import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { GamePiece } from "./actions/gamePiece";
import { Reset } from "./actions/reset";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded.
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the game actions.
streamDeck.actions.registerAction(new GamePiece());
streamDeck.actions.registerAction(new Reset());

// Finally, connect to the Stream Deck.
streamDeck.connect();
