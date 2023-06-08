import axios from "axios";
import { toast } from "react-toastify";

export const getWorkplaceGroupDDLAction = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`
    );
    const data = [...res?.data];
    // data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getBuDDLForEmpDirectoryAndSalaryDetails = async (
  accId,
  setter
) => {
  try {
    const res = await axios.get(
      `/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getMonthYearDDLAction = async (partId, setter) => {
  try {
    // 1 = month
    // 2 = year
    const res = await axios.get(
      `/hcm/HCMReport/SalaryGenerateProcess?partId=${partId}&businessUnitId=0&workplaceGroupId=0&monthId=0&yearId=0`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const generateSalaryAndConfirmAction = async (
  partId,
  setLoading,
  data,
  userId,
  cb
) => {
  try {
    // 5 = generate
    // 6 = confirm
    if (
      !data?.businessUnit ||
      !data?.month ||
      !data?.year ||
      !data?.workplaceGroup
    )
      return toast.warn("Please select all fields");

    setLoading(true);
    const res = await axios.get(
      `/hcm/HCMReport/SalaryGenerateProcess?partId=${partId}&businessUnitId=${data?.businessUnit?.value}&workplaceGroupId=${data?.workplaceGroup?.value}&monthId=${data?.month?.value}&yearId=${data?.year?.value}&insertByUserId=${userId}`
    );
    setLoading(false);
    cb()
    if (res?.data?.[0]?.message === "Processing") {
      toast.success("Submitted successfully");
    } else {
      toast.warn(res?.data?.[0]?.message || "Failed, try again");
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getButtonTextAndListDataAction = async (
  partId,
  setter,
  data,
  setLoading
) => {
  try {
    // 3 = generate text
    // 4 = landing / list
    if (
      data?.businessUnit &&
      data?.month &&
      data?.year
    ) {
      if(partId === 3 && !data?.workplaceGroup) return null;
      setLoading(true);
      const res = await axios.get(
        `/hcm/HCMReport/SalaryGenerateProcess?partId=${partId}&businessUnitId=${data?.businessUnit?.value}&workplaceGroupId=${partId === 4 ? 0 : data?.workplaceGroup?.value}&monthId=${data?.month?.value}&yearId=${data?.year?.value}`
      );
      setLoading(false);
      if (partId === 3) {
        setter(res?.data?.[0]?.message);
      } else {
        setter(res?.data);
      }
    }
  } catch (error) {
    setLoading(false);
    if (partId === 3) {
      toast.warn("Something went wrong, please refresh and try again");
      setter("Error");
    } else {
      setter([]);
    }
  }
};
