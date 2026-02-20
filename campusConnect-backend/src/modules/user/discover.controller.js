import User from "./user.model.js";

export const discoverUsers = async (req, res) => {
  try {
    const {
      search,
      skill,
      institute,
      trending,
      recommended,
      page = 1,
      limit = 10,
    } = req.query;

    const currentUser = req.user;

   
    let query = { _id: { $ne: currentUser._id } };


    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }


    if (skill) {
      query.skills = { $in: [skill] };
    }

    if (institute) {
      query.university = institute;
    }

    let users;


    if (trending === "true") {
      users = await User.find({ _id: { $ne: currentUser._id } })
        .sort({ lastActive: -1 }) 
        .limit(10)
        .select("-password");
    }


    else if (recommended === "true") {
      const allUsers = await User.find({
        _id: { $ne: currentUser._id },
      }).select("-password");

      const currentSkills = currentUser.skills || [];

      users = allUsers
        .map((user) => {
          const skillsOverlap = user.skills
            ? user.skills.filter((s) => currentSkills.includes(s)).length
            : 0;

          const universityMatch =
            user.university === currentUser.university ? 1 : 0;

          const score = skillsOverlap + universityMatch;

          return { ...user.toObject(), score };
        })
        .filter((u) => u.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }


    else {
      const skip = (page - 1) * limit;

      users = await User.find(query)
        .skip(skip)
        .limit(Number(limit))
        .select("-password");
    }

    res.status(200).json({ success: true, users });

  } catch (error) {
    console.error("Discover Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
