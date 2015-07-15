describe('utils', function () {

    describe('handle', function () {

        it('should handle all kinds of exceptions', function () {
            // arrange
            var err1 = {},
                err2 = { statusText: 'This is err2.' },
                err3 = { data: { ExceptionMessage: 'This is err3.' } },
                err4 = { data: { InnerException: { ExceptionMessage: 'This is err4.' } } },
                err5 = { data: { Message: 'This is err5.' } };

            // act
            var result1 = utils.handle(err1),
                result2 = utils.handle(err2),
                result3 = utils.handle(err3),
                result4 = utils.handle(err4),
                result5 = utils.handle(err5);

            // assert
            expect(result1).toEqual('An error occured.');
            expect(result2).toEqual('This is err2.');
            expect(result3).toEqual('This is err3.');
            expect(result4).toEqual('This is err4.');
            expect(result5).toEqual('This is err5.');
        });

    });

    describe('arrayize', function () {

        it('should convert `arguments` object to an array', function () {
            // arrange
            var fn = function () {
                var args = utils.arrayize(arguments);
                return args;
            },
            result1, result2;

            // act
            result1 = fn({ id: 1 }, 'saleh', 1363);
            result2 = fn(4, 6, 3, 7, 1);
            result2.sort(function (a, b) {
                return a - b;
            }); // [1, 3, 4, 6, 7]

            // assert
            expect(angular.isArray(result1)).toEqual(true);
            expect(angular.isArray(result2)).toEqual(true);

            expect(result2).toEqual([1, 3, 4, 6, 7]);
        });

    });

});
