# Mobile App T5/R5 Referral System Implementation

## Overview
Updated the mobile app to support T5/R5 (investigator) users with the ability to view, accept, and work on referral assignments, matching the functionality of the web-based RegionDashboard.

## Changes Made

### 1. Type System Updates
**File:** `mobile-app/src/shared/types/index.ts`

- Added `user_tier` field to `AuthenticatedUser` interface to support tier-based role identification (T1-T5, R1-R5)
- Created new interfaces for referral/assignment management:
  - `Assignment`: Contains referral details including notification info, patient data, priority, and supervisor information
  - `ReferralResponse`: API response wrapper for assignment lists

### 2. Referral Service
**File:** `mobile-app/src/shared/services/referralService.ts`

Created a new service with methods for:
- `getInvestigatorAssignments()`: Fetch pending assignments for T5/R5 users
- `acceptReferral()`: Accept an assignment
- `rejectReferral()`: Reject an assignment with a reason
- `startInvestigation()`: Mark investigation as in progress
- `getReferralDetails()`: Get detailed information about a specific referral

Exported via `mobile-app/src/shared/services/index.ts`

### 3. Assignments Modal Component
**File:** `mobile-app/src/components/forms/AssignmentsModal.tsx`

Features:
- Full-screen modal showing list of pending assignments
- Each assignment card displays:
  - Case name and priority badge (color-coded)
  - Patient identifier
  - City and disease information
  - Current status
  - Supervisor name
- Tap assignment to view detailed information
- Detailed view shows:
  - Complete referral information
  - Assignment notes and supervisor notes
  - Due date if applicable
  - Action buttons based on status:
    - **Pending**: Accept or Reject buttons
    - **Accepted/In Progress**: Start Investigation button
- Accept action: Confirms acceptance and updates backend
- Reject action: Prompts for rejection reason
- Start Investigation: Navigates to form with referral context

### 4. Template List Screen Updates
**File:** `mobile-app/src/screens/templates/TemplateListScreen.tsx`

Enhancements:
- Import `referralService` and `AssignmentsModal` component
- Added state for assignments modal visibility and count
- `fetchAssignmentsCount()`: Fetches pending assignment count for badge
- Refresh assignments count when:
  - Screen gains focus
  - User refreshes (pull-to-refresh)
  - Assignments modal closes
- Display "التكليفات" button for T5/R5 users when they have pending assignments:
  - Prominent button below header
  - Red badge showing count of pending assignments
  - Opens AssignmentsModal on tap
- Responsive design with proper RTL support

### 5. Styling
All components use:
- COLORS theme from `mobile-app/src/theme/colors.ts`
- RTL-aware layout using `I18nManager.isRTL`
- Consistent with existing mobile app design patterns
- Shadow and elevation for depth
- Color-coded priority badges (low/normal/high/urgent)
- Arabic-first text rendering

## User Flow

### For T5/R5 Users:
1. **Login** → User authenticates with T5 or R5 tier credentials
2. **Template List Screen** → Shows "التكليفات" button with pending count badge
3. **Tap التكليفات** → Opens AssignmentsModal
4. **View Assignments** → Scrollable list of pending referrals
5. **Select Assignment** → Tap to view full details
6. **Decision Point**:
   - **Accept**: Assignment marked as accepted, can now start investigation
   - **Reject**: Provide reason, assignment returned to supervisor
7. **Start Investigation** → Navigate to form filling screen with assignment context
8. **Fill Form** → Complete epidemiological investigation form
9. **Submit** → Investigation data saved and referral marked complete

## API Integration

The mobile app connects to existing backend endpoints:
- `GET /api/referrals/investigator/:investigatorId/pending` - Fetch assignments
- `PUT /api/referrals/:id/accept` - Accept referral
- `PUT /api/referrals/:id/reject` - Reject referral
- `PUT /api/referrals/:id/start-investigation` - Mark as in progress

All endpoints use the existing authentication token from `AuthContext`.

## Key Features

1. **Real-time Badge Updates**: Assignment count refreshes on screen focus and after modal actions
2. **Conditional Visibility**: Button only shown to T5/R5 users with pending assignments
3. **Offline Resilience**: Uses existing mobile app network handling patterns
4. **Arabic-First UX**: All text in Arabic with proper RTL layout
5. **Status-Based Actions**: Different buttons shown based on referral status
6. **Priority Visualization**: Color-coded badges for quick priority identification
7. **Seamless Navigation**: Integrated with existing navigation stack

## Testing Checklist

- [x] T5/R5 users see التكليفات button when assignments exist
- [x] Assignment count badge displays correctly
- [x] Modal opens and shows assignment list
- [x] Assignment details view displays all information
- [x] Accept action works and updates status
- [x] Reject action prompts for reason and updates status
- [x] Start investigation navigates to form screen
- [x] Count refreshes after modal actions
- [x] RTL layout renders correctly
- [x] Network errors handled gracefully
- [x] Non-T5/R5 users don't see the button

## Files Modified

1. `/mobile-app/src/shared/types/index.ts` - Type definitions
2. `/mobile-app/src/shared/services/referralService.ts` - New service (created)
3. `/mobile-app/src/shared/services/index.ts` - Export referral service
4. `/mobile-app/src/components/forms/AssignmentsModal.tsx` - New component (created)
5. `/mobile-app/src/screens/templates/TemplateListScreen.tsx` - Integration updates

## Implementation Notes

- Uses existing `apiClient` for HTTP requests
- Follows mobile app conventions for state management
- No database changes required (uses existing backend)
- Compatible with offline sync patterns
- Matches web dashboard functionality but adapted for mobile UX

## Future Enhancements

- Push notifications for new assignments
- Assignment filters (by priority, disease, date)
- Assignment search functionality
- Offline assignment viewing
- Assignment history view
