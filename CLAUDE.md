# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension built with WXT that generates annual reports for Tsinghua University card.tsinghua.edu.cn users. The extension provides:
- A floating button on card.tsinghua.edu.cn/userselftrade
- A panel to fetch transaction data and generate annual reports
- Image export using Vercel Satori for sharing
- UI built with Ant Design v6 and Ant Design Charts

This project upgrades the previous Next.js web app (located in `/thu-food-report`) to a browser extension format to bypass API CORS restrictions.

## Development Commands

### Running the Extension
```bash
# Development mode (Chrome)
bun run dev

# Development mode (Firefox)
bun run dev:firefox

# Build for production
bun run build
bun run build:firefox

# Create distribution zip
bun run zip
bun run zip:firefox

# Type checking
bun run compile
```

### Package Management
This project uses `bun` as the package manager. Install dependencies with:
```bash
bun install
```

After installing dependencies, always run:
```bash
bun run postinstall  # or: wxt prepare
```

## Architecture

### Extension Structure (WXT Framework)

WXT follows a file-based entrypoint system where files in `/entrypoints` automatically become extension components:

- **`entrypoints/background.ts`**: Service worker for background tasks (API calls, data processing)
- **`entrypoints/content.ts`**: Content script that injects UI into card.tsinghua.edu.cn/userselftrade
- **`entrypoints/popup/`**: Extension popup UI (optional, for browser toolbar icon)

### Key Architectural Patterns

**Data Flow**:
1. Content script detects page load on card.tsinghua.edu.cn/userselftrade
2. Injects floating button in right bottom corner
3. User clicks button → opens panel
4. Panel sends message to background worker
5. Background worker fetches data from card.tsinghua.edu.cn API with user's cookies
6. Data is decrypted (AES-128-ECB), processed, and analyzed
7. Report is rendered in panel using Ant Design components
8. Satori generates PNG images for sharing

**Data Processing Pipeline** (from thu-food-report):
```
fetchData → cleanDataFrame → createDataTable → constructMealDataTable → analyze
```

**Note**: Data is fetched fresh on each request. No persistent storage of transaction data is required.

### Migration from thu-food-report

The `/thu-food-report` directory contains the original Next.js implementation. Key components to migrate:

**Core Logic** (reusable):
- `src/action.ts`: Data fetching, AES decryption, data processing, analysis functions
- `src/components/poster.tsx`: 10 visualization components (slides)
- Analysis functions: BasicStats, Favorite, Cost, Time, NewYearFirstMeal, etc.

**Needs Adaptation**:
- Replace Next.js server actions with extension background messages
- Replace MongoDB with temporary in-memory storage (no persistence needed)
- Replace Next.js routing with in-panel navigation
- Adapt carousel to fit extension panel dimensions

### Tech Stack Requirements

**Current (to be added)**:
- Ant Design v6 (`antd@^6.0.0`)
- Ant Design Charts (`@ant-design/charts`)
- Ant Design X (`@ant-design/x` - for future LLM features)
- Vercel Satori (`satori`) - for rendering reports to PNG/SVG
- Data processing library (TBD - evaluate options):
  - Polars (polars-js)
  - DuckDB-wasm
  - Arquero (current in thu-food-report, may need replacement)
- crypto-js or Web Crypto API - for AES-128-ECB decryption

**Already Installed**:
- React 19.2.3
- WXT 0.20.6
- TypeScript 5.9.3

## Data Structures

### API Endpoint (Updated for 2025)

**IMPORTANT**: The API has changed from the 2024 version. Query parameters are now in the request body instead of URL params.

```
POST https://card.tsinghua.edu.cn/business/querySelfTradeList
Headers:
  - Cookie: servicehall={user_cookie}
  - Content-Type: application/json

Body (JSON):
{
  "pageNumber": 0,
  "pageSize": 1000,
  "starttime": "2025-01-01",
  "endtime": "2025-12-31",
  "idserial": "user_student_id",
  "tradetype": "-1"
}

Response:
{
  "data": "<key(16 chars) + base64(aes_encrypted_data)>"
}
```

**Debug Output**: Implement configurable debug logging to capture:
- Raw API request/response
- Decryption status
- Data structure changes
- Any new fields in the response

This helps detect undocumented API changes.

### Decrypted Transaction Record
```typescript
{
  txdate: string       // Transaction date
  meraddr: string      // Cafeteria name
  mername: string      // Stall name
  txamt: number        // Amount (cents)
  balance: number      // Card balance
  txcode: string       // "1210" for meal transactions
}
```

**Note**: These field names may have changed in the 2025 API. Debug output will help identify changes.

### Report Data Type
See `thu-food-report/src/action.ts` for the complete `ReportData` type (38 fields including totalAmount, totalMeals, favorite cafeteria/stall, timing habits, etc.)

## Important Implementation Notes

### Content Script Constraints
- Match pattern should be: `*://card.tsinghua.edu.cn/userselftrade*`
- Use Shadow DOM for floating button/panel to avoid CSS conflicts
- Listen for page load completion before injecting UI
- Use `@1natsu/wait-element` or similar to ensure page elements are ready

