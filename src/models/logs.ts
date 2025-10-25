// models/Log.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  username: string;
  change: string;
  createdAt: Date;
  expiresAt?: Date;
}

const LogSchema: Schema = new Schema<ILog>({
  username: { type: String, required: true },
  change: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, expires: 0 }, // TTL index - document expires at this time
});

const Logg = mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);
export default Logg;

// const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// export default User;
