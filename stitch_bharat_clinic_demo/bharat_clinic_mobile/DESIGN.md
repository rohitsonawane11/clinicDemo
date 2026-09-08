---
name: Bharat Clinic Mobile
colors:
  surface: '#f9f9ff'
  surface-dim: '#cadbfc'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dfe8ff'
  surface-container-highest: '#d6e3ff'
  on-surface: '#091c35'
  on-surface-variant: '#434654'
  inverse-surface: '#20314b'
  inverse-on-surface: '#ecf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#5b5f61'
  on-secondary: '#ffffff'
  secondary-container: '#dde0e2'
  on-secondary-container: '#5f6365'
  tertiary: '#004e32'
  on-tertiary: '#ffffff'
  tertiary-container: '#006844'
  on-tertiary-container: '#72e9af'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#181c1e'
  on-secondary-fixed-variant: '#434749'
  tertiary-fixed: '#82f9be'
  tertiary-fixed-dim: '#65dca4'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005235'
  background: '#f9f9ff'
  on-background: '#091c35'
  surface-variant: '#d6e3ff'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  touch-target: 48px
---

## Brand & Style
The design system for Bharat Clinic is built on a philosophy of "Essentialism." It targets patients and practitioners who require immediate clarity and zero cognitive load. The aesthetic is **Corporate / Modern** with a strong emphasis on **Minimalism**, mirroring the utility and speed of global messaging platforms.

The UI should evoke feelings of reliability, hygiene, and efficiency. By stripping away non-essential ornamentation, the focus remains entirely on healthcare data and actionable tasks (appointments, prescriptions, records).

## Colors
This design system utilizes a high-trust palette designed for high-glare environments and quick scanning.

- **Primary (#0052CC):** A deep, trustworthy medical blue used for primary actions, active states, and branding.
- **Secondary (#F4F7F9):** A soft, cool-tinted gray used for large background areas to reduce eye strain compared to pure white.
- **Success (#36B37E):** Reserved exclusively for 'Completed' statuses, verified badges, and successful payment confirmations.
- **Neutral (#42526E):** Used for body text and secondary labels to maintain hierarchy without the harshness of pure black.
- **Background (#FFFFFF):** Used for cards and input fields to create a clear "layer" above the secondary background.

## Typography
The system uses **Inter** for its exceptional legibility on small screens and neutral, professional tone. 

- **Scale:** Font sizes are kept strictly within a 11px to 24px range to ensure content density remains high without sacrificing readability.
- **Hierarchy:** Use `headline-lg` for screen titles and `headline-md` for card titles. 
- **Readability:** Body text should maintain a 150% line-height to ensure medical instructions are easy to parse.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for mobile-first interaction.

- **Margins:** 16px (md) standard side margins for all mobile screens.
- **Gutter:** 12px (sm) spacing between related elements within a card.
- **Vertical Rhythm:** Elements are spaced in multiples of 4px. Use 24px (lg) to separate major sections.
- **Touch Targets:** All interactive elements (buttons, toggles, list items) must maintain a minimum height of 48px to ensure accessibility for elderly users or those in high-stress situations.

## Elevation & Depth
This design system avoids heavy shadows to maintain a "lightweight" feel. Instead, it uses **Tonal Layers** and **Low-contrast Outlines**.

- **Surface Tiers:** The main app background is `#F4F7F9`. Interactive cards and containers are pure `#FFFFFF`.
- **Borders:** Use 1px solid borders in a light gray (`#E1E4E8`) for card definitions instead of shadows.
- **Active State:** When an element is pressed, it should subtly shift to a slightly darker background color or a 2px primary border rather than "lifting" with a shadow.

## Shapes
A **Rounded** (Level 2) shape language is used to make the clinical environment feel approachable and safe.

- **Cards/Containers:** Use 0.5rem (8px) for standard containers.
- **Buttons:** Use 1rem (16px) or fully rounded "pill" shapes for primary call-to-actions to distinguish them from informational cards.
- **Inputs:** Use 0.5rem (8px) to maintain consistency with cards.

## Components
- **Buttons:** Primary buttons use a solid `#0052CC` fill with white text. Secondary buttons use a transparent background with a 1px primary border. No gradients.
- **Chips/Badges:** Small, rounded-pill containers used for statuses like "Confirmed" (Green tint) or "Pending" (Gray tint). Use `label-sm` for text.
- **Lists:** High-density vertical lists with 16px padding and a 1px separator line. Each item should have a chevron icon if it leads to a new screen.
- **Input Fields:** Labeled with `label-md` floating above the field. Use a 1px border that turns 2px Primary on focus.
- **Cards:** White backgrounds, 8px corner radius, and subtle 1px border. Used to group appointment details or patient vitals.
- **Doctor/Patient Avatars:** Always circular to contrast with the rectangular card shapes.
- **Action Sheets:** For mobile, use bottom-anchored sheets instead of centered modals for easier thumb reach.