const express = require('express')
const router = express.Router()
const middleware = require('../middlewares')
const ticketControllers = require('../controllers/TicketController')
router.get('/getAllTickets',ticketControllers.getAllTicket)
router.get('/getTicketById', ticketControllers.getTicketById)
router.get('/getMovieSchedule', ticketControllers.getMovieSchedule)
router.get('/getSeat', ticketControllers.getSeat)
router.post('/addTicket', middleware.verifyJWT, ticketControllers.addTicket)
router.get('/getTicketByAccountId', middleware.verifyJWT, ticketControllers.getTicketByAccountId)
router.get('/getFoodCombo', ticketControllers.getFoodCombo)

module.exports = router