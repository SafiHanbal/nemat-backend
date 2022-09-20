const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Menu = require('../../models/menu.model');
const User = require('../../models/user.model');
const Review = require('../../models/review.model');
const Order = require('../../models/order.model');

dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to DB!'))
  .catch((err) => console.log(err.message));

const importDataToDB = async () => {
  try {
    const menuData = JSON.parse(
      fs.readFileSync('./dev-data/data/menu.json', {
        encoding: 'utf-8',
      })
    );

    const userData = JSON.parse(
      fs.readFileSync('./dev-data/data/user.json', {
        encoding: 'utf-8',
      })
    );

    const orderData = JSON.parse(
      fs.readFileSync('./dev-data/data/order.json', {
        encoding: 'utf-8',
      })
    );

    const menu = await Menu.create(menuData);
    const user = await User.create(userData, { validateBeforeSave: false });
    const order = await Order.create(orderData);

    if (menu) console.log('Menu data imported successfully!');
    if (user) console.log('User data imported successfully!');
    if (order) console.log('Order data imported successfully!');
  } catch (err) {
    console.log(err.message, err);
  }
  process.exit();
};

const deleteDataFromDB = async () => {
  try {
    await Menu.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('Menu data deleted successfully!');
    console.log('User data deleted successfully!');
    console.log('Order data deleted successfully!');
    console.log('Review data deleted successfully!');
  } catch (err) {
    console.log(err.message, err);
  }
  process.exit();
};

const importReview = async () => {
  try {
    const reviewData = JSON.parse(
      fs.readFileSync('./dev-data/data/review.json', {
        encoding: 'utf-8',
      })
    );
    const review = await Review.create(reviewData);
    if (review) console.log('Review data imported successfully!');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') importDataToDB();
if (process.argv[2] === '--delete') deleteDataFromDB();
if (process.argv[2] === '--importReview') importReview();
