// expressサーバ
const express = require('express')
const app = express()

// AWS関係
const AWS = require('aws-sdk')
const secret = require('./secret.json')
const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
})

const server = app.listen(3000, () => {
    console.log('Start Server!')
})

// 動作テスト用のping
app.get('/api/ping', (req, res) => {
    s3.listBuckets((err, data) => {
        if (err) {
            const params = {
                error: err,
            }
            res.json(params)
            return
        }

        res.json(data)
    })
})
