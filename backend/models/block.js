const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  index: { type: Number, required: true },
  previousHash: { type: String, required: true },
  timestamp: { type: Number, required: true },
  data: { type: String, required: false, default: "" },
  hash: { type: String, required: true },
  nonce: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Block", postSchema);
