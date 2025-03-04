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

export const validateProfileUpdateData = (data) => {
  const allowedEditFeilds = ["age", "gender", "about", "firstName", "lastName"];
  const isEditAllowed = Object.keys(data).every((item) =>
    allowedEditFeilds.includes(item)
  );
  //Rest Validaion will be taken care by Schema as User.save() triggers schema validation
  return isEditAllowed;
};
