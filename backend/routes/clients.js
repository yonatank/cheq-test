var express = require('express');

var router = express.Router();

var config = require('config');
var mysql = require('mysql');



let dbConfig = config.get('dbConfig');
dbConfig.multipleStatements = true;
const con = mysql.createConnection(
    dbConfig
);


con.connect(function(err) {
    if (err) throw err;
});

router.use(function (req, res, next) {
    // Add these headers to prevent CORS problems.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,,GET,PUT, POST, DELETE')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next()
});


router.get('/', function (req, res) {
    const query = "SELECT * FROM clients";
    con.query(query,[], function (err, result) {
        if (err){
            res.end(JSON.stringify(response));
        }else{
            res.send(JSON.stringify(result));
        }
    });
});

router.get('/:id', function (req, res) {
    const clientId = req.params.id ? req.params.id : null

    const query = "SELECT * FROM clients WHERE id = ?";
    con.query(query,[clientId], function (err, result) {
        if (err){
            res.status(500).send({error: err})
        }else{
            if(result.length > 0){
                res.send(JSON.stringify({client:result[0]}));
            }else{
                res.status(500).send({error: "client not found"})
            }

        }
    });
});


router.post('/create', function (req, res) {
    const client = {
        first_name : req.body.firstName,
        last_name : req.body.lastName,
        phone : req.body.phone,
    }

    const query = "INSERT INTO clients SET ?";
    let q = con.query(query,[client], function (err, result) {
        if (err){
            res.status(500).send({error: err})
        }else{
            res.send({success: "User created successfully"});
        }
    });
});


router.put('/update/:id', function (req, res) {
    const clientId = req.params.id ? req.params.id : null
    const clientForm = req.body.client

    if(clientId){
        const query = "UPDATE `clients` SET ? WHERE `id` = ? LIMIT 1";
        let q = con.query(query,[clientForm,clientId], function (err, result) {
            if (err){
                res.status(500).send({error: err})
            }else{
                res.send({success: "User deleted successfully"});
            }
        });
    }else{
        res.status(500).send({error: "No client id provided"})
    }

});

router.delete('/delete/:id', function (req, res) {
    const clientId = req.params.id ? req.params.id : null

    if(clientId){
        const query = "DELETE FROM `clients` WHERE `id` = ? LIMIT 1 ";
        let q = con.query(query,[clientId], function (err, result) {
            if (err){
                res.status(500).send({error: err})
            }else{
                res.send({success: "User deleted successfully"});
            }
        });
    }else{
        res.status(500).send({error: "No client id provided"})
    }

});


module.exports = router;
