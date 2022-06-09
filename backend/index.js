// expressサーバ
const express = require('express')
const app = express()
const server = app.listen(3000, () => {
    console.log('Start Server!')
})  
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)

// AWS関係
const AWS = require('aws-sdk')
const secret = require('./secret.json')
const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
})

// =========== API ==================

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

// ファイルリスト取得
app.get('/api/file/list', (req, res) => {
    const bucketParams = {
        Bucket: secret.bucketName,
    }
    s3.listObjects(bucketParams, (err, data) => {
        if (err) {
            const params = {
                error: err,
            }
            res.json(params)
            return
        }

        res.json({
            list: data.Contents,
        })
    })
})

// アップロード
app.post('/api/file/upload', (req, res) => {
    const response = {
        result: true,
    }

    console.log(req.params)

    res.json(response)
})
