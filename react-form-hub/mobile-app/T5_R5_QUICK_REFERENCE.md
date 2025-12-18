# Mobile App T5/R5 Quick Reference

## For T5/R5 Users (Investigators)

### What You'll See
When you log in as a T5 or R5 user and have pending assignments:
- A prominent **"📋 التكليفات"** button appears at the top of the templates screen
- A red badge shows the number of pending assignments

### How to Use

#### 1. View Your Assignments
```
Tap "📋 التكليفات" → Assignment list opens
```

#### 2. Review Assignment Details
```
Tap any assignment card → Detailed view opens
```
Shows:
- Patient information
- City and disease
- Priority level (color-coded)
- Supervisor name and notes
- Assignment notes
- Due date

#### 3. Accept an Assignment
```
Detail view → Tap "قبول التكليف"
```
- Assignment marked as accepted
- You can now start the investigation

#### 4. Reject an Assignment
```
Detail view → Tap "رفض التكليف"
→ Enter rejection reason
→ Tap "إرسال"
```
- Assignment returned to supervisor

#### 5. Start Investigation
```
After accepting → Tap "بدء التحقيق"
```
- Navigates to investigation form
- Form pre-filled with notification data (if available)
- Complete and submit as normal

## Assignment Priorities

| Priority | Color | Label |
|----------|-------|-------|
| Low | Gray | منخفضة |
| Normal | Blue | عادية |
| High | Orange | عالية |
| Urgent | Red | عاجلة |

## Assignment Status Flow

1. **assigned_investigator** → معلق - بانتظار القبول
   - Actions: Accept or Reject
   
2. **accepted_investigator** → مقبول
   - Actions: Start Investigation
   
3. **in_progress** → قيد العمل
   - Actions: Continue Investigation
   
4. **completed** → مكتمل
   - No actions (investigation finished)

## Refresh Data

Pull down on template list to refresh:
- User data
- Assignment count
- Template list

## Technical Details

### Components
- `AssignmentsModal`: Main assignments interface
- `TemplateListScreen`: Shows assignments button

### Services
- `referralService.getInvestigatorAssignments(userId)`
- `referralService.acceptReferral(referralId, userId, userTier)`
- `referralService.rejectReferral(referralId, userId, userTier, reason)`
- `referralService.startInvestigation(referralId)`

### State Management
```typescript
const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
const [assignmentsCount, setAssignmentsCount] = useState(0);
```

### User Tier Check
```typescript
if (user?.user_tier === 'T5' || user?.user_tier === 'R5') {
  // Show assignments functionality
}
```

## API Endpoints Used

- `GET /api/referrals/investigator/:id/pending`
- `PUT /api/referrals/:id/accept`
- `PUT /api/referrals/:id/reject`
- `PUT /api/referrals/:id/start-investigation`

## Troubleshooting

### Assignments button not showing?
- Verify user_tier is T5 or R5
- Check if there are pending assignments
- Pull down to refresh

### Can't see assignment details?
- Check network connection
- Verify API server is running
- Check authentication token is valid

### Accept/Reject not working?
- Verify network connection
- Check server logs for errors
- Ensure referral ID is valid

## Related Files

```
mobile-app/
├── src/
│   ├── components/
│   │   └── forms/
│   │       └── AssignmentsModal.tsx
│   ├── screens/
│   │   └── templates/
│   │       └── TemplateListScreen.tsx
│   ├── shared/
│   │   ├── services/
│   │   │   └── referralService.ts
│   │   └── types/
│   │       └── index.ts (Assignment, ReferralResponse)
│   └── contexts/
│       └── AuthContext.tsx (user_tier)
└── MOBILE_REFERRAL_SYSTEM.md (full documentation)
```
