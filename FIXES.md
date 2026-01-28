# Fixes Applied to Articles Filter System

This document tracks all critical bugs fixed in the articles filter and infinite scroll implementation.

---

## Fix #1: Maximum Update Depth Exceeded Error

### Problem

The application was experiencing a fatal error:
```
Error: Maximum update depth exceeded. This can happen when a component 
repeatedly calls setState inside componentWillUpdate or componentDidUpdate. 
React limits the number of nested updates to prevent infinite loops.
```

### Root Cause

The issue was caused by **duplicate state management** creating a circular update loop:

1. `ArticleProvider` maintained local state via `useReducer`
2. It initialized state from `HomeContext.articleFilters`
3. A `useEffect` watched for state changes and synced back to `HomeContext`
4. This update triggered a re-render
5. The component re-initialized with new `articleFilters` values
6. The `useEffect` detected changes and updated again
7. **Infinite loop!**

#### Code Before (Problematic)

```typescript
// ArticleProvider.tsx
const { articleFilters, setArticleFilters } = useContext(HomeContext);

const [state, dispatch] = useReducer(articleFilterReducer, {
  ...initialArticleState,
  ...articleFilters, // ❌ Initializing from HomeContext
});

const value = useFilter(state, dispatch);

// ❌ This creates an infinite loop!
useEffect(() => {
  setArticleFilters({
    category: value.category,
    year: value.year,
    fileType: value.fileType,
    author: value.author,
    language: value.language,
  });
}, [value, setArticleFilters]); // value changes → updates HomeContext → re-render → repeat
```

### Solution

**Use HomeContext as the single source of truth** - removed the duplicate local state entirely.

#### Code After (Fixed)

```typescript
// ArticleProvider.tsx
export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const { articleFilters, updateFilterField, setArticleFilters } =
    useContext(HomeContext);

  // ✅ No local reducer state - use HomeContext directly

  const handleCategoryChange = useCallback(
    (value: string | number | readonly string[] | undefined) => {
      updateFilterField("category", value); // ✅ Update HomeContext directly
    },
    [updateFilterField],
  );

  const handleYearChange = useCallback(
    (newValue: number[]) => {
      updateFilterField("year", newValue);
    },
    [updateFilterField],
  );

  // ... other handlers

  const value = useMemo(
    () => ({
      ...articleFilters, // ✅ Read directly from HomeContext
      resetFilter,
      handleYearChange,
      handleAuthorChange,
      handleCategoryChange,
      handleFileTypeChange,
      handleLanguageChange,
    }),
    [articleFilters, resetFilter, /* ... handlers */],
  );

  return <ArticleContext value={value}>{children}</ArticleContext>;
}
```

### Key Changes

1. **Removed `useReducer`** - No more local state management
2. **Removed `useEffect` sync** - No more circular updates
3. **Used `updateFilterField` directly** - Updates HomeContext in one direction only
4. **Read from `articleFilters`** - Single source of truth

### Architecture After Fix

```
┌─────────────────────────────────────┐
│       HomeProvider (Global)         │
│  - articleFilters (single source)   │
│  - updateFilterField()               │
│  - setArticleFilters()               │
└──────────────┬──────────────────────┘
               │
               ├──────────────────────┐
               │                      │
               ▼                      ▼
     ┌─────────────────┐    ┌─────────────────┐
     │ ArticleProvider │    │ Articles        │
     │ (Filter UI)     │    │ (Consumer)      │
     │                 │    │                 │
     │ - Reads filters │    │ - Reads filters │
     │ - Updates via   │    │ - Passes to API │
     │   updateField() │    │                 │
     └─────────────────┘    └─────────────────┘
```

### Benefits

1. ✅ **No infinite loops** - Single direction data flow
2. ✅ **Simpler code** - Less state management overhead
3. ✅ **Better performance** - No unnecessary re-renders from sync effect
4. ✅ **Single source of truth** - HomeContext owns the filter state
5. ✅ **Predictable updates** - Clear update path via `updateFilterField()`

### Testing

After the fix, verify:
- [ ] Filters can be changed without errors
- [ ] Each filter change updates the articles list
- [ ] Reset button works without infinite loops
- [ ] Multiple rapid filter changes don't cause issues
- [ ] No console errors or warnings
- [ ] Browser doesn't freeze

### Related Files Modified

- `src/pages/home/ArticlesFitler/ArticleProvider.tsx` - Removed reducer, used HomeContext directly
- `src/pages/home/ArticlesFitler/ArticleContext.ts` - Context definition (unchanged, still used)
- `src/hooks/useFilter.ts` - No longer used by ArticleProvider (can be removed if unused elsewhere)

### Lessons Learned

