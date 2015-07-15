+function () {
    'use strict';

    angular
        .module('myApp')
        .provider("localDb", localDbProvider);

    function localDbProvider() {
        var provider;

        return {
            setProvider: function (value) {
                return provider = value;
            },
            $get: ['$injector', function ($injector) {
                return $injector.get(provider);
            }]
        };
    }

} ()


