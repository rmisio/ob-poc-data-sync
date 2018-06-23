import * as RxDB from 'rxdb';
import { QueryChangeDetector } from 'rxdb';
import profileSchema from 'schema/profile';

QueryChangeDetector.enable();
QueryChangeDetector.enableDebugging();

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));

const db = {
  promise: null,
  name: null,
  instance: null,
}

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

  const profileCollection = await database.collection({
    name: 'profiles',
    schema: profileSchema
  });

  // set up replication
  // const replicationState = 
  //   profileCollection.sync({ remote: syncURL + dbName + '/' });
  // this.subs.push(
  //   replicationState.change$.subscribe(change => {
  //     console.dir(change)
  //   })
  // );
  // this.subs.push(
  //   replicationState.docs$.subscribe(docData => console.dir(docData))
  // );
  // this.subs.push(
  //   replicationState.active$.subscribe(active => console.log(`Replication active: ${active}`))
  // );
  // this.subs.push(
  //   replicationState.complete$.subscribe(completed => console.log(`Replication completed: ${completed}`))
  // );
  // this.subs.push(
  //   replicationState.error$.subscribe(error => {
  //     console.dir(error)
  //   })
  // );  

  return database;
}

// todo: this should accept name and password instead of seed
export function connect(name, password) {
  if (db.promise) {
    if (db.name !== name) {
      db.instance.destroy();
    } else {
      return db.promise;
    }
  }

  db.promise = _connect(`ob${name}`, password);
  return db.promise;
}

export function destroy() {
  // todo: return the destroy call and return a rejected
  // promise if there is no instance.
  if (db.instance) {
    db.instance.destroy();
  }
}
