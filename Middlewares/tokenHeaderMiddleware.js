export async function validTokenHeader(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    next();
}
