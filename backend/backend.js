"use strict";
const express = require('express')
const app = express()
const port = 3001
const database = require('./database')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getAllComments/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    if(videoId != undefined)
    {
        const aComments = await database.getCommentsByVideoId(videoId)
        res.status(200).send(aComments)
    }
    else
    {
        res.status(400).send("You must pass videoId")
    }
})
app.post('/addComment/:videoId', async (req, res) => {
    console.log(req.body)
    const videoId = req.params.videoId;
    if(req.body && videoId)
    {
        const comment = req.body.comment;
        let response = await database.addCommentToVideoId(videoId, comment)
        res.status(200).send(response);
    }
    else
    {
        res.status(400).send("No body or videoId passed")
    }
    

})

app.listen(port, () => console.log(`BlockMeNot listening on ${port}!`))
