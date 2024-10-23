import { baseApi } from './baseClient';

export const getPlants = ({ pageIndex = 1, pageSize = 10, search = '' }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().get('/Plant', {
                params: {
                    pageIndex,
                    pageSize,
                    search
                }
            });
            console.log('data: ', data);
            return resolve(data);
        } catch (error) {
            console.log('Error fetching accounts:', error);
            return reject(error);
        }
    });
};

export const getPlantDetails = (plantId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await baseApi().get(`/Plant/${plantId}`);
            return resolve(data);
        } catch (error) {
            console.log('Error fetching account details:', error);
            return reject(error);
        }
    });
};

// Hàm để cập nhật thông tin tài khoản (nếu cần)
// export const updateAccount = (userId, accountData) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const { data } = await baseApi().put(`/Accounts/${userId}`, accountData);
//             return resolve(data);
//         } catch (error) {
//             console.log('Error updating account:', error);
//             return reject(error);
//         }
//     });
// };
