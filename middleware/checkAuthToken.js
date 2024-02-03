const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkAuthToken(req, res, next) {
  const authToken = req.cookies.auth_token;
  const refreshToken = req.cookies.refresh_token;  
  console.log("Auth Called");
  // prints if no auth or refresh token found.
  if (!authToken || !refreshToken) {
    return res
      .status(401)
      .send({
        message: "Authentication failed: No authToke or refreshToken provided.",
      });
  }

  jwt.verify(authToken, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        (refreshErr, refreshDecoded) => {
          // refreshToken is expired and access token is expired
          if (refreshErr) {
            return res
              .status(401)
              .send({
                message: "Authentication failed: Both tokens are invalid.",
              });
          }
          // refresh not expired & access token is expired
          else {
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
            res.cookie("auth_token", newAuthToken, { httpOnly: true });
            res.cookie("refresh_token", newRefreshToken, { httpOnly: true });
            req.userId = refreshDecoded.userId;
            next();
          }
        }
      );
    }
    // if token not expired continue to the next
    else {
      req.userId = decoded.userId;
      next();
    }
  });
}

module.exports = checkAuthToken;
