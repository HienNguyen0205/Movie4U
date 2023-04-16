const db = require('../database');
const jwt = require('jsonwebtoken');
const TicketControllers = {
    getAllTicket: (req, res) => {
        const status = req.query.status;
        const sql = `SELECT ticket.id, ticket.name, ticket.price, ticket.status
                    FROM ticket
                    WHERE ticket.status = ?`;
        db.queryParams(sql, [status])
            .then((results) => {
                res.status(200).json(
                    {
                        code: 200,
                        message: 'Success',
                        data: results
                    }
                );
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error'
                });
            });
    },
    getTicketById: (req, res) => {
        const id = req.query.id;
        const sql = `SELECT ticket.id, ticket.name, ticket.price, ticket.status
                    FROM ticket
                    WHERE ticket.id = ?`;
        db.queryParams(sql, [id])
            .then((results) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: results
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500, 
                    message: 'Internal server error' 
                });
            });
    },
    getMovieSchedule(req, res) {
        const moive_id = req.query.movie_id;
        const sql = `SELECT
        sch.id AS schedule_id,
        sch.movie_id,
        sch.room_id,
        sch.theatre_id,
        sch.date,
        sch.price,
        GROUP_CONCAT(DISTINCT st.start_time) AS start_times,
        GROUP_CONCAT(DISTINCT st.end_time) AS end_times,
        GROUP_CONCAT(DISTINCT st.id) AS schedule_time_ids,
        th.name AS theatre_name,
        th.address AS theatre_address,
        th.image AS theatre_image,
        r.name AS room_name,
        r.type AS room_type,
        r.capacity AS room_capacity
        FROM 
            schedule sch
        JOIN 
            theatre th ON sch.theatre_id = th.id
        JOIN 
            room r ON sch.room_id = r.id
        JOIN 
            schedule_time st ON sch.id = st.schedule_id
        WHERE 
            sch.movie_id = ? 
            AND DATE(sch.date) = CURDATE()
        GROUP BY sch.id, th.name, th.address, th.image, r.name, r.type, r.capacity;   
        `;
        db.queryParams(sql, [moive_id])
            .then((results) => {
                res.status(200).json({
                    code: 200,
                    message: 'Success',
                    data: results
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    code: 500, 
                    message: 'Internal server error' 
                });
            });
    },
    addTicket: async (req, res) => {
        if (req.user == null) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { schedule_id, schedule_time_id, seat } = req.body;

        if (!schedule_id || !schedule_time_id || !seat) {
            res.status(400).json({ 
                code: 201,
                message: 'Bad request' 
            });
            return;
        }

        seatList = seat.split(',');

        const check = await checkSeat(schedule_time_id, seatList);

        if (!check) {
            res.status(400).json({
                code: 201, 
                message: 'Seat is not available' 
            });
            return;
        }

        await addTicketAndSeat(seatList, schedule_time_id, req.user.id);

        res.status(200).json({
            code: 200,
            message: 'Success'
        });
    },
    getSeat: async (req, res) => {
        const { schedule_id, schedule_time_id } = req.body;
        const sql = `SELECT seat FROM ticket WHERE schedule_id = ? AND schedule_time_id = ?`;
        const results = await db.queryParams(sql, [schedule_id, schedule_time_id]);
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: results
        });
    }
};

async function checkSeat(schedule_time_id, seat) {
    for (let i = 0; i < seat.length; i++) {
        const sql = 'SELECT * FROM seat WHERE schedule_time_id = ? AND name = ?';
        const results = await db.queryParams(sql, [schedule_time_id, seat[i]]);
        if (results.length > 0) {
            return false;
        }
    }
    return true;
}

async function addTicketAndSeat(seatList, schedule_time_id, account_id) {
    const sql = 'Insert into ticket (schedule_time_id, account_id) values (?,?)';
    const results = await db.queryTransaction(sql, [schedule_time_id, account_id]);
    const ticket_id = results.insertId;
    for (let i = 0; i < seatList.length; i++) {
        const sql = 'Insert into seat (ticket_id,schedule_time_id,name) values (?,?,?)';
        await db.queryTransaction(sql, [ticket_id,schedule_time_id, seatList[i]]);
    }
}

module.exports = TicketControllers;