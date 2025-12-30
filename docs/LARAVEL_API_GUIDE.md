# Laravel Backend Migration - Complete Guide

## Overview

This document provides a complete guide for the Laravel backend that replaces the Express.js backend as required by the assignment specifications.

## Architecture

### Tech Stack
- **Framework**: Laravel 12.44.0
- **PHP Version**: 8.2.12
- **Database**: SQLite (production-ready, zero-config)
- **Web Scraping**: Symfony DomCrawler 7.4.1
- **HTTP Client**: Guzzle (included with Laravel)

### Directory Structure
```
backend-laravel/
├── app/
│   ├── Console/Commands/
│   │   └── ScrapeArticles.php        # Artisan command for web scraping
│   ├── Http/Controllers/Api/
│   │   └── ArticleController.php     # REST API controller
│   └── Models/
│       └── Article.php                # Eloquent ORM model
├── database/
│   ├── migrations/
│   │   └── 2025_12_30_120227_create_articles_table.php
│   └── database.sqlite               # SQLite database file
├── routes/
│   └── api.php                        # API routes definition
├── storage/
│   └── logs/
│       └── laravel.log               # Application logs
└── bootstrap/
    └── app.php                        # Application configuration
```

## Installation & Setup

### Prerequisites
- PHP 8.2 or higher
- Composer
- Git

### Step 1: Install Dependencies
```bash
cd backend-laravel
composer install
```

### Step 2: Configure Environment
The `.env` file is already configured for SQLite:
```env
DB_CONNECTION=sqlite
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:bbwF8wCHaj0vjWZek5ZkMJvFhXKEj0LCqalEnDjB/t4=
```

### Step 3: Create Database & Run Migrations
```bash
# Create SQLite database file
touch database/database.sqlite

# Run migrations
php artisan migrate
```

### Step 4: Start Development Server
```bash
php artisan serve --port=8000
```

Server will start at: `http://localhost:8000`

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Health Check
**GET** `/health`

Response:
```json
{
  "success": true,
  "message": "Laravel API is running",
  "timestamp": "2025-12-30T12:24:52.734128Z"
}
```

### Articles Endpoints

#### 1. List Articles (with pagination, search, filters)
**GET** `/articles`

Query Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 10, max: 100) - Items per page
- `search` - Search term (searches title, content, excerpt)
- `sortBy` - Sort field (prefix with `-` for descending, e.g., `-published_date`)
- `source` - Filter by source type: `all`, `scraped`, `original`, `enhanced`, `competitor`

Example:
```bash
curl "http://localhost:8000/api/articles?page=1&limit=10&search=healthcare&sortBy=-published_date&source=scraped"
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI in Healthcare: Hype or Reality?",
      "url": "https://beyondchats.com/blogs/ai-in-healthcare-hype-or-reality/",
      "content": "Full article content...",
      "excerpt": "Introduction text...",
      "author": "BeyondChats",
      "published_date": "2025-03-21T00:00:00.000000Z",
      "thumbnail": "https://beyondchats.com/wp-content/uploads/2025/03/AI-in-Healthcare-Hype-or-Reality-1.jpg",
      "tags": ["scraped", "beyondchats"],
      "metadata": {
        "sourceType": "scraped",
        "wordCount": 1923,
        "readingTime": 10,
        "scrapedFrom": "https://beyondchats.com/blogs/"
      },
      "scraped_at": "2025-12-30T12:26:17.000000Z",
      "created_at": "2025-12-30T12:26:17.000000Z",
      "updated_at": "2025-12-30T12:26:17.000000Z"
    }
  ],
  "pagination": {
    "total": 2,
    "pages": 1,
    "current": 1,
    "limit": 10
  }
}
```

#### 2. Get Single Article
**GET** `/articles/{id}`

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Article Title",
    ...
  }
}
```

Error (404):
```json
{
  "success": false,
  "message": "Article not found"
}
```

#### 3. Create Article
**POST** `/articles`

Request Body:
```json
{
  "title": "My Article Title",
  "url": "https://example.com/article",
  "content": "Full article content",
  "excerpt": "Short description",
  "author": "Author Name",
  "published_date": "2025-12-30",
  "thumbnail": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "metadata": {
    "sourceType": "original",
    "wordCount": 500
  }
}
```

Validation Rules:
- `title`: required, min 5 characters
- `url`: required, valid URL, unique
- `content`: optional
- `excerpt`: optional, max 500 characters
- `author`: optional
- `published_date`: optional, valid date
- `thumbnail`: optional, valid URL
- `tags`: optional array
- `metadata`: optional object

Response (201):
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": 3,
    "title": "My Article Title",
    ...
  }
}
```

#### 4. Update Article
**PUT** `/articles/{id}`

