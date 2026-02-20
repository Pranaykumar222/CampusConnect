import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    university: {
      type: String,
      trim: true
    },

    major: {
      type: String,
      trim: true
    },

    academicYear: {
      type: String,
      enum: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]
    },

    location: {
      type: String,
      trim: true
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },

    bio: {
      type: String,
      maxlength: 500
    },

    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User"
    },
    
    bannerImage: {
      type: String,
      default: ""
    },

    profileCompleted: {
      type: Boolean,
      default: false
    },
    
    skills: {
      type: [String],
      default: []
    },

    interests: {
      type: [String],
      default: []
    },

    socialLinks: {
      website: String,
      github: String,
      linkedin: String,
      twitter: String
    },

    isPrivate: {
      type: Boolean,
      default: false
    },

  lastActive: { 
    type: Date, 
    default: Date.now 
  },
  
  isOnline: {
    type: Boolean,
    default: false
  },

  lastSeen: {
    type: Date
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  isBanned: {
    type: Boolean,
    default: false,
  }
  
  

  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (this.authProvider !== "local") return false;
  return bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);


export default User;
