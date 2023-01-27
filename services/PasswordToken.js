const knex = require('../database/connection');
const User = require('./User');
const crypto = require('crypto');

class PasswordToken {

    async create(email) {
        const user = await User.findByEmail(email);
        if (user) {
            try {
                const token = crypto.randomUUID();
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table('passwordtokens');
                return { status: true, token: token };
            } catch (error) {
                return { status: false, err: error };
            }

        } else {
            return { status: false, err: 'Email não cadastrado.'}
        }
    }
}

module.exports = new PasswordToken();