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
  db.name = name;

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

export function connect(name, password) {
  const dbName = `ob${name}`;
  
  if (db.promise) {
    console.log(`the db name is ${db.name}, you want ${name}`);
    if (db.name !== dbName) {
      console.log('No Matchy match matchers');
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
    return db.instance.destroy()
      .then(() => {
        db.instance = null;
        db.promise = null;
        db.name = null;   
      });
  } else {
    return new Promise().resolve();
  }
}
