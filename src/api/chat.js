import {baseApi} from './baseClient';

export const getConversations = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const {data} = await baseApi().get('/Conversation/Conversations');
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
            const {data} = await baseApi().get(`Conversation/Conversations/GetByUserId?userId=${userId}`);
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
            const {data} = await baseApi().post('Message/Messages', {
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