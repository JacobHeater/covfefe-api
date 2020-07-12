/* eslint-disable jest/no-export */

import { Entity } from '@common/models/entities/entity';
import shortid from 'shortid';
import { serverResource } from '../helpers';
import * as request from 'request-promise-native';
import { User } from '@common/models/entities/user/user';
import { Environment } from '@common/env';

export enum SkipTestsInSuite {
  get,
  post,
  put,
  delete,
}

export abstract class ApiTestSuite<TEntity extends Entity> {
  protected abstract factory(): TEntity;
  protected abstract routeName: string;
  protected abstract modelName: string;
  protected abstract assertPutEquals(model: TEntity, response: TEntity): void;
  protected abstract updateForPut(model: TEntity): TEntity;
  protected skipped: SkipTestsInSuite[] = [];

  public init(): void {
    !this.skipped.includes(SkipTestsInSuite.get) && this.initGet();
    !this.skipped.includes(SkipTestsInSuite.post) && this.initPost();
    !this.skipped.includes(SkipTestsInSuite.put) && this.initPut();
    !this.skipped.includes(SkipTestsInSuite.delete) && this.initDelete();
    this.registerAdditionalTests();
  }

  protected registerAdditionalTests(): void {
    // virtual method for tests to register additional assertions
  }

  protected route(id?: string): string {
    if (id) {
      return serverResource(`api/${this.routeName}/${id}`);
    }

    return serverResource(`api/${this.routeName}`);
  }

  protected get headers(): { [key: string]: string } {
    return {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    };
  }

  private initGet(): void {
    test(`It should receive a 200 from the route /heartbeat request`, async () => {
      const heartbeatPromise = request.get(`${this.route()}/heartbeat`);

      await expect(heartbeatPromise).resolves.not.toThrow();
    });

    test(`It should retrieve a list of ${this.modelName} using the GET api/${this.routeName} endpoint`, async () => {
      const promises: Promise<unknown>[] = [];

      for (let i = 0; i < 10; i++) {
        const entity = this.factory();
        const response = request.post(this.route(), {
          json: true,
          body: entity,
          headers: this.headers
        });
        promises.push(response);
      }

      const post = Promise.all(promises);

      await expect(post).resolves.not.toThrow();

      const response = await request.get(this.route(), {
        json: true,
        headers: this.headers,
      });

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(1);
    });

    test(`It should return 404 when providing an id to GET api/${this.routeName} that doesn't exist`, async () => {
      const get = () =>
        request.get(this.route(shortid.generate()), {
          json: true,
          headers: this.headers
        });

      await expect(get).rejects.toThrow(/404/);
    });
  }

  private initPost(): void {
    test(`It should successfully accept a ${this.modelName} model via POST`, async () => {
      const model = this.factory();

      const response = await request.post(this.route(), {
        body: model,
        json: true,
        headers: this.headers,
      });

      expect(response.id).toBeDefined();
    });

    test(`It should send back 400 when the request body is not a ${this.modelName} resource`, async () => {
      const post = () =>
        request.post(this.route(), {
          body: {},
          json: true,
          headers: this.headers,
        });

      await expect(post).rejects.toThrow(/400/);
    });
  }

  private initPut(): void {
    test(`It should successfully update an existing ${this.modelName} resource`, async () => {
      const model = this.factory();

      const response = await request.post(this.route(), {
        body: model,
        json: true,
        headers: this.headers,
      });

      expect(response.id).toBeDefined();

      const putModel = this.factory();

      this.updateForPut(putModel);

      const putResponse = await request.put(this.route(response.id), {
        json: true,
        body: putModel,
        headers: this.headers,
      });

      expect(putResponse).toContain('OK');

      const getResponse = await request.get(this.route(response.id), {
        json: true,
        headers: this.headers,
      });

      expect(getResponse.id).toBe(response.id);
      this.assertPutEquals(getResponse, putModel);
    });

    test(`It should send 404 when an id is sent to PUT api/${this.routeName} that does not exist`, async () => {
      const put = () =>
        request.put(this.route(shortid.generate()), {
          json: true,
          body: this.updateForPut(this.factory()),
          headers: this.headers,
        });

      await expect(put).rejects.toThrow(/404/);
    });

    test(`It should send 500 when id is valid, but body is empty when request sent to PUT api/${this.routeName}`, async () => {
      const model = this.factory();

      const response = await request.post(this.route(), {
        json: true,
        body: model,
        headers: this.headers,
      });

      expect(response.id).toBeDefined();

      const put = () =>
        request.put(this.route(response.id), {
          json: true,
          body: {},
          headers: this.headers,
        });

      await expect(put).rejects.toThrow(/500/);
    });
  }

  private initDelete(): void {
    test(`It should successfully delete a ${this.modelName} resource when sent to DELETE api/${this.routeName}`, async () => {
      const model = this.factory();

      const response = await request.post(this.route(), {
        json: true,
        body: model,
        headers: this.headers,
      });

      expect(response.id).toBeDefined();

      const _delete = (() =>
        request.delete(this.route(response.id), {
          json: true,
          headers: this.headers,
        }))();

      await expect(_delete).resolves.toContain('OK');
    });

    test(`It should send back 404 for a DELETE to a ${this.modelName} resource with an invalid id`, async () => {
      const _delete = () =>
        request.delete(this.route(shortid.generate()), {
          json: true,
          headers: this.headers,
        });

      await expect(_delete).rejects.toThrow(/404/);
    });
  }
}
