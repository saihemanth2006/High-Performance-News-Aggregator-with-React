# High-Performance News Aggregator with React

This project shows how to build a news aggregator app and then make it faster. It uses React and fetches the top 500 stories from HackerNews API.

The project has two versions

- Slow version with performance problems (on slow-version branch)
- Fast version with optimizations (on main branch)

## What It Does

- Shows top 500 stories from HackerNews
- Search articles by title
- Sort articles by score
- Large hero image at the top
- Articles display with title, score, author, and link

## Requirements

- Node.js 18 or higher
- npm or yarn
- Docker and Docker Compose (optional)

## How to Set Up

1. Clone the repository

```bash
git clone https://github.com/saihemanth2006/High-Performance-News-Aggregator-with-React.git
cd High-Performance-News-Aggregator-with-React
```

2. Install packages

```bash
npm install
```

3. Create .env file (optional)

```bash
cp .env.example .env
```

## How to Run

### Local Development

To see the slow version

```bash
git checkout slow-version
npm install
npm run dev
```

To see the optimized version

```bash
git checkout main
npm install
npm run dev
```

The app will open at http://localhost:3000

### Production Build

```bash
npm run build
```

This creates a dist folder with optimized files.

### Docker Deployment

```bash
docker-compose up -d --build
```

Then go to http://localhost:3000

To stop

```bash
docker-compose down
```

## Project Structure

```
project/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── Dockerfile
├── docker-compose.yml
├── vite.config.js
├── package.json
├── .env.example
├── PERFORMANCE.md
└── README.md
```

## Performance Improvements

The slow version has these problems

- Fetches stories one by one (takes 30-60 seconds)
- Shows all 500 articles at once (very slow to interact)
- Uses full lodash library (too big)
- Formats dates for every article every time it renders
- Big hero image with no optimization
- Everything in one JavaScript file

The optimized version fixes these

- Fetches all stories at the same time (5 seconds)
- Shows only visible articles (virtualization)
- Uses only the functions it needs from lodash
- Formats dates once and reuses them
- Optimized images with correct sizes
- Multiple JavaScript files for faster loading

## Git Branches

- main - optimized version
- slow-version - version with performance problems

To see what changed

```bash
git diff main slow-version
```

## Available Commands

```bash
npm run dev          starting dev server
npm run build        build for production
npm run preview      preview built app
```

## Environment Variables

Create a .env file based on .env.example

```
PORT=3000
NODE_ENV=development
```

## How the API Works

The app uses the free HackerNews API

- Get story IDs https://hacker-news.firebaseio.com/v0/topstories.json
- Get story details https://hacker-news.firebaseio.com/v0/item/{id}.json

The optimized version fetches all stories in parallel instead of one by one.

## Docker Details

The app runs in a Node container on port 3000. The Dockerfile has two stages

- Build stage compile and optimize
- Runtime stage serve the built files

Health checks every 30 seconds to make sure the app is working.

## Testing

To check if it works

- Open the app in your browser
- Search for an article title
- Click the sort button
- Check that the app responds quickly
- No errors in the browser console

## Troubleshooting

### App won't start

- Make sure Node.js 18+ is installed
- Try npm cache clean --force && npm install

### Docker container exits

- Check logs docker logs [container-id]
- Port 3000 might be in use
- Try docker-compose up --build

### API requests timeout

- Check internet connection
- The HackerNews API might be slow
- Try again in a few minutes

## Files Explained

- App.jsx Main component with all the logic
- App.css Styling for the app
- vite.config.js Build configuration
- docker-compose.yml Docker setup
- Dockerfile How to build the container
- PERFORMANCE.md Detailed performance information

## What You Learn

By working with this project, you understand

- How to find performance problems
- How to make apps faster
- Network optimization
- React performance
- Docker and containers
- How to measure improvements

## For More Info

See PERFORMANCE.md for detailed performance metrics and changes made in each optimization.

## License

This is a learning project.
