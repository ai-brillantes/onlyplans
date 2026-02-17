# OnlyPlans iOS App - Quick Improvement Opportunities

*Analysis completed on: 2025-01-27*

## Executive Summary

Analyzed the OnlyPlans iOS codebase (tfti-sponti) and identified 5 quick wins that could significantly improve app stability, performance, and user experience. These improvements focus on error handling, memory management, auth flows, and code cleanup.

---

## 1. Fix Missing Invite Creation Error Handling

**File(s) to change:**
- `ViewModels/CreateInviteViewModel.swift`
- `Managers/InviteManager.swift`

**What to change:**
- Add proper error handling around Firebase batch operations in `createInvite()` method
- Handle network timeouts and Firestore quota limits  
- Show user-friendly error messages when invite creation fails
- Add retry logic for transient failures

**Current issue:**
Todo.txt mentions "error handling when invite creation fails" - the current code has multiple points where Firebase operations could fail silently, leaving users confused when invites don't appear.

**Estimated effort:** Small
**Impact:** High

---

## 2. Fix Auth State Race Conditions

**File(s) to change:**
- `ViewModels/AuthManager.swift`
- `ViewModels/UserViewModel.swift`

**What to change:**
```swift
// In AuthManager.swift - fix the init() method
init() {
    // Current code calls async operations in init without proper waiting
    // Move async profile checking to a dedicated method
    setupAuthStateListener()
}

private func setupAuthStateListener() {
    Auth.auth().addStateDidChangeListener { [weak self] auth, user in
        // Properly handle auth state changes here
    }
}
```

**Current issue:**
AuthManager's init() calls async operations synchronously, and UserViewModel has multiple auth state listeners that can conflict. This causes the "isProfileComplete" flag to be unreliable.

**Estimated effort:** Small  
**Impact:** High

---

## 3. Optimize Memory Usage in ImageCacheManager

**File(s) to change:**
- `Managers/ImageCacheManager.swift`

**What to change:**
- Remove aggressive 30-second cache cleanup (commented in code)
- Implement smarter memory pressure handling 
- Reduce default cache limits from 20 items/15MB to 10 items/10MB
- Add image compression before caching

**Current issue:**
ImageCacheManager has overly aggressive memory cleanup and large cache limits that can cause memory warnings on older devices.

**Estimated effort:** Small
**Impact:** Medium

---

## 4. Fix Inefficient Friend Queries

**File(s) to change:**
- `ViewModels/UserViewModel.swift` (fetchFriends method)
- `Managers/InviteManager.swift` (getAllFriendIds method)

**What to change:**
- Cache friend lists locally instead of querying Firestore every time
- Add pagination to friend queries (currently loads all friends)
- Use composite indices for friend relationship queries
- Add debouncing to prevent duplicate friend fetches

**Current issue:**
The app makes multiple expensive Firestore queries to fetch friend relationships, causing slow loading times and unnecessary billing costs.

**Estimated effort:** Medium
**Impact:** Medium

---

## 5. Clean Up Duplicate HomeView Initialization 

**File(s) to change:**
- `Views/Home/HomeView.swift`

**What to change:**
- Remove duplicate `hasInitialized` flag logic
- Consolidate multiple `onAppear` calls into single initialization method
- Remove redundant environment object passing
- Simplify navigation destination bindings

**Current issue:**
HomeView has complex initialization logic with duplicate checks and over-engineering that makes debugging difficult.

**Estimated effort:** Small
**Impact:** Low

---

## Additional Quick Fixes Found

### SMS Compliance Implementation
- **File:** `Managers/InviteManager.swift`
- **Fix:** Complete the unified SMS queue system already partially implemented
- **Effort:** Medium | **Impact:** High

### Profile Image Cache Invalidation
- **File:** `ViewModels/UserViewModel.swift` 
- **Fix:** The profile image update flow has cache invalidation logic that could be simplified
- **Effort:** Small | **Impact:** Medium

---

## Implementation Priority

1. **Auth State Race Conditions** - Critical for user experience
2. **Invite Creation Error Handling** - Critical for core functionality  
3. **Memory Usage Optimization** - Important for app stability
4. **Friend Query Optimization** - Important for performance
5. **HomeView Cleanup** - Nice to have for maintainability

---

## Notes

- Focus on items 1-3 first as they directly impact user experience
- All identified issues have existing code patterns to follow
- No breaking changes required for any of these improvements
- Test thoroughly on older devices (iPhone 11 and below) after memory optimizations
