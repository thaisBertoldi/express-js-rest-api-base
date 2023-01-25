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

    async findAll(){
        try {
            return await knex.select(['id', 'name', 'email', 'role']).table('users');
        } catch (error) {
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select(['id', 'name', 'email', 'role']).where({ id: id }).table('users');
            return result.length > 0 ? result[0] : undefined;
        } catch (error) {
            return [];
        }
    }

    async update(id, name, email, role) {
        const user = await this.findById(id);
        if (user) {
            let editUser = {};
            if (email && email !== user.email) {
                const result = await this.findEmail(email);
                if (!result) {
                    editUser.email = email;
                } else {
                    return { status: false, err: 'Email já cadastrado.'};
                }
            }

            if (name) {
                editUser.name = name;
            }

            if (role) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({ id: id }).table('users');
                return { status: true }
            } catch (error) {
                return { status: false, err: error};
            }
            
        } else {
            return { status: false, err: 'Usuário não encontrado.'};
        }
    }
}

module.exports = new User();