var Q = require('q');
var crypto = require('crypto');

/*
 * Note: this is a VERY bad authentication implementation. Do NOT use in production.
 */
var users = {
  'luuk': '48f123338c345e4e7b137c52e055e1a6f78caa22c43f3dc1e29a070b38428e12'
};

module.exports = {
  authenticate: function (username, password) {
    var deferred = Q.defer();
    var hash = crypto.createHash('sha256');
    hash.update(password);
    if (users[username] === hash.digest('hex')) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
    return deferred.promise;
  }
};
