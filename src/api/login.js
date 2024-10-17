import {baseApi} from './baseClient';

export const login = ({
    usernameOrEmail, password
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {data} = await baseApi().post('/Users/Login',{
                usernameOrEmail: usernameOrEmail,
                password: password
            });
            return resolve(data)
        } catch (error) {
            console.log('system error:', error)
            return reject(error)
        }
    })
}
