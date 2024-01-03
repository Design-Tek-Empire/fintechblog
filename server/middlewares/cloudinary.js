const fileSystem = require("fs");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const axios = require("axios");

// cloudinary confifuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true,
});

// configuration Options and Storage folder
const options = {
  resource_type: "auto",
  folder: "fintechblog",
};


// Compress Image with Sharp and Send to Cloudinary
// This function handles single image upload
exports.compressImg = async (req, res, next) => {
  try {
  
    if (req.files) {
      // Check for internet connection
      const isOnline = await checkInternetConnection();

      if (!isOnline) {
        // delete the file from tmp folder
        fileSystem.unlink(req.files.image.tempFilePath, (err) => {
          if (err) throw err;
        });
        req.flash("error_msg", "Internet is required to Upload Image");
        return res.redirect("/posts/create");
      }

      const imageFile = fileSystem.readFileSync(req.files.image.tempFilePath);

      // Extract the actual file name
      const fileName = req.files.image.name.replace(/\..+$/, "");

      // Rename the file
      const newFileName = `new-${fileName}-${Date.now()}.jpeg`;
      //  Resive the image with sharp
      await sharp(imageFile)
        .resize({
          fit: sharp.fit.contain,
          width: 800,
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/${newFileName}`);

      // Upload to cloudinary and await results
      const result = await cloudinary.uploader.upload(
        `uploads/${newFileName}`,
        options
      );
      //  Attach Image Url to req.body
      req.body.image = result.secure_url;

      // delete the file from tmp folder
      fileSystem.unlink(req.files.image.tempFilePath, (err) => {
        if (err) throw err;
      });
      // Delete the Image from the uploads folder
      fileSystem.unlink(`uploads/${newFileName}`, (err) => {
        if (err) throw err;
      });
    }

    next();
  } catch (err) {
    console.log(err)
  }
};


// Function to check internet connection
async function checkInternetConnection() {
  try {
    // Make a small HTTP request to a known server
    await axios.get('https://www.google.com', { timeout: 3000 });
    return true; // If the request is successful, assume there is an internet connection
  } catch (error) {
    return false; // If there is an error, assume there is no internet connection
  }
}