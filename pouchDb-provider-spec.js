describe('pouchDb Provider', function () {

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
            db.create();
            db.database.put(doc).then(function () {
                return db.database.get(id);
            }).then(function (doc) {
                return db.remove(doc); // the real act
            }).then(assert);


            // assert
            function assert() {
                return db.database.get(id).catch(function (err) {
                    expect(err.status).toEqual(404);
                    expect(err.reason).toEqual('deleted');
                    done();
                });
            }
        });

        it('should delete a document if a document\'s id and rev is provided', function (done) {
            // arrange
            var db = arrange(),
                id = 'docId_2',
                doc = { _id: id, name: 'name2' };

            // act
            db.create();
            db.database.put(doc).then(function () {
                return db.database.get(id);
            }).then(function (doc) {
                return db.remove(doc._id, doc._rev); // the real act
            }).then(assert);


            // assert
            function assert() {
                return db.database.get(id).catch(function (err) {
                    expect(err.status).toEqual(404);
                    expect(err.reason).toEqual('deleted');
                    done();
                });
            }
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
            db.create();
            db.database.bulkDocs(docs).then(function () {
                return db.get(); // the real act
            }).then(assert);


            // assert
            function assert(docs) {
                expect(docs.length).toEqual(4);

                expect(docs[0]._id).toEqual('1');
                expect(docs[1]._id).toEqual('2');
                expect(docs[2]._id).toEqual('3');
                expect(docs[3]._id).toEqual('4');

                done();
            }
        });

        it('should return a document if a document id provided', function (done) {
            // arrange
            var db = arrange(),
                docs = [{ _id: '1', name: 't1' }, { _id: '2', name: 't2' }, { _id: '3', name: 't3' }, { _id: '4', name: 't4' }];

            // act
            db.create();
            db.database.bulkDocs(docs).then(function () {
                return db.get('2'); // the real act
            }).then(assert);

            // assert
            function assert(doc) {
                expect(doc._id).toEqual('2');
                expect(doc.name).toEqual('t2');
                done();
            }
        });

        it('should return the documents filtered by provided `where clause` object', function (done) {
            // arrange
            var db = arrange(),
                docs = [{ _id: '1', name: 't1' }, { _id: '2', name: 't2' }, { _id: '3', name: 't3' }, { _id: '4', name: 't4' }],
                where = { startKey: '1', endKey: '4' };

            // act
            db.create();
            db.database.bulkDocs(docs).then(function () {
                return db.get(where); // the real act
            }).then(assert);

            // assert
            function assert(docs) {
                expect(docs.length).toEqual(4);
                expect(docs[0]._id).toEqual('1');
                expect(docs[1]._id).toEqual('2');
                expect(docs[2]._id).toEqual('3');
                expect(docs[3]._id).toEqual('4');
                done();
            }
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
            db.create();
            db.save(doc).then(function () {
                return db.database.get(doc.id);
            }).then(assert);

            // assert
            function assert(doc) {
                expect(doc._id).toEqual('1');
                done();
            }
        });

        it('should save an array of documents', function (done) {
            // arrange
            var db = arrange(),
                docs = [{ id: '1', name: 't1' }, { id: '2', name: 't2' }, { id: '3', name: 't3' }, { id: '4', name: 't4' }];

            // act 
            db.create();
            db.save(docs).then(function (res) {
                return db.database.allDocs({ include_docs: true });
            }).then(function (docs) {
                return docs.rows.map(function (r) { return r.doc; });
            }).then(assert);

            // assert
            function assert(docs) {
                expect(docs.length).toEqual(4);
                expect(docs[0]._id).toEqual('1');
                expect(docs[1]._id).toEqual('2');
                expect(docs[2]._id).toEqual('3');
                expect(docs[3]._id).toEqual('4');
                done();
            }
        });

    });

});