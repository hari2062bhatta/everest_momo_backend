    import jwt from "jsonwebtoken";
    import dotenv from "dotenv";
    dotenv.config();
    const authMiddlewares = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "not authenticated" });
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
        req.user = decoded;
        // res.status(200).json({ success: true, message: "login successful" });
        next();
        } else {
        return res
            .status(401)
            .json({ success: false, message: "not authenticated" });
        }
    } catch (err) {
        return res.status(401).json({
        message: "Invalid or expired token",
        });
    }
    };

    export default authMiddlewares;
