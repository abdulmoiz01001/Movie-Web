const express = require("express")
const fs = require('fs');
const path = require('path');
const User = require("../models/User.schema")
const router = express.Router()
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const multer = require("multer")
const uploadOnCloudinary = require("../config/cloudinaryConfig")
const { generateToken, verifyToken } = require("../config/JWT")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'public/temp';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/auth/register', upload.single('profileImg'), async (req, res) => {
  const { email, password, name } = req.body
  const filePath = req.file.path;
if(!filePath){
res.status(400).json({error:"Profile image is required"})
}
  try {
    const ifUser = await User.find({email:email})
    if(ifUser.length==0){
      
    
    if (!filePath) {
      return res.status(400).json({ error: 'Profile image is required' });
    }
    const result = await uploadOnCloudinary(filePath);
    if (!result) {
      return res.status(500).json({ error: 'Failed to upload image' });
    }
    const profileImg = result.secure_url;
    const user = new User({
      name,
      profileImg,
      password,
      email
    });

    await user.save();

    // Attach the new user to the req object
    req.user = user;
    const generatedToken = generateToken(user._id)
    res.cookie('token', generatedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      token: generatedToken,
    });
  }
  else{
    res.status(404).json({
      Error:"user exits "
    });
  }
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
      console.log (email,password)
      console.log("body" ,  req.body)
      try {
          if (!email || !password) {
            return res.status(400).send('Email and password are required');
          }
      const user = await User.findOne({ email})
      if (!user) {
            return res.status(400).send('User not found');
          }
    const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
  return res.status(400).send('Invalid credentials');

}
          
    const token = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
    });
    res.json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  token: token,
              });
  }
    catch (error) {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  // 
  //   const user = await User.find({ email});
  //   console.log("user" , user)
  //   if (!user) {
  //     return res.status(400).send('User not found');
  //   }
  //   console.log("bycript" , await bcrypt.compare(password,user.password))
  //   const isMatch = await bcrypt.compare(password, user.password);
  //   // const isMatch = user.password === password
  //   if (!isMatch) {
  //       //   }
  //   const token = generateToken(user._id);
  
  //         res.cookie('token', token, {
  //             httpOnly: true,
  //             secure: process.env.NODE_ENV === 'production',
  //             maxAge: 3600000, // 1 hour
  //         });
  
  //         res.json({
  //             _id: user._id,
  //             name: user.name,
  //             email: user.email,
  //         });
  // } catch (error) {
  //   res.status(401).json({ message: 'Invalid email or password' });
  // }
})
router.post('/auth/logout',async(req,res)=>{
  const token = req.cookies.token;
  console.log("Token from API Route" + token);
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = verifyToken(token)
    console.log(decoded);
    if(decoded){
      res.cookie('token', null, { httpOnly: true, expires: new Date(0) }); // Set the expiration to a past date
    
    res.status(200).send('Logout successful');
    }
    else{
      return res.status(401).json({ error: 'noone logged in ' });

    }
  } catch (error) {
    res.status(404).json({message:"Error in logging out seems like noone is logged in "})
  }
})
router.get('/users',async(req,res)=>{
    const user = await User.find()
    res.status(200).json(user)
})
module.exports = router