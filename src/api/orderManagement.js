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

export const getPlantsBill = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().get(`GetList/Order/By/OrderId?orderId=${id}`);
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

export const getFilteredOrders = ({ typeEcommerceId, startDate, endDate, pageIndex = 1, pageSize = 5000 }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().get('/Order/GetOrdersByTypeEcommerceId', {
                params: {
                    typeEcommerceId,
                    startDate,
                    endDate,
                    pageIndex,
                    pageSize
                }
            });
            return resolve(data);
        } catch (error) {
            console.log('Error fetching filtered orders:', error);
            return reject(error);
        }
    });
};

export const updateOrderDetailDeposit = ({ orderDetailId, depositDescription, depositReturnCustomer, depositReturnOwner }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().put('/Order/UpdateOrderDetailDeposit', {
                params: {
                    orderDetailId,
                    depositDescription,
                    depositReturnCustomer,
                    depositReturnOwner
                }
            });
            return resolve(data);
        } catch (error) {
            console.log('Error updating order detail deposit:', error);
            return reject(error);
        }
    });
};