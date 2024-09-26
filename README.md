
<div align="center">

[![Stream Deck SDK banner](https://images.ctfassets.net/8j9xr8kwdre8/1ihLKCwNWEfPixs27dq0c0/130be66a5173f332e4caa892a3462893/banner.png)](https://docs.elgato.com/sdk)

# Stream Deck SDK Plugin Samples

[![SDK documentation](https://img.shields.io/badge/Documentation-2ea043?labelColor=grey&logo=gitbook&logoColor=white)](https://docs.elgato.com/sdk)
[![Elgato homepage](https://img.shields.io/badge/Elgato-3431cf?labelColor=grey&logo=data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+RWxnYXRvPC90aXRsZT48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJtMTMuODgxOCA4LjM5NjQuMDI2MS4wMTk2IDkuOTQ5NCA1LjcxNzJjLS40ODg0IDIuNzI5LTEuOTE5NiA1LjIyMjMtNC4wMzg0IDcuMDI1M0ExMS45MjYyIDExLjkyNjIgMCAwIDEgMTIuMDk3IDI0Yy0zLjE5MjUgMC02LjE5MzktMS4yNDc3LTguNDUyNy0zLjUxNDRDMS4zODY4IDE4LjIxODguMTQyNyAxNS4yMDQ0LjE0MjcgMTJjMC0zLjIwNDIgMS4yNDQtNi4yMTg3IDMuNTAxNS04LjQ4NTRDNS45MDE5IDEuMjQ4IDguOTAzMiAwIDEyLjA5NyAwYzIuNDM5NCAwIDQuNzg0Ny43MzMzIDYuNzgzIDIuMTE4NyAxLjk1MjYgMS4zNTQgMy40NDY2IDMuMjM1NyA0LjMyMjcgNS40NDIyLjExMTIuMjgyOS4yMTQ5LjU3MzYuMzA1MS44NjU3bC0yLjEyNTUgMS4yMzU5YTkuNDkyNCA5LjQ5MjQgMCAwIDAtLjI2MTktLjg2OTRjLTEuMzU0LTMuODMwMy00Ljk4MTMtNi40MDQ4LTkuMDIzNy02LjQwNDhDNi44MTcxIDIuMzg4MyAyLjUyMiA2LjcwMDUgMi41MjIgMTJjMCA1LjI5OTUgNC4yOTUgOS42MTE1IDkuNTc0OCA5LjYxMTUgMi4wNTIgMCA0LjAwODQtLjY0NDIgNS42NTk2LTEuODY0NyAxLjYxNzItMS4xOTU1IDIuODAzNi0yLjgzMzcgMy40MzA5LTQuNzM2NGwuMDA2NS0uMDQxOUw5LjU5MDYgOC4zMDQ4djcuMjI1Nmw0LjAwMDQtMi4zMTM4IDIuMDYgMS4xODExLTUuOTk2MiAzLjQ2ODgtMi4xMi0xLjIxMjZWNy4xOTQzbDIuMTE3NC0xLjIyNDUgNC4yMzA5IDIuNDI3OS0uMDAxMy0uMDAxMyIvPjwvc3ZnPg==)](https://elgato.com)
[![Join the Marketplace Makers Discord](https://img.shields.io/badge/Marketplace%20Makers-5662f6?labelColor=grey&logo=discord&logoColor=white)](https://discord.gg/GehBUcu627)

</div>

In this repository, you can find a number of complete plugins for the Stream Deck app, each of which use the official [Stream Deck SDK](https://github.com/elgatosf/streamdeck). Within each sample, you can expect to find:
* A readme, explaining which parts of the SDK the plugin is focused on.
* An image/gif of the plugin in-app, possibly with a demonstration of its use.
* A prepared .streamDeckPlugin file which can be installed without building the sample.
* TypeScript project files that can be used to modify and build the sample as you see fit.

## Prerequisites

To build any of these plugins, you will need to ensure you have [Node.js](https://nodejs.org/en/) (version 20+) and [npm](https://nodejs.org/en/) installed on your system. To run them, all provided samples require Stream Deck 6.5 or higher, unless otherwise specified in the readme for a sample.

Installing the [Stream Deck CLI](https://github.com/elgatosf/cli) tool is strongly recommended. Once you have Node.js and npm installed, install it with:
```bash
npm install -g @elgato/cli
```

## Building and Running

All of the samples have pre-built binaries which can be installed into Stream Deck immediately. Just open the included .streamDeckPlugin file.

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

