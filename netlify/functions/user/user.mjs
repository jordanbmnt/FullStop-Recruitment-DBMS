import { ObjectId } from "mongodb";
import { clientPromise } from "../db_client/db_client.mjs";

const mongoose = require("mongoose");

const validateFileType = (contentType) => {
  const allowedTypes = ["application/pdf"];
  return allowedTypes.includes(contentType);
};

const uploadDocument = async (mongoose, headers, uploadedFileId, cvFile) => {
  const conn = await mongoose.connect(process.env.MONGODB_CV_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.connection.db;
  const gfs = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads",
  });

  if (!cvFile) {
    return new Response(
      JSON.stringify({
        statusCode: 400,
        error: "No file uploaded.",
      }),
      {
        status: 400,
        headers,
      }
    );
  }

  if (!validateFileType(cvFile.type)) {
    return new Response(
      JSON.stringify({
        statusCode: 400,
        error: "Invalid file type. Please upload PDF documents only.",
      }),
      {
        status: 400,
        headers,
      }
    );
  }

  const fileBuffer = Buffer.from(await cvFile.arrayBuffer());

  const writestream = gfs.openUploadStream(cvFile.name, {
    chunkSizeBytes: 1024 * 256,
    metadata: {
      contentType: cvFile.type,
    },
  });

  uploadedFileId = writestream.id.toString();
  console.log("File uploaded to GridFS with ID:", uploadedFileId);

  await new Promise((resolve, reject) => {
    writestream.end(fileBuffer, (err) => {
      if (err) {
        console.error("Error writing file to GridFS:", err);
        return reject(err);
      }
      resolve();
    });
  });

  console.warn("File uploaded to GridFS successfully.");
};

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
  let uploadedFileId;

  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  try {
    if (request.method === "OPTIONS") {
      return new Response("", {
        status: 200,
        headers,
      });
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const cvFile = formData.get("cvFile");
      const cvType = formData.get("cvType") || "";
      const previousJobReasons = formData.get("previousJobReasons") || "";

      uploadDocument(mongoose, headers, uploadedFileId, cvFile);

      // ---------------------------- Upload Form Data ----------------------------

      if (!cvType || !previousJobReasons) {
        return new Response(
          JSON.stringify({
            statusCode: 400,
            error:
              "Missing required fields: cvType and previousJobReasons are required",
          }),
          {
            status: 400,
            headers,
          }
        );
      }

      let fileInfo = {
        gridFsId: new ObjectId(uploadedFileId),
        fileName: cvFile.name,
        fileSize: Math.round(cvFile.size / 1024),
        fileType: cvFile.type,
        uploadedAt: new Date(),
      };

      // Create CV submission document
      const cvSubmission = {
        email: formData.get("email"),
        status: formData.get("status"),
        field: formData.get("field"),
        jobTitle: formData.get("jobTitle"),
        yearsOfXp: parseInt(formData.get("yearsOfXp")),
        skills: JSON.parse(formData.get("skills")),
        summary: formData.get("summary"),
        name: formData.get("name"),
        coverLetter: formData.get("coverLetter"),
        cvType,
        previousJobReasons,
        fileInfo,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
      const collection = database.collection(
        process.env.MONGODB_COLLECTION || "fullstop-db-users"
      );

      const insertResult = await collection.insertOne(cvSubmission);

      if (!insertResult.acknowledged) {
        throw new Error("Failed to save CV submission to database");
      }

      return new Response(
        JSON.stringify({
          statusCode: 200,
          success: true,
          message: "CV submitted successfully and file uploaded to GridFS!",
          body: {
            id: cvSubmission.id,
            cvType: cvSubmission.cvType,
            createdAt: cvSubmission.createdAt,
            fileName: fileInfo?.fileName || null,
            fileSize: fileInfo?.fileSize || null,
            gridFsId: fileInfo?.gridFsId || null,
            insertedId: insertResult.insertedId,
          },
        }),
        {
          status: 200,
          headers,
        }
      );
    } else if (request.method === "GET") {
      const { searchParams } = new URL(request.url);
      const database = (await clientPromise).db(
        process.env.MONGODB_CV_DATABASE
      );
      const metaData = await collectionQueryCall(
        database,
        searchParams,
        "meta"
      );
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
          success: true,
          message: "Successfully retrieved user data",
          body: results,
        }),
        {
          status: 200,
          headers,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          statusCode: 405,
          error: "Method not allowed",
        }),
        {
          status: 405,
          headers,
        }
      );
    }
  } catch (error) {
    console.error("Error processing user:", error);

    return new Response(
      JSON.stringify({
        statusCode: 500,
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers,
      }
    );
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("MongoDB connection disconnected.");
    }
  }
};
