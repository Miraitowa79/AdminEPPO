import { baseApi } from "./baseClient";

export const getAuctions = ({ page = 1, size = 2000, search = "" }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/GetList/AllRoom", {
        params: {
          page,
          size,
          search,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log("Error fetching auctions:", error);
      return reject(error);
    }
  });
};

export const getAuctionStatus = ({
  page = 1,
  size = 100,
  search = "",
  status = "",
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get("/GetList/Rooms/Status", {
        params: {
          page,
          size,
          search,
          status,
        },
      });
      return resolve(data);
    } catch (error) {
      console.log("Error fetching auctions:", error);
      return reject(error);
    }
  });
};

export const getAuctionDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await baseApi().get(`/GetList/Rooms/Id?roomId=${id}`);
      return resolve(data);
    } catch (error) {
      console.log("Error fetching auction details:", error);
      return reject(error);
    }
  });
};

export const createAuctionRoom = (roomData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await baseApi().post("/GetList/Rooms/Create/Room", roomData);
      return resolve(data);
    } catch (error) {
      console.log("Error creating auction room:", error);
      return reject(error);
    }
  });
};

export const updateAuctionRoom = (roomId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await baseApi().put(
        `/GetList/Rooms/Update/Room/Id?id=${roomId}`,
        updatedData
      );
      return resolve(response.data);
    } catch (error) {
      console.log("Error updating auction room:", error);
      return reject(error);
    }
  });
};
