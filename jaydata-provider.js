+function () {
    'use strict';

    angular
        .module('myApp')
        .provider('jaydata', jaydataProvider);

    function jaydataProvider() {
        var dbName = 'myDb';

        return {
            setDbName: function (name) {
                return dbName = name;
            },
            $get: jaydataProviderGetter
        };

        function jaydataProviderGetter() {
            var db = null,
                result = {};

            function checkDb() {
                if (!db) {
                    throw "Database is not created.";
                }
            }


            function create(name) {
                
            }

            function remove() {
                
            }

            function get() {
                
            }

            function save() {
                
            }

            result = {
                database: db,
                create: create,
                remove: remove,
                save: save,
                get: get
            };

            return result;
        }
    }

} ();