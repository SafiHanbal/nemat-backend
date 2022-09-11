const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Menu = require('../../models/menu.model');

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

const importDataToDB = async () => {
  try {
    const menu = await Menu.create(menuData);
    if (menu) console.log('Data imported successfully!');
  } catch (err) {
    console.log(err.message, err);
  }
  process.exit();
};

const deleteDataFromDB = async () => {
  try {
    await Menu.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.log(err.message, err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importDataToDB();
if (process.argv[2] === '--delete') deleteDataFromDB();
