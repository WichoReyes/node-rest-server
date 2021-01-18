const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(require('./routes/usuario'));


//Nos conectamos a la base de datos especificando el puerto en el cual esta corriendo nuestra base de datos y el 
//nombre que queremos para la base
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        throw new Error(err);
    } else {
        console.log('Base de datos online');
    }
});

//Otra manera para conectar a la base de datos 

//mongoose.connect('mongodb://localhost:27017/cafe', {
//    useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true
//});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
})