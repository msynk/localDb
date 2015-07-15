+function () {
    'user strict';

    angular
        .module('myApp')
        .provider('pouchDb', pouchDbProvider);

    function pouchDbProvider() {
        var dbName = 'myDb';

        return {
            setDbName: function (name) {
                return dbName = name;
            },
            $get: ['$q', pouchDbProviderGetter]
        };

        function pouchDbProviderGetter() {
            var db = null,
                self = this,
                result = {};


            //function getKey(id, userId) {
            //    userId = userId || authService.getUser().id;
            //    return userId + '-' + dbName + '-' + id;
            //}

            function checkDb() {
                if (!db) {
                    throw "Database is not created.";
                }
            }


            function create(name) {
                result.database = db = new PouchDB(name || dbName);
            }

            function remove() {
                var args = utils.arrayize(arguments);

                checkDb();

                if (args.length === 0) { // pouchDb.remove();
                    return db.destroy().then(function (res) {
                        result.database = db = null;
                        return res;
                    });
                }

                if (args.length === 1 && angular.isObject(args[0])) {  // pouchDb.remove({ _id:'docId', _rev:'docRev' });
                    return db.remove(args[0]);
                }

                return db.remove.apply(db, args);
            }

            function get() {
                var args = utils.arrayize(arguments);

                checkDb();

                if (args.length === 0) { // pouchDb.get();
                    return db.allDocs({ include_docs: true }).then(function (res) {
                        return res.rows.map(function (r) { return r.doc; });
                    });
                }

                if (args.length === 1) {
                    var where = args[0];

                    if (angular.isString(where)) {  // pouchDb.get('docId');
                        return db.get(where);
                    }

                    if (angular.isObject(where)) {  // pouchDb.get({startKey:'id1', endKey:'id2'});
                        angular.extend(where, { include_docs: true });
                        return db.allDocs(where).then(function (res) {
                            return res.rows.map(function (r) { return r.doc; });
                        });
                    }
                }

                // pouchDb.query(mapFun, {propery1: 'filter1', ...});
                // pouchDb.query({map: mapFun, reduce: reduceFun}, {propery1: 'filter1', ...});
                // pouchDb.query('viewName', {propery1: 'filter1', ...});
                // for more info: http://pouchdb.com/api.html#query_database
                return db.query.apply(db, args); // todo: must be improved further
            }

            function save() {
                var args = utils.arrayize(arguments),
                    value;

                checkDb();

                if (args.length === 0) {
                    throw 'No item(s) provided.';
                }

                value = args[0];

                if (angular.isArray(value)) {
                    return insertOrUpdateArray(value); //return db.bulkDocs(value);
                }

                return insertOrUpdate(value); //return db.put(value);
            }

            function insertOrUpdateArray(items) {
                items.result = items.result || [];
                if (items.result.length === 0) {
                    items.reverse();
                }

                if (items.length === 0) {
                    return items.result;
                } else {
                    return insertOrUpdate(items[items.length - 1]).then(function (doc) {
                        items.result.push(doc);
                        items.pop(); // or without pop:    items = items.slice(1);   but we lose the `result` property
                        return insertOrUpdateArray(items);
                    });
                }
            }

            function insertOrUpdate(item) {
                var id = item.id || item.Id;
                if (!id) {
                    throw 'item must have an id property';
                }

                //item._id = getKey(id);
                item._id = id;

                var saveAndGet = function () {
                    return db.put(item).then(function (result) { // add or update item
                        return db.get(id); // get and return new item
                    });
                }

                //var now = new Date().getTime();
                //while (new Date().getTime() - now < 2000) { };

                return db.get(id)
                    .then(function (doc) { // found
                        item._rev = doc._rev;
                        return saveAndGet();
                    }).catch(function (err) {
                        if (err && err.status === 404) { // not found
                            return saveAndGet();
                        }
                        throw err;
                    });
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