#!/bin/bash
set -e

echo "=== Collectify Banknotes - Android APK Build ==="
echo ""

# Step 1: Type check
echo "[1/3] Running type check..."
npx tsc --noEmit
echo "  ✓ Type check passed"

# Step 2: Build Android APK
echo "[2/3] Building Android APK..."
eas build --platform android --profile preview --non-interactive 2>&1
echo "  ✓ Android APK build completed"

# Step 3: Done
echo "[3/3] Done!"
echo ""
echo "=== Build Complete ==="
echo "Download the APK from the link above."
