import { baseApi } from './baseClient';

export const getTypeEcommerce = ({ page = 1, size = 10, search = '' }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get('/GetList/TypeEcommerce', {
        params: {
          page,
          size,
          search,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log('Error fetching typeEcommerce data:', error);
      return reject(error);
    }
  });
};

export const getTypeEcommerceById = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await baseApi().get(`/GetList/TypeEcommerce/Id?id=${id}`);
        return resolve(data);
      } catch (error) {
        console.log('Error fetching typeEcommerce by id:', error);
        return reject(error);
      }
    });
  };