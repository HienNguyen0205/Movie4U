const express = require('express')
const router_admin = express.Router()

router_admin.get('/', (req, res) => {
    res.render('home_admin', {
        layout: 'mainLayout_admin',
        
    })
})

module.exports = router_admin