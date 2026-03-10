# Image Resizer

A simple image resizer plugin to demonstrate utilizing native dependencies in a Stream Deck plugin. This sample uses [sharp](https://sharp.pixelplumbing.com/) for image processing, which relies on platform-specific native binaries.

<details>
<summary><strong>Quick Start</strong></summary>

1. Install dependencies (this also fetches platform-specific native binaries for `sharp`).

    ```sh
    pnpm install
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
2. **Plugin folder (`*.sdPlugin`)** — depends on `sharp` and uses pnpm configuration to install the platform-specific packages that must ship with the plugin.

The root [package.json](package.json) uses pnpm for the repo and runs a single postinstall step to install the plugin-bundled dependencies into the Stream Deck plugin folder:

```json
"packageManager": "pnpm@10.32.0",
"postinstall": "pnpm --dir com.elgato.image-resizer.sdPlugin install"
```

The plugin's own [com.elgato.image-resizer.sdPlugin/package.json](com.elgato.image-resizer.sdPlugin/package.json) only needs to declare `sharp`:

```json
"dependencies": {
    "sharp": "^0.34.5"
}
```

The platform matrix now lives in [com.elgato.image-resizer.sdPlugin/pnpm-workspace.yaml](com.elgato.image-resizer.sdPlugin/pnpm-workspace.yaml):

```yaml
nodeLinker: hoisted
packageImportMethod: copy

ignoredOptionalDependencies:
    - '@img/sharp-linux-*'
    - '@img/sharp-libvips-linux*'
    - '@img/sharp-wasm32'

supportedArchitectures:
    os:
        - win32
        - darwin
    cpu:
        - x64
        - arm64
```

With that config, pnpm installs the required `@img/sharp-*` packages automatically as Sharp optional dependencies. Contributors no longer need to know or manually list which runtime packages are required for macOS and Windows.

The `nodeLinker: hoisted` and `packageImportMethod: copy` settings keep the plugin folder's `node_modules` flat and non-symlinked, which is a better fit for packaging a self-contained `.sdPlugin` bundle.

The `ignoredOptionalDependencies` and pnpm override rules also prune unsupported Sharp optional packages from the plugin dependency graph, so Linux and wasm artifacts are not installed for this sample.

This means `pnpm install` at the repo root still sets up development dependencies, and the `postinstall` hook ensures the `.sdPlugin` folder also contains the native Sharp packages required at runtime.

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
