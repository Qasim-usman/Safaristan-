const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
  console.log("connected successfully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airnbn');
}

const initDB = async () => {
  await Listing.deleteMany({});

  // safe handling based on structure
  const dataArray = initData.data ? initData.data : initData;

  const updatedData = dataArray.map((obj) => ({
    ...obj,
    owner: '68874b3466d9541fa2af3d5b'
  }));

  await Listing.insertMany(updatedData);
  console.log("Data was initialized");
};

initDB();
