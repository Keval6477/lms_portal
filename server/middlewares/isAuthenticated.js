import jwt from "jsonwebtoken";
const isAutheticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User Not authorized.",
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "User Not authorized.",
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Error in authticated token", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch.",
    });
  }
};

export default isAutheticated;