import axios from "axios";

// getWorkplaceGroupDDL
export const getWorkplaceGroupDDL = () => {
  return axios.get("/hcm/HCMDDL/GetWorkplaceGroupDDL");
};

// getbusinessunitDDL
export const getbusinessunitDDL = () => {
  return axios.get("/hcm/HCMDDL/GetBusinessunitDDL");
};

//get Workplace Landing
export const getWorkPlaceLandingData = (accId, pageNo, pageSize) => {
  return axios.get(
    `/hcm/WorkPlace/WorkPlaceLandingPagination?AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
};

//Get WorkPlaceGroupById
export const getWorkPlaceGroupById = (wpGroupid, accId) => {
  return axios.get(
    // `/hcm/WorkPlace/GetWorkPlaceById?WorkPlaceById=${id}`
    `/hcm/WorkPlace/GetWorkPlaceGroupById?WorkplaceGroupId=${wpGroupid}&AccountId=${accId}`
  );
};
//Get WorkPlaceById
export const getWorkPlaceById = (wpId) => {
  return axios.get(`/hcm/WorkPlace/GetWorkPlaceById?WorkPlaceById=${wpId}`);
};
//SaveEditWorkplace
export function putSaveEditWorkplace(data) {
  return axios.put(`/hcm/WorkPlace/EditWorkplace`, data);
}

//createWorkplaceSave
export const getCreateWorkplace = (createData) => {
  return axios.post(`/hcm/WorkPlace/CreateWorkplace`, [...createData]); //api problem
};
