import * as Yup from "yup";

// init data
export const initData = {
  fromDateTime: "",
  toDateTime: "",
};

// validation schema
export const validationSchema = Yup.object({
  fromDateTime: Yup.date().required("Please enter fromt date time"),
  toDateTime: Yup.date().required("Please enter fromt date time"),
});

// group id
export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";

// select report id
export const selectReportId = {
  rdl: "073c7fa2-cbe2-4706-bd09-855f021b1861",
};

// select paramter
export const selectParameters = (values, buUnId) => {
  const { fromDateTime, toDateTime } = values;
  return [
    { name: "fromdate", value: `${fromDateTime}` },
    { name: "todate", value: `${toDateTime}` },
    { name: "intUnit", value: `${buUnId}` },
    { name: "intShippoint", value: `${0}` },
  ];
};
