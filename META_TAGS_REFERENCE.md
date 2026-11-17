# Mobile Meta Tags for ChainFree

The following meta tags should be included in the HTML entry point for optimal mobile experience:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#8B5CF6">
<meta name="apple-mobile-web-app-title" content="ChainFree">
```

## Explanation:
- `viewport`: Sets proper mobile scaling and prevents zooming
- `mobile-web-app-capable`: Enables full-screen mode on Android
- `apple-mobile-web-app-capable`: Enables full-screen mode on iOS
- `apple-mobile-web-app-status-bar-style`: Controls iOS status bar appearance
- `theme-color`: Sets the browser UI color (purple for ChainFree)
- `apple-mobile-web-app-title`: Sets the app name on iOS home screen

## Additional PWA Features (optional):
```html
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/icon-192x192.png">
```
