# Phase 2: Automated Content Discovery Agent 🤖

**Powered by Claude AI Sonnet 4.5**

## Overview

The Automated Content Discovery Agent is an intelligent system that:
- 🔍 Searches Google for competitor articles
- 📄 Scrapes and analyzes competitor content
- 🤖 Uses Claude AI to analyze and enhance your articles
- 💾 Automatically updates your database
- ✨ Publishes improved versions of your content

## Features

### 🎯 Core Capabilities
- **Intelligent Search**: Google search with blog-only filtering
- **Smart Scraping**: Multi-strategy content extraction
- **AI Analysis**: Claude Sonnet 4 powered content analysis
- **Automated Enhancement**: Creates improved versions based on competitor analysis
- **Database Integration**: Seamless backend API communication

### 🎨 Beautiful CLI
- ASCII art banner
- Colored output with Chalk
- Progress spinners with Ora
- Interactive menus with Inquirer
- Pretty tables with CLI-Table3

### 🛡️ Demo Mode
- Limits processing to 5 articles
- Mock search results
- Mock scraped content
- Mock AI analysis
- No API key required for testing

## Installation

```bash
cd phase2/automated-script
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
# Backend API
BACKEND_URL=http://localhost:8000

# Claude AI (optional for demo)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Search (optional for demo)
SERP_API_KEY=your_serpapi_key_here

# Demo Mode
DEMO_MODE=true
```

## Usage

### Start the CLI

```bash
npm start
```

### Menu Options

1. **🔍 Process a Single Article**
   - Select an article from your database
   - Runs complete analysis workflow
   - Shows detailed progress and results

2. **🚀 Process All Articles (Batch Mode)**
   - Processes all original articles
   - Automatic rate limiting
   - Comprehensive summary

3. **📊 View Statistics**
   - Total articles count
   - Original vs Enhanced
   - Average similarity scores

4. **📋 List All Articles**
   - View all articles in database
   - See which are analyzed
   - Distinguish original from enhanced

## How It Works

### 6-Step Workflow

```
1. 🔍 Google Search
   ├─ Search for articles similar to yours
   └─ Filter for blog posts only

2. 📊 Select Top Results
   ├─ Take top 2 competitors
   └─ Display titles and URLs

3. 📄 Scrape Content
   ├─ Extract full article text
   ├─ Get metadata (author, date)
   └─ Multiple fallback strategies

4. 🤖 AI Analysis (Claude Sonnet 4)
   ├─ Compare your article vs competitors
   ├─ Calculate similarity scores
   ├─ Identify ranking factors
   ├─ Generate improvements
   └─ Create enhanced versions

5. 💾 Update Database
   ├─ Save analysis results
   ├─ Update metadata
   └─ Store ranking factors

6. ✨ Publish Enhanced Versions
   ├─ Create new article entries
   ├─ Add AI-generated tag
   └─ Link to original
```

## Architecture

```
phase2/automated-script/
├── index.js                          # CLI entry point
├── src/
│   ├── ContentDiscoveryAgent.js      # Main orchestrator
│   ├── DatabaseService.js            # Backend API client
│   ├── GoogleSearchService.js        # Search integration
│   ├── ContentScraper.js             # Web scraping
│   └── ClaudeAnalyzer.js            # AI analysis
├── package.json
└── .env
```

## Demo Mode Features

When `DEMO_MODE=true`:

- ✅ Works without API keys
- ✅ Mock search results
- ✅ Mock scraped content
- ✅ Mock AI analysis
- ✅ Processes max 5 articles
- ✅ "Demo Mode" watermark in output

## Production Requirements

For real usage:

1. **Anthropic API Key**
   - Sign up: https://console.anthropic.com
   - Model: Claude Sonnet 4
   - Cost: ~$3 per 1M input tokens

2. **SerpAPI Key** (optional)
   - Sign up: https://serpapi.com
   - Free tier: 100 searches/month
   - Fallback: Mock results in demo mode

3. **Backend API**
   - Must be running on `BACKEND_URL`
   - All 7 CRUD endpoints required

## API Endpoints Used

```
GET  /api/articles          # List articles
GET  /api/articles/:id      # Get single article
POST /api/articles          # Create article
PUT  /api/articles/:id      # Update article
```

## Error Handling

- ✅ Network timeouts (30s)
- ✅ Invalid URLs
- ✅ Scraping failures
- ✅ AI analysis errors
- ✅ Database connection issues
- ✅ Rate limiting (5s between articles)

## Performance

- **Single Article**: ~30-60 seconds
- **Batch Mode**: ~5 minutes for 5 articles
- **Rate Limiting**: 5s delay between articles
- **Retry Logic**: 3 attempts for AI analysis

## Output Example

```
============================================================
📝 Processing: AI in Healthcare Article
============================================================

🔍 Step 1/6: Searching Google...
✓ Found 10 relevant articles

📊 Step 2/6: Selected top 2 results:
   1. Complete Guide to AI in Healthcare
   2. AI Healthcare Best Practices 2025

📄 Step 3/6: Scraping competitor content...
   ✓ Scraped: Complete Guide to AI in Healthcare
   ✓ Scraped: AI Healthcare Best Practices 2025

🤖 Step 4/6: Analyzing with Claude AI...
✓ Analysis complete!
   Similarity Score: 67%
   Ranking Factors: 8

💾 Step 5/6: Updating database...
✓ Original article updated

📤 Step 6/6: Publishing enhanced versions...
   ✓ Published: AI in Healthcare: Enhanced Edition

✅ Processing complete!
   Articles analyzed: 2
   Similarity score: 67%
   Enhancements: 1
```

## Troubleshooting

### Backend Connection Failed
```bash
# Start backend server
cd ../../backend
npm start
```

### No Articles Found
```bash
# Run scraper first
curl http://localhost:8000/api/articles/scrape -X POST
```

### API Key Issues
- Set `DEMO_MODE=true` for testing
- Check `.env` file exists
- Verify key format

## Credits

- **Author**: S_Harshit_B
- **Email**: shiki2hustle@gmail.com
- **Repository**: github.com/Git-brintsi20/beyondchats-assignment-2025
- **License**: MIT with Attribution

## Next Steps

1. ✅ Phase 1: Backend API (Complete)
2. ✅ Phase 2: Content Discovery (Complete)
3. ⏳ Phase 3: Frontend with Vercel v0
4. ⏳ Deployment (MongoDB Atlas + Render + Vercel)
5. ⏳ Documentation & Video

---

Made with ❤️ for BeyondChats Assignment 2025
