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

### Building for Production

```bash
npm run build
```

This generates optimized production files in the `dist/` directory, including:

- Multiple JS chunks (code splitting)
- Bundle analysis report (`stats.html`)
- Compressed assets

### Docker Deployment

#### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up -d --build

# View logs
docker-compose logs -f news-aggregator

# Check service health
docker-compose ps

# Stop the application
docker-compose down
```

The application will be accessible at `http://localhost:3000`

#### Manual Docker Build

```bash
# Build the image
docker build -t news-aggregator:latest .

# Run the container
docker run -d \
  -p 3000:3000 \
  --name news-aggregator \
  news-aggregator:latest

# View logs
docker logs -f news-aggregator

# Stop the container
docker stop news-aggregator
```

## 📂 Project Structure

```
High-Performance-News-Aggregator-with-React/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.js                 # React entry point
│   └── style.css               # Global styles
├── public/                      # Static assets
├── dist/                        # Production build output
│   └── stats.html              # Bundle analysis report
├── Dockerfile                   # Production image definition
├── docker-compose.yml           # Docker Compose configuration
├── vite.config.js              # Vite build configuration
├── package.json                # Project dependencies
├── .env.example                # Environment variables template
├── PERFORMANCE.md              # Detailed performance audit report
└── README.md                   # This file
```

## 🔄 Project Phases

### Phase 1: Slow Version (`slow-version` branch)

Contains intentional anti-patterns:

1. **Sequential API Fetching (N+1 Problem)**
   - Fetches story IDs first
   - Then fetches each story individually in a loop
   - Creates massive network waterfall (~30-60+ seconds)

2. **No List Virtualization**
   - Renders all 500+ articles to the DOM
   - Causes massive memory overhead and poor interactions

3. **Full Lodash Import**
   - Uses `import _ from 'lodash'` instead of cherry-picking
   - Includes entire 70KB+ library when only one function is needed

4. **Expensive Render Computations**
   - Date formatting runs for every item on every render
   - No component memoization

5. **Unoptimized Images**
   - Large hero image (2MB+) with no optimization attributes
   - No width/height → causes layout shifts
   - No srcset → inefficient for responsive design

6. **No Code Splitting**
   - Everything bundled into single JavaScript file
   - Slow initial load and Time to Interactive

### Phase 2: Optimized Version (main branch)

Implements systematic optimizations:

1. ✅ **Parallel Network Requests** - Use Promise.all for concurrent fetching
2. ✅ **List Virtualization** - Render only visible items (@tanstack/react-virtual)
3. ✅ **Dependency Optimization** - Cherry-picked imports, bundle analysis
4. ✅ **Memoization** - Optimize expensive computations and components
5. ✅ **Image Optimization** - Modern formats, srcset, lazy loading
6. ✅ **Code Splitting** - Split bundle into multiple chunks

## 📊 Performance Metrics

### Baseline vs. Optimized

| Metric               | Slow Version | Optimized | Improvement   |
| -------------------- | ------------ | --------- | ------------- |
| **Lighthouse Score** | 25-35/100    | 80-90/100 | +55-65 points |
| **LCP**              | 8-12s        | <2.5s     | 70% faster    |
| **INP**              | 500-800ms    | <150ms    | 75% faster    |
| **CLS**              | 0.3-0.5      | <0.05     | 90% better    |
| **Bundle Size**      | 800KB        | 350KB     | 56% smaller   |
| **Network Time**     | 60s+         | 5s        | 92% faster    |

For detailed metrics and analysis, see [PERFORMANCE.md](PERFORMANCE.md)

## 🛠 Available Scripts

```bash
# Start development server
npm run dev

# Build production version
npm run build

# Preview production build locally
npm preview

# View bundle analysis (after build)
open dist/stats.html
```

## 🔍 Performance Analysis

### Lighthouse Testing

1. **Open the application in Chrome**
2. **Open Chrome DevTools** (F12)
3. **Go to "Lighthouse" tab**
4. **Select "Performance"**
5. **Click "Analyze page load"**
6. **Review scores and recommendations**

### Chrome DevTools Performance Panel

