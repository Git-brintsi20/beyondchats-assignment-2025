# Vercel v0 Prompt - BeyondChats Article Discovery Frontend

> **Copy this entire prompt to Vercel v0 to generate the complete frontend**  
> URL: https://v0.dev

---

## Project Requirements

Build a modern, responsive React application for displaying and managing scraped articles with AI-enhanced content discovery.

### Tech Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API or Zustand
- **HTTP Client**: Axios
- **UI Components**: shadcn/ui (preferred) or custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion

### API Backend
The frontend will connect to a REST API at `http://localhost:3000/api` (configurable via environment variable).

---

## Features Required

### 1. **Home Page** (`/`)

#### Hero Section
- **Title**: "BeyondChats Content Discovery"
- **Subtitle**: "AI-Powered Article Analysis & Enhancement"
- **Description**: Brief explanation of the platform
- **CTA Button**: "Explore Articles" (scrolls to article grid)
- **Gradient Background**: Modern gradient with subtle animation

#### Search & Filter Bar
- **Search Input**: 
  - Debounced search (300ms delay)
  - Search icon on left
  - Clear button (X) on right when text exists
  - Placeholder: "Search articles by title, content, or keywords..."
  - Full-width on mobile, max-width 600px on desktop

- **Filter Panel** (Expandable on mobile):
  - **Source Filter**: Dropdown/Select
    - All Articles
    - Original Content
    - AI Enhanced
    - Competitive Analysis
  - **Date Range**: Date picker or dropdown
    - All Time
    - Last 7 Days
    - Last 30 Days
    - Last 90 Days
  - **Sort Options**: Dropdown
    - Newest First
    - Oldest First
    - Title (A-Z)
    - Reading Time (Shortest)
    - Reading Time (Longest)
  - **Apply Filters** button (primary color)
  - **Reset** button (secondary)

#### Article Grid
- **Responsive Grid**:
  - 1 column on mobile (< 640px)
  - 2 columns on tablet (640px - 1024px)
  - 3 columns on desktop (> 1024px)
- **Spacing**: 6-8 units gap between cards
- **Loading State**: 6-9 skeleton cards with shimmer animation
- **Empty State**: 
  - Illustration or icon
  - Message: "No articles found"
  - Subtext: "Try adjusting your filters or search query"
  - Button to reset filters

#### Article Card Component
Each card should display:
- **Thumbnail Image**: 
  - 16:9 aspect ratio
  - Fallback gradient with first letter of title (large font)
  - Hover: Subtle zoom effect (scale 1.05)
- **Badges** (top-right corner over thumbnail):
  - "✨ AI Enhanced" (purple badge if `metadata.isAIGenerated === true`)
  - "🔄 Updated" (blue badge if `metadata.lastAnalyzed` exists)
- **Title**: 
  - 2 lines max with ellipsis
  - Font size: text-xl, font-weight: bold
  - Hover: Change color to primary
- **Excerpt**: 
  - 3 lines max with ellipsis
  - Font size: text-sm
  - Color: text-gray-600
- **Metadata Row**:
  - Author icon + name (if available, else "Unknown")
  - Date icon + formatted date (e.g., "Dec 29, 2025")
  - Clock icon + reading time (e.g., "5 min read")
  - Separator: "•" between items
  - Font size: text-xs, color: text-gray-500
- **Tags** (if available):
  - Show first 3 tags
  - Colored pills with different colors
  - Font size: text-xs
- **Card Styling**:
  - White background
  - Rounded corners (rounded-xl)
  - Shadow on hover (shadow-md → shadow-xl)
  - Lift effect on hover (translate-y -4px)
  - Smooth transitions (300ms)
  - Cursor pointer
  - Full card clickable (onClick navigates to detail page)

#### Pagination
- **Display**: "Showing 1-10 of 45 articles"
- **Controls**:
  - Previous button (disabled if first page)
  - Page numbers (show current, 2 before, 2 after, with ellipsis)
  - Next button (disabled if last page)
- **Style**: Clean, minimal design
- **Mobile**: Simplified to just Prev/Next with page count

---

### 2. **Article Detail Page** (`/articles/:id`)

#### Layout
- **Breadcrumb Navigation**: Home > Articles > {Article Title}
- **Back Button**: "← Back to Articles"
- **Max Width**: 800px centered container
- **White Card**: With shadow and padding

#### Header Section
- **Large Title**: h1, font-bold, text-4xl
- **Metadata Bar**:
  - Author (with avatar placeholder)
  - Published date
  - Reading time
  - Word count
  - Last updated (if AI-enhanced)
- **Tags**: Full list of tags with colors
- **Action Buttons**:
  - Share (Twitter, LinkedIn, Copy Link)
  - "View Original" link (if this is enhanced version)
  - "Compare Versions" button (if both original and enhanced exist)

