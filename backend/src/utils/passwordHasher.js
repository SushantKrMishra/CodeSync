import bcrypt from "bcryptjs";
export const hashPassword = async (data) => {
  return await bcrypt.hash(data, 11);
};

export const comparePassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};
