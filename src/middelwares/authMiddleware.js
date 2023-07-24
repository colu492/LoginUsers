export function checkAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        // El usuario es un administrador, permitir el acceso
        return next();
    } else {
        // El usuario no tiene permisos de administrador, denegar el acceso
        return res.status(403).json({ error: 'Acceso denegado. Requiere permisos de administrador.' });
    }
}

export function checkUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        // El usuario es un usuario normal, permitir el acceso
        return next();
    } else {
        // El usuario no tiene permisos de usuario, denegar el acceso
        return res.status(403).json({ error: 'Acceso denegado. Requiere permisos de usuario.' });
    }
}
