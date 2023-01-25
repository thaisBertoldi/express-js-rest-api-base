const User = require('../services/User');
const bcrypt = require('bcrypt');

class UserController {

    async index(req, res){
        const users = await User.findAll();
        res.json(users);
    }

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

    async findUser(req, res) {
        const user = await User.findById(req.params.id);
        if (!user){
            res.status(404);
            res.json({error: "Usuário não encontrado"});
        } else {
            res.json(user);
        }
    }

    async edit(req, res) {
        const { id, name, role, email } = req.body;
        const result = await User.update(id, name, email, role);
        if (result && result.status) {
            res.send("Editado com sucesso");
        } else {
            res.status(406);
            res.send(result?.err);
        }
    }
}

module.exports = new UserController();