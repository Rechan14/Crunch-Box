const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // Authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // Authorize based on user role
        async (req, res, next) => {
            try {
                console.log("Decoded JWT Payload:", req.user); // Debugging

                // Directly extract role from token
                if (!req.user || !req.user.role) {
                    return res.status(401).json({ message: 'Unauthorized: Role missing in token' });
                }

                const account = await db.Account.findByPk(req.user.id);

                if (!account || (roles.length && !roles.includes(account.role))) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                //  Ensure req.user.role is always set correctly
                req.user.role = account.role;

                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
                
                next();
            } catch (error) {
                console.error("Authorization Error:", error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    ];
}
