import { Db, MongoClient } from "mongodb";
import { getConfig } from "./config";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const { mongodbUri } = getConfig();

  if (!global._mongoClientPromise) {
    const client = new MongoClient(mongodbUri);
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const { dbName } = getConfig();
  const client = await getClientPromise();
  return client.db(dbName);
}