1. **Avoid duplicate state** - Don't maintain the same state in multiple places
2. **One source of truth** - Use context as the source, not a mirror
3. **Watch for circular updates** - useEffect + setState can create loops
4. **Functional updates** - When you must sync state, use functional updates
5. **Keep it simple** - If context exists, use it directly instead of wrapping

---

**Date Fixed**: 2024  
**Issue**: Maximum update depth exceeded  
**Status**: ✅ Resolved  
**Priority**: Critical

---

## Fix #2: Infinite Loading on Scroll

### Problem

The ArticlesContent component was experiencing infinite loading when scrolling:
- Continuous API calls even when already fetching
- Browser performance degradation
- Excessive network requests
- Never-ending loading states

### Root Cause

The IntersectionObserver was continuously reporting intersection status without tracking state changes:

1. LoadingMore component becomes visible
2. `useIntersection` reports `isIntersected = true`
3. `useArticle` triggers `fetchNextPage()`
4. While fetching, element is still visible (still intersecting)
5. `useIntersection` keeps reporting `isIntersected = true`
6. Effect runs again → triggers another fetch
7. **Infinite loop!**

#### Code Before (Problematic)

```typescript
// useIntersection.ts
export default function useIntersection(ref: RefObject<HTMLElement | null>) {
  const [isIntersected, setIsIntersected] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersected(entries[0].isIntersecting); // ❌ Always updates
      },
      { threshold: 0.1 }
    );
    // ...
  }, [ref]);

  return isIntersected;
}
```

```typescript
// useArticle.ts
useEffect(() => {
  if (isIntersected && hasNextPage && !isFetchingNextPage) {
    fetchNextPage(); // ❌ Called repeatedly while visible
  }
}, [isIntersected, hasNextPage, isFetchingNextPage, fetchNextPage]);
```

### Solution

Implemented a **two-layer defense**:

#### 1. Smart Intersection Detection

Track intersection state **changes** instead of continuous status:

```typescript
// useIntersection.ts
const [isIntersected, setIsIntersected] = useState(false);
const previousIntersectingRef = useRef(false); // ✅ Track previous state

const observer = new IntersectionObserver(
  (entries) => {
    const isCurrentlyIntersecting = entries[0].isIntersecting;

    // ✅ Only update when status CHANGES
    if (isCurrentlyIntersecting && !previousIntersectingRef.current) {
      setIsIntersected(true);
      previousIntersectingRef.current = true;
    } else if (!isCurrentlyIntersecting && previousIntersectingRef.current) {
      setIsIntersected(false);
      previousIntersectingRef.current = false;
    }
  },
  {
    threshold: 0.1,
    rootMargin: "200px", // ✅ Preload before visible
  }
);
```

#### 2. Fetch Guard with useRef

Prevent duplicate triggers using ref (no re-renders):

```typescript
// useArticle.ts
const fetchingRef = useRef(false); // ✅ Track if already triggered

useEffect(() => {
  // ✅ Only fetch if ALL conditions met
  if (
    isIntersected &&
    hasNextPage &&
    !isFetchingNextPage &&
    !fetchingRef.current
  ) {
    fetchingRef.current = true; // ✅ Mark as triggered
    fetchNextPage();
  }

  // ✅ Reset when appropriate
  if (!isIntersected || !isFetchingNextPage) {
    fetchingRef.current = false;
  }
}, [isIntersected, hasNextPage, isFetchingNextPage, fetchNextPage]);
```

### Key Improvements

1. **State Change Detection** - Only updates when entering/leaving viewport
2. **Fetch Guard** - `useRef` prevents re-triggering until reset
3. **Preloading** - `rootMargin: "200px"` for smoother UX
4. **Proper Cleanup** - No memory leaks

### Testing

- [ ] Scroll to bottom - only ONE request per scroll
- [ ] Network tab shows no duplicate requests
- [ ] Rapid scrolling doesn't cause issues
- [ ] Last page loads correctly without infinite loop
- [ ] Console shows no errors

### Related Files Modified

- `src/hooks/useIntersection.ts` - Added state change detection
- `src/pages/home/Articles/useArticle.ts` - Added fetch guard
- `src/pages/home/Articles/useArticleContent.ts` - Fixed import path

### Benefits

1. ✅ No infinite loading - One fetch per intersection
2. ✅ Better performance - Fewer state updates
3. ✅ Smoother UX - Preloading with rootMargin
4. ✅ Network efficient - No duplicate requests
5. ✅ Memory safe - Proper cleanup

**Date Fixed**: 2024  
**Issue**: Infinite loading on scroll  
**Status**: ✅ Resolved  
**Priority**: Critical

---

## Summary

Both critical issues have been resolved:
1. ✅ **Filter state infinite loop** - Single source of truth in HomeContext
2. ✅ **Infinite scroll loading** - Smart intersection detection + fetch guard

See `FILTER_IMPLEMENTATION.md` and `INFINITE_SCROLL_FIX.md` for detailed documentation.