# Quick Test Guide - Filter & Scroll Fixes

## 🚀 Quick Start

1. **Start the server**
   ```bash
   cd sluk
   npm run dev
   ```

2. **Open browser**
   - Navigate to `http://localhost:3500/`
   - Open DevTools (F12 or Ctrl+Shift+I)
   - Open Console tab

3. **Check for errors**
   - Console should be clean (no red errors)
   - No "Maximum update depth exceeded" error
   - No infinite loop warnings

---

## ✅ Test #1: Filter State (Infinite Loop Fix)

### Quick Test (30 seconds)
1. **Click different category badges** rapidly 5-10 times
   - Expected: No browser freeze ✅
   - Expected: No console errors ✅
   - Expected: Articles update smoothly ✅

2. **Drag year slider** back and forth quickly
   - Expected: Responsive movement ✅
   - Expected: No lag or freeze ✅
   - Expected: Articles filter correctly ✅

3. **Type in author search** quickly
   - Type: "John Doe" then clear it
   - Expected: No errors ✅
   - Expected: Articles update ✅

4. **Click "Reset Filter" button**
   - Expected: All filters reset to defaults ✅
   - Expected: No console errors ✅

### Pass Criteria
- ❌ If browser freezes → FAIL
- ❌ If console shows "Maximum update depth" → FAIL
- ❌ If CPU usage spikes to 100% → FAIL
- ✅ If all smooth and responsive → PASS

---

## ✅ Test #2: Infinite Scroll (Loading Fix)

### Quick Test (1 minute)

1. **Open Network tab** in DevTools
   - Clear any existing requests

2. **Scroll to bottom** of articles list
   - Watch the Network tab
   - Expected: Only ONE new request appears ✅
   - Expected: Loading spinner appears briefly ✅
   - Expected: New articles load ✅
   - Expected: Loading stops after fetch ✅

3. **Scroll up and down** past loading zone 3 times quickly
   - Expected: Fetch triggers only when entering zone ✅
   - Expected: No duplicate requests ✅
   - Expected: No multiple simultaneous requests ✅

4. **Keep scrolling** until no more articles
   - Expected: Loading stops when no more pages ✅
   - Expected: No error messages ✅

### Pass Criteria
- ❌ If multiple requests per scroll → FAIL
- ❌ If loading never stops → FAIL
- ❌ If browser tab freezes → FAIL
- ✅ If 1 request per scroll to bottom → PASS
- ✅ If loading stops cleanly → PASS

---

## 🔬 Advanced Test (Optional, 2 minutes)

### Combined Test
1. Apply multiple filters (category + year + file type)
2. Scroll to load more articles
3. Change a filter while scrolling
4. Repeat 2-3 times

**Expected:**
- Filters and scroll work independently ✅
- No conflicts or errors ✅
- Changing filter resets pagination ✅

---

## 📊 Network Monitoring Test

### Setup
```javascript
// Paste in browser console:
let requestCount = 0;
const originalFetch = window.fetch;
window.fetch = function(...args) {
  requestCount++;
  console.log(`🌐 Request #${requestCount}:`, args[0]);
  return originalFetch.apply(this, args);
};
console.log("✅ Fetch monitoring enabled");
```

### Test
1. Scroll to bottom
2. Check console
3. Should see: `🌐 Request #1: ...` (one request only)
4. Scroll again
5. Should see: `🌐 Request #2: ...` (next request)

**Pass:** Request count increments by 1 per scroll ✅

---

## 🚨 Known Good Behavior

### Filters
- Clicking category changes articles immediately
- Dragging slider updates years in real-time
- Author search filters as you type
- Reset button clears all filters instantly
- Multiple filters combine (AND logic)

### Infinite Scroll
- Loading starts when 200px from bottom (preload)
- Spinner shows while fetching
- New articles append to list
- Loading stops when fetch completes
- Last page shows no more spinner

---

## ❌ Known Bad Behavior (Should NOT Happen)

### If You See These - Report Bug

1. **Browser Freezes**
   - Tab becomes unresponsive
   - CPU usage at 100%
   - → Filter infinite loop issue

2. **Never-ending Loading**
   - Spinner keeps spinning forever
   - Network tab shows continuous requests
   - Browser slows down
   - → Scroll infinite loop issue

3. **Console Errors**
   - "Maximum update depth exceeded"
   - "Too many re-renders"
   - "Cannot update component while rendering"
   - → State management issue

4. **Duplicate Requests**
   - 2+ requests per scroll
   - Multiple simultaneous fetches
   - → Intersection observer issue

---

## 📝 Test Results Template

**Date:** _______________  
**Browser:** _______________  
**Tester:** _______________

| Test | Pass/Fail | Notes |
|------|-----------|-------|
| Filter rapid clicks | [ ] | |
| Year slider drag | [ ] | |
| Author search | [ ] | |
| Reset filter | [ ] | |
| Scroll to bottom | [ ] | |
| Multiple scrolls | [ ] | |
| No duplicate requests | [ ] | |
| No console errors | [ ] | |
| No browser freeze | [ ] | |

**Overall Status:** ☐ PASS  ☐ FAIL

**Issues Found:**
_____________________________________________
_____________________________________________

---

## 🎯 Expected Console Output

### Good (Clean Console)
```
✓ React Query initialized
✓ Articles loaded
✓ Filter updated
```

### Bad (Error Console)
```
❌ Error: Maximum update depth exceeded
❌ Warning: Cannot update during render
❌ Error: Too many re-renders
```

---

## 💡 Tips

1. **Use React Query DevTools** (if installed)
   - Watch query status
   - Verify pagination works
   - Check cache behavior

2. **Monitor Performance**
   - Open Performance tab
   - Record while testing
   - Look for long tasks (red)

3. **Test on Mobile**
   - Responsive design
   - Touch scrolling
   - Filter panel behavior

---

## ✅ Sign-Off

- [ ] All quick tests passed
- [ ] No console errors
- [ ] No performance issues
- [ ] Ready for production

**Tested by:** _______________  
**Approved:** _______________  
**Date:** _______________

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Both fixes verified and working