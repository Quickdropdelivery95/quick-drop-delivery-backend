// Authentication placeholder. Replace with verified JWT/session authentication before exposing this API publicly.
// Never trust a user role supplied directly by the mobile app.
export function requireRole(...allowedRoles) { return (_req, res, _next) => res.status(501).json({error:'Authentication is not configured.', message:'Add phone OTP authentication and verified server-side sessions before enabling protected operations.'}); }
