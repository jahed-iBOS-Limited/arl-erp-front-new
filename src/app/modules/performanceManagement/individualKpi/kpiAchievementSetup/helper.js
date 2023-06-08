import axios from "axios";

export const getEmployeesByDepartmentId = async (
  accId,
  buId,
  depId,
  setter
) => {
  try {
    const res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDLByDepartment?AccountId=${accId}&BusinessUnitId=${buId}&DepartmentId=${depId}`
    );
    if (res.status === 200 && res?.data) {
      const addVanceDDL = res?.data.map((item) => {
        return {
          label: `${item.label} (${item.value}) `,
          value: item.value,
        };
      });
      setter(addVanceDDL);
    }
  } catch (error) {}
};
