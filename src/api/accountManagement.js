import { baseApi } from "./baseClient";

export const getAccounts = ({ page = 1, size = 100, search = "" }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/GetList/Users", {
        params: {
          page,
          size,
          search,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      return reject(error);
    }
  });
};

export const getAccountDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("id:", id);
      const { data } = await baseApi().get(`/GetUser/Users/Id?userId=${id}`);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching account details:", error);
      return reject(error);
    }
  });
};

export const getAccountsStatus = ({
  page = 1,
  size = 100,
  search = "",
  roleId = "",
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/GetList/FilterByRole", {
        params: {
          page,
          size,
          roleId,
          search,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      return reject(error);
    }
  });
};

export const updateAccountDetails = (userId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await baseApi().put(
        `/GetUser/Users/UpdateAccount/ChangeStatus/Id?userId=${userId}`,
        { status: updatedData.status }
      );
      return resolve(response.data);
    } catch (error) {
      console.log("Error updating auction room:", error);
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
