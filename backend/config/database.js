const mongoose = require('mongoose');
require('dotenv').config();
const pc = require('picocolors');

mongoose.connect(process.env.MONGODB_URI, {

})
  .then(db => console.log(pc.green(`Connect to database at ${process.env.MONGODB_URI}`)))
  .catch(err => console.log(err));
