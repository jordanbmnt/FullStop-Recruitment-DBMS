import { MongoClient } from "mongodb";
// require("@dotenvx/dotenvx").config();

const FIELD_OCCURRENCES_AGG = [
  {
    $group: {
      _id: "$field",
      count: {
        $sum: 1,
      },
    },
  },
];
const EXISTING_FIELDS_AGG = [
  {
    $group: {
      _id: "$field",
    },
  },
  {
    $count: "uniqueFieldsCount",
  },
];

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, _context) => {
  try {
    const { searchParams } = new URL(request.url);
    const searchParamsDict = {
      occurrence: searchParams.get("occurrence"),
    };
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection
      .aggregate(searchParamsDict ? FIELD_OCCURRENCES_AGG : EXISTING_FIELDS_AGG)
      .toArray();

    return new Response(
      JSON.stringify({
        statusCode: 200,
        body: results,
      })
    );
  } catch (e) {
    return { statusCode: 500, body: e.toString() };
  }
};
