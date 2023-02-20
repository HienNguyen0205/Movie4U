const express = require('express')
const router_admin = express.Router()

router_admin.get('/', (req, res) => {
    res.render('home_admin', {
        layout: 'mainLayout_admin',
        icons_dashboard: [
            {src: './images/Admin/total_views_icon.png', ammount: '645,948'}
        ]
    })
})

module.exports = router_admin