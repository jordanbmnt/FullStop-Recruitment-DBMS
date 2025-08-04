import { clientPromise } from "../db_client/db_client.mjs";

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
    skills: searchParams.get("skills"),
    status: searchParams.get("status"),
    minExperience: searchParams.get("minExperience"),
    maxExperience: searchParams.get("maxExperience"),
  };

  for (const param in searchParamsDict) {
    const paramValue = searchParamsDict[param];

    if (paramValue) {
      if (param === "skills") {
        const paramArr = paramValue
          .split(" ")
          .map((p) => p.toLowerCase().replace("-", " "));

        query[param] = {
          $in: paramArr,
        };
      } else if (param === "minExperience" || param === "maxExperience") {
        if (!query.yearsOfXp) {
          query.yearsOfXp = {};
        }

        if (param === "minExperience") {
          query.yearsOfXp.$gte = parseInt(paramValue);
        } else {
          query.yearsOfXp.$lte = parseInt(paramValue);
        }
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
