import { MongoClient } from "mongodb";
require("@dotenvx/dotenvx").config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

export const handler = async (event) => {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.find({}).limit(10).toArray();
    
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (e) {
    return { statusCode: 500, body: e.toString() };
  }
};
