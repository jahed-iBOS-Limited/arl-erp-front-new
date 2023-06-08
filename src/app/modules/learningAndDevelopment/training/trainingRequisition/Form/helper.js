import axios from "axios";

export function setData(valueOption, setFieldValue) {
  axios
    .get(
      `/hcm/EmployeeBasicInformation/GetEmployeeBasicInfoById?EmployeeId=${valueOption?.value}`
    )
    .then((res) => {
      console.log(res?.data);
      setFieldValue("designation", {
        value: res?.data[0]?.designationId,
        label: res?.data[0]?.designationName,
        businessUnitId: res?.data[0]?.businessUnitId,
        supervisorId: res?.data[0]?.supervisorId,
      });
      setFieldValue("jobType", {
        value: res?.data[0]?.employmentTypeId,
        label: res?.data[0]?.employmentTypeName,
      });
      setFieldValue("email", res?.data[0]?.email || "");
      setFieldValue("phone", res?.data[0]?.contactNumber || "");
      setFieldValue("gender", res?.data[0]?.gender);
      setFieldValue("supervisor", res?.data[0]?.supervisorName);
    });
}
