import { getDb } from "@/lib/mongodb";

const COLLECTION = "categories";

export async function listCategories() {
  const db = await getDb();
  return db.collection(COLLECTION).find().toArray();
}

export async function isValidCategory(name: string) {
  const db = await getDb();
  const category = await db.collection(COLLECTION).findOne({ name });
  return Boolean(category);
}