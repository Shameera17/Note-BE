import bcrypt from "bcrypt";
import User from "../models/user";

export const isEmailAvail = async (email: string) => {
  const flag = await User.findOne({ email: email })
    .then(() => true)
    .catch(() => false);
  return flag;
};
export const isUsernameExist = async (userName: string) => {
  const flag = await User.findOne({ userName: userName })
    .then((user) => user)
    .catch(() => false);
  return flag;
};

export const securePassword = (
  plainText: string,
  salt: string,
  finalFunc: (hash: string | undefined, error?: string) => void
) => {
  bcrypt
    .hash(plainText + salt, 10)
    .then((hash) => {
      finalFunc(hash);
    })
    .catch((error) => finalFunc(undefined, error));
};
