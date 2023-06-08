import axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getSbuDDLAction = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getYearDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getCategoryDDL = async (setter) => {
  try {
    let res = await axios.get(`/pms/CommonDDL/StrategicParticularsTypeDDL`);
    const newData = res?.data?.filter(
      (data) =>
        data?.label === "Initiatives" ||
        data?.label === "Milestone" ||
        data?.label === "Program"
    );
    setter(newData);
  } catch (err) {
    setter([]);
  }
};

// this function is used from four kpi
export const getStrategicDataAction = async (
  accId,
  buId,
  initiativeId,
  initiativeTypeRefId,
  categoryId,
  yearId,
  setFinance,
  setCustomer,
  setProcess,
  setGrowth,
  setLoading
) => {
  try {
    setLoading(true);
    let res = await axios.get(
      `/pms/StrategicParticulars/GetStrategicInitiativeLanding?accountId=${accId}&businessUnitId=${buId}&InitiativeTypeId=${initiativeId}&InitiativeTypeRefaranceId=${initiativeTypeRefId}&CategoryId=${categoryId}&YearId=${yearId}`
    );

    let financeData = [];
    let customerData = [];
    let processData = [];
    let growthData = [];

    let data = res?.data;

    let objReturn = (item) => {
      return {
        ...item,
        initiativeNo: item?.initiativeNo,
        comment: item?.comment,
        statusValueLabel: { value: item?.statusId, label: item?.status },
        ownerName: {value : item?.ownerId, label: item?.ownerName},
        priorityName: {value: item?.priorityId, label: item?.priorityName},
        budget: item?.budget,
        startDate: _dateFormatter(item?.startDate),
        endDate: _dateFormatter(item?.endDate),
      };
    };

    for (let i = 0; i < data.length; i++) {
      let item = data[i];

      if (item?.bscperspectiveId === 1) {
        financeData.push(objReturn(item));
      } else if (item?.bscperspectiveId === 2) {
        customerData.push(objReturn(item));
      } else if (item?.bscperspectiveId === 3) {
        processData.push(objReturn(item));
      } else if (item?.bscperspectiveId === 4) {
        growthData.push(objReturn(item));
      }

      // set state
      setFinance(financeData);
      setCustomer(customerData);
      setProcess(processData);
      setGrowth(growthData);
    }
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setFinance([]);
    setCustomer([]);
    setProcess([]);
    setGrowth([]);
  }
};

export const getStatudDDLAction = async (setter) => {
  try {
    let res = await axios.get(
      `/pms/StrategicParticulars/GetInitiativeStatusDDL`
    );

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
