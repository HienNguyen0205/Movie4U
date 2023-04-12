const jwt = require('jsonwebtoken');

const MiddleWares = {
    verifyJWT: (req, res, next) => {
        const token = req.headers.authorization;

        if(!token){
            return res.status(401).json({message: 'Token not found'});
        }

        const accessToken = token.split(' ')[1];

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                return res.status(403).json({message: 'Invalid token'});
            }
            req.user = user;
            next();
        });
    },
    
}