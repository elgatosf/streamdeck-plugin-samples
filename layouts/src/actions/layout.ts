import {
	action,
	DialRotateEvent,
	JsonObject,
	SingletonAction,
	WillAppearEvent,
} from '@elgato/streamdeck';

/**
 * An example action class that demonstrates switching the encoder's touch display layout.
 */
@action({ UUID: 'com.elgato.layouts.layout' })
export class Layout extends SingletonAction {
	/**
	 * Sets the initial title when the action appears on Stream Deck.
	 */
	onWillAppear(ev: WillAppearEvent<JsonObject>): Promise<void> | void {
		let { value = 0 } = ev.payload.settings;

		if (value === 0) {
			ev.action.setFeedback({ title: 'Layout $X1' });
		}
	}

	/**
	 * Switch the layout and update the title based on the dial rotation.
	 */
	onDialRotate(ev: DialRotateEvent<DialSettings>): Promise<void> | void {
		let { value = 0 } = ev.payload.settings;

		if (ev.payload.ticks > 0 && value < 6) {
			value++;
		} else if (ev.payload.ticks < 0 && value > 0) {
			value--;
		}

		switch (value) {
			case 0:
				ev.action.setFeedbackLayout('$X1');
				ev.action.setFeedback({ title: 'Layout $X1' });
				break;
			case 1:
				ev.action.setFeedbackLayout('$A0');
				ev.action.setFeedback({ title: 'Layout $A0' });
				break;
			case 2:
				ev.action.setFeedbackLayout('$A1');
				ev.action.setFeedback({ title: 'Layout $A1' });
				break;
			case 3:
				ev.action.setFeedbackLayout('$B1');
				ev.action.setFeedback({ title: 'Layout $B1' });
				break;
			case 4:
				ev.action.setFeedbackLayout('$B2');
				ev.action.setFeedback({ title: 'Layout $B2' });
				break;
			case 5:
				ev.action.setFeedbackLayout('$C1');
				ev.action.setFeedback({ title: 'Layout $C1' });
				break;
			case 6:
				ev.action.setFeedbackLayout('custom-layout.json');
				ev.action.setFeedback({ title: 'Custom Layout' });
				break;
		}

		ev.action.setSettings({ value });
	}
}

/**
 * Settings for {@link Layout}.
 */
type DialSettings = {
	value: number;
};
