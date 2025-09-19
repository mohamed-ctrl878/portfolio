# Mohamed Mahmoud - Portfolio

A modern, interactive portfolio website showcasing full-stack development skills and creative projects. Built with React, TypeScript, and advanced animations using GSAP.

## 🚀 Live Demo

[View Live Portfolio](https://your-portfolio-url.com) *(Update with your actual URL)*

## ✨ Features

- **Interactive Animations**: Smooth GSAP-powered animations and scroll triggers
- **Performance Optimized**: Built-in performance monitoring and device-adaptive optimizations
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern Tech Stack**: React 19, TypeScript, Vite for fast development
- **Error Boundaries**: Comprehensive error handling with fallback components
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Performance Testing**: Built-in performance profiler and test suite

## 🛠 Tech Stack

### Frontend
- **React 19** - Latest React with improved rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional-grade animations
- **Lucide React** - Modern icon library

### Development & Testing
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and quality
- **Playwright** - End-to-end testing
- **Vitest** - Unit testing framework
- **PostCSS** - CSS processing

### Performance & Monitoring
- **Custom Performance Monitor** - Real-time FPS tracking
- **Performance Profiler** - Comprehensive browser-based analysis
- **Device Capability Detection** - Adaptive performance settings
- **Memory Management** - Animation cleanup and optimization

## 📁 Project Structure

```
vite-project/
├── src/
│   ├── components/           # React components
│   │   ├── About.tsx        # About section
│   │   ├── CardProject.tsx  # Project cards
│   │   ├── ContactSection.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Hero.tsx         # Hero section
│   │   ├── LoadingScreen.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── NavBar.tsx       # Navigation
│   │   ├── ParticleBackground.tsx
│   │   ├── ProjectSection.tsx
│   │   ├── SimpleFallback.tsx
│   │   └── TechStack.tsx    # Skills showcase
│   ├── constants/           # Static data
│   │   ├── projects.ts      # Project information
│   │   └── skills.tsx       # Skills and technologies
│   ├── hooks/               # Custom React hooks
│   │   ├── useGSAP.tsx      # GSAP integration
│   │   ├── useProjectScrollable.tsx
│   │   └── useRegisterPlugin.tsx
│   ├── tests/               # Performance tests
│   │   └── performance.test.ts
│   ├── utils/               # Utility functions
│   │   ├── animations.ts    # Animation helpers
│   │   ├── gsapConfig.ts    # GSAP configuration
│   │   ├── performance.ts   # Performance monitoring
│   │   ├── performanceProfiler.ts
│   │   └── responsive.ts    # Responsive utilities
│   ├── App.tsx             # Main application
│   ├── main.tsx            # Entry point
│   ├── App.css             # Global styles
│   └── index.css           # Base styles
├── public/                 # Static assets
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.cjs    # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (pnpm recommended for faster installs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio/vite-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Personal Information

1. **Update personal details** in `src/constants/`:
   - `projects.ts` - Add your projects
   - `skills.tsx` - Update your tech stack

2. **Modify content** in components:
   - `src/components/Hero.tsx` - Update hero section
   - `src/components/About.tsx` - Personal information
   - `src/components/ContactSection.tsx` - Contact details

### Styling

- **Colors**: Modify `tailwind.config.cjs` for custom color scheme
- **Animations**: Adjust GSAP timelines in component files
- **Layout**: Update responsive breakpoints in `src/utils/responsive.ts`

### Performance Settings

The portfolio automatically adapts to device capabilities:

- **Low-end devices**: Reduced animations and particle count
- **Mobile devices**: Optimized for touch and smaller screens
- **Slow connections**: Simplified effects and faster loading

Override settings in `src/utils/performance.ts`.

## 📊 Performance Monitoring

### Built-in Tools

The portfolio includes comprehensive performance monitoring:

```javascript
// Access performance tools in browser console (development mode)
performanceProfiler.runFullAudit()     // Comprehensive analysis
performanceTest.runAutomatedTest()     // Performance testing
```

### Performance Features

- **Real-time FPS monitoring** during animations
- **Memory usage tracking** and cleanup
- **Device capability detection** for optimal settings
- **Animation performance profiling**
- **Scroll performance optimization**

### Performance Metrics

- **Target FPS**: 60fps on modern devices, 30fps on low-end
- **Memory Usage**: Monitored and cleaned up automatically
- **Animation Count**: Tracked and optimized
- **Load Time**: Optimized with code splitting and lazy loading

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests with Playwright
npm run test:e2e

# Performance tests (in browser console)
performanceTest.runAutomatedTest()
```

### Performance Testing

The portfolio includes automated performance testing:

- **FPS measurement** during scroll and animations
- **Memory leak detection** 
- **Paint timing analysis**
- **Layout shift monitoring**
- **Animation performance profiling**

## 🔧 Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deployment Options

**Static Hosting (Recommended)**:
- Vercel (zero-config)
- Netlify
- GitHub Pages
- Firebase Hosting

**Example Vercel deployment**:
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables

Create `.env.local` for any environment-specific variables:

```env
VITE_CONTACT_FORM_URL=your-contact-form-endpoint
VITE_ANALYTICS_ID=your-analytics-id
```

## ♿ Accessibility

The portfolio is built with accessibility in mind:

- **Semantic HTML** structure
- **ARIA labels** and descriptions
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** support
- **Reduced motion** preferences respected

## 📱 Browser Support

- **Modern browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Android Chrome 88+
- **Graceful degradation**: Fallbacks for older browsers

## 🔄 Updates & Maintenance

### Updating Dependencies

```bash
npm update
npm audit fix
```

### Adding New Projects

1. Add project data to `src/constants/projects.ts`
2. Include project images in `public/projects/`
3. Test animations and responsiveness

### Performance Optimization

- Monitor performance metrics regularly
- Update animation settings based on user feedback
- Optimize images and assets
- Review and update responsive breakpoints

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Portfolio**: [Your Portfolio URL]
- **GitHub**: [@your-username](https://github.com/your-username)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
- **Email**: your.email@example.com

---

## 🎯 Key Features Highlights

### Advanced Animations
- **GSAP-powered** smooth animations
- **Scroll-triggered** effects
- **Magnetic button** interactions
- **Particle backgrounds** with performance optimization

### Performance Excellence
- **60 FPS** target on modern devices
- **Adaptive performance** based on device capabilities
- **Memory management** for long-running animations
- **Real-time monitoring** and optimization

### Developer Experience
- **TypeScript** for type safety
- **Hot module replacement** for fast development
- **ESLint** for code quality
- **Comprehensive testing** suite

### User Experience
- **Loading screens** with smooth transitions
- **Error boundaries** for graceful error handling
- **Responsive design** for all device sizes
- **Accessibility** features throughout

Built with ❤️ by Mohamed Mahmoud
