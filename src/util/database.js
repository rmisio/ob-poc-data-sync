import * as RxDB from 'rxdb';
import { QueryChangeDetector } from 'rxdb';
import profileSchema from 'schema/profile';

QueryChangeDetector.enable();
QueryChangeDetector.enableDebugging();

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));

let db = {
  promise: null,
  name: null,
  instance: null,
}

const syncUrl = `http://${window.location.hostname}:5984/`;

async function _connect(name, password) {
  const database = await RxDB.create(
    {
      name,
      adapter: 'idb',
      password,
    }
  );

  // TODO: first part for debugging only!
  window.db = db.instance = database;
  db.name = name;

  const profileCollection = await database.collection({
    name: 'profiles',
    schema: profileSchema
  });

  // set up replication
  profileCollection.sync({ remote: `${syncUrl}${db.name}/` });

  return database;
}

export function connect(name, password) {
  if (name.indexOf(password) > -1) {
    throw new Error('The database name should not be equal to or contain ' +
      'the password.');
  }

  const dbName = `ob${name}`;
  
  if (db.promise) {
    if (db.name !== dbName) {
      return db.instance.destroy()
        .then(
          () => {
            db.promise = _connect(dbName, password);
            return db.promise;
          }
        );
    } else {
      return db.promise;
    }
  }

  db.promise = _connect(dbName, password);
  return db.promise;
}

export function destroy() {
  if (db.instance) {
    const destroyInstance = db.instance;
    
    db = {
      promise: null,
      name: null,
      instance: null,
    }

    return destroyInstance.destroy();

    // todo: log error on failed destroy.
  } else {
    return new Promise().resolve();
  }
}

export function getCurDb() {
  if (!db.instance) {
    return null;
  }

  return {
    name: db.name,
    instance: db.instance,
  }
}
