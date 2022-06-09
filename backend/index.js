const express = require('express')
const app = express()

const server = app.listen(3000, () => {
    console.log('Start Server!')
})

app.get('/api/ping', (req, res) => {
    const params = {
        message: 'Hello',
    }
    res.json(params)
})
