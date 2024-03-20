const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ErrorSchema = new Schema(
  {
    uid: {
      type: String,
      required: false,
    },
    error: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Error = mongoose.model("Error", ErrorSchema);

module.exports = Error;
