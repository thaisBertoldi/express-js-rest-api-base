class HomeController{

    async index(req, res){
        res.send("Exemplo");
    }

}

module.exports = new HomeController();