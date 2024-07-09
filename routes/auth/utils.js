import jwt from "jsonwebtoken"

const refreshTokenTokenAge = 60 * 60; //s (7d)

import { configDotenv } from "dotenv";
configDotenv();


const verifyRefreshTokenMiddleware = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SIGNATURE);
    req.user = decoded;
  } catch (err) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        maxAge: 0,
      })
    );
    return res.sendStatus(401);
  }
  return next();
};

const getTokens = (login) => ({
  refreshToken: jwt.sign({ login }, process.env.SIGNATURE, {
    expiresIn: `${refreshTokenTokenAge}s`,
  }),
});
export {getTokens, refreshTokenTokenAge, verifyRefreshTokenMiddleware}