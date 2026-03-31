import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import "dotenv/config";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password should be greater than 6" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "user already exist" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          process.env.CLIENT_URL,
        );
        console.log("Calling sendWelcomeEmail...");
      } catch (error) {
        console.error("failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalid credentials" });
    const isPassCorrect = await bcrypt.compare(password, user.password);
    if(!isPassCorrect) return res.status(400).json({ message: "password incorrect" })
    
    generateToken(user._id,res)
    res.status(200).json({
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      profilePic:user.profilePic
    })


  } 
  catch (error) {
    console.log("error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout=(_,res)=>{
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({message:"logged out successfully"})
}

export const updateProfile=async(req,res,next)=>{
  try {
    const {profilePic}=req.body
    if(!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId=req.user._id

    const uploadRes=await cloudinary.uploader.upload(profilePic)

    const updatedUSer=await User.findByIdAndUpdate(userId,{profilePic:uploadRes.secure_url},{new:true})

    res.status(200).json(updatedUSer)

  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
