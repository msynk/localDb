var utils = utils || {};

+function (u) {
    'use strict';

    u.handle = function utils$handle(err) {
        if (err.data) {
            if (err.data.InnerException) {
                return u.handle({ data: err.data.InnerException });
            }
            if (err.data.Message) {
                return err.data.Message; 
            }
            return err.data.ExceptionMessage;
        }

        if (err.statusText) {
            return err.statusText;
        }

        return 'An error occured.';
    };

    u.arrayize = function (arguments) {
        return [].slice.call(arguments);
    }

}(utils = utils || {});