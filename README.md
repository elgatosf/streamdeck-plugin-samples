
<div align="center">

[![Stream Deck SDK banner](https://images.ctfassets.net/8j9xr8kwdre8/1ihLKCwNWEfPixs27dq0c0/130be66a5173f332e4caa892a3462893/banner.png)](https://docs.elgato.com/sdk)

# Stream Deck SDK Plugin Samples

</div>

In this repository, you can find a number of complete plugins for the Stream Deck software, each of which use the official [Stream Deck SDK for Node.js.](https://github.com/elgatosf/streamdeck) Within each sample, you can expect to find:
* A readme, explaining which parts of the SDK the plugin is focused on;
* An image/gif of the plugin in-software, possibly with a demonstration of its use;
* A prepared .streamDeckPlugin file which can be installed without building the sample;
* Typescript project files that can be used to modify and build the sample as you see fit.

## Prerequisites

To build any of these plugins, you will need to ensure you have [Node.js](https://nodejs.org/en/) (version 20+) and [npm](https://nodejs.org/en/) installed on your system. To run them, all provided samples require Stream Deck 6.4 or higher, unless otherwise specified in the readme for a sample.

Installing the [Stream Deck CLI](https://github.com/elgatosf/cli) tool is strongly recommended. Once you have Node.js and npm installed, install it with:
```bash
npm install -g @elgato/cli
```

## Building and Running

Any of the samples have pre-built binaries which can be installed into Stream Deck immediately. Just open the included .streamDeckPlugin file.

If you would like to build a sample yourself, you can do so with the following steps
```bash
# Install dependencies
npm i
# Install the sample in Stream Deck (*.sdPlugin should be
# replaced with the name of the folder ending in .sdPlugin)
streamdeck link *.sdPlugin
# Build the sample and watch for changes
npm run watch
```
For more information on building plugins, please consult our [documentation](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started)

## Samples

All samples are provided under the permissive [MIT license](LICENSE)

| Sample | Focus |
| --- | --- |
|[Cat Keys](cat-keys)|`setImage`, `onDidReceiveSettings`, payload settings, visible actions |
|[Layouts](layouts)|`setFeedback`, `setFeedbackLayout`, encoders, layouts |
|[Hello World](hello-world)|`i18n` / internationalization, `onDidReceiveSettings`|
|[Lights Out](lights-out)|`coordinates`, profiles, visible actions|

