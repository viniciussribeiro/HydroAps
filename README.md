# Hydro Pulse

Hydro Pulse is a mobile prototype for viewing rainfall information and community flood reports. The app is built with React Native and Expo, and includes an offline queue for reports.

## Project layout

- `mobile/` contains the Expo app.
- `mobile/docs/backend-contract.md` describes the proposed API contract.
- `mobile/docs/codigo.md` documents the app structure and behavior.

## Run the app

Requirements: Node.js LTS, pnpm, and Expo Go or Android Studio. On Windows, use EAS Build or a Mac for iOS builds.

```powershell
cd mobile
pnpm install
Copy-Item .env.example .env
pnpm start
```

The app uses simulated data by default. See `mobile/README.md` for platform commands and API configuration.
