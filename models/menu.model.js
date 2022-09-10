const mongoose = require('mongoose');

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
  },
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
      message: 'Servings should not be decimal!',
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
      values: ['starter', 'main-course', 'desert'],
      message: 'Please specify menu item as starter, main-course or desert!',
    },
    required: [true, 'Please provide a category for menu item!'],
  },
  isNonVeg: {
    type: Boolean,
    required: [true, 'Please specify is menu item is non-vegetarian!'],
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

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
