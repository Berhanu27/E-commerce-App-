import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.token;  // Fixed: correctly extract from headers (case-insensitive safe)

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, login again'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;  // Kept as-is since your controllers use req.body.userId

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export default authUser;