# Audience Cards Component

A 3D flip card component for the AI Captains homepage that displays target audiences with maritime-themed interactions and retro-gaming styling.

## Features

- **3D Flip Animation**: Click cards to reveal call-to-action on the back
- **Maritime Theme**: Compass, anchor, ship icons with ocean drift animations
- **Retro-Gaming Style**: CRT effects, scanlines, yellow borders, cyan text
- **Sound Integration**: Hover, click, and CTA sounds using the existing sound system
- **Responsive Design**: 1 column (mobile), 2 columns (tablet), 3 columns (desktop), 5 columns (large screens)
- **Interactive Elements**: Floating maritime icons, transformation energy effects
- **Accessibility**: Proper focus states and keyboard navigation

## Target Audiences

1. **WordPress Builders** - Compass icon, purple gradient
2. **Webflow Designers** - Ship icon, indigo gradient  
3. **Content Creators** - Anchor icon, pink gradient
4. **No-Code Builders** - Lightning bolt icon, green gradient
5. **Digital Entrepreneurs** - Trending up icon, orange gradient

## Usage

```tsx
import { AudienceCards } from "@/components/audience-cards"

// Basic usage
<AudienceCards />

// With custom className
<AudienceCards className="my-8" />
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |

## Component Structure

```
AudienceCards
├── Section Header ("CHOOSE YOUR CREW")
├── Maritime Background Elements
├── Audience Cards Grid (responsive)
│   ├── Card Front (audience info)
│   └── Card Back (CTA)
└── Bottom CTA Section
```

## Styling Classes Added to globals.css

- `.perspective-1000` - 3D perspective for flip effect
- `.preserve-3d` - 3D transform preservation
- `.backface-hidden` - Hide card backs during flip
- `.rotate-y-180` - 180-degree Y-axis rotation
- `.bg-gradient-radial` - Radial gradient backgrounds
- `.retro-glow` - Enhanced text glow effects
- `.audience-cards-grid` - Responsive grid layout

## Sound Effects

- **Hover**: `playSound("hover")` - When hovering over cards
- **Click**: `playSound("click")` - When clicking to flip cards  
- **CTA**: `playSound("select")` - When clicking call-to-action buttons

## Animation Classes Used

- `ship-wheel-rotation` - Spinning compass in header
- `ocean-drift` - Floating wave motion for icons
- `captain-glow` - Pulsing glow effect for maritime emblems
- `compass-navigation` - Compass pulse animation
- `anchor-chain` - Anchor swaying motion
- `transformation-energy` - Energy burst on card flip
- `maritime-waves` - Animated gradient background

## CRT Effects

Each card includes authentic CRT monitor effects:
- Fast moving scanlines
- Phosphor glow
- Vignette darkening
- Screen curvature
- Chromatic aberration

## Responsive Breakpoints

- **Mobile** (< 768px): 1 column, reduced perspective
- **Tablet** (768px - 1024px): 2 columns
- **Desktop** (1024px - 1536px): 3 columns
- **Large** (>= 1536px): 5 columns (shows all cards in one row)

## Integration Notes

- Component integrates with existing `useSound` hook
- Scrolls to `#power-up-section` when CTA buttons are clicked
- Uses existing color scheme (yellow borders, cyan text, gray backgrounds)
- Follows retro-gaming design patterns from the homepage
- Compatible with existing CRT effects and scanlines

## Customization

To modify audiences or add new cards:

1. Update the `audienceCards` array in the component
2. Add new maritime icons from `lucide-react`
3. Choose appropriate gradient colors
4. Ensure unique IDs for flip state management

## Performance

- Uses CSS transforms for hardware acceleration
- Implements `will-change` for optimized animations
- Backface visibility hidden for smooth flips
- Responsive animations with reduced complexity on mobile