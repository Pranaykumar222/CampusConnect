import mongoose from "mongoose";


const lookingForSchema = new mongoose.Schema({
  role: { type: String, required: true },
  slots: { type: Number, required: true },

  applicants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],

  accepted: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
});



const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    category: { type: String, required: true },

    description: String,

    techStacks: [{ type: String }],

    lookingFor: [lookingForSchema],

    status: {
      type: String,
      enum: ["Planning", "Active", "Completed"],
      default: "Planning",
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contributors: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],

    stars: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],

    bookmarkedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
  },
  { timestamps: true }
);


projectSchema.virtual("starsCount").get(function () {
  return this.stars?.length || 0;
});

projectSchema.virtual("membersCount").get(function () {
  return this.contributors?.length || 0;
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

export default mongoose.model("Project", projectSchema);
