import axios from "axios";

// export const getMenuList = async (setter) => {
//   try {
//     const res = await axios.get(
//       `/tms/LigterLoadUnload/LevelForPermissionDDL?intPartid=1&Unitid=0&Pkid=0`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(
//         res?.data.map((item) => ({
//           value: item?.intid,
//           label: item?.strLabelName,
//         }))
//       );
//     }
//   } catch (error) {}
// };

// export const deleteCarrierAgent = async (id, uId, setLoading, cb) => {
//   setLoading && setLoading(true);
//   try {
//     const res = await axios.put(
//       `/wms/FertilizerOperation/DeleteLighterCarrier?AutoId=${id}&UserId=${uId}`
//     );
//     toast.success(res?.data?.message);
//     cb && cb();
//     setLoading && setLoading(false);
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//     setLoading && setLoading(false);
//   }
// };

export const getEmpInfoByIdAction = async (employee, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/GetEmployeeInformation?EmployeeId=${employee?.value}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

// export const getEmpPermissionList = async (employee, buId, setter) => {
//   try {
//     const res = await axios.get(
//       `/wms/FertilizerOperation/GetPermissionForModificationById?UnitId=${buId}&Enroll=${employee?.value}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//     }
//   } catch (error) {}
// };
