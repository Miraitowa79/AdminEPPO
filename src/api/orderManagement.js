import { baseApi } from './baseClient';

export const getOrders = ({ pageIndex = 1, pageSize = 10, search = '' }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().get('/Order', {
                params: {
                    pageIndex,
                    pageSize,
                    search
                }
            });
            console.log('data: ', data);
            return resolve(data);
        } catch (error) {
            console.log('Error fetching orders:', error);
            return reject(error);
        }
    });
};

export const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('id:', id);
            const { data } = await baseApi().get(`/Order/${id}`);
            return resolve(data);
        } catch (error) {
            console.log('Error fetching order details:', error);
            return reject(error);
        }
    });
};