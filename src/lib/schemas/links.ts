import { ObjectId, type Sort } from "mongodb";
import { getDb } from "@/lib/mongodb";

const COLLECTION_NAME = "links";

export type LinkDocument = {
  _id?: ObjectId;
  url: string;
  title: string;
  notes: string;
  category: string;
  tags?: string[];
  status?: string;
  isFavorite?: boolean;
  normalizedUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

async function getCollection() {
  const db = await getDb();
  return db.collection<LinkDocument>(COLLECTION_NAME);
}

export async function findLinks(query: any, sort: Sort) {
  const collection = await getCollection();
  return collection.find(query, { sort }).toArray();
}

export async function insertLink(document: LinkDocument) {
  const collection = await getCollection();
  return collection.insertOne(document);
}

export async function findAllLinksMinimal() {
  const collection = await getCollection();
  return collection
    .find(
      {},
      {
        projection: {
          url: 1,
          title: 1,
          status: 1,
          isFavorite: 1,
          createdAt: 1,
          normalizedUrl: 1,
        },
      }
    )
    .toArray();
}

export async function updateLinkById(
  id: ObjectId,
  data: Partial<LinkDocument>
) {
  const collection = await getCollection();

  return collection.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { returnDocument: "after" }
  );
}

export async function deleteLinkById(id: ObjectId) {
  const collection = await getCollection();
  return collection.deleteOne({ _id: id });
}