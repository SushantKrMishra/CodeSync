import { User } from "../models/user.js";

export const createUser = async (req, res) => {
  try {
    //TODO: Need to rework
    //Current status - manual data is sent properly
    const userObj = {
      firstName: "Sushant",
      lastName: "Mishra",
      age: 24,
      emailId: "sushant@test.com",
      password: "Sushant123",
    };
    const user = new User(userObj);
    await user.save();
    res.status(201).json({
      message: "User Data added Successfully",
    });
  } catch (err) {
    //TODO: Logger here
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
