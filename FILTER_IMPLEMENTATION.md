# Articles Filter Implementation Documentation

## Overview

This document describes the implementation of the ArticlesFilter feature that allows users to filter articles dynamically. The implementation uses React Context for state management and follows the composite design pattern for component structure.

## Architecture

### State Management Flow

```
HomeProvider (Global State - Single Source of Truth)
    ↓
    ├── ArticleProvider (Wrapper)
    │   └── ArticleContext (Provides handlers)
    │       └── Filter Components (UI)
    │
    └── Articles Component (Consumer)
        └── useArticleContent hook
            └── Fetches filtered articles
```

**Note**: ArticleProvider does NOT maintain its own state. It reads from and updates HomeContext directly to avoid infinite loops.

### Key Components

1. **HomeProvider** (`src/states/providers/homeProvider.tsx`)
   - Central state management for the entire Home page
   - Manages `articleFilters` state that is shared across components
   - Provides `setArticleFilters()` and `updateFilterField()` functions

2. **ArticleProvider** (`src/pages/home/ArticlesFitler/ArticleProvider.tsx`)
   - Wraps the filter UI components
   - Provides handler functions (handleCategoryChange, etc.)
   - Directly updates HomeContext via `updateFilterField()`
   - **Does NOT maintain local state** (prevents infinite loops)

3. **ArticleContext** (`src/pages/home/ArticlesFitler/ArticleContext.ts`)
   - Defines the filter state shape
   - Provides reducer actions for filter updates
   - Exports context for child components

4. **Filter Components**
   - `ArticleListFilter` - Category selection with badges
   - `ArticleRangeFilter` - Year range slider
   - `ArticleRadioFilter` - File type radio buttons
   - `ArticleTextInputFilter` - Author search input
   - `ArticleSelectFilter` - Language dropdown

## Filter State Structure

```typescript
interface ArticleFilters {
  category: string | number | readonly string[] | undefined;
  year: number[];           // [minYear, maxYear]
  fileType: string;
  author: string;
  language: string;
}
```

### Initial State

```typescript
{
  category: "all",
  year: [1950, currentYear],
  fileType: "all",
  author: "",
  language: "all"
}
```

## How It Works

### 1. Filter Updates

When a user interacts with any filter component:

1. The component calls its handler (e.g., `handleCategoryChange`)
2. The handler calls `updateFilterField()` from HomeContext
3. HomeContext reducer updates the global `articleFilters` state
4. ArticleProvider re-renders with new `articleFilters` from context
5. Filter components receive updated values

### 2. Article Filtering

When filter state changes:

1. `useArticleContent` hook reads `articleFilters` from HomeContext
2. Passes filters to `useArticle` hook
3. `useArticle` calls `useFetchArticles` with filter params
4. React Query's `queryKey` includes filters, triggering re-fetch
5. API applies filters in `applyArticleFilters()` function
6. Filtered articles are returned and displayed

### 3. Filter Logic (API Level)

Located in `src/api/fetchArticles.ts`:

#### Category Filter
```typescript
if (filter.category && filter.category !== "all") {
  // Matches item_type_id with selected category
}
```

#### File Type Filter
```typescript
if (filter.fileType && filter.fileType !== "all") {
  // Checks article's files for matching mime_type
}
```

#### Author Filter
```typescript
if (filter.author && filter.author.trim() !== "") {
  // Searches user's full_name (case-insensitive)
}
```

#### Year Range Filter
```typescript
if (filter.year && filter.year.length === 2) {
  const [minYear, maxYear] = filter.year;
  // Filters articles where created_at year is in range
}
```

#### Language Filter
```typescript
if (filter.language && filter.language !== "all") {
  // Currently not implemented (requires DB schema update)
}
```

## Usage Example

### Adding a New Filter

1. **Add to ArticleFilters type:**
```typescript
// src/lib/types/IArticle.ts
export interface ArticleFilters {
  // ... existing filters
  newFilter: string;
}
```

2. **Update initial state:**
```typescript
// src/pages/home/ArticlesFitler/ArticleContext.ts
export const initialArticleState: ArticleState = {
  // ... existing state
  newFilter: "default",
  handleNewFilterChange: () => void 0,
};
```

3. **Add reducer action:**
```typescript
export type ArticleFilterAction =
  | { type: "SET_NEW_FILTER"; payload: string }
  | // ... other actions

export function articleFilterReducer(state, action) {
  switch (action.type) {
    case "SET_NEW_FILTER":
      return { ...state, newFilter: action.payload };
    // ... other cases
  }
}
```

