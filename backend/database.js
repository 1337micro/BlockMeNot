"use strict";
require('dotenv').config({path:"./backend/.env"})
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_HOST_PREFIX + process.env.DB_USER +":" + process.env.DB_PASS+ "@" + process.env.DB_HOST_SUFFIX;

const client = newMongoClient().connect()
function newMongoClient()
{
    return new MongoClient(uri, { useNewUrlParser: true })
}

function getCommentsByVideoId(videoId)
{
    
    return client
        .then(client => {
            const collection = client.db(process.env.DB_DATABASE_NAME).collection(process.env.DB_COMMENTS_COLLECTION_NAME)
            return collection.findOne({videoId: videoId})
        })
        .catch(reason => {
            console.error(reason)
        })
}
function addCommentToVideoId(videoId, comment, channel)
{
    
    return client
        .then(client => {
            const collection = client.db(process.env.DB_DATABASE_NAME).collection(process.env.DB_COMMENTS_COLLECTION_NAME)
            return collection.updateOne({videoId: videoId}, {$push:{comments:{comment:comment, channel:channel}}}, {upsert:true})
        })
        .catch(reason => {
            console.error(reason)
        })
}
module.exports.getCommentsByVideoId = getCommentsByVideoId;
module.exports.addCommentToVideoId = addCommentToVideoId;
