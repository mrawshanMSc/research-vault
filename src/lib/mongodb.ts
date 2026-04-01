import { MongoClient } from "mongodb";
import { config } from "./config";

const { mongodbUri, dbName } = config;

if (!mongodbUri) {
  throw new Error("Please define MONGODB_URI in .env");
}

if (!dbName) {
  throw new Error("Please define MONGODB_DB_NAME in .env");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(mongodbUri);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}
