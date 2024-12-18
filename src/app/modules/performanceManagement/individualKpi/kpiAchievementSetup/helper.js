import axios from 'axios';
export const getDepartmentDDL = async (
  accountId,
  buId,
  setter,
  isAddAllField = false,
) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAcIdBuIdDDL?AccountId=${accountId}&BusinessUnitId=${buId}`,
    );
    let data = res?.data;
    isAddAllField && data.unshift({ value: 0, label: 'All' });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getEmployeesByDepartmentId = async (
  accId,
  buId,
  depId,
  setter,
) => {
  try {
    const res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDLByDepartment?AccountId=${accId}&BusinessUnitId=${buId}&DepartmentId=${depId}`,
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
