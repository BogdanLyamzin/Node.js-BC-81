import {Schema, model} from "mongoose";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  category: {
    type: String,
    enum: ["family", "friends", "work", "other"],
    default: "other"
  }
});

const Contact = model("Contact", contactSchema);
// Category => categories
// Mouse => mice

export default Contact;
