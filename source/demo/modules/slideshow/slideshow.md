### Description

Slideshow / carousel thingy (for demo purposes only).

* Log `estatico.modules.slideshow.instances.slideshow1` to the console to see this instance and, specifically, how data and options are handled.
* It fires of an ajax request to `/mocks/demo/modules/slideshow/slideshow.json` which is delayed by 5s when running the gulp preview server.
* It listens to the custom `debouncedscroll` and `debouncedresize` events ands logs the orginial ones.
* It listens to the custom `mq` event and logs whether it's currently above or below the "small" breakpoint (as specified in `_mediaqueries.scss`).

### Integration

Copy HTML. The `data-slideshow-data` and `data-slideshow-options` attributes are optional. Dito for the script block which can be used for global data/options.
