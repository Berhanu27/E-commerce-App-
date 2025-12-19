import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized – No Token",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized – Not Admin",
      });
    }

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized – Wrong Admin",
      });
    }

    next();
  } catch (error) {
    console.log("Admin Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default adminAuth;
