<p align="center">
  <img src="assets/icon.png" width="120" height="120" alt="Collectify Banknotes Logo" style="border-radius: 24px;" />
</p>

<h1 align="center">Collectify Banknotes</h1>

<p align="center">
  <strong>The ultimate companion for paper currency collectors</strong><br/>
  Organize, track, and showcase your banknote collection across 195 countries and 6 continents.
</p>

<p align="center">
  <a href="https://apps.apple.com/tr/app/collectify-banknotes/id6758889763">
    <img src="https://img.shields.io/badge/App_Store-Download-blue?style=for-the-badge&logo=apple" alt="App Store" />
  </a>
  <img src="https://img.shields.io/badge/version-1.2.1-gold?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey?style=for-the-badge" alt="Platform" />
  <img src="https://img.shields.io/badge/license-Private-red?style=for-the-badge" alt="License" />
</p>

---

## About

Collectify Banknotes is a mobile app built for banknote collectors to catalog, organize, and track their paper currency collection. With support for 195 countries across 6 continents, AI-powered banknote identification, and cloud backup, it's the most comprehensive banknote collection tool available.

## Features

### Core Collection Management
- **195 Countries, 6 Continents** - Browse countries organized by continent with progress tracking
- **Banknote Cataloging** - Record denomination, currency, year range, circulation status, and personal notes
- **Front & Back Photos** - Photograph both sides of each banknote with camera or gallery
- **Custom Countries** - Add historical or unlisted countries (e.g., Yugoslavia, Soviet Union) under "Other" continent
- **Quick Add** - Searchable country list with one-tap navigation to add banknotes
- **Edit & Delete** - Full CRUD operations with confirmation dialogs
- **Unsaved Changes Protection** - Confirmation dialog when leaving forms with unsaved data

### Guided Banknote Identification
- **4-Step Wizard** - Photo → Script/Alphabet → Country → Denomination
- **11 Script Categories** - Latin, Turkish, Greek, Arabic, Cyrillic, CJK, South Asian, Southeast Asian, Ethiopic, Hebrew, Historical
- **Visual Descriptions** - Each country has visual descriptions to identify banknotes without knowing the figures ("bald man with round glasses" instead of "Gandhi")
- **Figure & Feature Search** - Search within countries by what you see: "pyramid", "lion", "bridge", "green", "polymer"
- **60+ Countries + 16 Historical** - Comprehensive coverage including Soviet Union, Yugoslavia, Ottoman Empire, pre-Euro currencies
- **Polymer Note Category** - Dedicated category for plastic/transparent banknotes
- **Completely Offline** - No API calls, no internet required, instant results
- **Auto-Fill Forms** - Selected country and denomination automatically populate the add form

### Achievement & Badge System
- **12 Unlockable Achievements** - Milestones for collection progress:
  - First Step (1st banknote), Collector (10), Enthusiast (25), Expert (50), Master Collector (100)
  - Traveler (5 countries), Globe Trotter (10), World Traveler (25), World Explorer (50)
  - Continental (all 6 continents), Completionist (complete a continent)
  - Photographer (10 back photos)
- **Animated Unlock Screen** - Custom animation with confetti when achievements are unlocked
- **Achievements Gallery** - Dedicated screen showing all achievements with unlock status

### Celebration Effects
- **Confetti Animations** - Particle-based confetti overlay using React Native Reanimated
- **Milestone Celebrations** - Triggered on new country, continent completion, and banknote count milestones (10, 25, 50, 100)
- **Achievement Unlock Modals** - Spring-animated reveal with celebration effects

### Statistics Dashboard
- **Collection Summary** - Total banknotes, unique countries, collection age in days
- **Continent Distribution** - Horizontal bar chart showing banknotes per continent
- **Top Denominations** - Most common denominations across your collection
- **Recent Activity** - Timeline of recently added banknotes with relative timestamps
- **Achievements Overview** - Quick grid view of all achievement statuses

### Search & Filter
- **Full-Text Search** - Search across country names, denominations, currencies, and notes
- **Continent Filters** - Horizontal chip filters for each continent
- **Photo Filter** - Filter banknotes that have back photos
- **Result Count** - Real-time result count display

### Photo Zoom Viewer
- **Pinch-to-Zoom** - Scale from 1x to 5x magnification
- **Double-Tap Zoom** - Toggle between 1x and 2.5x zoom
- **Pan Gestures** - Drag to pan when zoomed in
- **Front/Back Toggle** - Segmented control to switch between photo sides
- **Full-Screen Modal** - Immersive black background viewer

### Collection Export
- **CSV Export** - Spreadsheet format for Excel/Google Sheets
- **PDF Export** - Beautifully formatted dark-themed PDF with collection summary
- **Native Share Sheet** - Share via AirDrop, email, Messages, etc.

### File-Based Transfer
- **Export to JSON** - Complete collection export including all photos as base64
- **Import from JSON** - Restore from backup file on any device
- **No Account Required** - Works without cloud signup
- **Share Anywhere** - Send via AirDrop, email, cloud storage, messaging apps

