import mongoose from "mongoose";

export default mongoose.model(
  "members",
  new mongoose.Schema({
    entity_id: { type: String, required: true },
    username: { type: String, required: true },
  })
);
