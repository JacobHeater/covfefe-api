import * as request from 'request-promise-native';
import { serverResource } from './helpers';
import { LogLevel } from '@common/logging/winston/log-level';


beforeEach(() => process.env.LOG_LEVEL = LogLevel.info);

test('It should respond to http get / with a redirect to /api/docs', async () => {
  const response = await request.get(serverResource());

  expect(typeof response).toBe('string');
  expect(response).toContain('<!DOCTYPE html>');
  expect(response).toEqual(await request.get(serverResource('api/docs')));
});
