const mongoos = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try{
        await mongoos.connect(db ,{
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log('Połączono z mongoDB...')
    }catch(err) {
        console.error(err.message);
        //Zamknięcie procesu z błędem
        process.exit(1);
    }
}

module.exports = connectDB;