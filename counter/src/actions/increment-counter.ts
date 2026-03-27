import { action, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

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
	/** Tracks per-action press state to avoid cross-key races. */
	private pressState = new Map<string, AbortController>();

	/**
	 * Updates the key title when the action appears.
	 */
	override async onWillAppear(ev: WillAppearEvent<CounterSettings>): Promise<void> {
		await ev.action.setTitle(`${ev.payload.settings.count ?? 0}`);
	}

	/**
	 * Increments the counter on tap, and starts a timer to reset it on long press. If the key is released before the timer completes,
	 * the timer is cancelled and the counter is not reset.
	 */
	override async onKeyDown(ev: KeyDownEvent<CounterSettings>): Promise<void> {
		const settings = { ...ev.payload.settings };
		// default incrementBy to 1 if it's not set
		settings.incrementBy ??= 1;
		// default the count to 0 and increment
		settings.count = (settings.count ?? 0) + settings.incrementBy;

		// Update the settings and title to reflect the new count.
		await ev.action.setSettings(settings);
		await ev.action.setTitle(`${settings.count}`);

		// Start the timeout.
		const timeoutId = setTimeout(() => {
			this.pressState.delete(ev.action.id);
			ev.action.setTitle("0");
			ev.action.setSettings({ ...ev.payload.settings, count: 0 });
		}, 1500);

		// Create the abort controller that cancels the timeout and cleans up
		const controller = new AbortController();
		controller.signal.addEventListener(
			"abort",
			() => {
				this.pressState.delete(ev.action.id);
				clearTimeout(timeoutId);
			},
			{ once: true },
		);

		// Set the press state for the action
		this.pressState.set(ev.action.id, controller);
	}

	/**
	 * Aborts the long-press timer. If the timer has already completed, this does nothing.
	 */
	override async onKeyUp(ev: KeyUpEvent<CounterSettings>): Promise<void> {
		this.pressState.get(ev.action.id)?.abort();
	}
}
