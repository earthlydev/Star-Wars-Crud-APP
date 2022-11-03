const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config({path: 'config/.env'});
const connectionString = process.env.DB_URL;


MongoClient.connect(connectionString, {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Entered the Database');
        const db = client.db('star-wars-quote');
        const quotesCollection = db.collection('quotes');
        app.set('view engine', 'ejs')
        //Middlewares and other routes
        //Body-parser placed before CRUD handlers
        app.use(bodyParser.urlencoded({ extended:true }));
        app.use(bodyParser.json());
        app.use(express.static('public'));
        //Handlers
        app.get('/', (req,res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    res.render('index.ejs', {quotes: results});
                })
                .catch(error => console.error(error))
        })
        app.post('/quotes',(req,res)=>{
            quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/');
            })
            .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                {name: 'Yoda'},
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(res => {
                res.json('Success')
            })
            .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                   if(result.deletedCount === 0){
                     return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vader's quote`)
                })
                .catch(error => console.error(error))
        })
        app.listen(process.env.PORT || 3000,function(){
            console.log('Listening on PORT 3000');
        })
    })
    .catch(error => console.error(error))


