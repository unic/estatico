/*!
 * @class       Notification
 * @classdesc   Plugin for centralized Notifications. Initialized on <body />.
 * @author      Patrick Lauterburg, Unic AG
 * Edited by    Matthias Meier, Oriol Torrent Florensa, Thomas Jaggi, Marcin Borowski, Olga Skurativska Unic AG
 * @copyright   Unic AG
 */

import $ from '../../../../node_modules/jquery/dist/jquery';
import EstaticoModule from '../../../assets/js/modules/module';

class NotificationMessage extends EstaticoModule {

	constructor(data, options) {
		let _defaultData = {
			i18n: {
				close: 'Close'
			}
		},
		_defaultOptions = {
			modal: false,
			timeout: 2000,
			type: 'info', // info, error, success,
			message: '',
			stateClasses: {
				expanded: 'is_expanded'
			}
		};

		super(null, _defaultData, _defaultOptions, data, options);

		this.timer = null;
		this.template = {
			buttonClose: `<a class="close_button">${this.data.i18n.close}</a>`,
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
		this.ui.$element.addClass(this.options.stateClasses.expanded);
	}

	/**
	 * Remove specific notification
	 */
	hide() {
		this.ui.$element.removeClass(this.options.stateClasses.expanded);

		// TODO: replace setTimeout with proper helper function from ESTATICO-51
		setTimeout(() => {
			clearTimeout(this.timer);
			this.ui.$element.remove();
		}, 300);
	}

	_initUi() {
		this.ui.$element = $(this.template.message)
			.append(this.options.message)
			.addClass(NotificationMessage.getCSSClassByType(this.options.type) || '');

		if (this.options.modal) {
			this._initModalUi();
		} else {
			this._initTimerUi();
		}
	}

	_initModalUi() {
		this.ui.$closeButton = $(this.template.buttonClose);
		this.ui.$closeButton
			.prependTo(this.ui.$element)
			.on('click.' + NotificationMessage.name, (event) => {
				event.preventDefault();
				this.hide();
			});
	}

	_initTimerUi() {
		this.timer = setTimeout(() => {
			this.hide();
		}, this.options.timeout);

		this.ui.$element.on('click.' + NotificationMessage.name, (event) => {
			event.preventDefault();
			this.hide();
		});
	}
}

export default NotificationMessage;
