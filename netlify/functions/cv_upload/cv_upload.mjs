import { MongoClient } from "mongodb";
// const multiparty = require("multiparty");
const fs = require("fs");
require("@dotenvx/dotenvx").config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

/**
 * Parse multipart form data from the request
 */
// const parseMultipartForm = (event) => {
//   return new Promise((resolve, reject) => {
//     const form = new multiparty.Form();

//     // Convert base64 body to buffer for multipart parsing
//     const body = event.isBase64Encoded
//       ? Buffer.from(event.body, "base64")
//       : Buffer.from(event.body);

//     // Extract boundary from content-type header
//     const contentType =
//       event.headers["content-type"] || event.headers["Content-Type"];
//     const boundary = contentType.split("boundary=")[1];

//     if (!boundary) {
//       reject(new Error("No boundary found in content-type header"));
//       return;
//     }

//     // Create a mock request object for multiparty
//     const mockRequest = {
//       headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
//       body: body,
//       on: (event, callback) => {
//         if (event === "data") {
//           callback(body);
//         } else if (event === "end") {
//           callback();
//         }
//       },
//     };

//     form.parse(mockRequest, (err, fields, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve({ fields, files });
//       }
//     });
//   });
// };

// /**
//  * Process uploaded file and return file information
//  */
// const processFile = async (file) => {
//   try {
//     const fileContent = fs.readFileSync(file.path);
//     const fileName = file.originalFilename;
//     const fileSize = Math.round(file.size / 1024); // Size in KB
//     const fileType = file.headers["content-type"];

//     // Generate unique filename
//     const timestamp = Date.now();
//     const uniqueFileName = `${timestamp}_${fileName}`;

//     // Here you would upload to cloud storage (AWS S3, Cloudinary, etc.)
//     // For now, we'll just return the file info

//     // Clean up temporary file
//     fs.unlinkSync(file.path);

//     return {
//       fileName: fileName,
//       uniqueFileName: uniqueFileName,
//       fileSize: fileSize,
//       fileType: fileType,
//       uploadedAt: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("Error processing file:", error);
//     throw new Error("Failed to process uploaded file");
//   }
// };

// /**
//  * Generate unique ID for CV submission
//  */
// const generateId = () => {
//   return Date.now().toString(36) + Math.random().toString(36).substr(2);
// };

/**
 * Validate file type
 */
const validateFileType = (contentType) => {
  const allowedTypes = ["application/pdf"];

  return allowedTypes.includes(contentType);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, _context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  try {
    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response("", {
        status: 200,
        headers,
      });
    }

    // Only allow POST requests
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

    // Parse the request body as form data
    const formData = await request.formData();
    console.warn(formData)

    // Extract form fields
    // const cvType = formData.get("cvType") || "";
    // const previousJobReasons = formData.get("previousJobReasons") || "";
    // const cvFile = formData.get("cvFile");

    // // Validate required fields
    // if (!cvType || !previousJobReasons) {
    //   return new Response(
    //     JSON.stringify({
    //       statusCode: 400,
    //       error:
    //         "Missing required fields: cvType and previousJobReasons are required",
    //     }),
    //     {
    //       status: 400,
    //       headers,
    //     }
    //   );
    // }

    // // Process file if uploaded
    // let fileInfo = null;
    // if (cvFile && cvFile.size > 0) {
    //   // Validate file type
    //   if (!validateFileType(cvFile.type)) {
    //     return new Response(
    //       JSON.stringify({
    //         statusCode: 400,
    //         error:
    //           "Invalid file type. Please upload PDF or Word documents only.",
    //       }),
    //       {
    //         status: 400,
    //         headers,
    //       }
    //     );
    //   }

    //   // Process file info
    //   fileInfo = {
    //     fileName: cvFile.name,
    //     fileSize: Math.round(cvFile.size / 1024), // Size in KB
    //     fileType: cvFile.type,
    //     uploadedAt: new Date().toISOString(),
    //   };

    //   // Here you would upload the file to cloud storage
    //   // const fileBuffer = await cvFile.arrayBuffer();
    //   // const uploadResult = await uploadToCloudStorage(fileBuffer, cvFile.name, cvFile.type);
    //   // fileInfo.cloudUrl = uploadResult.url;
    // }

    // // Create CV submission document
    // const cvSubmission = {
    //   id: generateId(),
    //   cvType,
    //   previousJobReasons,
    //   fileInfo,
    //   createdAt: new Date().toISOString(),
    //   status: "completed",
    //   submittedAt: new Date(),
    // };

    // // Save to MongoDB
    // const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    // const collection = database.collection(
    //   process.env.MONGODB_CV_COLLECTION || "cv_submissions"
    // );

    // const insertResult = await collection.insertOne(cvSubmission);

    // if (!insertResult.acknowledged) {
    //   throw new Error("Failed to save CV submission to database");
    // }

    return new Response(
      JSON.stringify({
        statusCode: 200,
        success: true
      }),
      // JSON.stringify({
      //   statusCode: 200,
      //   success: true,
      //   message: "CV submitted successfully",
      //   body: {
      //     id: cvSubmission.id,
      //     cvType: cvSubmission.cvType,
      //     createdAt: cvSubmission.createdAt,
      //     fileName: fileInfo?.fileName || null,
      //     fileSize: fileInfo?.fileSize || null,
      //     insertedId: insertResult.insertedId,
      //   },
      // }),
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
  }
};
