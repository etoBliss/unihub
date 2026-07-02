export const verifyAdminApiKey = (req, res, next) => {
  const apiKey = req.headers['x-admin-api-key'] || req.query.api_key;
  const expectedKey = process.env.ADMIN_API_KEY || 'default_admin_secret_key_2026';

  if (apiKey && apiKey === expectedKey) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized: Invalid Admin Secret API Key' });
  }
};
