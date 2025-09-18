# Pricing Tiers Component

## Overview

The **PricingTiers** component is a fully interactive arcade cabinet-styled pricing section designed specifically for the AI Captains Academy homepage. It combines retro-gaming aesthetics with maritime themes to create an engaging, immersive pricing experience.

## Features

### 🎮 Arcade Cabinet Design
- **Authentic arcade styling** with rounded cabinet frames
- **Interactive coin slots** with glowing LED indicators
- **Functional controls** including joystick and colored action buttons
- **CRT screen effects** with scanlines, phosphor glow, and chromatic aberration
- **Speaker grilles and coin return doors** for complete arcade authenticity

### ⚓ Maritime Elements
- **Compass, anchor, and shield icons** representing navigation and transformation
- **Ocean drift animations** for floating maritime elements
- **Ship wheel rotations** and captain ascension effects
- **Naval rank progression** (Academy → Captain → Admiral)

### 🎵 Sound Integration
- **Hover sound effects** on all interactive elements
- **Click sounds** for buttons and coin slots
- **Special "select" sound** for coin slot interactions
- **Seamless integration** with existing sound system

### 💰 Pricing Tiers

#### 1. Academy Access - $150/yr
- **Target**: Individual builders ready to transform
- **Icon**: Users (community focus)
- **Maritime**: Compass (navigation)
- **Features**:
  - Complete curriculum access
  - Community access and peer support
  - Weekly community Q&A sessions
  - Micro-workshops library
  - Foundation skill building
  - Basic AI tools training

#### 2. Captain's Bundle - $597 (LIFETIME)
- **Target**: Builders serious about transformation
- **Icon**: Crown (leadership)
- **Maritime**: Anchor (stability)
- **Popular**: ⭐ Most Popular Badge
- **Features**:
  - Everything in Academy Access
  - **LIFETIME ACCESS** (not yearly)
  - 2x 1-on-1 breakthrough sessions
  - Normally $350 each session
  - Advanced AI implementation
  - Priority community support
  - Captain's exclusive content
  - Direct mentor access

#### 3. Admiral's Fleet - $8997
- **Target**: Complete transformation seekers
- **Icon**: Trophy (achievement)
- **Maritime**: Shield (protection/guarantee)
- **Features**:
  - Everything in Captain's Bundle
  - 6-month build-a-business incubator
  - Direct mentor access with Jordan Urbs
  - Personal coaching sessions
  - Business strategy development
  - Revenue optimization guidance
  - **GUARANTEE**: Business built or we finish it!
  - Admiral's inner circle access

### 🎨 Visual Effects

#### CRT Screen Effects
- **Fast moving scanlines** (2.5s cycle)
- **Static scanlines** with subtle flicker
- **Phosphor glow** with 6s pulse animation
- **Chromatic aberration** for authentic CRT feel
- **Screen curvature** and vignette effects

#### Interactive Elements
- **Coin slot glow** on click/activation
- **Button hover effects** with sound
- **Price LED blinking** animation
- **Popular badge pulsing** effect
- **CTA button shine** on hover

#### Maritime Animations
- **Ocean drift** (8s cycle) for floating elements
- **Compass pulse** (4s cycle) for navigation icons
- **Ship wheel rotation** (12s cycle) for transformation symbols
- **Captain ascension glow** for upgrade effects

### 📱 Responsive Design

#### Desktop (1024px+)
- **3-column grid** layout
- **Full arcade cabinet** experience
- **Enhanced hover effects** and animations
- **Complete interactive elements**

#### Tablet (768px - 1024px)
- **2-column grid** with centered layout
- **Maintained arcade styling**
- **Optimized touch interactions**
- **Responsive pricing displays**

#### Mobile (< 768px)
- **Single column** stacked layout
- **Scaled arcade cabinets** (350px max width)
- **Simplified controls** for touch
- **Optimized text sizing**

#### Small Mobile (< 480px)
- **Ultra-compact** design (300px max width)
- **Stacked coin slot controls**
- **Scaled interactive elements**
- **Optimized for thumb navigation**

### 🔧 Technical Implementation

