import { connect } from 'mongoose';
import dotenv from 'dotenv';
import pc from 'picocolors';

dotenv.config();

connect(process.env.MONGODB_URI, {

})
  .then(db => console.log(pc.green(`Connect to database`)))
  .catch(err => console.log(pc.red("Error en la conexión de la base de datos"), err));
