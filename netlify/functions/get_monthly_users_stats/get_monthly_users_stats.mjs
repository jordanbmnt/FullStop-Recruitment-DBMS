import { MongoClient } from "mongodb";

const today = new Date();
const sixMonthsAgo = new Date(today);
sixMonthsAgo.setMonth(today.getMonth() - 6);

const MONTHLY_USERS_AGG = [
  {
    $match: {
      lastUpdated: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    },
  },
  {
    $project: {
      email: 1,
      yearMonth: {
        $dateToString: {
          format: "%Y-%m",
          date: "$lastUpdated", // Direct use of the date field
        },
      },
    },
  },
  {
    $group: {
      _id: {
        month: "$yearMonth",
        email: "$email",
      },
    },
  },
  {
    $group: {
      _id: "$_id.month",
      uniqueEmailCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
];

const processMonthlyData = (data) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const dataMap = new Map();
  data.forEach((item) => {
    dataMap.set(item._id, item.uniqueEmailCount);
  });

  const result = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const monthId = `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}`;

    const count = dataMap.get(monthId) || 0;

    result.push({
      x: {
        month: targetMonth + 1,
      },
      y: count,
    });
  }

  return result;
};

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, _context) => {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.aggregate(MONTHLY_USERS_AGG).toArray();

    return new Response(
      JSON.stringify({
        statusCode: 200,
        body: processMonthlyData(results),
      })
    );
  } catch (e) {
    return { statusCode: 500, body: e.toString() };
  }
};
