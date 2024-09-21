import moment from "moment";
import * as Yup from "yup";

// init data
export const initData = {
  fromDateTime: "",
  toDateTime: "",
  shipPoint: "",
};

// validation schema
export const validationSchema = Yup.object({
  fromDateTime: Yup.date().required("Please enter fromt date time"),
  toDateTime: Yup.date().required("Please enter fromt date time"),
  shipPoint: Yup.string().required("Ship point is required"),
});

// group id
export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";

// select report id
export const selectReportId = {
  rdl: "073c7fa2-cbe2-4706-bd09-855f021b1861",
};

// select paramter
export const selectParameters = (values, buUnId) => {
  const { fromDateTime, toDateTime, shipPoint } = values;
  return [
    {
      name: "fromdate",
      value: `${moment(fromDateTime).format("YYYY-MM-DD HH:mm:ss.SSS")}`,
    },
    {
      name: "todate",
      value: `${moment(toDateTime).format("YYYY-MM-DD HH:mm:ss.SSS")}`,
    },
    { name: "intUnit", value: `${buUnId}` },
    { name: "intShippoint", value: `${shipPoint?.value}` },
  ];
};
