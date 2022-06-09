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
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// AWS関係
const AWS = require('aws-sdk')
const secret = require('./secret.json')
AWS.config.update({
    accessKeyId: secret.accessKey,
    secretAccessKey: secret.secretKey,
    region: secret.region,
})
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

        const list = {}
        data.Contents.forEach(item => {
            const path = item.Key.split('/')[0]
            if (!Object.keys(list).some(p => p === path)) {
                list[path] = 0
            }
            list[path]++
        })

        res.json({
            list: list,
        })
    })
})

// アップロード
app.post('/api/file/upload', async (req, res) => {
    const generateFileName = () => {
        const chars = 'ABCDEFGHIJKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
        let name = ''
        for (let i = 0; i < 10; i++) {
            const index = Math.floor(Math.random() * chars.length)
            name += chars[index]
        }
        name += ".txt"
        return name
    }
    
    const response = {
        result: true,
    }
    const promises = []
    for (let i = 0; i < req.body.fileNum; i++) {
        const promise = new Promise((resolve, reject) => {
            const filePath = req.body.filePath + "/" + generateFileName()
            const uploadParams = {
                Bucket: secret.bucketName,
                Key: filePath,
                Body: filePath,
            }
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
        promises.push(promise)
    }

    try {
        await Promise.all(promises)
    } catch (error) {
        console.error(error)
        response.result = false
    }
    res.json(response)
})

// 署名付きURL発行
app.post('/api/file/gen', (req, res) => {
    const response = {
        result: true,
    }

    const bucketParams = {
        Bucket: secret.bucketName,
    }
    s3.listObjects(bucketParams, async (err, data) => {
        if (err) {
            console.error(err)
            response.result = false
            return
        }
        
        const promises = []
        data.Contents.forEach(item => {
            if (req.body.paths.some(path => item.Key.split('/')[0] === path)) { return }

            const promise = new Promise((resolve, reject) => {
                const signedUrlParams = {
                    Bucket: secret.bucketName,
                    Key: item.Key,
                    Expires: 300,
                }
                s3.getSignedUrl('getObject', signedUrlParams, (err2, url) => {
                    if (err2) {
                        reject(err2)
                        return
                    }
                    console.log(url)
                    resolve()
                })
            })
            promises.push(promise)
        })
        
        try {
            await Promise.all(promises)
        } catch (error) {
            console.error(error)
            response.result = false
        }    
    })

    res.json(response)
})
