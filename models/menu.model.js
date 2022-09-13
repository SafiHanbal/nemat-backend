const mongoose = require('mongoose');
const slugify = require('slugify');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for menu item!'],
    unique: [true, 'A menu item should have a unique name!'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a short description about menu item!'],
    trim: true,
  },
  slug: String,
  price: {
    type: Number,
    required: [true, 'Please provide a price for menu item!'],
  },
  servings: {
    type: Number,
    validate: {
      validator: function (value) {
        return `${value}`.split('.')[1] ? false : true;
      },
      message: 'Servings should not be a decimal!',
    },
    default: 1,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image for menu item!'],
  },
  category: {
    type: String,
    enum: {
      values: ['starter', 'main-course', 'bread', 'rice', 'sides', 'desert'],
      message:
        'Please specify menu item as starter, main-course, bread, rice, sides or desert!',
    },
    required: [true, 'Please provide a category for menu item!'],
  },
  isNonVeg: {
    type: Boolean,
    required: [true, 'Please specify is menu item is non-vegetarian!'],
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Ratings average can not be less than 1!'],
    max: [5, 'Ratings average can not be more than 5!'],
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
});

menuSchema.pre('save', function (next) {
  this.slug = slugify(this.name.toLowerCase());
  next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
