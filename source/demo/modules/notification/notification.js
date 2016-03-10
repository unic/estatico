/*!
 * @class       Notification
 * @classdesc   Plugin for centralized Notifications. Initialized on <body />.
 * @author      Patrick Lauterburg, Unic AG
 * Edited by    Matthias Meier, Oriol Torrent Florensa, Thomas Jaggi, Marcin Borowski, Olga Skurativska Unic AG
 * @copyright   Unic AG
 */

import $ from '../../../../node_modules/jquery/dist/jquery';
import EstaticoModule from '../../../assets/js/module/module';

class Notification extends EstaticoModule {

	constructor(state, props) {
		let _defaultState = {
			timer: null
		},
		_defaultProps = {
			modal: false,
			timeout: 2000,
			type: 'info', // info, error, success,
			message: '',
			i18n: {
				close: 'Close'
			},
			CSSClasses: {
				expanded: 'is_expanded'
			}
		};

		super(null, _defaultState, _defaultProps, state, props);

		this.template = {
			buttonClose: `<a class="close_button">${this.props.i18n.close}</a>`,
			message: '<div class="message" />'
		};

		this._initUi();
	}

	static getCSSClassByType(type) {
		let typeClasses = {
			info: 'is_info',
			error: 'is_error',
			success: 'is_success'
		};

		return typeClasses[type];
	}

	show() {
		this.ui.$element.addClass(this.props.CSSClasses.expanded);
	}

	/**
	 * Remove specific notification
	 */
	hide() {
		this.ui.$element.removeClass(this.props.CSSClasses.expanded);

		// TODO: replace setTimeout with proper helper function from ESTATICO-51
		setTimeout(() => {
			clearTimeout(this.state.timer);
			this.ui.$element.remove();
		}, 300);
	}

	_initUi() {
		this.ui.$element = $(this.template.message)
			.append(this.props.message)
			.addClass(Notification.getCSSClassByType(this.props.type) || '');

		if (this.props.modal) {
			this._initModalUi();
		} else {
			this._initTimerUi();
		}
	}

	_initModalUi() {
		this.ui.$closeButton = $(this.template.buttonClose);
		this.ui.$closeButton
			.prependTo(this.ui.$element)
			.on('click.' + Notification.name, (event) => {
				event.preventDefault();
				this.hide();
			});
	}

	_initTimerUi() {
		this.state.timer = setTimeout(() => {
			this.hide();
		}, this.props.timeout);

		this.ui.$element.on('click.' + Notification.name, (event) => {
			event.preventDefault();
			this.hide();
		});
	}
}

export default Notification;
