// middlewares/roleCheck.js
const roleCheck = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log(`🚫 ${req?.user?.id} ${req?.user?.role} ${req?.user?.email} want access invalid route`)
      return res.status(403).json({ message: '❌ Access forbidden: insufficient role' });
    }
    next();
  };
};

module.exports = roleCheck;
