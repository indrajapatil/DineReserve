// Simple admin auth middleware
// Checks for x-admin-secret header or process.env.ADMIN_SECRET
module.exports = function (req, res, next) {
  const header = req.get('x-admin-secret') || '';
  const secret = process.env.ADMIN_SECRET || 'changeme';
  if (header && header === secret) return next();
  return res.status(401).json({ success: false, error: 'Unauthorized' });
}
