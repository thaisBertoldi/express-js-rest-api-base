class UserController {

    async index(req, res){}

    async create(req, res){
        res.send("exemplo");
    }
}

module.exports = new UserController();