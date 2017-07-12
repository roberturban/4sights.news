/**
 * Created by Christopher on 28.06.2017.
 */
const user = {
  isSelf: (req, res, next) => {
    if (req.payload.user._id !== req.params.id) {
      return res.status(405).json({
        title: 'Not Allowed',
        error: {message: 'Not allowed'}
      });
    }
    next();
  },
  isSelfOrAdmin: (req, res, next) => {
    if (req.payload.user._id !== req.params.id && req.payload.user.role !== 'admin') {
      return res.status(405).json({
        title: 'Not Allowed',
        error: {message: 'Not allowed'}
      });
    }
    next();
  }
};

module.exports = user;
