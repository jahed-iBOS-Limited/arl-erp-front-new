import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../../_helper/_monthLastDate";
import { getSalesContactGridData } from "../_redux/Actions";

// group id
export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
// report id
export const reportId = "43b34d8a-19cd-4723-90c6-79729d4bd387";

// generate parameter values
export const generateParameterValues = (obj) => {
  const { values, selectedBusinessUnit } = obj;
  const { channel, fromDate, toDate } = values;

  const parameter = [
    { name: "BUnitId", value: `${selectedBusinessUnit?.value}` },
    { name: "intDistributionChannelId", value: `${+channel?.value}` || 0 },
    { name: "dteApprovedDateFrom", value: `${fromDate}` },
    { name: "dteApprovedDateTo", value: `${toDate}` },
  ];
  console.log(parameter);

  return parameter;
};

// report types
export const reportTypes = [
  { value: 1, label: "Details" },
  { value: 2, label: "Top Sheet" },
];

// sales contract inital values
export const salesContractInitalValues = {
  reportType: { value: 1, label: "Details" },
  channel: "",
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
};

// get sales contractDetails
export const salesContractDetailsLandingData = (obj) => {
  const {
    dispatch,
    profileData,
    selectedBusinessUnit,
    setLoading,
    pageNo,
    pageSize,
  } = obj;

  dispatch(
    getSalesContactGridData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setLoading,
      pageNo,
      pageSize
    )
  );
};
