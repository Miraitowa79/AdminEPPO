import { baseApi } from './baseClient';

export const getOrders = ({ pageIndex = 1, pageSize = 5000, search = '' }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().get('/Order', {
                params: {
                    pageIndex,
                    pageSize,
                    search
                }
            });
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
            const { data } = await baseApi().get(`/Order/${id}`);
            return resolve(data);
        } catch (error) {
            console.log('Error fetching order details:', error);
            return reject(error);
        }
    });
};

export const updateOrderDetails = (updatedOrderData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().put('/Order', updatedOrderData);
            return resolve(data);
        } catch (error) {
            console.log('Error updating order details:', error);
            return reject(error);
        }
    });
};
