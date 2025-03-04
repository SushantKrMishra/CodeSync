import { User } from "../models/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      users: users,
    });
  } catch (err) {
    //TODO: Logger Here why it failed
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
