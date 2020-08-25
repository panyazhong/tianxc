import mongoose from 'mongoose';
import config from '../../config';

const { mongodb } = config;

const DB_NAME = 'root',
  DB_PWD = '123456',
  DB_URL = `mongodb://${DB_NAME}:${DB_PWD}@${mongodb.host}:${mongodb.port}/${mongodb.db}`;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('connected success:' + DB_URL);
});

connection.on('error', (err) => {
  console.log('connection error' + err);
});

connection.on('disconnected', () => {
  console.log('connection disconnected');
});

export default mongoose;
