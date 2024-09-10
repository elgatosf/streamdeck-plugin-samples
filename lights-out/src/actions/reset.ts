import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

import { Grid } from "../grid";

/**
 * Resets the current state of the game to a fresh, randomized board
 */
@action({ UUID: "com.elgato.lightsout.reset" })
export class Reset extends SingletonAction {
	constructor() {
		super();
	}

	// Reset the game
	async onKeyDown(ev: KeyDownEvent): Promise<void> {
		const grid = Grid.getDeviceGrid(ev.deviceId);
		grid.randomize();
	}
}
