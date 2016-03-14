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

	constructor($element, options) {
		let _defaultOptions = {
			timer: null,
			modal: false,
			timeout: 2000,
			type: 'info', // info, error, success,
			message: '',
			i18n: {
				close: 'Close'
			},
			DOM: {
				selectors: {
					target: '[data-' + Notification.name + '=target]'
				},
				classes: {
					expanded: 'is_expanded'
				}
			}
		};

		super($element, _defaultOptions, options);

		this.$document = $(document);

		this.template = {
			buttonClose: `<a class="close_button">${this.options.i18n.close}</a>`,
			message: '<div class="message" />'
		};

		this._initUi();
	}

	static get events() {
		return {
			show: 'show.estatico.' + Notification.name,
			removeAll: 'removeAll.estatico.' + Notification.name,
			destroy: 'destroy.estatico.' + Notification.name
		};
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
		this.ui.$element.addClass(this.options.DOM.classes.expanded);
	}

	/**
	 * Remove specific notification
	 */
	hide() {
		this.ui.$element.removeClass(this.options.DOM.classes.expanded);

		// TODO: replace setTimeout with proper helper function from ESTATICO-51
		setTimeout(() => {
			clearTimeout(this.options.timer);
			this.ui.$element.remove();
		}, 300);
	}

	_initUi() {
		this.ui.$target = this.$document.find(this.options.DOM.selectors.target);

		this.ui.$element = $(this.template.message)
			.append(this.options.message)
			.addClass(Notification.getCSSClassByType(this.options.type) || '');

		if (this.options.modal) {
			this._initModalUi();
		} else {
			this._initTimerUi();
		}
	}

	_initModalUi() {
		this.ui.$closeButton = $(this.template.buttonClose);
		this.ui.$closeButton.prependTo(this.ui.$element);
	}

	_initTimerUi() {
		this.options.timer = setTimeout(this.hide.bind(this), this.options.timeout);
	}

	_initEventListeners() {
		if (this.options.modal) {
			this.ui.$closeButton.on('click.' + Notification.name, this.hide.bind(this));
		} else {
			this.ui.$element.on('click.' + Notification.name, this.hide.bind(this));
		}
	}
}

export default Notification;
