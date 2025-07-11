const jwt = require("jsonwebtoken");

function verfiyToken(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token here" });
  }
  try {
    const tokendecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = tokendecoded;
    console.log("Token in cookie:", req.cookies.token);

    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = verfiyToken;