### Collection Comparison
- **Load & Compare** - Import another collector's export file to compare collections
- **Side-by-Side Stats** - Total banknotes and countries comparison
- **Continent Breakdown** - Per-continent comparison table with winner highlighting
- **Common Countries** - Countries both collectors have
- **Exclusive Countries** - Countries only you or only they have (color-coded)
- **Unique Banknotes** - Specific banknotes you're missing or they're missing
- **Repeat Comparisons** - Compare with multiple collectors

### Internationalization
- **Bilingual** - Full English and Turkish language support
- **195 Country Names** - Translated in both languages
- **All UI Elements** - Every label, button, message, and error fully localized
- **Language Preference** - Persisted to device storage
- **Default Turkish** - App defaults to Turkish unless device language is English

### Design & UX
- **Dark Theme** - Premium dark navy (#14161E) with gold (#D4A843) accent colors
- **Haptic Feedback** - Tactile response on all interactive elements
- **Twemoji Rendering** - Cross-platform emoji images that work on all devices and simulators
- **Smooth Animations** - React Native Reanimated powered transitions
- **Safe Area Support** - Proper insets for all device types including notched phones
- **Portrait Orientation** - Optimized for one-handed use

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native 0.81 + Expo SDK 54 |
| **Language** | TypeScript 5.9 |
| **Navigation** | Expo Router (file-based routing) |
| **Styling** | NativeWind (Tailwind CSS) |
| **State Management** | Zustand |
| **Database** | expo-sqlite (SQLite) |
| **Identification** | Local guided wizard with visual pattern database |
| **Animations** | React Native Reanimated 4.1 |
| **Gestures** | React Native Gesture Handler 2.28 |
| **i18n** | i18next + react-i18next |
| **Images** | expo-image |
| **PDF Generation** | expo-print |
| **File Sharing** | expo-sharing |

## Project Structure

```
collectify-banknotes/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with DB init
│   ├── index.tsx                # Home (continents grid)
│   ├── continent/[id].tsx       # Country list by continent
│   ├── country/[id].tsx         # Banknote grid for a country
│   ├── country/banknote/
│   │   ├── add.tsx              # Add banknote form
│   │   ├── [id].tsx             # Banknote detail view
│   │   └── edit.tsx             # Edit banknote form
│   ├── achievements.tsx         # Achievements gallery
│   ├── statistics.tsx           # Statistics dashboard
│   ├── search.tsx               # Search & filter
│   ├── photo-viewer.tsx         # Full-screen photo zoom
│   ├── identify.tsx             # AI banknote identification
│   ├── quick-add.tsx            # Quick add with country search
│   ├── account.tsx              # Account, backup, export, compare
│   └── compare.tsx              # Collection comparison
├── src/
│   ├── components/              # 18 reusable UI components
│   ├── constants/               # Theme, continents, countries, achievements, scripts
│   ├── db/                      # SQLite schema & queries
│   ├── store/                   # Zustand state management
│   ├── i18n/                    # Localization (EN/TR)
│   └── utils/                   # Photos, search, statistics, export, backup, compare
├── assets/                      # App icons
└── .env                         # API keys (gitignored)
```

## Database Schema

### banknotes
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| country_code | TEXT | ISO 3166-1 alpha-2 code |
| denomination | TEXT | Face value |
| currency | TEXT | Currency code (e.g., USD, TRY) |
| front_photo | TEXT | URI to front photo file |
| back_photo | TEXT | URI to back photo file (nullable) |
| year_start | INTEGER | Issue start year |
| year_end | INTEGER | Issue end year (nullable) |
| is_current | INTEGER | Still in circulation (0/1) |
| notes | TEXT | Personal notes (nullable) |
| created_at | TEXT | ISO datetime |
| updated_at | TEXT | ISO datetime |

### achievements
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Achievement identifier |
| unlocked_at | TEXT | Unlock timestamp (nullable) |

### custom_countries
| Column | Type | Description |
|--------|------|-------------|
| code | TEXT | Unique country code |
| name | TEXT | Country display name |
| flag | TEXT | Flag emoji |
| currency | TEXT | Currency code |
| continent_id | TEXT | Always "other" |

## Privacy

- **Zero data collection** - No analytics, no tracking, no ads
- **All data on-device** - SQLite database stored locally
- **Optional cloud backup** - Only when user explicitly chooses to backup
- **No third-party sharing** - Your collection data is yours

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Xcode) or Android device/emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/alperyardimci/collectify-banknotes.git
cd collectify-banknotes

# Install dependencies
npm install

# Create .env file with your API keys
cat > .env << EOF
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EOF

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android
npx expo start --android
```

### Building

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build Android APK
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile production
```

## Author

**Alper Emin Yardimci**
- GitHub: [@alperyardimci](https://github.com/alperyardimci)
- App Store: [Collectify Banknotes](https://apps.apple.com/tr/app/collectify-banknotes/id6758889763)
