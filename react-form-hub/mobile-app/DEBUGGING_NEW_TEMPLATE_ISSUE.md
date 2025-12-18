# Debugging: New Template Not Showing in Mobile App

## Issue
Template `http://localhost:5000/form/mhti89sgbdyolhwnhur` was deployed but doesn't appear in the mobile app.

## Debugging Steps

### Step 1: Restart Expo Dev Server

**IMPORTANT:** The cache-busting fix requires restarting the Expo dev server.

```bash
cd /Users/fayaa/Desktop/App/MalariaForm/mobile-app

# Stop the current Expo server (Ctrl+C)

# Clear cache and restart
npx expo start --clear
```

### Step 2: Check Console Logs

After restarting and pulling to refresh in the app, check the Expo console for these logs:

```
📥 Fetched templates from server: { total: X, templates: [...] }
👤 User filter info: { hasUser: true, username: '...', assignedDiseases: [...] }
🔍 Starting template filtering...
📋 User assigned diseases: [...]
```

### Step 3: Identify the Problem

Look for your template in the console logs. You'll see one of these:

#### Problem 1: Template Not Deployed
```
❌ [Template Name]: Not deployed (isDeployed: false, deploymentId: undefined)
```

**Solution:** The template wasn't properly marked as deployed. Check:
- On web dashboard, did you click "نشر" (Publish)?
- Does the template have a deployment URL?

#### Problem 2: User Has No Assigned Diseases
```
❌ [Template Name]: User has no assigned diseases
```

**Solution:** The logged-in mobile user has no diseases assigned. 

1. Go to web dashboard → **إدارة المستخدمين** (Users tab)
2. Find the mobile app user
3. Assign at least one disease to them

#### Problem 3: Disease Mismatch
```
❌ [Template Name]: HQ template - no disease match. Template disease: "الملاريا", User diseases: ["حمى الضنك"]
```

**Solution:** The template's disease doesn't match any of the user's assigned diseases.

1. On web dashboard → Users tab
2. Find the mobile app user
3. Add the matching disease to their assignments

#### Problem 4: Template Not Active
```
❌ [Template Name]: Not active
```

**Solution:** Template is marked as inactive in database. Check `is_active` field.

### Step 4: Verify Template on Web

Check the template on the web dashboard:

1. Go to `http://localhost:5000/admin`
2. Find your template in the list
3. Verify:
   - ✅ Has deployment URL shown
   - ✅ Shows "🚀" or "منشور" indicator
   - ✅ Has a disease assigned
   - ✅ Is published to correct sectors/regions

### Step 5: Verify Mobile User Setup

1. Check which user is logged into mobile app:
   ```
   Look for console log: 👤 User filter info: { username: '...' }
   ```

2. On web dashboard, find that user and check:
   - ✅ Has assigned diseases
   - ✅ The assigned diseases match the template's disease
   - ✅ User is in a city/sector that has access to the template

### Step 6: Test Network Request

Check if the template is actually in the API response:

```bash
# Get auth token from Expo console logs, then:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://192.168.0.205:3001/api/templates?_t=1234567890 | jq '.[].name'
```

Look for your template name in the output.

## Common Solutions

### Solution 1: User Needs Disease Assignment

The most common issue! Mobile users need diseases assigned to see templates.

**Web Dashboard Steps:**
1. Admin Dashboard → **إدارة المستخدمين** tab
2. Click the user
3. Under "الأمراض المخصصة" (Assigned Diseases)
4. Check the diseases that match your deployed templates
5. Set permission to "تعديل" (Edit) or "عرض" (View)
6. Save

**Mobile App Steps:**
1. Pull down to refresh templates list
2. Template should now appear

### Solution 2: Template Needs Proper Disease Field

When publishing a template, ensure:
1. Select a disease from the "اختر المرض المستهدف" dropdown
2. Don't leave it as "-- اختر المرض --"
3. The disease must match what users are assigned to

### Solution 3: Template Needs Deployment

If template shows in database but not as deployed:
1. Find template in admin dashboard
2. Click "نشر" (Publish) button
3. Select target sectors
4. **Must select a disease**
5. Click "نشر القالب" (Publish Template)

### Solution 4: Cache Busting Not Applied

If logs don't show the `?_t=timestamp` in network requests:
1. Restart Expo dev server: `npx expo start --clear`
2. In mobile app, pull to refresh
3. Check network logs for `GET /api/templates?_t=...`

## Expected Flow When Working

1. **Deploy Template on Web:**
   - HQ user creates/edits template
   - Clicks "نشر" button
   - Selects sectors and disease
   - Gets deployment URL

2. **Assign User to Disease:**
   - Admin goes to Users tab
   - Edits mobile user
   - Assigns matching disease
   - Sets permission

3. **Mobile User Sees Template:**
   - Mobile user pulls to refresh
   - API fetches fresh data (with cache busting)
   - Filter checks: active ✓, deployed ✓, disease match ✓
   - Template appears in list

## Debug Checklist

Run through this checklist:

- [ ] Expo dev server restarted with `--clear`
- [ ] Template is marked as deployed on web
- [ ] Template has a disease assigned
- [ ] Mobile user exists in Users tab
- [ ] Mobile user has diseases assigned
- [ ] Assigned diseases include template's disease
- [ ] Console logs show template being fetched
- [ ] Console logs show why template was filtered out
- [ ] Network requests include `?_t=timestamp` parameter

## Need More Help?

If still not working, share these console log sections:

1. `📥 Fetched templates from server:` - Shows what API returns
2. `👤 User filter info:` - Shows user's assignments
3. `🔍 Starting template filtering...` - Shows filtering decisions
4. `✅ After filtering:` - Shows final result

These logs will reveal exactly why the template isn't appearing.

