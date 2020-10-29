
function authenticateUser(req, res, next) {
    console.log('Authentication! ...');

    next();
}

module.exports.authenticateUser = authenticateUser;