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
@action({ UUID: 'com.elgato.catastrophe.random-cat' })
export class RandomCat extends SingletonAction<RandomCatSettings> {
	private visibleAutoActions = new Map<String, Action>();
	private timer: NodeJS.Timeout | null = null;

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

	onWillDisappear(ev: WillDisappearEvent<RandomCatSettings>): void {
		this.visibleAutoActions.delete(ev.action.id);

		// If there are no more visible actions with autoUpdate enabled, clear the timer.
		if (this.visibleAutoActions.size === 0) {
			clearInterval(this.timer!);
			this.timer = null;
		}
	}

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

	onKeyUp(ev: KeyUpEvent<RandomCatSettings>): void | Promise<void> {
		this.setRandomCat(ev.action);
	}

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
