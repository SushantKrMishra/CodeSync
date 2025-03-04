import validator from "validator";

export const validateSignupData = (data) => {
  const { firstName, lastName, emailId, password } = data;
  if (!firstName || !emailId || !password) {
    return false;
  }
  //We are dependent over the Schema Validators
  return true;
};

export const validateLoginData = (data) => {
  const { emailId, password } = data;
  if (!emailId || !password) {
    return false;
  }
  return validator.isEmail(emailId);
};
