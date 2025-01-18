import { baseApi } from "./baseClient";

export const getContracts = ({ page = 1, size = 1000, search = "" }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/GetList/Contracts", {
        params: {
          page,
          size,
          search,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log("Error fetching contracts:", error);
      return reject(error);
    }
  });
};

export const getContractDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("id:", id);
      const { data } = await baseApi().get(
        `/GetList/Contracts/Id?contractId=${id}`
      );
      return resolve(data);
    } catch (error) {
      console.log("Error fetching contract details:", error);
      return reject(error);
    }
  });
};

export const createContract = (newContract) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().post(
        "/GetList/Contracts/Create/Contract",
        newContract
      );
      return resolve(data);
    } catch (error) {
      console.log("Error creating contract:", error);
      return reject(error);
    }
  });
};

export const createContractWithUserId = (userId, newContract) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().post(
        `/GetList/Contracts/Create/Contract/Addendum?userId=${userId}`,
        newContract
      );
      return resolve(data);
    } catch (error) {
      console.log("Error creating contract with userId:", error);
      return reject(error);
    }
  });
};

export const updateContractDetails = (id, updatedContract) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().put(
        `/GetList/Contracts/Update/Contract/Id?id=${id}`,
        updatedContract
      );
      return resolve(data);
    } catch (error) {
      console.log("Error updating contract details:", error);
      return reject(error);
    }
  });
};

export const getContractsByUserId = (userId, { page = 1, size = 100 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/GetList/Contracts/UserId", {
        params: {
          userId,
          page,
          size,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log("Error fetching contracts by userId:", error);
      return reject(error);
    }
  });
};

export const getContractStatus = ({
  page = 1,
  size = 1000,
  search = "",
  status,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/GetList/Contracts/Status", {
        params: {
          page,
          size,
          search,
          status,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log("Error fetching contracts:", error);
      return reject(error);
    }
  });
};

export const getContractsByOrderIdAndCode = (orderId, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `/GetList/Contracts/Owner-Customer/Id?orderId=${orderId}&code=${code}`;
      const { data } = await baseApi().get(url);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching contracts by orderId and code:", error);
      return reject(error);
    }
  });
};

export const getContractsByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `/GetList/Contracts/OrderDetail/Contract-list/Id?orderId=${orderId}`;
      const { data } = await baseApi().get(url);
      resolve(data);
    } catch (error) {
      console.log("Error fetching contracts by orderId:", error);
      reject(error);
    }
  });
};
