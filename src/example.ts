import { GitHubRepoFetcher } from './index';

async function displayGitHubProfile(username: string) {
    const fetcher = new GitHubRepoFetcher();

    try {
        console.log('\n🔍 Fetching GitHub profile for:', username);
        console.log('----------------------------------------');

        // Fetch user stats
        const stats = await fetcher.getUserStats(username);
        console.log('\n📊 Profile Statistics:');
        console.log('Name:', stats.name);
        console.log('Bio:', stats.bio);
        console.log('Followers:', stats.followers);
        console.log('Following:', stats.following);
        console.log('Public Repos:', stats.public_repos);
        console.log('Total Stars:', stats.totalStars);

        // Display language statistics
        if (stats.languages) {
            console.log('\n💻 Language Usage:');
            Object.entries(stats.languages)
                .sort(([, a], [, b]) => b - a)
                .forEach(([lang, bytes]) => {
                    console.log(`${lang}: ${(bytes / 1024).toFixed(2)} KB`);
                });
        }

        // Fetch repositories
        const repos = await fetcher.getReposWithReadme(username);
        console.log('\n📚 Latest Repositories:');
        repos.slice(0, 5).forEach(repo => {
            console.log('\n-', repo.name);
            console.log('  Description:', repo.description);
            console.log('  Stars:', repo.stargazers_count);
            console.log('  URL:', repo.html_url);
        });

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

// Get username from command line argument
const username = process.argv[2];
if (!username) {
    console.error('Please provide a GitHub username as an argument');
    console.log('Example: npm run example octocat');
    process.exit(1);
}

displayGitHubProfile(username);
