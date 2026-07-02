export const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User context missing' });
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        message: `Forbidden: Access restricted. Required Role: [${allowedRoles.join(', ')}]. Your Role: [${req.user.role}]`
      });
    }
  };
};
