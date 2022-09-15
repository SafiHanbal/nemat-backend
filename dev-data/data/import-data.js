const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Menu = require('../../models/menu.model');
const User = require('../../models/user.model');

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

const importDataToDB = async () => {
  try {
    const menu = await Menu.create(menuData);
    const user = await User.create(userData, { validateBeforeSave: false });

    if (menu) console.log('Menu data imported successfully!');
    if (user) console.log('User data imported successfully!');
  } catch (err) {
    console.log(err.message, err);
  }
  process.exit();
};

const deleteDataFromDB = async () => {
  try {
    await Menu.deleteMany();
    await User.deleteMany();

    console.log('Menu data deleted successfully!');
    console.log('User data deleted successfully!');
  } catch (err) {
    console.log(err.message, err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importDataToDB();
if (process.argv[2] === '--delete') deleteDataFromDB();
