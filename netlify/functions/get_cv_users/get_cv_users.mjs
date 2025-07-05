import { MongoClient } from "mongodb";
require("@dotenvx/dotenvx").config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, _context) => {
  try {
    const { searchParams } = new URL(request.url);
    console.warn(searchParams.get('field'))
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.find({email: {
      $regex: /@/i 
    }}).limit(10).toArray();

    return new Response(JSON.stringify({
      statusCode: 200,
      body: results,
    }));
  } catch (e) {
    return { statusCode: 500, body: e.toString() };
  }
};
