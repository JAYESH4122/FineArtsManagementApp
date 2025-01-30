const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model('AdminDetails', AdminSchema);
module.exports = Admin;
