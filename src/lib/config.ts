type AppConfig = {
  mongodbUri: string;
  dbName: string;
};

export function getConfig(): AppConfig {
  const mongodbUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!mongodbUri) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!dbName) {
    throw new Error("Missing MONGODB_DB_NAME");
  }

  return {
    mongodbUri,
    dbName,
  };
}
