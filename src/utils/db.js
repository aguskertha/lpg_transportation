const mongoose = require('mongoose');
// const databaseLocal = `mongodb://${process.env.db_service_name}:${process.env.db_port}/${process.env.db_name}`;
const database = process.env.MONGO_URI;

mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true ,
});

mongoose.connection.on('connected', () => {
    console.log(`${database} terkoneksi...`);
});
