# Image Resizer

A simple image resizer plugin to demonstrate utilizing native dependencies in a Stream Deck plugin. This sample uses [sharp](https://sharp.pixelplumbing.com/) for image processing, which relies on platform-specific native binaries.

<details>
<summary><strong>Quick Start</strong></summary>

1. Install dependencies (this also fetches platform-specific native binaries for `sharp`).

    ```sh
    npm install
    ```

2. Build the plugin.

    ```sh
    npm run build
    ```

3. Link the plugin to Stream Deck.

    ```sh
    streamdeck link com.elgato.image-resizer.sdPlugin
    ```

</details>

## Configuration Changes for Native Modules

### Installing Platform-Specific Binaries

Native modules like `sharp` ship pre-built binaries for each OS/architecture. Since Stream Deck plugins must bundle binaries for all supported platforms, the install scripts in [package.json](package.json) fetch binaries for both macOS (arm64) and Windows (x64) in two locations:

1. **Project root** — so that tooling and IntelliSense can resolve the module during development.
2. **Plugin folder (`*.sdPlugin`)** — so the native `.node` files are included when the plugin folder is zipped and distributed.

```json
"install-sharp": "npm run sharp-mac && npm run sharp-win && npm run sdplugin-sharp-mac && npm run sdplugin-sharp-win",
"sharp-mac": "npm install --cpu=arm64 --os=darwin sharp --ignore-scripts",
"sharp-win": "npm install --cpu=x64 --os=win32 sharp --ignore-scripts",
"sdplugin-sharp-mac": "npm install --prefix com.elgato.image-resizer.sdPlugin --cpu=arm64 --os=darwin sharp --ignore-scripts",
"sdplugin-sharp-win": "npm install --prefix com.elgato.image-resizer.sdPlugin --cpu=x64 --os=win32 sharp --ignore-scripts"
```

The `install-sharp` script runs automatically via npm's `postinstall` hook after `npm install`.

### Rollup Config (`rollup.config.mjs`)

The key changes in the Rollup configuration to support native modules:

1. **Mark native modules as external** — `sharp` is listed in the `external` array so Rollup does not attempt to bundle its native binaries into the output. At runtime, Node's module resolution walks up from the output directory (`bin/`) and finds `sharp` in the `*.sdPlugin/node_modules` directory.

    ```js
    external: ['sharp'],
    ```

2. **Ignore dynamic requires** — The `@rollup/plugin-commonjs` option `ignoreDynamicRequires: true` prevents Rollup from failing on `require()` calls that sharp's internals use to dynamically load the correct platform binary.

    ```js
    commonjs({ ignoreDynamicRequires: true }),
    ```

> [!WARNING]
> Note that these are the changes required for `sharp`, however, other native modules may require more or less configuration changes.
