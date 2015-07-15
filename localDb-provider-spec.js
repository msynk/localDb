describe('localDb Provider', function () {

    var provider, $inj;

    beforeEach(function () {
        // Initialize the service provider by injecting it to a fake module's config block
        angular
            .module('testApp', function () { })
            .config(function (localDbProvider) {
                provider = localDbProvider;
            });

        // Initialize myApp injector
        module('myApp', 'testApp');

        inject(function ($injector) {
            $inj = $injector;
        });
    });

    it('should set the current db provider', function () {
        // arrange
        var providerName = 'pouchDb',
            result;
        // act
        result = provider.setProvider(providerName);

        // assert
        expect(result).toEqual(providerName);
    });

    it('should get the current db provider', function () {
        // arrange
        var providerName = 'pouchDb',
            result;
        // act
        provider.setProvider(providerName);
        result = $inj.invoke(provider.$get);
        
        // assert
        expect(result.database).toBeDefined();
        expect(result.create).toBeDefined();
        expect(result.remove).toBeDefined();
        expect(result.save).toBeDefined();
        expect(result.get).toBeDefined();
    });
});