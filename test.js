const express = require('express')

const app = express()

app.use(express.json())

app.post('/', function (req, res) {
    console.log(req.body)
    res.send('OK')
})

app.listen(3000)