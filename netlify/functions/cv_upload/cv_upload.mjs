import { MongoClient, ObjectId } from "mongodb";
const mongoose = require("mongoose");
// require("@dotenvx/dotenvx").config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const validateFileType = (contentType) => {
  const allowedTypes = ["application/pdf"];
  return allowedTypes.includes(contentType);
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

    if (request.method !== "POST") {
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

    // ---------------------------- Upload Document ----------------------------

    const conn = await mongoose.connect(process.env.MONGODB_CV_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = conn.connection.db;
    const gfs = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const formData = await request.formData();

    const cvFile = formData.get("cvFile");

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

    // ---------------------------- Upload Form Data ----------------------------

    const cvType = formData.get("cvType") || "";
    const previousJobReasons = formData.get("previousJobReasons") || "";

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
  } catch (error) {
    console.error("Error processing CV submission:", error);

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
