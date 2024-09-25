import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { setTimeout } from "timers/promises";

import { GamePiece, LIGHT_OFF, LIGHT_ON } from "./gamePiece";

/**
 * Resets the current state of the game to a fresh, randomized board
 */
@action({ UUID: "com.elgato.lightsout.reset" })
export class Reset extends SingletonAction {
	gamePiece: GamePiece;

	constructor(gamePieceController: GamePiece) {
		super();
		this.gamePiece = gamePieceController;
	}

	/**
	 * Resets the game
	 */
	async onKeyDown(ev: KeyDownEvent): Promise<void> {
		this.gamePiece.setAll(ev.deviceId, LIGHT_OFF);
		await setTimeout(500);
		this.gamePiece.setAll(ev.deviceId, LIGHT_ON);
		await setTimeout(200);
		this.gamePiece.randomize(ev.deviceId);
	}
}