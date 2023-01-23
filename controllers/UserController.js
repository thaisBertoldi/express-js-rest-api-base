const User = require('../services/User');
const bcrypt = require('bcrypt');

class UserController {

    async index(req, res){}

    async create(req, res){
        const { email, name, password } = req.body;

        if(!email || !name || !password) {
            res.status(400);
            const err = !email ? "email inválido" : !name ? "nome inválido" : "senha inválida";
            res.json({ err: err })
            return;
        }

        if(await User.findEmail(email)) {
            res.status(406);
            res.json({ err: 'O email já está cadastrado'});
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.new(email, hashPassword, name);

        res.status(200);
        res.send("Dados ok");
    }
}

module.exports = new UserController();