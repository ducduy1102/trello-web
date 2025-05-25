import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { env } from "~/config/environment";
/**
 * References
 *https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
 */

// Config cloudinary, user v2 version 2
const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Initialize function to upload file to Cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Create a stream to upload to cloudinary
    const stream = cloudinaryV2.uploader.upload_stream(
      { folder: folderName },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    // Upload the above stream using lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const CloudinaryProvider = { streamUpload };
