# GitHub Repo Fetcher

A simple Node.js module to fetch GitHub repositories, READMEs, and user statistics for a given profile.

Please leave a star if you use this <3

## Features
- Fetch user's repositories and their READMEs
- Get comprehensive user statistics
- Language usage analysis
- Star count and contribution metrics
- TypeScript support

## Quick Start

### Installation

```bash
# Using npm
npm install github-repo-fetcher

# Using yarn
yarn add github-repo-fetcher
```

### Basic Usage

```typescript
import { GitHubRepoFetcher } from 'github-repo-fetcher';

async function main() {
    // Initialize (token is optional but recommended for higher rate limits)
    const fetcher = new GitHubRepoFetcher('your-github-token');
    
    try {
        // Get user stats
        const stats = await fetcher.getUserStats('octocat');
        console.log('User Stats:', stats);
        
        // Get repositories with READMEs
        const repos = await fetcher.getReposWithReadme('octocat');
        console.log('Repositories:', repos);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
```

### CLI Example

```bash
# Install dependencies
npm install

# Run the example script
npm run example <github-username>

# Example
npm run example octocat
```

## GitHub Token

While the module works without a token, it's recommended to use one to avoid rate limiting.

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` and `user` scopes
3. Use the token when initializing:

```typescript
const fetcher = new GitHubRepoFetcher('your-github-token');
```

## API Reference

### GitHubRepoFetcher Class

```typescript
class GitHubRepoFetcher {
    constructor(token?: string);
    async getReposWithReadme(username: string): Promise<GitHubRepo[]>;
    async getUserStats(username: string): Promise<GitHubUserStats>;
}
```

### Response Types

```typescript
interface GitHubRepo {
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    readme?: string;
    stargazers_count: number;
}

interface GitHubUserStats {
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
```

## Development

```bash
# Clone the repository
git clone <repository-url>
cd github-repo-fetcher

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode for tests
npm run test:watch
```

## Error Handling

The module includes built-in error handling:

```typescript
try {
    const stats = await fetcher.getUserStats('non-existent-user');
} catch (error) {
    console.error(error.message); // Will contain GitHub API error message
    console.error(error.status);  // Will contain HTTP status code
}
```

## Rate Limiting

GitHub API has rate limits:
- Authenticated requests: 5,000 requests per hour
- Unauthenticated requests: 60 requests per hour

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
