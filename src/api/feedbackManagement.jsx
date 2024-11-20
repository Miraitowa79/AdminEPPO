import { baseApi } from './baseClient';

export const getFeedbacks = ({ page = 1, size = 100, search = '' }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get('/GetList/Feedback', {
        params: {
          page,
          size,
          search
        }
      });
      return resolve(data);
    } catch (error) {
      console.log('Error fetching feedbacks:', error);
      return reject(error);
    }
  });
};

export const getFeedbackDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get(`/GetList/Feedback/Id?id=${id}`);
      return resolve(data);
    } catch (error) {
      console.log('Error fetching feedback details:', error);
      return reject(error);
    }
  });
};
