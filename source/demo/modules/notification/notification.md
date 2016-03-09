# Notification plugin

*Author*: Patrick Lauterburg

## Event-based triggering

### adding a notification

```javascript
$(document).trigger(estatico.modules.notification.events.add, {
	message: '<p>Demo: Info</p>',
	options: {
		type: 'info',
		modal: false,
		timeout: 10000
	}
});
```

#### Available options

| Name | Type | Default | Observations |
|-----------------|-----------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| type | {String} | 'info' | Options: 'info', 'success', 'error' |
| timeout | {Number} | 2000 | Timeout in milliseconds after which the notification will be closed automatically |
| modal | {Boolean} | false | Specifies if the Notification should be open indefinitely or closed after the specified timeout |


### removing all notifications

```javascript
$(document).trigger(estatico.modules.notification.events.removeAll);
```

### destroying the plugin

```javascript
$(document).trigger(estatico.modules.notification.events.destroy);
```
