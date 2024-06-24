import jwt from "jsonwebtoken"

const signatureRefresh = "MySuP3R_z3kr3t_refresh";

const accessTokenAge = 10 * 6; //s
const refreshTokenTokenAge = 60 * 60; //s (7d)


const verifyRefreshTokenMiddleware = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(refreshToken, signatureRefresh);
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
  refreshToken: jwt.sign({ login }, signatureRefresh, {
    expiresIn: `${refreshTokenTokenAge}s`,
  }),
});
export {getTokens, refreshTokenTokenAge, verifyRefreshTokenMiddleware}