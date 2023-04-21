const jwt = require('jsonwebtoken');

const MiddleWaresController = {
    verifyJWT: (req, res, next) => {
        const token = req.headers.authorization;

        if(!token){
            return res.status(401).json({message: 'Token not found'});
        }

        const accessToken = token.split(' ')[1];

        jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
            if(err){
                return res.status(403).json({message: 'Invalid token'});
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
                res.status(403).json({
                    code: 403,                    
                    message: 'You are not user'
                });
            }
        });
    },

    authForAdmin: (req, res, next) => {
        MiddleWaresController.verifyJWT(req, res, () => {
            if(req.user.status !== 0){
                next();
            }else{
                res.status(403).json({
                    code: 403,
                    message: 'You are not admin'
                });
            }
        });
    },

    authForRedirect: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.redirect('/');
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
            if(err){
                return res.redirect('/');
            }
            req.user = user;
            if(req.user.status === 1){
                res.redirect('/');
            }else{
                res.redirect('/admin');
            }
            next();
        });
    }
}

module.exports = MiddleWaresController;