const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name!'],
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
      required: [true, 'Please provide your mobile number!'],
      unique: [true, 'You already have an account. Please login!'],
      min: [1000000000, 'Please provide a valid contact number!'],
      max: [9999999999, 'Please provide a valid contact number!'],
    },
    address: {
      house: {
        type: String,
        required: [true, 'Please provide your house location details!'],
      },
      area: {
        type: String,
        required: [true, 'Please provide your area!'],
      },
      city: {
        type: String,
        required: [true, 'Please provide your city!'],
      },
      pinCode: {
        type: Number,
        required: [true, 'Please provide a pincode!'],
        min: [100000, 'Please provide a valide pincode!'],
        max: [999999, 'Please provide a valid pincode!'],
      },
    },
    password: {
      type: String,
      required: [true, 'Please enter password!'],
      min: [8, 'Password should be atleast 8 characters!'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm password!'],
      validate: {
        message: 'Password do not match!',
        validator: function (value) {
          return value === this.password;
        },
      },
    },
    role: {
      type: String,
      defalut: 'user',
      enum: ['admin', 'staff', 'user'],
    },
    photo: {
      type: String,
      default: 'photo.jpg',
    },
    changedPasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified || this.isNew) return next();

  this.changedPasswordAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createOTP = function () {
  const OTP = `${Math.round(Math.random() * 1000000)}`;
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(OTP)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return OTP;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