4. **Add handler in useFilter hook:**
```typescript
// src/hooks/useFilter.ts
const handleNewFilterChange = useCallback(
  (value: string) => {
    dispatch({ type: "SET_NEW_FILTER", payload: value });
  },
  [dispatch]
);
```

5. **Add filter component:**
```typescript
// In ArticlesFitler.tsx
<ArticleFilter.YourNewComponent
  value={newFilter}
  onChange={handleNewFilterChange}
/>
```

6. **Implement API filtering:**
```typescript
// src/api/fetchArticles.ts
if (filter.newFilter && filter.newFilter !== "all") {
  filtered = filtered.filter(article => {
    // Your filtering logic
  });
}
```

## Reset Filter Functionality

The reset filter button clears all filters back to their initial state:

```typescript
const resetFilter = useCallback(() => {
  dispatch({ type: "RESET" });
}, [dispatch]);
```

This is connected to the "Reset Filter" button in the UI.

## Automatic Filtering

Filters are applied automatically on every change:

- **No submit button required** - Changes trigger immediate re-fetch
- **Debouncing** - Consider adding for text inputs (author search)
- **Loading states** - Handled by React Query automatically

## React Query Integration

The filtering leverages React Query's caching:

```typescript
queryKey: ["articles", { term, sortBy, filter }]
```

When `filter` changes:
- Query key changes → triggers new fetch
- Previous results cached
- Smooth UX with loading states

## Performance Considerations

1. **Memoization**: Handler functions use `useCallback`
2. **Selective updates**: Only changed filter fields trigger updates
3. **Query caching**: React Query caches results by filter combination
4. **Simulated delay**: API has 3s delay for demo (remove in production)

## Testing Filters

### Manual Testing Checklist

- [ ] Category filter updates articles list
- [ ] Year range slider filters by publication year
- [ ] File type radio buttons filter by mime type
- [ ] Author search filters by author name
- [ ] Language dropdown filters (if implemented)
- [ ] Multiple filters work together (AND logic)
- [ ] Reset button clears all filters
- [ ] Filter state persists during search
- [ ] Loading states show during filter changes

## Important: Avoiding Infinite Loops

⚠️ **Critical**: ArticleProvider must NOT maintain duplicate state. It should only:
- Read `articleFilters` from HomeContext
- Update via `updateFilterField()` function
- Never use `useEffect` to sync state back to HomeContext

See `FIXES.md` for details on the infinite loop issue that was resolved.

## Known Limitations

1. **Language filter**: Not implemented due to missing database field
2. **Filter combination**: Uses AND logic only (not OR)
3. **API delay**: 3-second simulated delay should be removed for production
4. **No debouncing**: Text inputs trigger immediate re-fetch

## Future Enhancements

1. Add debouncing for author search input
2. Implement language filter when DB schema supports it
3. Add filter count badges to show active filters
4. Persist filters in URL query params
5. Add "Clear individual filter" buttons
6. Implement OR logic for certain filter combinations
7. Add filter presets/saved searches

## Troubleshooting

### Filters not working
- Check React DevTools for filter state updates
- Verify `articleFilters` in HomeContext
- Check Network tab for API calls with filter params
- Review console for errors

### Articles not updating
- Ensure `queryKey` includes filter params
- Verify `applyArticleFilters()` logic in API
- Check if filter values match expected format

### State sync issues
- Verify `useEffect` in ArticleProvider is running
- Check dependencies in `useEffect` array
- Ensure `setArticleFilters` is called correctly

## Code References

### Main Files
- `src/states/providers/homeProvider.tsx` - Global state
- `src/pages/home/ArticlesFitler/ArticleProvider.tsx` - Filter provider
- `src/pages/home/ArticlesFitler/ArticleContext.ts` - Filter context
- `src/api/fetchArticles.ts` - API filtering logic
- `src/hooks/useFilter.ts` - Filter state hooks
- `src/pages/home/Articles/useArticleContent.ts` - Filter consumption

### Component Files
- `src/pages/home/ArticlesFitler/ArticleListFilter.tsx`
- `src/pages/home/ArticlesFitler/ArticleRangeFilter.tsx`
- `src/pages/home/ArticlesFitler/ArticleRadioFilter.tsx`
- `src/pages/home/ArticlesFitler/ArticleTextInputFilter.tsx`
- `src/pages/home/ArticlesFitler/ArticleSelectFilter.tsx`

## Bug Fixes

### Maximum Update Depth Exceeded (Fixed)

**Issue**: Infinite loop caused by duplicate state management between ArticleProvider and HomeContext.

**Solution**: Removed local state from ArticleProvider, using HomeContext as single source of truth.

See `FIXES.md` for complete details.

---

**Last Updated**: 2024
**Author**: AI Assistant
**Version**: 1.1 (Fixed infinite loop issue)