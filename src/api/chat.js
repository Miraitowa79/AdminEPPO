import {baseApi} from './baseClient';
const server = import.meta.env.VITE_SERVER_URL?.replace(
    '/v1', ''
);

export const getConversations = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const {data} = await baseApi(server).get('/Conversation/GetByUser');
            return resolve(data)
        } catch (error) {
            console.log('system error:', error)
            return reject(error)
        }
    })
}

export const getConversationsByUserId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {data} = await baseApi(server).get(`Conversation/${userId}`);
            return resolve(data)
        } catch (error) {
            console.log('system error:', error)
            return reject(error)
        }
    })
}

export const sendMessageByConversationId = ({
    conversationId,
    userId,
    message1,
    type,
    imageLink=''
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {data} = await baseApi().post('/Message', {
                conversationId,
                userId,
                message1,
                type,
                imageLink
            });
            return resolve(data)
        } catch (error) {
            console.log('system error:', error)
            return reject(error)
        }
    })
}