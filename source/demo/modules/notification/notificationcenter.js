/*!
 * @class       Notification
 * @classdesc   Plugin for centralized Notifications. Initialized on <body />.
 * @author      Patrick Lauterburg, Unic AG
 * Edited by    Matthias Meier, Oriol Torrent Florensa, Thomas Jaggi, Unic AG
 * @copyright   Unic AG
 */

import $ from '../../../../node_modules/jquery/dist/jquery';
import Notification from './notification';
import EstaticoModule from '../../../assets/js/module/module';

class NotificationCenter extends EstaticoModule {

	constructor($element, options) {
		let _defaultOptions = {
			notifications: [],
			isVisible: false,
			DOM: {
				selectors: {
					target: '[data-' + Notification.name + '=target]'
				}
			}
		};

		super($element, _defaultOptions, options);

		this.template = {
			wrapper: '<div class="mod_notification" role="alert" />'
		};

		this._initUi();
		this._initEventListeners();
	}

	static get events() {
		return {
			addNotification: 'addNotification.estatico.' + NotificationCenter.name,
			removeAllNotifications: 'removeAllNotifications.estatico.' + NotificationCenter.name,
			destroy: 'destroy.estatico.' + NotificationCenter.name
		};
	}

	/**
	 * Add notification
	 * @param message Content to display
	 * @param options Custom settings
	 */
	addNotification(event, options) {
		var notification = new Notification(null, options);

		if (!this.options.isVisible) {
			this._show();
		}

		notification.ui.$element.appendTo(this.ui.$wrapper);

		// there has to be a delay to trigger transitions initially
		setTimeout(notification.show.bind(notification), 1);
		this.options.notifications.push(notification);
	}

	/**
	 * Remove all notifications
	 */
	removeAllNotifications() {
		this.options.notifications.forEach((notification) => {
			notification.hide();
		});

		this.options.notifications = [];
	}

	_initUi() {
		this.ui.$target = $('body');
		this.ui.$wrapper = $(this.template.wrapper).appendTo(this.ui.$target).hide();
	}

	_initEventListeners() {
		this.ui.$target.on(NotificationCenter.events.addNotification, this.addNotification.bind(this));
		this.ui.$target.on(NotificationCenter.events.removeAllNotifications, this.removeAllNotifications.bind(this));
	}

	/**
	 * Show overlay
	 */
	_show() {
		this.ui.$wrapper.show();
		this.options.isVisible = true;
	}

	/**
	 * Unbind events, remove data, custom teardown
	 * @method
	 * @public
	 */
	destroy() {
		this.ui.$wrapper.remove();
	}
}

export default NotificationCenter;
