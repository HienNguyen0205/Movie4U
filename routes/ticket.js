const express = require('express')
const router = express.Router()
const ticketControllers = require('../controllers/TicketController')
router.get('/getAllTickets', ticketControllers.getAllTicket)
router.get('/getTicketById', ticketControllers.getTicketById)
router.get('/getMovieSchedule', ticketControllers.getMovieSchedule)

module.exports = router