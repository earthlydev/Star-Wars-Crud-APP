const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://admin:911Luna@cluster0.4yftzen.mongodb.net/?retryWrites=true&w=majority'
console.log('May Node be with you');


MongoClient.connect(connectionString, {
    useUnifiedTopology: true
  })
    .then(client => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');
    
    // ===============
    //  Middlewares
    // ===============
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    // ===============
    //  Routes
    // ===============
    app.get('/', (request, response) => {
        db.collection('quotes').find().toArray()
        .then(quotes => {
            response.render('index.ejs', { quotes: quotes });
        })
        .catch(error => console.error(error))
    })
    app.post('/quotes', (request, response) => {
        quotesCollection.insertOne(request.body)
            .then(result => {
                response.redirect('/')
            })
            .catch( error => console.error(error))
    })
    app.put('/quotes', (request, response)=>{
        console.log(request.body);
    })
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
    })
    .catch(error => console.error(err))
