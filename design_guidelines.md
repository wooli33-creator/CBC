# Design Guidelines: 기후 위기 빙고 챌린지

## Design Approach

**Selected Approach:** Custom Educational Game Design
**Justification:** This is a playful, educational game for elementary students requiring a warm, approachable aesthetic that encourages interaction and learning. The design should be inviting, clear, and fun while maintaining educational credibility.

**Key Design Principles:**
- Playful yet purposeful: Balance fun with educational value
- Clarity first: Young users need obvious interaction cues
- Celebration-focused: Victory moments should feel rewarding
- Approachable learning: Educational content should feel like discovery, not testing

---

## Typography

**Primary Font:** Noto Sans KR (Google Fonts) - excellent Korean character support with friendly appearance
**Secondary Font:** Nunito or Comic Neue for playful accents

**Hierarchy:**
- Page Title (기후 위기 빙고 챌린지): Bold, 2.5rem-3rem, extra letter spacing for impact
- Victory Message: Bold, 2rem, animated scale-in effect
- Bingo Keywords: Medium weight, 1rem-1.125rem, clear readability
- Pop-up Headings: Semibold, 1.25rem
- Pop-up Descriptions: Regular, 1rem, generous line-height (1.6-1.8) for easy reading
- Footer Message: Regular, 1rem, friendly tone

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 for consistency
- Small gaps: 2 (0.5rem)
- Standard spacing: 4 (1rem)
- Section padding: 6-8 (1.5rem-2rem)
- Large breathing room: 12 (3rem) for page margins

**Grid Structure:**
- Container: max-w-6xl, centered with mx-auto
- Bingo Grid: Perfect square maintaining 1:1 aspect ratio, responsive sizing
- Mobile: Single column, grid scales to fit viewport width (min 280px)
- Tablet/Desktop: Centered grid with comfortable tile size (70-90px per tile)

**Page Layout:**
```
┌─────────────────────────────┐
│   Header (Title)           │
│   Victory Message Area     │  ← Conditional display
├─────────────────────────────┤
│                             │
│     5×5 Bingo Grid         │  ← Main interactive area
│     (centered)             │
│                             │
├─────────────────────────────┤
│   Reset Button             │
│   Footer Message           │
└─────────────────────────────┘
```

---

## Component Library

### Bingo Grid Tiles
- **Shape:** Rounded squares (border-radius: 8-12px)
- **Size:** Consistent across all tiles, responsive scaling
- **States:**
  - Default: Clean, flat appearance with subtle border
  - Hover: Gentle lift effect (transform: translateY(-2px))
  - Selected: Distinct filled state with checkmark or icon overlay
  - Transition: Smooth 0.2s ease for all state changes
- **Typography:** Centered text, word-wrap enabled, 2-3 lines max
- **Interactive Feedback:** Cursor pointer, subtle scale on click (0.95)

### Pop-up Modal
- **Overlay:** Semi-transparent backdrop covering entire viewport
- **Modal Card:** 
  - Centered, max-width 500px on desktop
  - Full-width with margin on mobile
  - Rounded corners (16px)
  - Generous padding (p-6 to p-8)
  - Subtle shadow for elevation
- **Content Structure:**
  - Keyword heading at top (bold)
  - Description text (comfortable reading width)
  - Close button (X icon, top-right, 44px touch target)
  - Emoji integration for visual interest
- **Animation:** Fade-in with gentle scale (0.95 to 1)

### Victory Banner
- **Position:** Fixed or sticky at top of grid
- **Animation:** Slide down + fade in, confetti-like emoji animations
- **Content:** Message + celebration emoji, prominent display
- **Styling:** Stand-out treatment, larger padding, centered text

### Reset Button
- **Size:** Large touch target (min 48px height)
- **Position:** Below grid, centered
- **Style:** Rounded pill shape (border-radius: 24px)
- **Icon:** Include refresh/reset icon alongside text
- **Interaction:** Bouncy click animation, clear active state

### Header Section
- **Title:** Bold, extra-large, centered
- **Spacing:** Generous top/bottom padding (p-8)
- **Icon/Emoji:** Earth emoji (🌍) or plant (🌱) integrated into title

### Footer Section
- **Message:** Centered, friendly tone
- **Emoji:** Plant emoji (🌱) as decorative element
- **Spacing:** Comfortable padding, not cramped

---

## Interaction Patterns

**Tile Click Flow:**
1. Tile scales slightly on click (0.95)
2. State changes to selected with smooth transition
3. Modal fades in immediately after tile state change
4. Bingo check runs in background
5. Victory banner appears if line completed

**Modal Interactions:**
- Click outside modal: Close modal
- Click X button: Close modal
- Escape key: Close modal
- Modal prevents background scrolling when open

**Reset Flow:**
- Confirmation prompt: "새로운 빙고를 시작하시겠어요?"
- Tiles shuffle with staggered animation
- All selections clear
- Victory banner hides if present

---

## Responsive Behavior

**Mobile (< 640px):**
- Bingo grid: 280-320px width, tiles ~56px each
- Pop-up: Full-width minus 16px margins
- Typography: Scale down headers by 15%
- Spacing: Reduce padding to p-4

**Tablet (640px - 1024px):**
- Bingo grid: 400-450px width, tiles ~80px each
- Pop-up: max-width 480px
- Standard typography sizes

**Desktop (> 1024px):**
- Bingo grid: 500px width maximum, tiles ~90px each
- Pop-up: max-width 500px
- Full typography hierarchy

---

## Animation Guidelines

**Use Sparingly:**
- Tile state changes: 200ms ease
- Modal open/close: 250ms ease-out
- Victory banner: 400ms with bounce easing
- Reset shuffle: Staggered 100ms delays per tile

**No Animations:**
- Continuous looping effects
- Distracting background movements
- Excessive particle effects

---

## Accessibility

**Keyboard Navigation:**
- Tab through all bingo tiles in reading order
- Enter/Space to select tile
- Tab to Reset button
- Escape to close modal

**Touch Targets:**
- Minimum 44×44px for all interactive elements
- Clear visual spacing between tiles (gap-2)
- Modal close button: 44×44px minimum

**Visual Clarity:**
- High contrast between tile states
- Clear selected/unselected differentiation
- Readable text at all sizes (minimum 16px body)
- Focus indicators on all interactive elements

---

## Content Structure

**Keywords Array (JS):** 25 climate-related Korean terms stored in shuffleable array

**Descriptions:** Object mapping each keyword to educational content (2-3 sentences, emoji support)

**Editable Format:** 
```
const keywords = ['탄소중립', '재활용', ...];
const descriptions = {
  '탄소중립': '설명 텍스트 🌍',
  ...
};
```

---

## Images

**No hero image required** - This is a game interface focused on the interactive bingo grid as the primary visual element.

**Emoji Usage:** Liberal use of thematic emoji (🌍🌱♻️🌞💧) throughout UI to enhance visual appeal without image assets.