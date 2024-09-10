import streamDeck from "@elgato/streamdeck";
import { setTimeout } from "timers/promises";

export type LightState = 0 | 1;
export const LIGHT_OFF: LightState = 1;
export const LIGHT_ON: LightState = 0;

export type GridItem = {
	id: string;
	state: LightState;
};

/**
 * A boundless grid meant to hold our actions, which provides some convenient tools to manipulate the playing field
 */
export class Grid {
	static devices: Map<string, Grid>;
	// Fetches a playing field associated with a specific Stream Deck device ID. Creates a new one if necessary.
	static getDeviceGrid(deviceId: string) {
		if (!this.devices) {
			this.devices = new Map();
		}

		let grid = this.devices.get(deviceId);
		if (!grid) {
			grid = new Grid();
			this.devices.set(deviceId, grid);
		}
		return grid;
	}

	items: Map<string, GridItem>;

	constructor() {
		this.items = new Map();
	}

	// Accessor functions that combine a column and row into a single composite key
	set(column: number, row: number, value: GridItem): void {
		this.items.set(this.compositeKey(column, row), value);
	}
	get(column: number, row: number): GridItem | undefined {
		return this.items.get(this.compositeKey(column, row));
	}
	delete(column: number, row: number): void {
		this.items.delete(this.compositeKey(column, row));
	}
	// Methods to join and split a row and column into a single key for use in our map
	compositeKey(column: number, row: number): string {
		if (column < 0 || row < 0) {
			return "";
		}
		return `${column}/${row}`;
	}
	decompositeKey(key: string): { column: number; row: number } {
		const split = key.split("/");
		const column = parseInt(split[0]);
		const row = parseInt(split[1]);
		return { column, row };
	}

	// Toggles a light switch and returns the change in the number of lights that are on
	toggleLight(column: number, row: number, updateAction?: boolean): number {
		let changedLights = 0;

		// Locate all the lights we need to flip
		const toFlip = [
			this.get(column, row),
			this.get(column - 1, row),
			this.get(column + 1, row),
			this.get(column, row - 1),
			this.get(column, row + 1),
		];

		for (const item of toFlip) {
			if (!item) {
				continue;
			}
			if (item.state == LIGHT_ON) {
				item.state = LIGHT_OFF;
				changedLights--;
			} else {
				item.state = LIGHT_ON;
				changedLights++;
			}
			// If requested, update the Stream Deck key as well
			if (updateAction) {
				const action = streamDeck.actions.createController(item.id);
				action.setState(item.state);
			}
		}

		return changedLights;
	}

	// Sets all tracked actions to the specified state
	setAll(state: LightState) {
		this.items.forEach((item) => {
			const action = streamDeck.actions.createController(item.id);
			action.setState(state);
			item.state = state;
		});
	}

	// Flashes all actions on and off a certain number of times, and then resets the playing field
	async flashAll(count: number): Promise<void> {
		const offset = 100;
		while (count-- > 0) {
			await setTimeout(offset);
			this.setAll(LIGHT_OFF);

			await setTimeout(offset);
			this.setAll(LIGHT_ON);
		}
		await setTimeout(offset * 2);
	}

	// Flashes a single action on and off
	async flashSingle(item: GridItem): Promise<void> {
		const action = streamDeck.actions.createController(item.id);
		action.setState(LIGHT_ON);
		await setTimeout(50);
		action.setState(LIGHT_OFF);
	}

	// Checks the game state to see if the player has won, and if they have, play the win sequence
	tryWin() {
		let won = true;
		this.items.forEach((item) => {
			if (item.state == LIGHT_ON) {
				won = false;
			}
		});
		if (won) {
			this.displayWin();
		}
	}

	// Play the win sequence
	async displayWin() {
		// Grab all of the coordinates of actions and randomize them
		let keys: string[] = [];
		this.items.forEach((item, key) => {
			keys.push(key);
		});
		keys.sort((a, b) => Math.random() - 0.5);

		// Flash every key in the playing field
		for (const key of keys) {
			const item = this.items.get(key);
			if (!item) {
				continue;
			}
			await this.flashSingle(item);
		}

		// Flash and reset the playing field
		await this.flashAll(3);
		this.randomize();
	}

	// Randomize the board through simulated play
	async randomize() {
		// Get all action coordinates
		let keys: string[] = [];
		this.items.forEach((item, key) => {
			keys.push(key);
		});

		// Tracking variables for light coverage
		const totalLights = keys.length;
		let visibleLights = 0;

		// Turn all lights off. Starting from the off state ensures the generated board is actually winnable.
		this.items.forEach((item) => (item.state = LIGHT_OFF));

		// "Play" the game randomly for some number of iterations, while ensuring that at least 1/3 of the lights are on at the end
		const iterations = Math.max(10, Math.random() * 50);

		for (let i = 0; i < iterations || visibleLights / totalLights < 0.33; ++i) {
			// Ensure we do not loop forever
			if (i > 1000) {
				break;
			}

			// Pick random coordinate
			const coord = keys[Math.floor(Math.random() * keys.length)];
			const { column, row } = this.decompositeKey(coord);

			// Toggle the randomly selected light
			visibleLights += this.toggleLight(column, row);
		}

		// Update all of the action states
		for (const pair of this.items) {
			const item = pair[1];
			const action = streamDeck.actions.createController(item.id);
			action.setState(item.state);
			// Wait for each light to "turn off" as if someone is walking through and turning them off one by one
			if (item.state == LIGHT_OFF) {
				await setTimeout(100);
			}
		}
	}
}
