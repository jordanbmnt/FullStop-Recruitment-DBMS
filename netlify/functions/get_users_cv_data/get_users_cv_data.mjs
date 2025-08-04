import { clientPromise } from "../db_client/db_client.mjs";
import { ObjectId } from "mongodb";

/**
 *
 * @returns An "&&" query for searching MongoDB
 */
const collectionQueryBuilder = ({ searchParams, uploadsType }) => {
  const userId = searchParams.get("user_id");

  if (uploadsType === "meta") {
    return { _id: new ObjectId(userId) };
  } else if (uploadsType === "binary") {
    return { files_id: new ObjectId(userId) };
  } else {
    return {};
  }
};

const collectionQueryCall = async (database, searchParams, type) => {
  try {
    const collection =
      type === "meta"
        ? process.env.MONGODB_CV_META_COLLECTION
        : process.env.MONGODB_CV_BIN_COLLECTION;
    const dbCollection = database.collection(collection);
    const metaDataQuery = collectionQueryBuilder({
      searchParams,
      uploadsType: type,
    });
    const results = await dbCollection.find(metaDataQuery).toArray();

    return {
      [type]: results,
      code: 200,
    };
  } catch (e) {
    console.warn("Issue with getting user CV data.", e.toString());
    return {
      [type]: [],
      message: "Issue with getting user CV data, please check logs.",
      code: 500,
    };
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, _context) => {
  try {
    console.warn(1);
    const { searchParams } = new URL(request.url);
    const database = (await clientPromise).db(process.env.MONGODB_CV_DATABASE);
    const metaData = await collectionQueryCall(database, searchParams, "meta");
    const binaryData = await collectionQueryCall(
      database,
      searchParams,
      "binary"
    );
    const results = [{ ...metaData, ...binaryData }];

    //! ERROR: MongoServerError: Expected 'find' to be string, but got <nil> instead. Doc = [{find <nil>} {filter [{_id ObjectID("687514c7ef891ba5e3fef44a")}]} {lsid [{id {4 [139 97 100 197 17 208 75 30 184 65 148 73 124 216 184 142]}}]} {$clusterTime [{clusterTime {1753824511 1}} {signature [{hash {0 [132 67 215 0 185 235 79 216 39 163 123 89 219 243 30 249 63 141 188 19]}} {keyId 7481352916712816647}]}]} {$db cv_data}]
    //TODO: Testing getting meta data

    return new Response(
      JSON.stringify({
        statusCode: 200,
        body: results,
      })
    );
  } catch (e) {
    console.warn(e.toString());
    return { statusCode: 500, body: e.toString() };
  }
};
