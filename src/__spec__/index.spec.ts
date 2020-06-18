import { startServerAsync, stopServerAsync } from '..';
import { Server } from 'http';
import * as request from 'request-promise-native';
import { serverPort, serverResource } from './helpers';

let server: Server;

beforeAll(async () => server = await startServerAsync(serverPort));
afterAll((async () => await stopServerAsync(server)));

test('It should respond to http get / with a redirect to /api/docs', async () => {
  const response = await request.get(serverResource());

  expect(typeof response).toBe('string');
  expect(response).toContain('<!DOCTYPE html>');
  expect(response).toEqual(await request.get(serverResource('api/docs')));
});
