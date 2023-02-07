class HomeController {
  async index(req, res) {
    res.send("Exemplo");
  }

  async validate(req, res) {
    res.send('ok');
  }
}

module.exports = new HomeController();
