//= require ../../assets/vendor/jquery/jquery.js
//= require ../../assets/js/.tmp/lodash.js

/**
 * Slideshow
 *
 * @author Thomas Jaggi, http://responsive.ch
 */
(function(window, document, $, undefined) {
    'use strict';

    var PLUGIN_NAME = 'slideshow';

    var Plugin = function($element, options) {
            this.settings = $.extend(true, {
                domSelectors: {
                    slide: '[data-' + PLUGIN_NAME + '="slide"]',
                    image: '[data-' + PLUGIN_NAME + '="image"]'
                },
                stateClasses: {
                    isInitialized: 'is-initialized',
                    isActive: 'is-active'
                },
                autoplayInterval: 20000,
                initalSlide: 0
            }, options, $element.data(PLUGIN_NAME +'-options'));

            this.$element = $element;

            this.$slides = null;

            this.template = null;

            this.slides = 0;
            this.activeSlide = -1;
            this.interval = null;
        };

    Plugin.prototype.init = function() {
        this.$slides = this.$element.find(this.settings.domSelectors.slide).each($.proxy(function(index, slide) {
                var $slide = $(slide),
                    image = $slide.find(this.settings.domSelectors.image).attr('src');

                // $slide.css('background-image', 'url(' + image + ')').addClass(this.settings.stateClasses.isInitialized);
            }, this));

        this.slides = this.$slides.length;

        this.show(this.settings.initalSlide);

        this.interval = setInterval($.proxy(function() {
            this.next();
        }, this), this.settings.autoplayInterval);
    };

    Plugin.prototype.show = function(index) {
        if (this.activeSlide === index) return;

        if (index >= this.slides) {
            index = 0;
        } else if (index < 0) {
            index = this.slides;
        }

        this.$slides.eq(this.activeSlide).removeClass(this.settings.stateClasses.isActive);
        this.$slides.eq(index).addClass(this.settings.stateClasses.isActive);

        this.activeSlide = index;
    };

    Plugin.prototype.replaceSlides = function(images) {
        var $template = this.$element.find(this.settings.domSelectors.template),
            template = this.template || $.trim($template.html),
            html = _.template(template, {
                data: {
                    images: images
                }
            });
		// console.log(images, template);
        clearInterval(this.interval);

        this.template = template;

        this.$element.html(html);

        this.init();
    };

    Plugin.prototype.prev = function() {
        this.show(this.activeSlide - 1);
    };
    Plugin.prototype.next = function() {
        this.show(this.activeSlide + 1);
    };

    window.Site.utils.registerPlugin(PLUGIN_NAME, Plugin, true);

})(window, document, jQuery);
