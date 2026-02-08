// const express=require('express')
require('dotenv').config()
const backend_url=process.env.BACKEND_URL
const frontend_url=process.env.FRONTEND_URL
const uri=process.env.DB_URL
const GOOGLE_API_KEY=process.env.GOOGLE_API_KEY
const EMAIL_PASSWORD=process.env.EMAIL_PASSWORD
const IMAGE_API=process.env.IMAGE_API
const SECRET_API=process.env.SECRET_API
const CLOUD_NAME=process.env.CLOUD_NAME
const weaviateUrl = process.env.WEAVIATE_URL
const weaviateApiKey = process.env.WEAVIATE_API_KEY
module.exports={
    backend_url,
    frontend_url,
    uri,
    GOOGLE_API_KEY,
    EMAIL_PASSWORD,
    IMAGE_API,
    SECRET_API,
    CLOUD_NAME,
    weaviateUrl,
    weaviateApiKey
}