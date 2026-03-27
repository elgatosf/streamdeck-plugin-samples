import {
	action,
	KeyDownEvent,
	KeyUpEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";

/**
 * Persistent settings used by {@link IncrementCounter}.
 */
type CounterSettings = {
	/** Current counter value shown on the key. */
	count?: number;
	/** Amount to increment the counter by on each press. */
	incrementBy?: number;
};

/**
 * Stream Deck action that increments a counter on tap and resets it on long press.
 */
@action({ UUID: "com.elgato.counter.action" })
export class IncrementCounter extends SingletonAction<CounterSettings> {
	/** Timer used to detect a long press reset. */
	private resetTimer?: NodeJS.Timeout;

	/** Tracks whether the current press already triggered a reset. */
	private didReset = false;

	/**
	 * Updates the key title when the action appears.
	 */
	override onWillAppear(
		ev: WillAppearEvent<CounterSettings>,
	): void | Promise<void> {
		return ev.action.setTitle(`${ev.payload.settings.count ?? 0}`);
	}

	/**
	 * Starts a long-press timer. If the key is held for 1.5 seconds,
	 * the counter is reset to `0`.
	 */
	override async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		this.didReset = false;

		this.resetTimer = setTimeout(() => {
			this.didReset = true;
			void ev.action.setTitle("0");
			void ev.action.setSettings({ ...ev.payload.settings, count: 0 });
		}, 1500);
	}

	/**
	 * Increments the counter if the key was released before a reset occurred.
	 */
	override async onKeyUp(ev: KeyUpEvent<CounterSettings>): Promise<void> {
		clearTimeout(this.resetTimer);

		if (this.didReset) {
			this.didReset = false;
			return;
		}

		const settings = { ...ev.payload.settings };
		settings.incrementBy ??= 1;
		settings.count = (settings.count ?? 0) + settings.incrementBy;

		await ev.action.setSettings(settings);
		await ev.action.setTitle(`${settings.count}`);
	}
}
