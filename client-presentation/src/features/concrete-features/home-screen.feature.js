import { Feature, specificationType } from '../feature';

const exampleUsage =
`// manifest.json
{
    "icons": {
        "48": "icon.png",
        "96": "icon@2x.png"
      },

      "manifest_version": 2,

      "name": "...",

      "start_url": "/",
      "background_color": "white",
      "display": "standalone",
      "orientation": "portrait"
      "version": "0.1"
}

// for safari
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="assets/launcher/icon-1x.png">
<link rel="apple-touch-icon" sizes="192x192" href="assets/launcher/icon-4x.png">
`;

export default new Feature('home-screen',
    exampleUsage,
    () => ({}),
    { test: () => window.BeforeInstallPromptEvent, specification: specificationType.STANDARD }
);
