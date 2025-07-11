function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: wrong role " });
    }
    console.log("User role:", req.user.role);

    next();
  };
}

module.exports = requireRole;
