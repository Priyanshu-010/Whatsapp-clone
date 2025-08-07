import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, required: true },
    msg_id: { type: String, required: true, unique: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String },
    timestamp: { type: Date, required: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    user_name: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
