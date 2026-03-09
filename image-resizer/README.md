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

Native modules like `sharp` ship pre-built binaries for each OS and architecture. This sample now keeps the setup split by responsibility:

1. **Project root** — depends on `sharp` so local development, TypeScript, and bundling can resolve the module normally for the current machine.
2. **Plugin folder (`*.sdPlugin`)** — declares `sharp` plus the platform packages that must ship with the plugin so the final `.sdPlugin` contains the native binaries for supported targets.

The root [package.json](package.json) now uses a single postinstall step to install the plugin-bundled dependencies into the Stream Deck plugin folder:

```json
"postinstall": "npm run sdplugin-sharp",
"sdplugin-sharp": "npm install --prefix com.elgato.image-resizer.sdPlugin --ignore-scripts --force sharp @img/sharp-win32-x64 @img/sharp-darwin-arm64"
```

The plugin's own [com.elgato.image-resizer.sdPlugin/package.json](com.elgato.image-resizer.sdPlugin/package.json) explicitly lists the runtime packages that need to be present inside the distributable plugin:

```json
"dependencies": {
    "@img/sharp-darwin-arm64": "^0.34.5",
    "@img/sharp-win32-x64": "^0.34.5",
    "sharp": "^0.34.5"
}
```

This means `npm install` at the repo root still sets up development dependencies, and the `postinstall` hook ensures the `.sdPlugin` folder also contains the native Sharp packages required at runtime.

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
