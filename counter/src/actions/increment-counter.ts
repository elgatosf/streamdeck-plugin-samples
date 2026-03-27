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
	/** Tracks per-action press state to avoid cross-key races. */
	private pressState = new Map<
		string,
		{ resetTimer?: NodeJS.Timeout; didReset: boolean }
	>();

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
		const state = this.pressState.get(ev.action.id) ?? { didReset: false };
		state.didReset = false;

		if (state.resetTimer) {
			clearTimeout(state.resetTimer);
		}

		state.resetTimer = setTimeout(() => {
			state.didReset = true;
			void ev.action.setTitle("0");
			void ev.action.setSettings({ ...ev.payload.settings, count: 0 });
		}, 1500);

		this.pressState.set(ev.action.id, state);
	}

	/**
	 * Increments the counter if the key was released before a reset occurred.
	 */
	override async onKeyUp(ev: KeyUpEvent<CounterSettings>): Promise<void> {
		const state = this.pressState.get(ev.action.id);

		if (state?.resetTimer) {
			clearTimeout(state.resetTimer);
		}

		if (state?.didReset) {
			this.pressState.delete(ev.action.id);
			return;
		}

		const settings = { ...ev.payload.settings };
		settings.incrementBy ??= 1;
		settings.count = (settings.count ?? 0) + settings.incrementBy;

		await ev.action.setSettings(settings);
		await ev.action.setTitle(`${settings.count}`);
		this.pressState.delete(ev.action.id);
	}
}
