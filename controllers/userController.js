const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();
const uploadFileToCloudinary = require("../config/uploadFileToCloudinary");


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
    
}

exports.registerUser = async (req, res) => {
    try {
        const {name, email, password, address, bio} = req.body;

        // Check if file was uploaded
        let profilePicture = "";
        

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Invalid email"});
        }
        if(!validator.isStrongPassword(password)){
            return res.status(400).json({message: "Password is not strong enough"});
        }
        const existingEmail = await userModel.findOne({email});
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"});
        }
        if (req.files && req.files.image) {
            const file = req.files.image;
            try {
                const response = await uploadFileToCloudinary(file, "profilePicture");
                profilePicture = response.secure_url;
            } catch (uploadError) {
                return res.status(400).json({ message: "Error uploading profile picture" });
            }
        }

        const user = await userModel.create({
            name,
            email,
            password,
            address,
            bio,
            profilePicture
        });
        const token = createToken(user._id);
        res.status(201).json({user, token});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Find user and check password
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token and send response
        const token = createToken(user._id);
        res.status(200).json({ user: user.toPublicJSON(), token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id; 
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: user.toPublicJSON() });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = {};

        // Handle text fields
        if (req.body.name) {
            if (req.body.name.length < 2) {
                return res.status(400).json({ message: "Name must be at least 2 characters long" });
            }
            updateData.name = req.body.name;
        }

        if (req.body.address !== undefined) {
            updateData.address = req.body.address;
        }

        if (req.body.bio !== undefined) {
            if (req.body.bio.length > 500) {
                return res.status(400).json({ message: "Bio cannot exceed 500 characters" });
            }
            updateData.bio = req.body.bio;
        }

        // Handle file upload
        if (req.files && req.files.image) {
            try {
                const file = req.files.image;
                const response = await uploadFileToCloudinary(file, "profilePicture");
                updateData.profilePicture = response.secure_url;
            } catch (uploadError) {
                return res.status(400).json({ message: "Error uploading profile picture" });
            }
        }

        // Only proceed with update if there are fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser.toPublicJSON()
        });

    } catch (error) {
        console.error("Update profile error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// Optional: Password update function
exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }

        // Validate password strength
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ message: "New password is not strong enough" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isValidPassword = await user.comparePassword(currentPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

