import { Request, Response } from "express";
import User from "../models/user";
import {
  isEmailAvail,
  isUsernameExist,
  securePassword,
} from "../services/auth";
const { v4: uuidv4 } = require("uuid");

const isUsername = (req: Request, res: Response) => {
  isUsernameExist(req.body.userName).then((flag) => {
    if (flag) {
      return res.status(400).json({
        message: "Username already exists!",
      });
    }
  });
};

const saveUser = (req: Request, res: Response) => {
  const { email, password, username, firstName, lastName } = req.body;

  if (!email)
    return res.status(400).json({
      message: "Invalid Email",
    });

  isEmailAvail(email).then((data) => {
    if (data) {
      return res.status(400).json({
        message: "User with similar email exists!",
      });
    } else {
      const salt = uuidv4();
      securePassword(
        password,
        salt,
        (hashed: string | undefined, error?: string) => {
          if (hashed) {
            const newUser = new User({
              username,
              firstName,
              lastName,
              email: email,
              salt: salt, // store the salt value in a separate field of the user document
              encrypted_password: hashed, // store the hash in the password field of the user document
            });
            newUser
              .save()
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Account creation successfull!" })
              )
              .catch((err) =>
                res
                  .status(400)
                  .json({ message: "Account creation failed! " + error })
              );
          } else {
          }
        }
      );
    }
  });
};

const signIn = (req: Request, res: Response) => {
  const { userName, plainText } = req.body;
  if (!userName)
    return res.status(400).json({
      message: "Invalid Username",
    });
  if (!plainText)
    return res.status(400).json({
      message: "Invalid Password",
    });

  isUsernameExist(userName).then((flag) => {
    if (!flag) {
      return res.status(400).json({
        message: "Username does not exists!",
      });
    } else if (flag instanceof User) {
      const UserData = flag;
      const password = UserData.encrypted_password;

      securePassword(plainText, UserData.salt, (hashed) => {
        if (hashed === password) {
          return res.status(200).json({
            message: "User granted access",
          });
        }
      });
    }
  });
};
export { saveUser, isUsername, signIn };
