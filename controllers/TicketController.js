const db = require('../database');
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
                    message: 'Internal server error' });
            });
    },
    getTicketById: (req, res) => {
        const id = req.query  .id;
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
                res.status(500).json({ message: 'Internal server error' });
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
            GROUP_CONCAT(DISTINCT  st.start_time) AS start_times,
            GROUP_CONCAT(DISTINCT st.end_time) AS end_times,
            GROUP_CONCAT(DISTINCT st.id) AS schedule_time_ids,
            th.name AS theatre_name,
            th.address AS theatre_address,
            th.image AS theatre_image,
            r.name AS room_name,
            r.type AS room_type,
            r.capacity AS room_capacity
            FROM schedule sch
            JOIN theatre th ON sch.theatre_id = th.id
            JOIN room r ON sch.room_id = r.id
            JOIN schedule_time st ON sch.id = st.schedule_id
            WHERE sch.movie_id = ? AND sch.date = CURDATE()
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
                res.status(500).json({ message: 'Internal server error' });
            });
    },
    addTicket: async (req, res) => {
    }

};

async function checkSeat(schedule_id, seat) {
    const sql = ``;
    const results = await db.queryParams(sql, [schedule_id, seat]);
    if (results.length > 0) {
        return false;
    }
    return true;
}


module.exports = TicketControllers;