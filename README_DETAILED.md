# AuraScan AI - Product Intelligence Mobile App

A powerful, AI-driven mobile app for scanning and analyzing product packaging and ingredient labels. Built with React, TypeScript, and Gemini AI.

## 🌟 Features

### Core Functionality
- **Intelligent Product Scanning**: Real-time camera scanning with AI vision detection
- **Comprehensive Analysis**: 8-section detailed product breakdown including benefits, considerations, ingredients, quality insights, and smart verdicts
- **Personalized Experience**: Custom allergen tracking, dietary preferences, and personalized recommendations
- **Advanced Tools Hub**: Access to powerful features like batch scanning, comparison tools, and analytics

### User Experience
- **Beautiful UI**: Modern, minimal design with smooth animations and transitions
- **Theme Customization**: Dark/light modes with custom accent colors
- **Accessibility**: Font size adjustment, animation intensity controls, and reduced motion support
- **Responsive Design**: Optimized for mobile devices with touch-friendly interactions

### Authentication & Onboarding
- **Secure Login**: Email/password, social login (Google, Apple), and biometric options
- **Guided Onboarding**: 4-step onboarding process covering welcome, health profile, theme customization, and feature tour
- **Profile Persistence**: Secure local storage of user preferences

## 🏗️ Architecture

### Technology Stack
- **Framework**: React 19.2.4 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS with custom CSS tokens
- **AI Integration**: Google Gemini AI (gemini-3-pro-preview)
- **Icons**: Lucide React

### Project Structure
```
/gan
├── components/          # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Toggle.tsx
│   ├── ThemeWrapper.tsx
│   └── index.tsx
├── views/              # Screen components
│   ├── Analytics.tsx
│   ├── Comparison.tsx
│   ├── DeepDive.tsx
│   ├── History.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Onboarding.tsx
│   ├── Processing.tsx
│   ├── Results.tsx
│   ├── Scan.tsx
│   ├── Settings.tsx
│   └── ToolsHub.tsx
├── services/           # API and external services
│   └── geminiService.ts
├── styles/             # Global styles and design tokens
│   └── tokens.css
├── App.tsx            # Main application component
├── types.ts           # TypeScript type definitions
├── constants.tsx      # App constants and configuration
└── index.html         # HTML entry point
```

## 🎨 Design System

### CSS Design Tokens
Located in `/styles/tokens.css`, the design system includes:

#### Color Palette
- **Primary**: `#0066FF` (Electric Blue)
- **Secondary**: `#7C3AED` (Violet)
- **Accent Colors**: Cyan, Orange
- **Semantic Colors**: Success, Warning, Danger, Info

#### Spacing Scale (8px base)
- `--spacing-sm`: 4px
- `--spacing-base`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px
- `--spacing-xxl`: 48px

#### Typography
- **Font Family**: Inter, Segoe UI, System UI
- **Font Sizes**: 12px - 40px scale
- **Font Weights**: 400 (Regular) - 900 (Black)

#### Animation Timing
- **Durations**: Fast (200ms), Normal (300ms), Slow (600ms)
- **Easing Functions**:
  - `ease-out`: cubic-bezier(0.34, 1.56, 0.64, 1)
  - `ease-in-out`: cubic-bezier(0.42, 0, 0.58, 1)

### Component Library

#### Button
Variants: `primary | secondary | tertiary | danger | ghost`
```tsx
<Button variant="primary" size="md" icon={<Icon />}>
  Click Me
</Button>
```

#### Card
Variants: `default | elevated | glass | gradient`
```tsx
<Card variant="elevated" padding="lg" hover>
  {children}
</Card>
```

#### Badge
Variants: `success | warning | danger | info | neutral`
```tsx
<Badge variant="success" size="md" icon={<Icon />}>
  Label
</Badge>
```

#### Input
```tsx
<Input 
  label="Email" 
  icon={<MailIcon />} 
  iconPosition="left"
  error="Invalid email"
/>
```

#### Toggle
```tsx
<Toggle
  checked={value}
  onChange={setValue}
  label="Enable Feature"
  description="Description text"
/>
```

#### Modal
```tsx
<Modal isOpen={isOpen} onClose={close} title="Modal Title">
  {content}
</Modal>
```

## 📱 Screens

### 1. Login/Sign-Up Screen
- Clean, minimal entry with animated background
- Email/password and social login options
- Value proposition messaging
- Progressive disclosure of profile fields

### 2. Onboarding (4 Screens)
1. **Welcome**: App mission and key benefits
2. **Health Profile**: Allergen and dietary preference customization
3. **Theme Customization**: Accent color, mode, animation intensity, font size
4. **Feature Tour**: Highlights of core features and advanced tools

### 3. Home Screen
- Prominent scan button with animated rings
- Quick action grid (History, Favorites, Tools, Settings)
- Recent activity list
- Personalized greeting
- Expert mode indicator
- Slide-in menu for navigation

