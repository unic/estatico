/*!
 * @class       Notification
 * @classdesc   Plugin for centralized Notifications. Initialized on <body />.
 * @author      Patrick Lauterburg, Unic AG
 * Edited by    Matthias Meier, Oriol Torrent Florensa, Thomas Jaggi, Unic AG
 * @copyright   Unic AG
 */

import $ from '../../../../node_modules/jquery/dist/jquery';
import NotificationMessage from './notificationmessage';
import EstaticoModule from '../../../assets/js/helpers/module';

class Notification extends EstaticoModule {

	constructor($element, data, options) {
		super($element, {}, {}, data, options);

		this.template = {
			wrapper: '<div class="mod_notification" role="alert" />'
		};

		this.isVisible = false;
		this.notifications = [];

		this._initUi();
		this._initEventListeners();
	}

	static get events() {
		return {
			addNotification: 'addNotification.estatico.' + Notification.name,
			removeAllNotifications: 'removeAllNotifications.estatico.' + Notification.name,
			destroy: 'destroy.estatico.' + Notification.name
		};
	}

	/**
	 * Add notification
	 * @param message Content to display
	 * @param options Custom settings
	 */
	addNotification(event, options, data) {
		var notification = new NotificationMessage(data, options);

		if (!this.isVisible) {
			this._show();
		}

		notification.ui.$element.appendTo(this.ui.$wrapper);

		// there has to be a delay to trigger transitions initially
		setTimeout(notification.show.bind(notification), 1);
		this.notifications.push(notification);
	}

	/**
	 * Remove all notifications
	 */
	removeAllNotifications() {
		this.notifications.forEach((notification) => {
			notification.hide();
		});

		this.notifications = [];
	}

	_initUi() {
		this.ui.$target = $('body');
		this.ui.$wrapper = $(this.template.wrapper).appendTo(this.ui.$target).hide();
	}

	_initEventListeners() {
		this.ui.$target.on(Notification.events.addNotification, this.addNotification.bind(this));
		this.ui.$target.on(Notification.events.removeAllNotifications, this.removeAllNotifications.bind(this));
	}

	/**
	 * Show overlay
	 */
	_show() {
		this.ui.$wrapper.show();
		this.isVisible = true;
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

export default Notification;
