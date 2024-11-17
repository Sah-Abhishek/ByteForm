const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if(!authHeader){
        return res.status(403).json({
            message: "Authorization token is required"
        });
    }
    const token = authHeader.split(' ')[1];
    console.log("This is token from authMiddleware: ", token);
    if(!token){
        return res.status(401).json({
            message: "Authorization token is required"
        })
    }
    jwt.verify(token , jwtSecret, (err, user) => {
        if (err) {
            console.log("Error while verifying token: ", err);
            res.status(403).json({
                message: "Invalid or expired token"
            })

        }
        req.user = user;
        next();
    })
}

module.exports = authMiddleware;