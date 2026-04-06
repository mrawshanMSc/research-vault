import { getDb } from "@/lib/mongodb";

const COLLECTION = "statuses";

export async function listStatuses() {
  const db = await getDb();
  return db.collection(COLLECTION).find().toArray();
}

export async function isValidStatus(name: string) {
  const db = await getDb();
  const status = await db.collection(COLLECTION).findOne({ name });
  return Boolean(status);
}