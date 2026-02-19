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

Native modules like `sharp` ship pre-built binaries for each OS/architecture. Since Stream Deck plugins must bundle binaries for all supported platforms, the install scripts in [package.json](package.json) fetch binaries for both macOS (arm64) and Windows (x64):

```json
"install-sharp": "npm run sharp-mac && npm run sharp-win",
"sharp-mac": "npm install --cpu=arm64 --os=darwin sharp",
"sharp-win": "npm install --cpu=x64 --os=win32 sharp"
```

Run `npm run install-sharp` after `npm install` to download binaries for all target platforms.

### Rollup Config (`rollup.config.mjs`)

The key changes in the Rollup configuration to support native modules:

1. **Mark native modules as external** — `sharp` is listed in the `external` array so Rollup does not attempt to bundle its native binaries into the output. The plugin's runtime `require`/`import` of `sharp` resolves against the copied `node_modules` at runtime instead.

    ```js
    external: ['sharp'],
    ```

2. **Copy native dependencies into the plugin bundle** — The `rollup-plugin-copy` plugin copies the `sharp` package and its platform-specific bindings (`@img/`) from the project's `node_modules` into the plugin's `bin/node_modules` directory. This ensures the native `.node` files are available at runtime.

    ```js
    copy({
      copyOnce: true,
      errorOnExist: false,
      overwrite: false,
      targets: [
        { src: 'node_modules/@img/',   dest: 'com.elgato.image-resizer.sdPlugin/bin/node_modules' },
        { src: 'node_modules/sharp/',  dest: 'com.elgato.image-resizer.sdPlugin/bin/node_modules' },
      ],
    }),
    ```

3. **Ignore dynamic requires** — The `@rollup/plugin-commonjs` option `ignoreDynamicRequires: true` prevents Rollup from failing on `require()` calls that sharp's internals use to dynamically load the correct platform binary.

    ```js
    commonjs({ ignoreDynamicRequires: true }),
    ```

> [!WARNING]
> Note that these are the changes required for `sharp`, however, other native modules may require more or less configuration changes.
