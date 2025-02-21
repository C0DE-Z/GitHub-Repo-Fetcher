export interface GitHubRepo {
  stargazers_count: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  readme?: string;
}

export interface GitHubError {
  message: string;
  status: number;
}

export interface GitHubUserStats {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  created_at: string;
  updated_at: string;
  contributions?: number;
  languages?: { [key: string]: number };
  totalStars?: number;
}
