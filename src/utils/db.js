const mongoose = require('mongoose');
const database = process.env.MONGO_URI;

mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});

mongoose.connection.on('connected', () => {
    console.log(`${database} terkoneksi...`);
});