#### Content Section
- **Full Article Content**:
  - Well-formatted HTML/Markdown
  - Line height: relaxed (1.7)
  - Font size: text-lg
  - Paragraphs with proper spacing
  - Headings styled appropriately (h2, h3)
  - Lists styled (ul, ol)
  - Code blocks (if any) with syntax highlighting

#### AI Enhancement Section (if `metadata.isAIGenerated === true`)
- **Expandable Section**: "AI Enhancement Details"
- **Show**:
  - Similarity Score: Progress bar with percentage
  - Ranking Factors: List with checkmarks
  - Keywords Added: Colored badges
  - References Used: Clickable links to source articles

#### References Section (if `metadata.references` exists)
- **Title**: "Sources & References"
- **List**: Cards showing:
  - Source title
  - Source URL (clickable)
  - Date scraped
  - Open in new tab icon

#### Related Articles Section
- **Title**: "Related Articles"
- **Grid**: 3 mini article cards (same design as home page but smaller)
- **Logic**: Show other articles with similar tags (mock for now)

---

### 3. **Comparison Page** (`/compare/:originalId/:enhancedId`) - BONUS

#### Layout
- **Split Screen**: 50/50 on desktop, stacked on mobile
- **Sticky Header**: With titles of both versions
- **Synchronized Scrolling**: When scrolling one side, other follows

#### Left Panel: Original Article
- Label: "Original Version"
- Display full content

#### Right Panel: AI-Enhanced Article  
- Label: "AI-Enhanced Version"
- Display full content with highlights:
  - New sections: Light green background
  - Modified sections: Light yellow background

#### Comparison Metrics (Sticky Sidebar or Top Bar)
- **Word Count**: Original vs Enhanced (with % change)
- **Reading Time**: Original vs Enhanced
- **Similarity Score**: Visual gauge (0-100%)
- **Improvements**:
  - Keywords added: Number with list
  - Sections added: Number
  - Readability score: Before/After
- **Toggle View**:
  - Side-by-side (desktop default)
  - Stacked (mobile default)
  - Difference view (highlight changes only)

---

### 4. **Statistics Dashboard** (Optional Bonus) (`/stats`)

Display aggregate statistics:
- **Total Articles**: Count with icon
- **AI-Enhanced Articles**: Count + percentage
- **Average Similarity Score**: Percentage
- **Total References**: Count
- **Articles by Source**: Pie chart or bar chart
- **Publishing Timeline**: Line chart showing articles over time
- **Top Keywords**: Word cloud or tag cloud
- **Recent Activity**: List of last 10 articles

Use chart library: Recharts or Chart.js

---

## API Integration

### Axios Setup (`src/services/api.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add any auth tokens here if needed
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message;
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default api;
```

### API Endpoints to Consume

```typescript
// GET /articles
// Query params: page, limit, search, sort, sourceType, dateFrom, dateTo
interface GetArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  sourceType?: 'original' | 'competitive-analysis' | 'enhanced';
  dateFrom?: string;
  dateTo?: string;
}

// GET /articles/:id
// Returns single article with all metadata

// GET /articles/stats
// Returns statistics object

// Response format:
interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}

