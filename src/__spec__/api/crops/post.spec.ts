import * as request from 'request-promise-native';
import { serverResource } from '@app/__spec__/helpers';
import { Crop } from '@common/models/entities/crop/crop';
import { Origin } from '@common/models/entities/origin/origin';
import shortid from 'shortid';

test('It should successfully accept a Crop model via POST', async () => {
  const model = new Crop();
  model.origin = new Origin();
  model.origin.id = shortid.generate();
  model.origin.altitude = 2000;
  model.origin.country = 'Ethiopia';
  model.origin.estate = 'Estate';
  model.year = new Date().getFullYear();

  const response = await request.post(serverResource('api/crops'), {
    body: model,
    json: true,
  });

  expect(response.year).toBe(model.year);
});

test('It should send back 400 when the request body is not a crop resource', async () => {
  await expect(() => request.post(serverResource('api/crops'), {
    body: {},
    json: true
  })).rejects.toThrow(/400/);
});
