const jwt = require('jsonwebtoken');
const secret = 'dhasdjfdksnfklsdmfoaisdhasodkasdmasçld';

module.exports = (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (authToken){
        const token = authToken.split(' ')[1];
        try {
            const decoded = jwt.verify(token, secret);
            if (decoded.role === 1) {
                next();
            } else {
                res.status(403);
                res.send('Falha na autenticação. Você não é administrador.');
                return;
            }
        } catch (error) {
            res.status(403);
            res.send('Falha na autenticação. Token inválido');
            return;
        }
    } else {
        res.status(403);
        res.send('Falha na autenticação.');
        return;
    }
}