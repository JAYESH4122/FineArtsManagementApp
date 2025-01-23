const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password with hashed password
AdminSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('AdminDetails', AdminSchema);
module.exports = Admin;