Request Body: (same as create, all fields optional)

Response:
```json
{
  "success": true,
  "message": "Article updated successfully",
  "data": { ... }
}
```

#### 5. Delete Article
**DELETE** `/articles/{id}`

Response (204):
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

#### 6. Get Statistics
**GET** `/articles/stats`

Response:
```json
{
  "success": true,
  "data": {
    "total": 2,
    "enhanced": 0,
    "original": 2,
    "latest": {
      "title": "Latest Article",
      "date": "2025-03-24T00:00:00.000000Z"
    },
    "oldest": {
      "title": "Oldest Article",
      "date": "2025-03-21T00:00:00.000000Z"
    }
  }
}
```

#### 7. Trigger Web Scraping
**POST** `/articles/scrape`

Response:
```json
{
  "success": true,
  "message": "Scraping completed",
  "output": "Starting article scraper...\nSaved: 5 articles\nSkipped: 0 articles"
}
```

## Web Scraper Command

### Manual Execution
```bash
php artisan scrape:articles
```

### With Options
```bash
# Scrape specific number of articles
php artisan scrape:articles --count=10

# Default is 5 articles (as per assignment requirement)
```

### What It Does
1. Fetches https://beyondchats.com/blogs/
2. Extracts article links, titles, excerpts, thumbnails
3. Fetches full content from each article URL
4. Calculates word count and reading time
5. Saves to database with metadata
6. Skips duplicates (checks URL)
7. Respects rate limiting (2-second delay between requests)
8. Defaults to scraping 5 oldest articles (as per assignment)

### Output Example
```
Starting article scraper...
Fetching: https://beyondchats.com/blogs/
Found 5 articles
Fetching content from: https://beyondchats.com/blogs/article-1/
✓ Saved: Article Title 1
Fetching content from: https://beyondchats.com/blogs/article-2/
✓ Saved: Article Title 2
Fetching content from: https://beyondchats.com/blogs/article-3/
✓ Saved: Article Title 3
Fetching content from: https://beyondchats.com/blogs/article-4/
✓ Saved: Article Title 4
Fetching content from: https://beyondchats.com/blogs/article-5/
✓ Saved: Article Title 5

Scraping completed!
Saved: 5 articles
Skipped: 0 articles
```

## Database Schema

### Articles Table
```sql
CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    author VARCHAR(255),
    published_date TIMESTAMP,
    thumbnail VARCHAR(255),
    tags JSON,
    metadata JSON,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX articles_title_index ON articles(title);
CREATE INDEX articles_published_date_index ON articles(published_date);
CREATE UNIQUE INDEX articles_url_unique ON articles(url);
```

### Metadata Structure
```json
{
  "sourceType": "scraped",        // original | enhanced | competitor | scraped
  "wordCount": 1923,               // Number of words in content
  "readingTime": 10,               // Minutes (based on 200 words/min)
  "scrapedFrom": "https://...",    // Source URL
  "isAIGenerated": false,          // Boolean flag
  "similarityScore": 0.85,         // 0-1 score for similarity analysis
  "keywords": ["AI", "healthcare"], // Extracted keywords
  "references": [                   // Citation references
    {
      "title": "Reference Title",
      "url": "https://..."
    }
  ]
}
```

## Eloquent Model Features

### Article Model Methods

#### `calculateReadingTime()`
```php
$article = Article::find(1);
$minutes = $article->calculateReadingTime(); // Returns 10 (for 2000 words)
```

#### `addReference($title, $url)`
```php
$article->addReference('Study on AI', 'https://example.com/study');
// Automatically saves to metadata->references array
```

### Accessors

#### `formattedDate`
```php
echo $article->formattedDate; // "March 21, 2025"
```

#### `shortExcerpt`
```php
echo $article->shortExcerpt; // First 100 characters + "..."
```

### Query Scopes

#### `search($term)`
```php
Article::search('healthcare')->get();
// Searches in title, content, and excerpt
```

#### `sourceType($type)`
```php
Article::sourceType('scraped')->get();
// Filters by metadata->sourceType
```

## Error Handling

All API responses follow consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error details (in debug mode)",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - Deleted (No Content)
- `400` - Bad Request (Validation Error)
- `404` - Not Found
- `500` - Internal Server Error

## Testing

### Manual Testing with cURL

#### Test Health
```bash
curl http://localhost:8000/api/health
```

#### Test List Articles
```bash
curl http://localhost:8000/api/articles
```

#### Test Create Article
```bash
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "url": "https://example.com/test",
    "content": "Test content",
    "excerpt": "Test excerpt"
  }'
```

#### Test Search
```bash
curl "http://localhost:8000/api/articles?search=healthcare"
```