#### Component Structure
```tsx
PricingTiers
├── Section Header (Choose Your Path)
├── Pricing Cards Grid
│   ├── Arcade Cabinet Frame
│   │   ├── Popular Badge (conditional)
│   │   ├── Arcade Header
│   │   │   ├── Coin Slot Area
│   │   │   └── Arcade Controls
│   │   ├── Arcade Screen (CRT)
│   │   │   ├── CRT Effects Overlay
│   │   │   └── Screen Content
│   │   │       ├── Tier Header
│   │   │       ├── Price Display
│   │   │       ├── Features List
│   │   │       └── CTA Button
│   │   └── Arcade Base
│   │       ├── Speaker Grille
│   │       └── Coin Return
└── Money-Back Guarantee Banner
```

#### CSS Classes
- `.arcade-cabinet-frame` - Main cabinet styling
- `.popular-tier` - Enhanced styling for popular option
- `.arcade-screen` - CRT monitor styling
- `.crt-*` - Various CRT effects
- `.maritime-*` - Navigation and ocean effects
- `.coin-slot` - Interactive coin slot styling
- `.tier-*` - Pricing tier specific styles

#### Animation Classes
- `.ocean-drift` - Maritime floating animation
- `.compass-navigation` - Compass pulse effect
- `.ship-wheel-rotation` - Continuous rotation
- `.captain-glow` - Ascension glow effect
- `.blink` - LED blinking effect
- `.newCoursePulse` - Popular badge animation

### 🎯 Integration Points

#### Sound System
```tsx
const { playSound } = useSound()
- playSound("hover") // On element hover
- playSound("click") // On button clicks
- playSound("select") // On coin slot interaction
```

#### External Links
- All CTA buttons link to: `https://skool.com/aicaptains`
- Opens in new tab with security attributes
- Consistent with existing site navigation

#### Styling Inheritance
- Uses existing **retro-text** font classes
- Integrates with **retro-button** styling
- Maintains **yellow/cyan/red** color scheme
- Follows **border-4 border-yellow-500** patterns

### 🚀 Usage

```tsx
import { PricingTiers } from "@/components/pricing-tiers"

// Basic usage
<PricingTiers />

// With custom className
<PricingTiers className="my-custom-class" />
```

### 🎮 User Experience

#### Visual Hierarchy
1. **Section header** draws attention with retro styling
2. **Popular badge** highlights recommended option
3. **Price displays** use LED-style animations
4. **Feature lists** with clear checkmarks
5. **CTA buttons** with prominent retro styling

#### Interactive Flow
1. **Hover effects** provide immediate feedback
2. **Coin slot interaction** adds gamification
3. **Sound feedback** enhances arcade feel
4. **Smooth animations** maintain immersion
5. **Clear pricing** removes decision friction

#### Conversion Optimization
- **Popular badge** guides users to recommended tier
- **Lifetime value** clearly highlighted for Captain tier
- **Guarantee messaging** reduces purchase anxiety
- **Feature comparison** shows clear value progression
- **Strong CTAs** with action-oriented language

### 🔒 Accessibility

- **Keyboard navigation** support
- **Screen reader** friendly structure
- **High contrast** text and backgrounds
- **Clear focus indicators**
- **Alternative text** for decorative elements

### 🎨 Customization

#### Color Variants
- Modify `arcadeStyle` gradients for different themes
- Update `border-color` for tier differentiation
- Customize `popular-badge` colors

#### Animation Timing
- Adjust maritime animation durations
- Modify CRT effect intensities
- Control sound trigger timing

#### Content Updates
- Update pricing in `pricingTiers` array
- Modify feature lists per tier
- Change CTA text and URLs

---

## Summary

The PricingTiers component successfully combines the site's retro-gaming aesthetic with maritime transformation themes, creating an engaging and memorable pricing experience. The arcade cabinet design with interactive elements and CRT effects provides a unique twist on traditional pricing tables, while maintaining clear information hierarchy and strong conversion optimization.

The component is fully responsive, integrates seamlessly with the existing sound system, and provides multiple interaction points to keep users engaged. The maritime elements reinforce the "passenger to captain" transformation narrative throughout the pricing journey.