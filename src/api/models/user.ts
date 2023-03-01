import { model, Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema: Schema = new Schema<IUser>({
  username: {
    required: true,
    type: String,
  },
  encrypted_password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  firstName: String,
  lastName: String,
});

UserSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

const User = model<IUser>("User", UserSchema);
export default User;
