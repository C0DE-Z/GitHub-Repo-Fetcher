import axios from 'axios';
import { GitHubRepoFetcher } from '../index';
import { mockRepo, mockUserData, mockLanguages, mockReadme } from './mocks';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitHubRepoFetcher', () => {
  let fetcher: GitHubRepoFetcher;

  beforeEach(() => {
    fetcher = new GitHubRepoFetcher('test-token');
    jest.clearAllMocks();
  });

  describe('getReposWithReadme', () => {
    it('should fetch repositories with readmes', async () => {
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes('/repos')) {
          return Promise.resolve({ data: [mockRepo] });
        }
        if (url.includes('/readme')) {
          return Promise.resolve({ data: mockReadme });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetcher.getReposWithReadme('testuser');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...mockRepo,
        readme: mockReadme
      });
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue({
        response: { data: { message: 'Not Found' }, status: 404 }
      });

      await expect(fetcher.getReposWithReadme('nonexistent')).rejects.toEqual({
        message: 'Not Found',
        status: 404
      });
    });
  });

  describe('getUserStats', () => {
    it('should fetch user statistics successfully', async () => {
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes('/users/') && !url.includes('/repos')) {
          return Promise.resolve({ data: mockUserData });
        }
        if (url.includes('/repos')) {
          return Promise.resolve({ data: [mockRepo] });
        }
        if (url.includes('/languages')) {
          return Promise.resolve({ data: mockLanguages });
        }
        if (url.includes('/contributions')) {
          return Promise.resolve({ data: 500 });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetcher.getUserStats('testuser');

      expect(result).toEqual({
        ...mockUserData,
        languages: mockLanguages,
        totalStars: 10,
        contributions: 500
      });
    });

    it('should handle missing data gracefully', async () => {
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes('/users/')) {
          return Promise.resolve({ data: mockUserData });
        }
        if (url.includes('/repos')) {
          return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: {} });
      });

      const result = await fetcher.getUserStats('testuser');

      expect(result.languages).toEqual({});
      expect(result.totalStars).toBe(0);
    });
  });
});
