import streamDeck, {
	Action,
	action,
	DidReceiveSettingsEvent,
	KeyUpEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from '@elgato/streamdeck';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

/**
 * An example action class that displays a random cat.
 */
@action({ UUID: 'com.elgato.cat-keys.random-cat' })
export class RandomCat extends SingletonAction<RandomCatSettings> {
	private visibleAutoActions = new Map<String, Action>();
	private timer: NodeJS.Timeout | null = null;

	/**
	 * Sets the initial action image, stores the action for auto-updating, and establishes a timer for auto-updating.
	 */
	onWillAppear(ev: WillAppearEvent<RandomCatSettings>): void {
		// Set a random cat image when the key appears.
		this.setRandomCat(ev.action);

		// If autoUpdate is enabled, set a random cat image every 15 minutes.
		if (ev.payload.settings.autoUpdate) {
			this.visibleAutoActions.set(ev.action.id, ev.action);

			if (this.timer === null) {
				this.timer = setInterval(() => {
					this.visibleAutoActions.forEach((action) => {
						this.setRandomCat(action);
					});
				}, FIFTEEN_MINUTES);
			}
		}
	}

	/**
	 * Removes the action from the auto-update list (as it is no longer visible) and clears the timer if no more actions are auto-updating.
	 */
	onWillDisappear(ev: WillDisappearEvent<RandomCatSettings>): void {
		this.visibleAutoActions.delete(ev.action.id);

		// If there are no more visible actions with autoUpdate enabled, clear the timer.
		if (this.visibleAutoActions.size === 0) {
			clearInterval(this.timer!);
			this.timer = null;
		}
	}

	/**
	 * Adds or removes the action from the auto-update list based on the settings provided by the property inspector.
	 */
	onDidReceiveSettings(ev: DidReceiveSettingsEvent<RandomCatSettings>): Promise<void> | void {
		if (ev.payload.settings.autoUpdate) {
			this.visibleAutoActions.set(ev.action.id, ev.action);

			if (this.timer === null) {
				this.timer = setInterval(() => {
					this.visibleAutoActions.forEach((action) => {
						this.setRandomCat(action);
					});
				}, FIFTEEN_MINUTES);
			}
		} else {
			this.visibleAutoActions.delete(ev.action.id);

			if (this.visibleAutoActions.size === 0) {
				clearInterval(this.timer!);
				this.timer = null;
			}
		}
	}

	/**
	 * Sets a new random cat image when the key is pressed.
	 */
	onKeyUp(ev: KeyUpEvent<RandomCatSettings>): void | Promise<void> {
		this.setRandomCat(ev.action);
	}

	/**
	 * Fetches a random cat image and sets it as the action's image.
	 * @param action The action in which to apply the new cat image.
	 */
	private async setRandomCat(action: Action) {
		try {
			const response = await fetch('https://cataas.com/cat?width=144&height=144');
			const buffer = await response.arrayBuffer();
			const data = Buffer.from(buffer).toString('base64');
			const image = `data:image/png;base64,${data}`;

			action.setImage(image);
		} catch (e) {
			streamDeck.logger.error('Failed to fetch random cat image:', e);
		}
	}
}

/**
 * Settings for {@link RandomCat}.
 */
type RandomCatSettings = {
	autoUpdate: boolean;
};