### 4. Scan/Camera Screen
- Live camera preview with scanning frame
- AI confidence indicator (real-time detection accuracy)
- Batch scan mode for multiple products
- Manual image upload option
- Corner bracket scanning frame with animated scan line

### 5. Processing Screen
- Neural network animation
- Stage-by-stage progress indicators
- Estimated time remaining
- Progress bar with shimmer effect
- Option to cancel

### 6. Results Screen (8 Sections)
1. **Product Snapshot**: Image, name, brand, barcode, certifications
2. **Benefits**: Key positives with icons and descriptions
3. **Considerations**: Concerns with severity indicators
4. **Ingredient Intelligence**: Condensed view with allergen highlights
5. **Quality Insights**: Sourcing, sustainability score
6. **Caution Indicators**: Warning signals with severity levels
7. **Smart Verdict**: AI recommendation with confidence score
8. **Product Score**: Animated numeric scores with breakdown

Action buttons: Save to Favorites, Compare, Export PDF, Deep Dive

### 7. Advanced Tools Hub
Grid/list of power-user features:
- Ingredient Deep Dive
- Comparison Tool
- Advanced Analytics
- Batch Analysis
- Product Tracking
- Allergen Scanner
- Sustainability Deep Dive
- Export & Reports

### 8. Ingredient Deep Dive
- Full ingredient list with detailed analysis
- Allergen warnings with user-specific flags
- Source information (natural vs synthetic)
- Safety profiles and regulatory status
- Search/filter functionality

### 9. Comparison Tool
- Side-by-side comparison of 2-4 products
- Color-coded differences matrix
- Visual comparison charts
- Export comparison reports
- Recommendation engine

### 10. History & Favorites
- Recently scanned products with timestamps
- Starred/favorited items with custom tags
- Search and filter capabilities
- Bulk actions
- Sync across devices

### 11. Advanced Analytics Dashboard
- Personal consumption trends
- Health insights and patterns
- Sustainability impact
- Spending analysis
- Ingredient watchlist
- Interactive charts with drill-down

### 12. Settings & Preferences
Comprehensive settings including:
- Health profile (allergens, dietary restrictions)
- Expert mode toggle
- Theme customization (colors, mode, animations, font size)
- Accessibility options
- Notifications preferences
- Data export (JSON/CSV)
- Privacy and sync settings
- Account management
- Language/regional settings

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/narendrareddys121-tech/gan.git
cd gan

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create a `.env.local` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎯 Key Features Implementation

### Animation System
- Staggered entrance animations for list items
- Fade-in-up for sections with delays
- Smooth transitions between screens
- Animated score counting
- Pulse and glow effects for emphasis
- Respects user's reduced motion preferences

### Theme System
- Dynamic theme switching (light/dark)
- Custom accent color selection
- Animation intensity control (minimal/moderate/full)
- Font size adjustment
- Persistence across sessions

### AI Integration
- Google Gemini AI for product analysis
- Structured output with type safety
- User-specific allergen detection
- Confidence scoring
- Error handling and retries

### State Management
- Local storage persistence
- React hooks for state
- Context-free architecture
- Type-safe state updates

## 📊 Performance

- **Build Size**: ~6KB CSS (gzipped: ~1.5KB)
- **Bundle**: Optimized with Vite
- **Animations**: Hardware-accelerated CSS transforms
- **Images**: Lazy loading and optimization
- **Code Splitting**: Dynamic imports for routes

## 🔐 Security

- Secure authentication flow
- Data encryption for sensitive information
- No direct API key exposure
- Input sanitization
- XSS prevention
- CORS handling

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- Reduced motion support
- High contrast mode
- Adjustable font sizes
- Focus indicators
- Semantic HTML

## 🎨 Design Philosophy

### Principles
1. **Calm Intelligence**: Advanced technology without overwhelming users
2. **Progressive Disclosure**: Show complexity only when needed
3. **Personalization**: Adapt to user preferences and needs
4. **Trustworthiness**: Clear, honest communication
5. **Accessibility First**: Inclusive design for all users

### Visual Language
- Soft gradients and subtle shadows
- Generous white space
- Clear hierarchy
- Smooth animations
- Warm, approachable colors for warnings
- Premium feel with minimal aesthetics

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Type checking
npm run type-check
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Developer**: AuraScan AI Team
- **AI Provider**: Google Gemini
- **Design System**: Custom-built

## 🙏 Acknowledgments

- Google Gemini AI for intelligent product analysis
- Lucide React for beautiful icons
- Tailwind CSS for utility-first styling
- React team for the amazing framework
- Open source community

## 📞 Support

For support, email support@aurascan.ai or visit our [Help Center](https://aurascan.ai/help).

## 🗺️ Roadmap

- [ ] Offline mode with local analysis
- [ ] Multi-language support
- [ ] Voice-activated scanning
- [ ] AR overlay for in-store scanning
- [ ] Social features (share scans with friends)
- [ ] Integration with health tracking apps
- [ ] Barcode database expansion
- [ ] Community ingredient reviews

---

Made with ❤️ by AuraScan AI Team
