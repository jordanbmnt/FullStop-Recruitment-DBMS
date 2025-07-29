import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let mongoClient;
let clientPromise;

if (!uri) {
  throw new Error("Mong URI missing.");
}

mongoClient = new MongoClient(uri);
clientPromise = mongoClient.connect();

export { clientPromise };