interface Article {
  _id: string;
  title: string;
  url: string;
  excerpt?: string;
  content?: string;
  author?: string;
  publishedDate?: string;
  thumbnail?: string;
  tags?: string[];
  scrapedAt: string;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastAnalyzed?: string;
    similarityScore?: number;
    rankingFactors?: string[];
    isAIGenerated?: boolean;
    sourceType?: string;
    keywords?: string[];
    references?: Array<{
      title: string;
      url: string;
      scrapedAt: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## Design System

### Colors
- **Primary**: Indigo/Purple (`#4F46E5`, `#7C3AED`)
- **Secondary**: Emerald (`#10B981`)
- **Accent**: Amber (`#F59E0B`)
- **Success**: Green (`#22C55E`)
- **Error**: Red (`#EF4444`)
- **Warning**: Orange (`#F97316`)
- **Text Primary**: `#1F2937`
- **Text Secondary**: `#6B7280`
- **Background**: `#F9FAFB`

### Typography
- **Font Family**: Inter or System UI
- **Headings**: Bold, tracking-tight
- **Body**: Regular, line-height relaxed
- **Small Text**: text-sm, text-gray-600

### Spacing
- Use Tailwind spacing scale (4, 6, 8, 12, 16, 24, 32, 48, 64)
- Consistent padding: p-6 for cards, p-4 for smaller components
- Consistent gaps: gap-6 for grids, gap-4 for lists

### Shadows
- **Default**: shadow-sm
- **Hover**: shadow-lg
- **Active**: shadow-xl

### Animations
- **Transitions**: 200-300ms ease-in-out
- **Hover Effects**: Scale, shadow, color changes
- **Loading**: Skeleton shimmer, spinner
- **Page Transitions**: Fade in (Framer Motion)

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile (<640px)
- Single column layout
- Hamburger menu (if navigation)
- Stacked filters (expandable drawer)
- Bottom navigation (optional)
- Touch-friendly buttons (min 44x44px)

### Tablet (640px - 1024px)
- 2-column grid
- Compact filters in top bar
- Side navigation (if needed)

### Desktop (>1024px)
- 3-column grid
- Full filter panel
- Larger text and spacing

---

## Accessibility

- **ARIA Labels**: All interactive elements
- **Keyboard Navigation**: Tab through all focusable elements
- **Focus Indicators**: Visible outline on focus
- **Alt Text**: All images
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Semantic HTML

---

## Performance Optimizations

- **Lazy Loading**: Images and routes
- **Code Splitting**: Route-based
- **Debouncing**: Search input
- **Virtualization**: If article list is very long (react-window)
- **Memoization**: useMemo, useCallback for expensive computations
- **Image Optimization**: Use Next.js Image if available

---

## Error Handling & Loading States

### Loading States
- **Initial Load**: Full-page skeleton with shimmer
- **Pagination**: Mini spinner + disabled state
- **Search**: Inline spinner in search bar
- **Detail Page**: Content skeleton

### Error States
- **Network Error**: 
  - Icon: Wifi off
  - Message: "Unable to connect to server"
  - Button: "Try Again"
- **404 Not Found**:
  - Icon: File question mark
  - Message: "Article not found"
  - Button: "Back to Home"
- **General Error**:
  - Icon: Alert triangle
  - Message: Error description
  - Button: "Retry"

### Empty States
- **No Articles**: Friendly message with illustration
- **No Search Results**: Suggest adjusting filters
- **No Tags**: Show placeholder

---

## Component Structure Suggestion

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── articles/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleGrid.tsx
│   │   ├── ArticleDetail.tsx
│   │   └── ArticleCardSkeleton.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   └── SortDropdown.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Loader.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── EmptyState.tsx
│   └── comparison/
│       ├── SplitView.tsx
│       ├── ComparisonMetrics.tsx
│       └── DiffHighlight.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ArticleDetailPage.tsx
│   ├── ComparisonPage.tsx
│   └── StatsPage.tsx
├── hooks/
│   ├── useArticles.ts
│   ├── useArticle.ts
│   ├── useSearch.ts
│   └── useDebounce.ts
├── services/
│   └── api.ts
├── utils/
│   ├── formatDate.ts
│   ├── calculateReadingTime.ts
│   └── truncateText.ts
├── types/
│   └── article.ts
└── App.tsx
```

---

## Additional Features (If Time Permits)

1. **Dark Mode Toggle**: Switch between light/dark theme
2. **Favorites/Bookmarks**: Save articles locally (localStorage)
3. **Export**: Download article as PDF/Markdown
4. **Print Stylesheet**: Optimized print view
5. **Keyboard Shortcuts**: Quick actions (search, close modal)
6. **Animations**: Smooth page transitions with Framer Motion
7. **Toast Notifications**: Success/error messages (react-hot-toast)

---

## Environment Variables

Create `.env.example`:
```
VITE_API_URL=http://localhost:3000/api
```

---

## Final Notes

### Priority Order
1. **Home Page** with article grid (MUST HAVE)
2. **Article Detail Page** (MUST HAVE)
3. **Search & Filters** (MUST HAVE)
4. **Responsive Design** (MUST HAVE)
5. **Comparison Page** (BONUS - Stand out!)
6. **Statistics Dashboard** (BONUS)

### Visual References
- **Style Inspiration**: Medium.com, Dev.to, Hashnode
- **Modern, clean, professional**
- **Smooth animations**
- **Excellent typography**
- **Good spacing and whitespace**

### Testing
- Test all features manually
- Verify responsiveness on multiple devices
- Check accessibility with keyboard navigation
- Validate API integration with real backend

---

## Prompt Summary for v0

**"Create a modern React + TypeScript article discovery platform with:**
- **Home page**: Hero, search bar with debounce, advanced filters, responsive 3-column article grid with beautiful cards, pagination
- **Article detail page**: Full content display, metadata, AI enhancement details, references section, related articles
- **Comparison page**: Split-screen view comparing original vs AI-enhanced articles with metrics
- **Article cards**: Thumbnail with fallback gradient, badges for AI-enhanced, hover effects, metadata row, tags
- **Styling**: Tailwind CSS, indigo/purple theme, smooth animations, modern gradient hero, shadcw/ui components
- **Responsive**: 1 column mobile, 2 tablet, 3 desktop
- **API integration**: Axios with interceptors, loading skeletons, error handling
- **Accessibility**: ARIA labels, keyboard nav, WCAG compliant
- **Features**: Debounced search, filters (source type, date, sort), pagination, empty states, error handling

Use Framer Motion for animations, Lucide React for icons, follow the design system with primary color #4F46E5. Make it look professional and impressive for a job assignment!"**

---

**Save this file and use it as your v0 prompt! Adjust based on v0's response and iterate.**
