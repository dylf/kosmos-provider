/**
 * @vitest-environment jsdom
 */
import axios from 'axios';
import { describe, test, expect } from 'vitest';
import { getAnimeData, getAnimeUrls } from '../searchAnime';
import data from './searchFixture.json';

describe('Test that we are getting data from the API', () => {
  test.each(data)(
    'check that it can get anime details for $title',
    async ({ title, expected }) => {
      const result = await getAnimeData(axios, title);
      expect(result).toStrictEqual(expected);
    }
  );

  test('it gets sources for anime', async () => {
    const result = await getAnimeUrls(axios, data[0]['expected']['slug'], 1);
    expect(result.dubSources.sources).toBeTruthy();
    expect(result.subSources.sources).toBeTruthy();
  });
});
