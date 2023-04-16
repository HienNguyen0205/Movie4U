const jwt = require('jsonwebtoken');

const MiddleWaresController = {
    verifyJWT: (req, res, next) => {
        const token = req.headers.authorization;

        if(!token){
            return res.status(401).json({message: 'Token not found'});
        }

        const accessToken = token.split(' ')[1];

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                req.session.flash = {
                    message: 'Unauthorized'                    
                }
                return res.redirect(303,'/');
            }
            req.user = user;
            next();
        });
    },

    authForUser: (req, res, next) => {
        MiddleWaresController.verifyJWT(req, res, () => {
            if(req.user.status === 1){
                next();
            }else{
                res.status(403).json({message: 'You are not user'});
            }
        });
    },

    authForAdmin: (req, res, next) => {
        MiddleWaresController.verifyJWT(req, res, () => {
            if(req.user.status !== 0){
                next();
            }else{
                res.status(403).json({message: 'You are not admin'});
            }
        });
    }
    
}

module.exports = MiddleWaresController;