"use strict";
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_HOST_PREFIX + process.env.DB_USER +":" + process.env.DB_PASS+ "@" + process.env.DB_HOST_SUFFIX;

const client = newMongoClient().connect()
function newMongoClient()
{
    return new MongoClient(uri, { useNewUrlParser: true })
}
