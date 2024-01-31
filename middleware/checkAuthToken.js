const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkAuth(req, res, next) {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;
  console.log("Check auth");
  if (!authToken || !refreshToken) {
    return res.status(401).send({
      message: "Authentication failed: No authtoken or refreshtoken found",
    });
  }

  jwt.verify(authToken, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        (refreshErr, refreshDecoded) => {
          if (refreshErr) {
            return res
              .status(401)
              .send({ message: "Authentication failed: Both tokens failed" });
          } else {
            const newAuthToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.AUTH_SECRET,
              { expiresIn: "10m" }
            );
            const newRefreshToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.REFRESH_SECRET,
              { expiresIn: "40m" }
            );
            res.cookie("authToken", newAuthToken, { httpOnly: true });
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
            req.userId = refreshDecoded.userId;
            next();
          }
        }
      );
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
}

module.exports = checkAuth;
