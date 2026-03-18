When the user asks to deploy to TestFlight, App Store, or build for Android:

## Pre-Deploy Checklist
1. `npx tsc --noEmit` — catch type errors
2. `npx expo install --check` — verify all deps are SDK-compatible
3. Check version in app.json — **MUST be higher than current App Store version**
4. `rm -rf /Users/alper/Desktop/CollectifyBanknotes-export` — clean old export

## TestFlight / iOS Deploy (Local Xcode - Fast, ~3 min)

DO NOT use EAS Build for iOS — free tier queue is too slow (30+ min). Use local Xcode build.

```bash
cd /Users/alper/Desktop/collectify-banknotes

# 1. Bump version in app.json (REQUIRED — same version = rejection)

# 2. Generate native iOS project
npx expo prebuild --platform ios --clean

# 3. Archive
xcodebuild -workspace ios/CollectifyBanknotes.xcworkspace \
  -scheme CollectifyBanknotes \
  -configuration Release \
  -archivePath /Users/alper/Desktop/CollectifyBanknotes.xcarchive \
  -destination "generic/platform=iOS" \
  archive \
  CODE_SIGN_STYLE="Automatic" \
  DEVELOPMENT_TEAM="9XUU5C4KK4" \
  -allowProvisioningUpdates \
  -authenticationKeyPath /Users/alper/Downloads/AuthKey_QQ24RND5T3.p8 \
  -authenticationKeyID QQ24RND5T3 \
  -authenticationKeyIssuerID da9d548c-1640-4ea2-a0a1-85fdb1ffce1e

# 4. Export + Upload to TestFlight
rm -rf /Users/alper/Desktop/CollectifyBanknotes-export
xcodebuild -exportArchive \
  -archivePath /Users/alper/Desktop/CollectifyBanknotes.xcarchive \
  -exportOptionsPlist /Users/alper/Desktop/ExportOptions.plist \
  -exportPath /Users/alper/Desktop/CollectifyBanknotes-export \
  -allowProvisioningUpdates \
  -authenticationKeyPath /Users/alper/Downloads/AuthKey_QQ24RND5T3.p8 \
  -authenticationKeyID QQ24RND5T3 \
  -authenticationKeyIssuerID da9d548c-1640-4ea2-a0a1-85fdb1ffce1e
```

Run archive as background task, check output for ARCHIVE SUCCEEDED/FAILED.
Run export as background task, check output for EXPORT SUCCEEDED/FAILED.

ExportOptions.plist: /Users/alper/Desktop/ExportOptions.plist
Contents: method=app-store-connect, destination=upload, signingStyle=automatic, teamID=9XUU5C4KK4

## Android APK Build (EAS Cloud)
```bash
eas build --platform android --profile preview --non-interactive
```

## Credentials
- ASC API Key: /Users/alper/Downloads/AuthKey_QQ24RND5T3.p8
- Key ID: QQ24RND5T3
- Issuer ID: da9d548c-1640-4ea2-a0a1-85fdb1ffce1e
- Team ID: 9XUU5C4KK4
- Bundle ID: com.alperyardimci.collectifybanknotes

## Lessons Learned (DO NOT repeat these mistakes)

### iOS Build
- **Never use EAS Build for iOS** — free tier queue 30+ min, local Xcode is ~3 min
- **Always use `-allowProvisioningUpdates`** — without it, provisioning fails
- **Always use `-authenticationKeyPath/ID/IssuerID`** on BOTH archive AND export steps
- **Never use `CODE_SIGN_IDENTITY="Apple Distribution"`** — conflicts with automatic signing. Use `CODE_SIGN_STYLE="Automatic"`
- **Always bump app.json version** before uploading — "train version closed" = version already exists
- **Xcode must have Apple account** (Settings → Accounts) and both Development + Distribution certificates
- **Do NOT use Xcode Organizer GUI** — CLI is fully autonomous
- **Do NOT install expo-image-manipulator** — Swift API incompatible with SDK 54, causes ARCHIVE FAILED

### Android Build
- **.npmrc with `legacy-peer-deps=true`** is REQUIRED — EAS cloud strict npm install fails without it
- **android.package** must be set in app.json for non-interactive builds
- **EAS init** must be run before first build (`eas init`)

### General
- **eas.json is gitignored** — contains API keys in env sections
- **Always run `npx expo install --check`** after adding packages — wrong versions cause build failures
- **When `npx expo install` fails with ERESOLVE**, use `npm install <pkg>@<version> --legacy-peer-deps`
- **grep output for "error:" after xcodebuild** — exit code 0 doesn't always mean success (tail -5 may miss errors)
- **Check ARCHIVE SUCCEEDED/FAILED and EXPORT SUCCEEDED/FAILED** explicitly in output
