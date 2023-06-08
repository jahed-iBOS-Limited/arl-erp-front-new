import axios from "axios";

export const getPositionGroupDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeePositionGroupDDL");
    setter(res?.data);
  } catch (error) {
    setter([]);
    console.log("Error", error?.message);
  }
};

export const getHRPositionDDL = async (posGroupId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetPositionDDLForGrade?PositionGroupId=${posGroupId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
    console.log("Error", error?.message);
  }
};
