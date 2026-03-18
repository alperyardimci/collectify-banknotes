## After Code Changes
After making any code changes:
1. Run `npx tsc --noEmit` to verify no TypeScript errors
2. Rebuild on iOS simulator:
```
lsof -ti:8081 | xargs kill -9 2>/dev/null; sleep 1 && npx expo start --ios
```
Run this as a background task so the user can see the result immediately.

## Dependency Management
- Always use `--legacy-peer-deps` when installing npm packages (configured in .npmrc)
- After adding new packages, run `npx expo install --check` to verify SDK compatibility
- If versions are wrong, use `npx expo install <package>` to get the correct version
- Run `npx expo-doctor` before builds to catch missing peer deps
- **DO NOT install expo-image-manipulator** — it has Swift API incompatibility with Expo SDK 54. For image compression, use ImagePicker quality parameter instead (e.g., quality: 0.4)
- When `npx expo install` fails with ERESOLVE, use `npm install <package>@<version> --legacy-peer-deps`

## Async/Await Gotchas
- `file.base64()` from expo-file-system/next returns a **Promise** — always use `await`
- `file.text()` from expo-file-system/next returns a **Promise** — always use `await`
- Forgetting `await` causes silent failures: Promise object gets passed as string, API calls fail with cryptic errors

## Gemini API
- Free tier: 15 requests/minute, 1500 requests/day
- 429 errors happen when images are too large (token limit per minute, not just request count)
- Always compress images before sending: use ImagePicker with quality: 0.4
- Use `gemini-2.0-flash-lite` model (higher rate limits than `gemini-2.0-flash`)
- Add retry logic with increasing delays for 429 errors
- Set `maxOutputTokens: 256` to reduce token usage

## Git & Security
- NEVER commit .env or eas.json — they contain API keys
- .env has Gemini and Firebase keys
- eas.json has Firebase keys and ASC API key path
- Always verify `git check-ignore .env eas.json` before pushing
- Use `gh auth setup-git` before `git push` if auth fails
- NEVER accept user passwords in chat — warn them about security

## Emoji Rendering
- iOS simulator does NOT support flag emojis or globe emojis — they show as question marks
- This is an Apple simulator limitation, NOT a code bug
- Real devices (both iOS and Android) render all emojis correctly
- The app uses Twemoji (EmojiImage component) to render emojis as images from CDN — works everywhere
- Do NOT replace emojis with Ionicons or text badges — keep emoji approach with EmojiImage
- Do NOT try to fix simulator emoji rendering (font copy, symlink, etc.) — it doesn't work

## i18n
- Default language is Turkish (unless device language is English)
- Custom countries use direct names (not i18n keys) — use `t(key, { defaultValue: key })` pattern
- All new features must add both EN and TR translations

## "Other" Continent (Custom Countries)
- "Other" continent has empty `countryCodes` array — custom countries are dynamic
- ContinentCard, getContinentProgress, statistics all need special handling for "other"
- Use `getCustomCountries()` to get the list, not `continent.countryCodes`
- Achievements should skip "other" continent (empty array causes false `hasAll`)
- Statistics `getContinentDistribution` must map unknown country codes to "other"
