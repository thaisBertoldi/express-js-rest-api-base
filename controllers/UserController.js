const User = require("../services/User");
const bcrypt = require("bcrypt");
const PasswordToken = require("../services/PasswordToken");
const jwt = require("jsonwebtoken");
const secret = "dhasdjfdksnfklsdmfoaisdhasodkasdmasçld";

class UserController {
  async index(req, res) {
    const users = await User.findAll();
    res.json(users);
  }

  async create(req, res) {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password) {
      res.status(400);
      const err = !email ? "email" : !name ? "nome" : "senha";
      res.json({ err: "Preencha o campo " + err });
      return;
    }

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}\.?([a-z]+)?$/g)) {
      res.status(400);
      res.json({ err: "Você precisa informar um email válido." });
      return;
    }

    if (await User.findEmail(email)) {
      res.status(406);
      res.json({ err: "O email já está cadastrado" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.new(email, hashPassword, name, role);

    res.status(200);
    res.send("Dados ok");
  }

  async findUser(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      res.json({ error: "Usuário não encontrado" });
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

  async remove(req, res) {
    const result = await User.delete(req.params.id);
    if (result.status) {
      res.status(200);
      res.send("Tudo ok");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async recoverPassword(req, res) {
    const result = await PasswordToken.create(req.body.email);
    if (result.status) {
      res.status(200);
      res.send(result.token.toString());
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    const isValidToken = await PasswordToken.validate(req.body.token);
    if (isValidToken.status) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      await User.changePassword(
        hashPassword,
        isValidToken.token.user_id,
        isValidToken.token.token
      );
      res.status(200);
      res.send("Senha alterada");
    } else {
      res.status(406);
      res.send("Token inválido");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (user) {
      const isEqualPassword = await bcrypt.compare(password, user.password);
      if (isEqualPassword) {
        const token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200);
        res.json({ token: token, userRole: user.role });
      } else {
        res.status(406);
        res.json({ err: 'Senha incorreta' });
      }
    } else {
      res.status(406);
      res.json({ status: false, err: 'Usuário não encontrado.' });
    }
  }
}

module.exports = new UserController();