### Background Worker
- Use `chrome.cookies.get()` (or `browser.cookies.get()`) to retrieve servicehall cookie
- Handle API rate limiting with retry logic (max 3 retries, exponential backoff)
- Process large datasets (1000 items per page, multiple pages) efficiently
- **No persistent storage needed** - fetch data fresh on each report generation

### Debug Configuration
Implement a debug mode that can be toggled via:
- Extension popup settings
- Developer console command
- Environment variable during build

Debug output should include:
- API request details (URL, headers, body)
- Raw API responses (before decryption)
- Decrypted data structure
- Data processing steps
- Any errors or unexpected data formats

### Security Considerations
- Never log servicehall cookie in debug output (redact it)
- Validate all data from card.tsinghua.edu.cn API
- Sanitize user inputs to prevent XSS

### UI/UX Requirements
- Floating button: fixed position, bottom-right corner, z-index > page content
- Panel: slide-in animation, draggable/resizable optional
- Use Ant Design theme tokens for consistent styling
- Panel should be closable and re-openable
- Support dark mode (Ant Design v6 has built-in support)

### Satori Image Generation
- Satori converts React components to SVG/PNG
- Requires custom font loading (currently using AlimamaShuHeiTi in thu-food-report)
- Render each report slide (300x300px) as separate images
- Combine into shareable format (single long image or zip of individual slides)

## File Organization Conventions

```
/entrypoints
  /background.ts          # API calls, data processing
  /content.ts             # UI injection, message passing
  /popup                  # Optional popup UI and settings
/components
  /report                 # Report visualization components (migrated from poster.tsx)
  /ui                     # Reusable UI components (Ant Design wrappers)
/lib
  /data-processing.ts     # Data pipeline (evaluate Polars/DuckDB/Arquero)
  /api.ts                 # API client and decryption
  /debug.ts               # Debug logging utilities
  /satori.ts              # Image generation logic
/assets
  /fonts                  # Custom fonts for Satori
/public
  /icon                   # Extension icons
```

## Configuration Files

### wxt.config.ts
- Already configured with `@wxt-dev/module-react`
- Add manifest configuration for permissions:
  - `host_permissions`: `["*://card.tsinghua.edu.cn/*"]`
  - `permissions`: `["cookies", "storage"]` (storage only for settings, not transaction data)

### tsconfig.json
- Extends `.wxt/tsconfig.json`
- Uses `jsx: "react-jsx"`
- Allows importing TypeScript extensions

## Common Development Patterns

### Message Passing (Content ↔ Background)
```typescript
// Content script
browser.runtime.sendMessage({
  type: 'FETCH_DATA',
  payload: { userId, startDate, endDate }
});

// Background worker
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'FETCH_DATA') {
    // Process and respond
  }
});
```

### Data Processing Library Evaluation

The original thu-food-report uses Arquero. Consider these alternatives:

**Polars (polars-js)**:
- Pros: Fast, Rust-based, familiar DataFrame API
- Cons: Larger bundle size, Node.js focused

**DuckDB-wasm**:
- Pros: SQL interface, very fast for aggregations, runs in browser
- Cons: WebAssembly overhead, steeper learning curve

**Arquero** (current):
- Pros: Lightweight, JavaScript-native, already working code
- Cons: Slower than Polars/DuckDB on large datasets

Choose based on:
1. Bundle size constraints for extension
2. Performance with expected data sizes (typically 1000-5000 transactions/year)
3. Code migration effort from thu-food-report

### Debug Logging Pattern
```typescript
// lib/debug.ts
export const debug = {
  enabled: false, // Toggle via settings
  log: (category: string, data: any) => {
    if (debug.enabled) {
      console.log(`[THU-CARD-SUMMARY-${category}]`, data);
    }
  },
  apiRequest: (url: string, body: any) => {
    debug.log('API-REQ', { url, body: { ...body, idserial: '***' } });
  },
  apiResponse: (data: any) => {
    debug.log('API-RES', data);
  }
};
```

## Dependencies to Add

When setting up the project, install these additional packages:
```bash
bun add antd @ant-design/charts @ant-design/x
bun add satori
bun add @1natsu/wait-element

# Data processing - choose one:
bun add polars        # Option 1: Polars
# OR
bun add @duckdb/duckdb-wasm  # Option 2: DuckDB
# OR
bun add arquero       # Option 3: Arquero (current)

# AES decryption - choose one:
bun add crypto-js     # Option 1: crypto-js
# OR use Web Crypto API (built-in, no package needed)

# TypeScript types
bun add -d @types/crypto-js  # if using crypto-js
```

## 2025 Data Update

The original thu-food-report was for 2024 data. Update:
- Date range: `2025-01-01` to `2025-12-31`
- NewYearFirstMeal logic: adjust for 2025 Spring Festival date (January 29, 2025)
- Any hardcoded 2024 references in UI text
- **API changes**: Request body format (not URL params)
- Monitor for any changes to response data structure via debug logs

## Future Enhancements

The architecture should support adding Ant Design X chatbot features later:
- Reserve space in panel for chat interface
- Design data structures to be queryable by LLM
- Consider using extension background for LLM API calls