#### Test Stats
```bash
curl http://localhost:8000/api/articles/stats
```

#### Test Scraper
```bash
curl -X POST http://localhost:8000/api/articles/scrape
```

### PowerShell Testing
```powershell
# Test health
Invoke-RestMethod -Uri "http://localhost:8000/api/health" | ConvertTo-Json

# Test articles
Invoke-RestMethod -Uri "http://localhost:8000/api/articles" | ConvertTo-Json -Depth 5
```

## Integration with Frontend

### Update API Base URL
In `frontend/lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Update Field Names
Laravel uses snake_case, Express used camelCase:
- `_id` → `id`
- `publishedDate` → `published_date`
- `scrapedAt` → `scraped_at`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`

### Example API Call
```typescript
const response = await axios.get('http://localhost:8000/api/articles', {
  params: {
    page: 1,
    limit: 10,
    search: 'AI',
    sortBy: '-published_date'
  }
});

console.log(response.data.data); // Array of articles
console.log(response.data.pagination); // Pagination info
```

## Integration with Phase 2 Script

### Update Database Service
In `phase2/automated-script/src/DatabaseService.js`:
```javascript
this.baseUrl = 'http://localhost:8000/api';
```

The API responses are already compatible with the existing script.

## Production Deployment

### Environment Configuration
1. Set `APP_ENV=production`
2. Set `APP_DEBUG=false`
3. Generate new `APP_KEY`: `php artisan key:generate`
4. For production database, consider MySQL/PostgreSQL:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=beyondchats
   DB_USERNAME=root
   DB_PASSWORD=secret
   ```

### Optimization
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Optimize composer autoloader
composer install --optimize-autoloader --no-dev
```

### Web Server Setup (Apache/Nginx)
Point document root to `backend-laravel/public/`

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name api.beyondchats.local;
    root /var/www/backend-laravel/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Logs & Debugging

### Application Logs
```bash
tail -f storage/logs/laravel.log
```

### Enable Debug Mode
In `.env`:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

### Query Logging
Add to `AppServiceProvider::boot()`:
```php
\DB::listen(function ($query) {
    \Log::info($query->sql, $query->bindings);
});
```

## Security Best Practices

1. **Never commit `.env`** - Contains sensitive keys
2. **Validate all inputs** - Already implemented in controller
3. **Use HTTPS** in production
4. **Rate limiting** - Add to routes if needed:
   ```php
   Route::middleware('throttle:60,1')->group(function () {
       // Your routes
   });
   ```
5. **CORS Configuration** - Update `config/cors.php` for frontend URLs

## Comparison: Express vs Laravel

| Feature | Express (Old) | Laravel (New) |
|---------|--------------|---------------|
| Language | JavaScript | PHP |
| Framework | Express.js 4.x | Laravel 12.x |
| Database | MongoDB | SQLite (or MySQL) |
| ORM | Mongoose | Eloquent |
| Validation | Manual | Built-in |
| CLI Commands | Custom scripts | Artisan commands |
| API Structure | Custom | RESTful resource |
| Error Handling | Custom middleware | Built-in exceptions |
| ID Format | `_id` (MongoDB ObjectId) | `id` (Integer) |
| Field Naming | camelCase | snake_case |

## Troubleshooting

### Issue: "Could not open input file: artisan"
**Solution**: Make sure you're in the `backend-laravel` directory
```bash
cd backend-laravel
php artisan serve
```

### Issue: "Target class [Laravel\Sanctum...] does not exist"
**Solution**: Already fixed in `bootstrap/app.php` by removing `statefulApi()` middleware

### Issue: "This database driver does not support fulltext index creation"
**Solution**: Already fixed in migration file - fulltext removed for SQLite compatibility

### Issue: Scraper fails with timeout
**Solution**: Increase timeout in `.env`:
```env
SCRAPER_TIMEOUT=60
```

### Issue: Permission denied on `database.sqlite`
**Solution**:
```bash
chmod 664 database/database.sqlite
chmod 775 database/
```

## Additional Resources

- Laravel Documentation: https://laravel.com/docs/12.x
- Eloquent ORM: https://laravel.com/docs/12.x/eloquent
- Artisan Commands: https://laravel.com/docs/12.x/artisan
- Validation: https://laravel.com/docs/12.x/validation
- Symfony DomCrawler: https://symfony.com/doc/current/components/dom_crawler.html

## Support & Contact

For issues or questions about this Laravel backend:
- Repository: https://github.com/Git-brintsi20/beyondchats-assignment-2025
- Author: S_Harshit_B
- License: MIT with Attribution

---

**Last Updated**: December 30, 2025  
**Laravel Version**: 12.44.0  
**PHP Version**: 8.2.12  
**Status**: ✅ Production Ready
