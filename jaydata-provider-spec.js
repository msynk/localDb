describe('jaydata Provider', function () {

    var provider, $inj;

    beforeEach(function () {
        // Initialize the service provider by injecting it to a fake module's config block
        angular
            .module('testApp', function () { })
            .config(function (pouchDbProvider) {
                provider = pouchDbProvider;
            });

        // Initialize myApp injector
        module('myApp', 'testApp');

        inject(function ($injector) {
            $inj = $injector;
        });
    });

    function arrange() {
        provider.setDbName('testDb');
        return $inj.invoke(provider.$get);
    }

    it('should set the current db name', function () {
        // arrange
        var dbName = 'testDb',
            result;
            
        // act
        result = provider.setDbName(dbName);

        // assert
        expect(result).toEqual(dbName);
    });

    describe('create', function () {

        it('should create a new instance of local database', function () {
            // arrange
            var db = arrange();

            // act
            db.create();

            // assert
            expect(db.database).toBeDefined();
            expect(db.database).not.toBeNull();
        });
    });

    describe('remove', function () {

        it('should throw, if no database created first', function () {
            // arrange
            var db = arrange();

            // act & assert
            expect(db.remove).toThrow('Database is not created.');
        });

        it('should delete the current instance of local database, if no argument is provided', function (done) {
            // arrange
            var db = arrange();

            // act
            db.create();

            // assert
            expect(db.database).toBeDefined();
            expect(db.database).not.toBeNull();

            // act
            db.remove().then(assert);

            // assert
            function assert() {
                expect(db.database).toBeNull();
                done();
            }
        });

        it('should delete a document if a document is provided', function (done) {
            // arrange
            var db = arrange(),
                id = 'docId_1',
                doc = { _id: id, name: 'name1' };

            // act

            // assert
			
        });

        it('should delete a document if a document\'s id and rev is provided', function (done) {
            // arrange
            var db = arrange(),
                id = 'docId_2',
                doc = { _id: id, name: 'name2' };

            // act
			
            // assert
			
        });

    });

    describe('get', function () {

        it('should throw, if no database created first', function () {
            // arrange
            var db = arrange();

            // act & assert
            expect(db.get).toThrow('Database is not created.');
        });

        it('should return all documents if no argument is provided', function (done) {
            // arrange
            var db = arrange(),
                docs = [{ _id: '1', name: 't1' }, { _id: '2', name: 't2' }, { _id: '3', name: 't3' }, { _id: '4', name: 't4' }];

            // act
			
            // assert
			
        });

        it('should return a document if a document id provided', function (done) {
            // arrange
            var db = arrange(),
                docs = [{ _id: '1', name: 't1' }, { _id: '2', name: 't2' }, { _id: '3', name: 't3' }, { _id: '4', name: 't4' }];

            // act
			
            // assert
			
        });

        it('should return the documents filtered by provided `where clause` object', function (done) {
            // arrange
            var db = arrange(),
                docs = [{ _id: '1', name: 't1' }, { _id: '2', name: 't2' }, { _id: '3', name: 't3' }, { _id: '4', name: 't4' }],
                where = { startKey: '1', endKey: '4' };

            // act
			
            // assert
			
        });

    });

    describe('save', function () {

        it('should throw, if no database created first', function () {
            // arrange
            var db = arrange();

            // act & assert
            expect(db.save).toThrow('Database is not created.');
        });

        it('should throw, if no argument is provided', function () {
            // arrange
            var db = arrange();

            // act 
            db.create();

            // assert
            expect(db.save).toThrow('No item(s) provided.');
        });

        it('should save a single document', function (done) {
            // arrange
            var db = arrange(),
                doc = { id: '1' };

            // act 

            // assert
			
        });

        it('should save an array of documents', function (done) {
            // arrange
            var db = arrange(),
                docs = [{ id: '1', name: 't1' }, { id: '2', name: 't2' }, { id: '3', name: 't3' }, { id: '4', name: 't4' }];

            // act

            // assert
			
        });

    });

});