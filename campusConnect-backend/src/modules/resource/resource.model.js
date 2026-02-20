import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { _id: false }
);


const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Notes", "Video", "PDF", "Link"],
    },

    description: {
      type: String,
    },

    category: {
      type: String,
    },

    externalLink: {
      type: String,
    },

    fileUrl: {
      type: String,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    downloads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    ratings: [ratingSchema],
  },
  {
    timestamps: true,
  }
);


resourceSchema.virtual("averageRating").get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;

  const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
  return Number((sum / this.ratings.length).toFixed(1));
});


resourceSchema.virtual("viewsCount").get(function () {
  return this.views?.length || 0;
});


resourceSchema.virtual("downloadsCount").get(function () {
  return this.downloads?.length || 0;
});


resourceSchema.virtual("ratingsCount").get(function () {
  return this.ratings?.length || 0;
});

resourceSchema.set("toJSON", { virtuals: true });
resourceSchema.set("toObject", { virtuals: true });

export default mongoose.model("Resource", resourceSchema);
