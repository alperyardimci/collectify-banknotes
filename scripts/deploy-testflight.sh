#!/bin/bash
set -e

echo "=== Collectify Banknotes - TestFlight Deploy ==="
echo ""

# Step 1: Type check
echo "[1/5] Running type check..."
npx tsc --noEmit
echo "  ✓ Type check passed"

# Step 2: Expo doctor
echo "[2/5] Running expo doctor..."
npx expo-doctor 2>&1 | tail -1
echo "  ✓ Health check passed"

# Step 3: Build iOS
echo "[3/5] Building iOS production..."
BUILD_OUTPUT=$(eas build --platform ios --profile production --non-interactive 2>&1)
echo "$BUILD_OUTPUT"

# Extract build ID
BUILD_ID=$(echo "$BUILD_OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | tail -1)

if [ -z "$BUILD_ID" ]; then
  echo "  ✗ Build failed or could not extract build ID"
  exit 1
fi
echo "  ✓ Build completed: $BUILD_ID"

# Step 4: Submit to TestFlight
echo "[4/5] Submitting to TestFlight..."
eas submit --platform ios --id "$BUILD_ID" --non-interactive 2>&1
echo "  ✓ Submitted to TestFlight"

# Step 5: Done
echo "[5/5] Done!"
echo ""
echo "=== Deploy Complete ==="
echo "Check App Store Connect for the new build."
echo "TestFlight review usually takes a few minutes."
