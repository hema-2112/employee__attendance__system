import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(404).json({ success: false, error: "Token Not Provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(404).json({ success: false, error: "Token Not Valid" });
    }

    const user = await User.findById(decoded._id).select('-password'); // Fixed this line

    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export default verifyUser;
