const supabase = require("../supabase");

async function auth(req, res, next) {

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    const token = header.split(" ")[1];

    const {
        data: { user },
        error
    } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({
            error: "Invalid authentication token"
        });
    }

    req.user = user;

    next();
}

module.exports = auth;