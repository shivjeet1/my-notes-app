# My Notes App

A simple notes app built because I wanted something that:
- opens fast
- stays offline
- doesn’t try to be a productivity religion

It’s minimal, local-first, and does one job well: take notes and get out of the way.

Built with:
- Vite for the frontend
- Tauri for desktop (macOS, Linux, Windows)
- Capacitor for Android

No Electron bloat. No cloud lock-in.

---

## Highlights

- Fast startup (native backend)
- Offline by default
- Clean, distraction-free UI
- Small binaries
- Easy to modify without fighting the stack

Basically: notes, not a lifestyle choice.

---

## Prebuilt Downloads

If you don’t want to build anything (recommended):

Go to the [GitHub Releases](https://github.com/shivjeet1/my-notes-app/releases) page and download the file for your OS.

### Desktop/PC
- Linux: AppImage, deb, rpm
- Windows: exe, msi
- macOS: dmg
- Android: apk

---

## Build from Source

### Common Requirements

- Node.js 20
- npm
- git

Verify:
```bash
node -v
npm -v
```

---

## macOS

### Requirements
- macOS 12+
- Xcode Command Line Tools

Install tools:
```bash
xcode-select --install
```

### Build
```bash
git clone https://github.com/shivjeet1/my-notes-app.git
cd my-notes-app

npm ci
npm run build
npx tauri build
```

### Output is generated in :
```
src-tauri/target/release/bundle/dmg/*.dmg
```

---

## Linux

### Requirements (example: Ubuntu, Arch & Other Linux Distributions)
```bash
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  build-essential
```

### Build
```bash
git clone https://github.com/shivjeet1/my-notes-app.git
cd my-notes-app

npm ci
npm run build
npx tauri build
```

- If you want to, you can install it locally/systemwide
```bash
sudo make install
```

- Run in terminal to experience 'my-notes' :
```bash
my-notes
```

### Output is generated in :
```
src-tauri/target/release/bundle/
```

---

## Windows

### Requirements
- Windows 10 or 11
- Visual Studio Build Tools
  - Desktop development with C++
- WebView2 Runtime

### Build (PowerShell)
```powershell
git clone https://github.com/shivjeet1/my-notes-app.git
cd my-notes-app

npm ci
npm run build
npx tauri build
```

### Output is generated in :
```
src-tauri/target/release/
```

---

## Android

Android uses Capacitor. It does not use Tauri.

### Requirements
- Java 21
- Android SDK (API 34)
- Android Studio recommended

### Build
```bash
git clone https://github.com/shivjeet1/my-notes-app.git
cd my-notes-app

npm ci
npm run build
npx cap sync android

cd android
./gradlew assembleDebug
```

#### #NoSignBuild
### Output is generated in :
```
android/app/build/outputs/apk/debug/app-debug.apk
```

You can sideload this APK on a device or just install it manually.

---

## Development

### Desktop/PC
```bash
npm run dev
npx tauri dev
```

### Android
```bash
npm run dev
npx cap open android
```

---

## Notes

- This app is intentionally made boring
- Features are added only when they justify themselves
- If something breaks, check the workflows first

---

## License

MIT. Do whatever you want.
