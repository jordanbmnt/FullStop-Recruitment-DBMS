import { MongoClient } from "mongodb";
require("@dotenvx/dotenvx").config();

const TOP_SKILLS_AGG = [
  {
    $match: {
      skills: { $exists: true, $ne: [] }, // Only users with skills
    },
  },
  {
    $unwind: "$skills", // Flatten the skills array
  },
  {
    $group: {
      _id: "$skills", // Group by skill name
      count: { $sum: 1 }, // Count occurrences
      users: { $addToSet: "$email" }, // Optional: collect unique users with this skill
    },
  },
  {
    $project: {
      skill: "$_id",
      count: 1,
      userCount: { $size: "$users" }, // Number of unique users with this skill
      _id: 0,
    },
  },
  {
    $sort: { count: -1 }, // Sort by frequency (highest first)
  },
  {
    $limit: 15, // Top 15 skills
  },
];

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, _context) => {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.aggregate(TOP_SKILLS_AGG).toArray();

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
