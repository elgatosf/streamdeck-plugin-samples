import { action, KeyDownEvent, SingletonAction, WillAppearEvent, WillDisappearEvent } from "@elgato/streamdeck";

import { Grid, LIGHT_OFF, LIGHT_ON } from "../grid";

/**
 * A play piece for the lights-out game
 */
@action({ UUID: "com.elgato.lightsout.gamepiece" })
export class GamePiece extends SingletonAction {
	constructor() {
		super();
	}

	// When a new game piece appears, we need to put it into the device's grid
	onWillAppear(ev: WillAppearEvent): void | Promise<void> {
		if (ev.payload.isInMultiAction) {
			return;
		}
		const { column, row } = ev.payload.coordinates;
		const grid = Grid.getDeviceGrid(ev.deviceId);
		grid.set(column, row, { id: ev.action.id, state: ev.payload.state ? LIGHT_OFF : LIGHT_ON });
	}

	// When a game piece disappears, we need to remove it from the device's grid
	onWillDisappear(ev: WillDisappearEvent): Promise<void> | void {
		if (ev.payload.isInMultiAction) {
			return;
		}
		const { column, row } = ev.payload.coordinates;
		const grid = Grid.getDeviceGrid(ev.deviceId);
		grid.delete(column, row);
	}

	// Performs a light switch toggle, which toggles the state of the 4 actions that border the pressed action in
	// each cardinal direction, as well as the action itself
	async onKeyDown(ev: KeyDownEvent): Promise<void> {
		if (ev.payload.isInMultiAction) {
			return;
		}
		const { column, row } = ev.payload.coordinates;
		const grid = Grid.getDeviceGrid(ev.deviceId);
		grid.toggleLight(column, row, true);
		grid.tryWin();
	}
}
