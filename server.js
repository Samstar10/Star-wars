const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

let quotesCollection;
let db;



MongoClient.connect('mongodb+srv://Sam:Shmoopysam9@cluster0.qvqtrvz.mongodb.net/?retryWrites=true&w=majority', 
{
    useUnifiedTopology: true,
})
    .then(client => {
        console.log('Connected to Database')
        db = client.db('star-wars-quotes')
        quotesCollection = db.collection('quotes')
    })
    .catch(error => {
        console.error(error)
    })

app.set('view engine', 'ejs')

app.use(express.static('public'));

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    db.collection('quotes')
        .find()
        .toArray()
        .then(results => {
            console.log(results)
            res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.error(error))
        
})

app.post('/quotes', (req, res) => {
    quotesCollection
        .insertOne(req.body)
        .then(result => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
})

app.put('/quotes', (req, res) => {
    quotesCollection
        .findOneAndUpdate(
            {name: 'Yoda'},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote,
                },
            },
            {
                upsert: true,
            }
        )
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
})

app.delete('/quotes', (req, res) => {
    quotesCollection
        .deleteOne({name: req.body.name})
        .then(result => {
            if(result.deletedCount === 0){
                return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vader's quote`)
        })
        .catch(error => console.error(error))
})

app.listen(8000, () => {
    console.log('listening on 8000')
})