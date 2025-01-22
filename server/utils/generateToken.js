import jwt from "jsonwebtoken";

const generateToken = ( user) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  // console.log(token);
  return token
};

export default generateToken;