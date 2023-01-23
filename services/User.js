const knex = require('../database/connection');

class User{

    async new(email, password, name) {
        try {
            await knex.insert({ email: email, password: password, name: name, role: 0 }).table('users');
        } catch (error) {
            console.log(error);
        }
    }

    async findEmail(email) {
        try {
            const emailExist = await knex.select('*').from('users').where({ email: email });
            return emailExist.length > 0 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new User();