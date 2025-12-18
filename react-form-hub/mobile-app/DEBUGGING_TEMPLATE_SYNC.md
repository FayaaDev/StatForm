# Debugging Template Sync Issues

## The Problem You Experienced

Your newly deployed template (https://vazhs.com/form/mhsq99add1rdy1icpn) didn't show up after pull-to-refresh, but appeared after Expo refresh (cmd+4).

## Why This Happens

There are **two possible reasons**:

### 1. **Server Timing Issue (Most Likely)**
- Template gets deployed in web app
- Mobile app immediately syncs
- Database transaction hasn't fully committed yet
- API returns templates but new one isn't included yet
- After a few seconds (Expo refresh), template is available

### 2. **User Permission Filtering**
- Template is fetched from server
- But filtered out because user "CholeGuy" doesn't have access
- Need to assign the template/disease to the user

## How to Debug - Follow These Steps

### Step 1: Deploy Template and Note Details
1. Deploy your template in web app
2. **Wait 2-3 seconds** before syncing mobile app (give DB time to commit)
3. Note the template name and deployment ID

### Step 2: Pull to Refresh with New Logs
1. Open mobile app
2. Pull down to refresh
3. **Check console logs carefully**

### Step 3: Analyze the Logs

#### A. Check if Template is Fetched from Server
Look for this section:
```
[syncTemplates] ============ SYNC START ============
[syncTemplates] User: CholeGuy
[syncTemplates] Assigned Diseases: [list of diseases]
[syncTemplates] Fetching templates from server...
[syncTemplates] ✅ Fetched X templates from server
[syncTemplates] ALL templates from server:
  1. "Template 1" (ID: 75, isDeployed: true, deploymentId: xyz, disease: Malaria, createdBySector: hq)
  2. "Template 2" (ID: 76, isDeployed: true, deploymentId: abc, disease: TB, createdBySector: regional)
  3. "YOUR NEW TEMPLATE" (ID: 77, isDeployed: true, deploymentId: mhsq99add1rdy1icpn, ...)
```

**If your template is NOT in this list:**
- ❌ Server hasn't returned it yet (timing issue)
- ❌ Template isn't properly deployed in the database
- **Solution**: Wait a few seconds and sync again

**If your template IS in this list:**
- ✅ Server sent it correctly
- Continue to Step B to check filtering

#### B. Check Filtering Results
Look for detailed filtering logs:
```
[Filter] HQ Template: "YOUR NEW TEMPLATE"
[Filter]   - Disease: Cholera
[Filter]   - User assigned diseases: TB, Malaria
[Filter]   ❌ FAIL - User not assigned to this HQ template
```

**If you see ❌ FAIL:**
- User doesn't have permission for this template/disease
- **Solution**: Assign the disease to the user in web app (User Manager)

**If you see ✅ PASS:**
- Template should appear in the list
- If it doesn't, there's another issue (contact dev team)

#### C. Check Final Result
```
[syncTemplates] ⚡ After filtering: 2 templates
[syncTemplates] Filtered templates (will be stored locally):
  1. "Template 1" (ID: 75)
  2. "Template 2" (ID: 76)
```

If your template is missing from this list, it was filtered out due to permissions.

## Quick Solutions

### Solution 1: Add Delay Before Syncing (Recommended)
After deploying a template:
1. **Wait 3-5 seconds** before syncing mobile app
2. This gives the database time to commit the transaction
3. Then pull to refresh

### Solution 2: Assign Disease to User
1. Go to web app → User Manager
2. Find user "CholeGuy"
3. Assign the template's disease (e.g., "Cholera", "TB", "Malaria")
4. Save
5. Pull to refresh in mobile app

### Solution 3: Check Template Deployment
1. Go to web app → Admin Dashboard
2. Find your template
3. Verify it has:
   - ✅ Green "Deployed" badge
   - ✅ Deployment ID shown
   - ✅ `isDeployed: true` in template_data
4. If not, click "Deploy" again

### Solution 4: Force Full Sync
If nothing works:
1. Sign out of mobile app
2. Wait 5 seconds
3. Sign in again
4. This triggers a complete fresh sync

## Example Log Analysis

### Example 1: Template Not Fetched from Server (Timing Issue)
```
[syncTemplates] ✅ Fetched 4 templates from server
[syncTemplates] ALL templates from server:
  1. "AppTest3" (ID: 75, ...)
  2. "App Test2" (ID: 74, ...)
  3. "AppTest4" (ID: 76, ...)
  4. "الملاريا Gemini" (ID: 70, ...)
```
**Problem**: Your new template (ID 77, deploymentId: mhsq99add1rdy1icpn) is missing!
**Solution**: Wait a few seconds and sync again.

### Example 2: Template Filtered Due to Permissions
```
[syncTemplates] ✅ Fetched 5 templates from server
[syncTemplates] ALL templates from server:
  1. "AppTest3" (ID: 75, disease: TB, ...)
  2. "YOUR NEW TEMPLATE" (ID: 77, disease: Cholera, createdBySector: hq, ...)
  ...

[Filter] HQ Template: "YOUR NEW TEMPLATE"
[Filter]   - Disease: Cholera
[Filter]   - User assigned diseases: TB, Malaria
[Filter]   ❌ FAIL - User not assigned to this HQ template

[syncTemplates] ⚡ After filtering: 1 templates
```
**Problem**: User "CholeGuy" isn't assigned to "Cholera" disease
**Solution**: Assign "Cholera" to user in User Manager

### Example 3: Success!
```
[syncTemplates] ✅ Fetched 5 templates from server
[syncTemplates] ALL templates from server:
  1. "YOUR NEW TEMPLATE" (ID: 77, disease: Cholera, deploymentId: mhsq99add1rdy1icpn, ...)
  ...

[Filter] HQ Template: "YOUR NEW TEMPLATE"
[Filter]   - Disease: Cholera
[Filter]   - User assigned diseases: TB, Malaria, Cholera
[Filter]   ✅ PASS - User assigned to extracted disease: Cholera

[syncTemplates] ⚡ After filtering: 3 templates
[syncTemplates] Filtered templates (will be stored locally):
  1. "AppTest3" (ID: 75)
  2. "YOUR NEW TEMPLATE" (ID: 77)
  3. "الملاريا Gemini" (ID: 70)
```
**Result**: Template successfully synced and will appear in the list! 🎉

## Testing Checklist

When deploying a new template:

- [ ] Template deployed in web app (green "Deployed" badge)
- [ ] **Wait 3-5 seconds** after deployment
- [ ] Open mobile app
- [ ] Pull to refresh
- [ ] Check console logs for sync details
- [ ] Verify template appears in the list
- [ ] If not, analyze logs to find the reason
- [ ] Apply appropriate solution

## Common User Permission Issues

### HQ Templates
- Created by "hq" sector
- Require **explicit disease assignment** to users
- Won't show unless user is assigned to that disease

### Regional Templates
- Created by regional sectors
- Automatically visible to users in that region
- Still require disease matching

### How to Check User's Assigned Diseases
Look for this in logs:
```
[syncTemplates] User: CholeGuy
[syncTemplates] Assigned Diseases: TB, Malaria, Dengue
```

If empty or missing diseases:
- Go to User Manager in web app
- Assign appropriate diseases to user
- Save and sync again

