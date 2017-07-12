/**
 * Created by Christopher on 28.06.2017.
 */

import User from '../user/userModel';

const param = {
  user_id: function(req, res, next) {
    if (req.query.user_id) {
      User.findOne({_id: req.query.user_id})
        .exec(function (err, user) {
          if (err) { return console.error(err); }
          console.log(user);
          req.query.user_id = user;
          next();
        });
    } else {
      next();
    }
  }
};

module.exports = param;
