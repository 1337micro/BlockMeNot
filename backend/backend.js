"use strict";
const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/addComment', (req, res) => {
    console.log(req.body)
    res.status(200).send({})
})

app.listen(port, () => console.log(`BugMeNot listening on ${port}!`))
