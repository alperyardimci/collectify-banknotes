After making any code changes, always rebuild and run the app on the iOS simulator by killing the existing Expo process and starting a new one:

```
lsof -ti:8081 | xargs kill -9 2>/dev/null; sleep 1 && npx expo start --ios
```

Run this as a background task so the user can see the result immediately.
