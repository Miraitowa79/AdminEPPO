import { baseApi } from './baseClient';

export const getContracts = ({ page = 1, size = 10, search = '' }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await baseApi().get('/GetList/Contracts', {
          params: {
            page,
            size,
            search
          }
        });
        return resolve(data);
      } catch (error) {
        console.log('Error fetching contracts:', error);
        return reject(error);
      }
    });
  };

  export const getContractDetails = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('id:', id);
        const { data } = await baseApi().get(`/GetList/Contracts/Id?id=${id}`);
        return resolve(data);
      } catch (error) {
        console.log('Error fetching contract details:', error);
        return reject(error);
      }
    });
  };