import { baseApi } from "./baseClient";

export const getPlants = ({ pageIndex = 1, pageSize = 1000, search = "" }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/Plant", {
        params: {
          pageIndex,
          pageSize,
          search,
        },
      });
      console.log("data: ", data);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      return reject(error);
    }
  });
};

/* Get list plant for function sale plant */
export const getListPlantSale = ({
  pageIndex = 1,
  pageSize = 1000,

  search = "",
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get(
        "/GetList/Plants/Filter/TypeEcommerceId?typeEcommerceId=1",
        {
          params: {
            pageIndex,
            pageSize,
            search,
          },
        }
      );
      console.log("data: ", data);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      return reject(error);
    }
  });
};
/* Get list plant for function renting plant */
export const getListPlantRenting = ({
  pageIndex = 1,
  pageSize = 1000,

  search = "",
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get(
        "/GetList/Plants/Filter/TypeEcommerceId?typeEcommerceId=2",
        {
          params: {
            pageIndex,
            pageSize,
            search,
          },
        }
      );
      console.log("data: ", data);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      return reject(error);
    }
  });
};

/* Get list plant for function auction plant */
export const getListPlantAuction = ({
  pageIndex = 1,
  pageSize = 1000,
  search = "",
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get(
        "/GetList/Plants/Filter/TypeEcommerceId?typeEcommerceId=3",
        {
          params: {
            pageIndex,
            pageSize,
            search,
          },
        }
      );
      console.log("data: ", data);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      return reject(error);
    }
  });
};

export const getPlantDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("id:", id);
      const { data } = await baseApi().get(`/Plant/${id}`);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching account details:", error);
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

export const getAllCategories = ({ pageIndex = 1, pageSize = 100 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get(
        "/GetList/Categories?page=1&size=100",
        {
          params: {
            pageIndex,
            pageSize,
          },
        }
      );
      console.log("data: ", data);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching accounts:", error);
      return reject(error);
    }
  });
};

export const updatePlant = (plantId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await baseApi().put(
        `/GetList/Plants/Update/PlantId?plantId=${plantId}`, // Correct URL structure with query parameter
        updatedData // Send the entire updated data if required, or specific fields
      );

      // Check if the request was successful
      if (response?.data?.statusCode === 200) {
        console.log("Plant updated successfully:", response.data.message);
        resolve(response.data); // Resolve with the response data
      } else {
        reject(new Error("Error updating plant: unexpected status code"));
      }
    } catch (error) {
      console.error("Error updating plant:", error); // Log the error for debugging
      reject(error); // Reject with the error
    }
  });
};
