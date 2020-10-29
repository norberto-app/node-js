
function isAdmin(req, res, next) {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send("Access denied.");
    }
}

module.exports = isAdmin;