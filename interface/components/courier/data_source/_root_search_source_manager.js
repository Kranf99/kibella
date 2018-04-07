define(function(require) {
    return function rootSearchSourceManager() {
        var appSource;

        function set(source) {
            appSource = source;
        }

        function get() {
            return appSource;
        }

        return {
            get: get,
            set: set
        }
    }
});