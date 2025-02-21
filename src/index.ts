import axios from 'axios';
import { GitHubRepo, GitHubError, GitHubUserStats } from './types';

export class GitHubRepoFetcher {
  private baseUrl = 'https://api.github.com';
  private token: string;

  constructor(token?: string) {
    this.token = token || '';
  }

  private get headers() {
    return {
      'Accept': 'application/vnd.github.v3+json',
      ...(this.token && { 'Authorization': `token ${this.token}` })
    };
  }

  async getReposWithReadme(username: string): Promise<GitHubRepo[]> {
    try {
      const repos = await this.getRepositories(username);
      const reposWithReadme = await Promise.all(
        repos.map(async (repo) => {
          const readme = await this.getReadme(repo.full_name);
          return { ...repo, readme };
        })
      );
      return reposWithReadme;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async getRepositories(username: string): Promise<GitHubRepo[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/${username}/repos`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async getReadme(fullRepoName: string): Promise<string | undefined> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/repos/${fullRepoName}/readme`,
        {
          headers: { ...this.headers, 'Accept': 'application/vnd.github.raw' }
        }
      );
      return response.data;
    } catch (error) {
      return undefined;
    }
  }

  async getUserStats(username: string): Promise<GitHubUserStats> {
    try {
      // Get basic user info
      const userResponse = await axios.get(
        `${this.baseUrl}/users/${username}`,
        { headers: this.headers }
      );
      
      // Get all repositories
      const repos = await this.getRepositories(username);
      
      // Calculate additional stats
      const languages: { [key: string]: number } = {};
      let totalStars = 0;

      for (const repo of repos) {
        // Get languages for each repo
        const langResponse = await axios.get(
          `${this.baseUrl}/repos/${repo.full_name}/languages`,
          { headers: this.headers }
        );
        
        Object.entries(langResponse.data).forEach(([lang, bytes]) => {
          languages[lang] = (languages[lang] || 0) + (bytes as number);
        });

        // Add stars
        totalStars += repo.stargazers_count || 0;
      }

      // Get contribution count for the last year
      const contributionsResponse = await axios.get(
        `${this.baseUrl}/users/${username}/contributions`,
        { headers: this.headers }
      ).catch(() => ({ data: 0 })); // This endpoint might need different handling based on GitHub API version

      return {
        ...userResponse.data,
        languages,
        totalStars,
        contributions: contributionsResponse.data
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): GitHubError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || 'Unknown GitHub API error',
        status: error.response?.status || 500
      };
    }
    return {
      message: 'Unknown error occurred',
      status: 500
    };
  }
}

export { GitHubRepo, GitHubError, GitHubUserStats };
