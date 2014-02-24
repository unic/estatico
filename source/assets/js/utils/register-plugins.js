//= require ../../vendor/jquery/jquery.js


(function(window, document, $, undefined) {
    'use strict';

    window.Site = window.Site || {};
    Site.utils = Site.utils || {};

    Site.utils.registerPlugin = function(pluginName, Plugin, autoInit) {
        if ($.fn[pluginName]) {
            $.fn[pluginName +'Orig'] = $.fn[pluginName];
        }

        $.fn[pluginName] = function(options) {
            var args = Array.prototype.slice.call(arguments, 1);

            return this.each(function() {
                var $this = $(this),
                    instance = $this.data(pluginName + '-instance');

                if (instance) {
                    if (typeof options === 'string' && instance[options] !== undefined) {
                        // Apply method
                        instance[options].apply(instance, args);
                    }
                } else {
                    // Init new instance
                    instance = new Plugin($this, options);
                    instance.init();

                    // Save instance
                    $this.data(pluginName + '-instance', instance);
                }
            });
        };

        if (autoInit) {
            $(document).on('ready.' + pluginName + ' ajaxLoaded.' + pluginName, function() {
                $.fn[pluginName].apply($('[data-'+ pluginName +'~="init"]'), [{
                    // Options
                }]);
            });
        }
    };

})(window, document, jQuery);
