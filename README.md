# Smart Neighborhood Help Network

> *"Trusted help, right in your neighborhood."*

A modern, premium 3D animated web platform for **Smart Neighborhood Help Network**—a verified hyperlocal community network that connects neighbors with trusted, background-checked local professionals (electricians, plumbers, cleaners, tutors, caregivers, carpenters, AC technicians, appliance specialists).

---

## ✨ Features & Architecture

- 🏙️ **Interactive 3D Smart Neighborhood Hero Scene**: Procedural isometric neighborhood with modern houses, solar panels, street lighting, glowing road traffic paths, and clickable neighborhood pro hotspots (Three.js / React Three Fiber / Drei).
- 📱 **Interactive 3D Smartphone Mockup**: Floating 3D phone model displaying the live mobile application interface with live GPS responder dispatch preview.
- 🚨 **Emergency SOS Fast Dispatch**: High-priority emergency help interface with a 3D pulsing beacon and real-time dispatch simulator (under 30-minute arrival).
- 🔍 **Hyperlocal Service Finder & Filter**: Interactive filter across 8 core services with live search, neighborhood radius filter (2, 5, 10 miles), and direct pro booking.
- 💼 **Interactive Pro Earnings Calculator**: Slide weekly hours and select trade to compute estimated monthly earnings with a 0% commission introductory guarantee.
- 🛡️ **Built Around Trust (4 Pillars)**: Multi-stage ID & background vetting, hyperlocal matching, masked phone privacy, escrow payments, and verified neighbor reviews.
- 📊 **Animated Statistics & Activity Ticker**: Real-time counter animations (`10K+` Pros, `25K+` Jobs, `4.9/5` Rating, `24/7` Support) and a live neighborhood activity feed.
- ❓ **Animated FAQ Accordion**: Categorized accordion items for safety, bookings, cancellations, and pro onboarding.
- 📲 **App Download Modal**: Interactive QR code camera scanner, direct APK download, and SMS link sender.
- 🎨 **Design System**: Deep navy (`#040812`, `#0B1325`), electric blue (`#3B82F6`), vibrant cyan (`#06B6D4`), verified emerald (`#10B981`), glassmorphic panels, and glowing borders.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS (with custom glassmorphism and glow utilities)
- **UI Motion**: Framer Motion
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn / pnpm

### Installation

```bash
# Clone or navigate to the project directory
cd "e:/MEGA PROJECT/WEBSITE"

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run locally at `http://localhost:3000`.

### Production Build

```bash
# Compile TypeScript and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── NeighborhoodScene.tsx
│   │   │   ├── NeighborhoodCanvas.tsx
│   │   │   ├── Smartphone3D.tsx
│   │   │   └── EmergencyBeacon3D.tsx
│   │   ├── common/
│   │   │   ├── AnimatedCounter.tsx
│   │   │   └── ServiceIcon.tsx
│   │   ├── modals/
│   │   │   ├── FindServiceModal.tsx
│   │   │   ├── EmergencySOSModal.tsx
│   │   │   ├── JoinProModal.tsx
│   │   │   ├── AppDownloadModal.tsx
│   │   │   └── BookServiceModal.tsx
│   │   └── sections/
│   │       ├── Navbar.tsx
│   │       ├── HeroSection.tsx
│   │       ├── StatisticsSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── HowItWorksSection.tsx
│   │       ├── WhyTrustUsSection.tsx
│   │       ├── EmergencySection.tsx
│   │       ├── ForProfessionalsSection.tsx
│   │       ├── AppPromotionSection.tsx
│   │       ├── AboutUsSection.tsx
│   │       ├── ContactSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── FinalCTASection.tsx
│   │       └── Footer.tsx
```

---

© 2026 Smart Neighborhood Help Network. All rights reserved.
