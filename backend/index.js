const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const clients = require('./routes/clients');



app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Server
app.listen(3001,function(){
    console.log('Server is Up')
})


app.use('/clients', clients);



module.exports = app;


