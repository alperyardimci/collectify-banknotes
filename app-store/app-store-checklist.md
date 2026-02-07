# App Store Connect Submission Checklist

## App Information
- **App Name:** Collectify Banknotes
- **Bundle ID:** com.alperyardimci.collectifybanknotes
- **SKU:** collectify-banknotes
- **Primary Language:** English (U.S.)
- **Category:** Lifestyle
- **Secondary Category:** Utilities
- **Content Rights:** Does not contain third-party content
- **Age Rating:** 4+

## Version Information (v1.0)
- **Version:** 1.0
- **Build:** 4
- **Copyright:** 2025 Alper Yardimci

## App Store Localizations
Fill in for both **English (U.S.)** and **Turkish**:
- See `metadata-en.md` and `metadata-tr.md`

## Screenshots Required
Upload for each device size (at least one set required):

### iPhone 6.9" (iPhone 16 Pro Max) — Required
1. Home screen (continent list with progress)
2. Continent screen (country list with sections)
3. Country screen (banknote grid with photos)
4. Banknote detail (photo + info)
5. Add banknote form

### iPhone 6.7" (iPhone 15 Plus) — Optional
Same 5 screenshots

### iPad 13" — Optional (if supporting tablet)
Same 5 screenshots

## App Review Information
- **Sign-in Required:** No (no user accounts)
- **Demo Account:** Not applicable
- **Notes for Review:** This is a fully offline banknote collection tracker. No internet connection is required. To test: launch the app, tap any continent, select a country, and add a banknote using the camera or photo library.

## Privacy
- **Privacy Policy URL:** Host `privacy-policy.md` and provide the URL
- **Data Collection:** Select "No, we do not collect data from this app"

### App Privacy Nutrition Labels
Select the following in App Store Connect:
- **Data Used to Track You:** None
- **Data Linked to You:** None
- **Data Not Linked to You:** None

## URLs Required
You need to host these pages and provide URLs to App Store Connect:
1. **Privacy Policy URL** — Host content from `privacy-policy.md`
2. **Support URL** — Host content from `support-page.md`

### Quick hosting options:
- GitHub Pages (free): Create a `/docs` folder in your repo
- A simple single-page website

## Permissions Declarations
In App Store Connect, explain why each permission is needed:

| Permission | Usage Description |
|-----------|-------------------|
| Camera | We need camera access to photograph your banknotes. |
| Photo Library | We need photo library access to select banknote photos. |

## Pricing
- **Price:** Free
- **In-App Purchases:** None

## Distribution
- **Countries:** All countries and regions
- **Pre-Order:** No
- **Automatic Release:** Release this version manually (recommended for first release)
