import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import e from 'express';

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) { // allow
      cb(new Error('Only .jpg, .jpeg, .png files are allowed!'), false);
    } else {
      cb(null, true);
    }
  }
});

export async function uploadToCloudinary(files, folder = 'book-store') {
  const uploadedUrls = [];
  for (const file of files) {
    const result = await new Promise(async (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
          folder
        },
        (error, result) => {
        if (error) reject(error);
        else resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    uploadedUrls.push(result.secure_url);
  }
  return uploadedUrls;
}
function extractPublicIdFromUrl(url){
  try {
    const paths = url.split('/');
    const fileWithExt = paths.slice(paths.indexOf('upload') + 2).join("/"); //book-store/dmm.png
    return fileWithExt.replace(/\.[^/.]+$/, "");
  }catch(err){
    console.error(err);
    return null;
  }
}
export async function deleteImageIntoCloudinary(paths) {
  try {
    for (const url of paths) {
      const publicId = extractPublicIdFromUrl(url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId)
        console.log(`Deleted: ${publicId}` );
      }
    }
  }catch(err){
    console.error(err.message);
  }
}

