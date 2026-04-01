if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

if (!process.env.MONGODB_DB_NAME) {
  throw new Error("Missing MONGODB_DB_NAME");
}

export const config = {
  mongodbUri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB_NAME,
};
