/**
 * Created by Christopher on 18.06.2017.
 */
const admin = {
  isAdmin: (req, res, next) => {
    if (req.payload.user.role !== 'admin') {
      return res.status(405).json({
        title: 'Not Allowed',
        error: {message: 'Not allowed'}
      });
    }
    next();
  }
};

module.exports = admin;