1. **Open DevTools Performance tab**
2. **Click record button (Ctrl+E on Windows)**
3. **Perform actions** (filter, sort, scroll)
4. **Stop recording**
5. **Analyze the flame chart** for long tasks and bottlenecks

### Bundle Analysis

After building for production, open `dist/stats.html` to see:

- Individual chunk sizes
- Module composition
- Import dependencies
- Tree-map visualization

## 📝 Environment Variables

The application respects the following environment variables (defined in `.env.example`):

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode: development | production

## 🔗 API Reference

### HackerNews API

The application uses the official HackerNews API:

- **Endpoint**: `https://hacker-news.firebaseio.com/v0`
- **Top Stories**: `/topstories.json` - Returns array of top story IDs
- **Story Details**: `/item/{id}.json` - Returns story data

**Important:** The API has rate limiting. Optimize requests to avoid hitting limits.

## 🐳 Docker Details

### Image Information

- **Base Image**: Node 18-Alpine (minimal footprint)
- **Size**: ~300MB
- **Runtime**: serve package for static file serving

### Health Check

- **Interval**: 30 seconds
- **Timeout**: 3 seconds
- **Healthy after**: 10 seconds

### Port Configuration

- **Internal**: 3000
- **External** (via Docker Compose): 3000

## 🧪 Testing

### Manual Testing Checklist

- [ ] Page loads without errors
- [ ] Hero image displays correctly
- [ ] Search filters articles in real-time
- [ ] Sort button works correctly
- [ ] No console errors in DevTools
- [ ] Responsive on mobile devices
- [ ] Links open in new tabs
- [ ] Docker container starts and stays healthy

### Performance Testing

1. **Profile the slow version** and record baseline metrics
2. **Implement optimizations** one at a time
3. **Measure after each change** to isolate impact
4. **Document findings** in PERFORMANCE.md
5. **Compare optimized version** to baseline

## 📖 Git Workflow

### Branches

- `main` - Final optimized version
- `slow-version` - Initial unoptimized version with anti-patterns

### Viewing Different Versions

```bash
# See optimized version
git checkout main

# See slow version with anti-patterns
git checkout slow-version

# Compare branches
git diff main slow-version
```

## 🎓 Learning Outcomes

By working through this project, you'll understand:

- **Core Web Vitals**: LCP, INP, CLS - why they matter for user experience
- **Network Performance**: Parallelization vs. sequential requests
- **List Virtualization**: Handling large datasets efficiently
- **Bundle Optimization**: Dependency analysis and code splitting
- **React Performance**: Memoization, component optimization
- **Image Optimization**: Modern formats, srcset, responsive images
- **DevTools Profiling**: Using Lighthouse and Chrome Performance panel
- **Docker Deployment**: Containerizing and deploying production apps

## 🚨 Common Issues

### Application won't start

- Ensure Node.js 18+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Docker container exits immediately

- Check logs: `docker logs <container-id>`
- Verify port 3000 isn't in use: `netstat -an | grep 3000`
- Build fresh image: `docker-compose up --build`

### API requests timing out

- Check internet connection
- Verify API is accessible: `curl https://hacker-news.firebaseio.com/v0/topstories.json`
- HackerNews API may have rate limits - consider implementing caching

### Poor performance even after optimization

- Run Lighthouse again to get current metrics
- Check Chrome DevTools Performance panel for bottlenecks
- Verify code hasn't reverted to slow version
- Clear browser cache (Ctrl+Shift+Delete)

## 📚 Resources

- [Google Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [React Performance](https://react.dev/reference/react/memo)
- [Vite Documentation](https://vitejs.dev/)
- [HackerNews API](https://github.com/HackerNews/API)
- [@tanstack/react-virtual](https://tanstack.com/virtual/latest)
- [Web Performance Working Group](https://www.w3.org/webperf/)

## 📄 License

This project is part of an educational exercise and is provided as-is.

## 🤝 Support

For issues or questions:

1. Check this README and PERFORMANCE.md
2. Review the code comments
3. Check Chrome DevTools for errors
4. Verify environment setup

---

**Happy optimizing! 🚀**

> "Performance is not about being fast. It's about making the user feel like the application is responsive." - Web Performance Engineer
