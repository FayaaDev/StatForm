# React Native RTL Implementation Guide v2

## Overview
This guide documents the correct approach for implementing Right-to-Left (RTL) support in React Native. It is emphasizing the "Trust the Engine" philosophy.

## The Golden Rule: Trust the Engine
React Native's layout engine (Yoga) automatically handles direction flipping when `I18nManager.isRTL` is true. 

**You do NOT need to manually flip layouts.**

### The "Row" Trap
A common mistake is to manually flip `flexDirection` for RTL. This is incorrect because the engine changes the meaning of "Start" and "End" in RTL mode.

- **LTR Mode**: Start = Left, End = Right
- **RTL Mode**: Start = Right, End = Left

Therefore, `flexDirection: 'row'` always means "Flow from Start to End".
- **In LTR**: Left → Right
- **In RTL**: Right → Left

**❌ WRONG - Manually reversing:**
```typescript
// This actually forces LTR visual order in RTL mode!
flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
```

**✅ CORRECT - Trusting the engine:**
```typescript
// Automatically flows LTR in English and RTL in Arabic
flexDirection: 'row'
```

## Implementation Strategy

### 1. Dynamic Initialization
Initialize RTL based on user preference, not just device settings.

```typescript
// src/lib/rtlSetup.ts
import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

export async function initRTL() {
  // 1. Allow RTL
  I18nManager.allowRTL(true);

  // 2. Check User Preference
  const language = await AsyncStorage.getItem('@app_language') || 'ar';
  const isArabic = language === 'ar';

  // 3. Force Direction if needed
  if (I18nManager.isRTL !== isArabic) {
    I18nManager.forceRTL(isArabic);
    if (Platform.OS !== 'web') {
      Updates.reloadAsync(); // Native requires reload
    }
  }
}
```

### 2. Text Alignment
React Native text does not automatically flip alignment unless you specify `writingDirection`.

**❌ WRONG:**
```typescript
textAlign: 'auto' // Often unreliable in RN
textAlign: 'left' // Forces Left alignment even in RTL
```

**✅ CORRECT:**
```typescript
// Explicitly tell the text component the direction
writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
```

### 3. Spacing (The `gap` Solution)
Using `marginLeft` and `marginRight` can be confusing when directions flip. 
- `marginLeft` applies to the physical Left side, even in RTL.
- `marginStart` applies to the logical Start side (Left in LTR, Right in RTL).

**Best Practice**: Use `gap` for spacing between items in a container. It works perfectly in both directions without mental overhead.

```typescript
container: {
  flexDirection: 'row',
  gap: 12, // Adds space between items regardless of direction
  alignItems: 'center',
}
```

### 4. Logical Properties
When you must use specific spacing, always use Logical Properties:

| Physical (Avoid) | Logical (Use) |
|------------------|---------------|
| `marginLeft` | `marginStart` |
| `marginRight` | `marginEnd` |
| `paddingLeft` | `paddingStart` |
| `paddingRight` | `paddingEnd` |
| `borderLeftWidth` | `borderStartWidth` |
| `borderRightWidth` | `borderEndWidth` |

## Common Components Checklist

### Icons & Text Rows
```typescript
<View style={styles.row}>
  <Icon name="user" />
  <Text>Username</Text>
</View>

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', // Engine handles the flip
    gap: 8, // Spacing
    alignItems: 'center',
  }
});
```

### Input Fields
```typescript
<TextInput 
  style={styles.input} 
  placeholder="..." 
/>

const styles = StyleSheet.create({
  input: {
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    textAlign: I18nManager.isRTL ? 'right' : 'left', // Optional, usually writingDirection is enough
  }
});
```

### Radio Buttons / Checkboxes
Ensure the "bullet" comes before the text in the logical flow.
```typescript
<View style={styles.option}>
  <RadioButton />
  <Text>Option 1</Text>
</View>

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row', // [Radio] [Text] in LTR, [Radio] [Text] (Right-to-Left) in RTL
    gap: 12,
    alignItems: 'center',
  }
});
```

## Summary of Fixes
1. **Remove** all `flexDirection: I18nManager.isRTL ? ...` logic. Replace with `flexDirection: 'row'`.
2. **Replace** `textAlign: 'auto'` with `writingDirection: ...`.
3. **Replace** `marginLeft/Right` with `gap` or `marginStart/End`.
4. **Ensure** `I18nManager` is imported in screens using RTL logic.

By following these rules, you work *with* the React Native layout engine rather than fighting against it.
