import { baseApi } from './baseClient';

export const getAuctions = ({ page = 1, size = 5, search = '' }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get('/GetList/Rooms', {
        params: {
          page,
          size,
          search
        }
      });
      return resolve(data);
    } catch (error) {
      console.log('Error fetching auctions:', error);
      return reject(error);
    }
  });
};

export const getAuctionDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get(`/GetList/Rooms/Id?id=${id}`);
      return resolve(data);
    } catch (error) {
      console.log('Error fetching auction details:', error);
      return reject(error);
    }
  });
};
