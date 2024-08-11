// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require('cloudinary').v2
const fs = require('fs')
// import fs from 'fs'
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dobcljwkq',
  api_key: '739649368583556',
  api_secret: 'I-xAZuCfViV57oanjTLZXFri8jg'
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) return null 
          
      const response = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'})
      console.log("file is uploaded on cloudinary " , response.url);
      fs.unlinkSync(localFilePath);
      return response
  } catch (error) {
      fs.unlinkSync(localFilePath);
      return null
  }
}

// export default {uploadOnCloudinary}
module.exports=uploadOnCloudinary