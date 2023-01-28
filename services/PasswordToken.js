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

    async validate(token) {
        try {
            const result = await knex.select().where({ token: token }).table('passwordtokens');
            if(result.length > 0) {
                if (result[0].used) {
                    return { status: false };
                } else {
                    return { status: true, token: result[0] };
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    async setUsed(token) {
        await knex.update({ used: 1 }).where({ token: token }).table('passwordtokens');
    }
}

module.exports = new PasswordToken();