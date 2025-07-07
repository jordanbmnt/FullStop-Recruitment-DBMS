import { MongoClient } from "mongodb";
require("@dotenvx/dotenvx").config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

/**
 *
 * @returns An "&&" query for searching MongoDB
 */
const collectionQueryBuilder = ({ searchParams }) => {
  const query = {};
  const searchParamsDict = {
    name: searchParams.get("name"),
    email: searchParams.get("email"),
    field: searchParams.get("field"),
    jobTitle: searchParams.get("jobTitle"),
    skills: searchParams.get("skills"),
    status: searchParams.get("status"),
    yearsOfXp: searchParams.get("yearsOfXp"),
  };

  for (const param in searchParamsDict) {
    const paramValue = searchParamsDict[param];

    if (paramValue) {
      if (param === "skills") {
        // I will be using dashes as spaces and actual spaces(+) as separators for elements in the skills array
        //! Always use lowercase skills especially in the db
        const paramArr = paramValue
          .split(" ")
          .map((p) => p.toLowerCase().replace("-", " "));

        query[param] = {
          $in: paramArr,
        };
      } else {
        const regExp = new RegExp(paramValue, "i");

        query[param] = {
          $regex: regExp,
        };
      }
    }
  }

  return query;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, _context) => {
  try {
    const { searchParams } = new URL(request.url);
    const returnLimit = searchParams.get("limit");
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const findQuery = collectionQueryBuilder({ searchParams });
    const maxResults = await collection.countDocuments(findQuery);
    const results = await collection
      .find(findQuery)
      .sort("yearsOfXp", "desc")
      .limit(parseInt(returnLimit))
      .toArray();

    return new Response(
      JSON.stringify({
        statusCode: 200,
        body: results,
        maxLength: maxResults,
      })
    );
  } catch (e) {
    return { statusCode: 500, body: e.toString() };
  }
};
