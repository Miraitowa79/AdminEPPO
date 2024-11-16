import { baseApi } from "./baseClient";

export const getWalletDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("id:", id);
      const { data } = await baseApi().get(`/GetList/Wallet/Id?id=${id}`);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching wallet details:", error);
      return reject(error);
    }
  });
};
