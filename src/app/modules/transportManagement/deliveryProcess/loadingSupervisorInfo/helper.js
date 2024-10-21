import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

// === landing ==== //

// init data
export const initData = {
  type: { value: 3, label: "Scan Card/QR Code Scan (IN)" },
  shipmentId: "",
  shipmentCode: "",
  shippingPoint: "",
  shipPoint: "",
  vehicleNumber: "",
  driver: "",
  deliveryDate: "",
  packerName: "",
  tlm: "",
  viewType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  // packer forcely complete
  reportType: { value: 1, label: "Shipment Created" },
};

// packer forcely complete report type ddl
export const packerReportTypeDDL = [{ value: 1, label: "Shipment Created" }];

//
export const headers_one = [
  "SL",
  "Item",
  "Bag Type",
  "UoM",
  "Quantity",
  "Price",
  "Actions",
];

//
export const headers_two = [
  "SL",
  "Shipment Code",
  "Vehicle",
  "Bag Type",
  "Total Qty",
  "UoM",
  "Route Name",
  "Transport Name",
  "Provider Type",
  "Shipping Type",
  "TLM",
  "Bursting Qty",
  "Actions",
];

// packer forcely complete table header
export const packerForcelyCompleteTableHeader = [
  "SL",
  "Shipment No",
  "Contact Date",
  "Route Name",
  "Transport Mode",
  "Provider Type",
  "Shipping Type Name",
  "Vehicle Name",
  "Loading Confirm Date",
  "Pump",
  "Total Qty",
  "Actions",
];

// choose report table
export const chooseReportTableHeader = (values, selectedBusinessUnit) => {
  let headers;

  //   switch (values?.type?.value) {
  //     case 1:
  //     case 2:
  //       // if business unit is 144 than show all header but if it's not than remove last header element
  //       if (selectedBusinessUnit?.value === 144) {
  //         headers = headers_one;
  //       } else if (selectedBusinessUnit?.value !== 144) {
  //         headers = headers_one.slice(0, -2);
  //       } else {
  //         headers = headers_two;
  //       }
  //       break;

  //     case 6:
  //       headers = packerForcelyCompleteTableHeader;
  //       break;

  //     default:
  //       headers = headers_two;
  //   }

  switch (true) {
    case [1, 2].includes(values?.type?.value):
      headers = headers_two;
      break;

    case [6].includes(values?.type?.value):
      headers = packerForcelyCompleteTableHeader;
      break;

    case selectedBusinessUnit?.value === 144:
      headers = headers_one;
      break;

    case selectedBusinessUnit?.value !== 144:
      headers = headers_one.slice(0, -2);
      break;

    default:
      headers = headers_two;
  }

  return headers;
};

// reportTypeDDL
export const reportTypeDDL = [
  // { value: 1, label: "Loading Pending" },
  { value: 1, label: "Delivery Complete" },
  { value: 3, label: "Scan Card/QR Code Scan (IN)" },
  { value: 5, label: "Scan Card/QR Code Scan (OUT)" },
  { value: 6, label: "Packer Forcely Complete" },
  // { value: 4, label: "Shift wise Packer Information" },
];

// get data
export const getData = (
  profileData,
  selectedBusinessUnit,
  values,
  getRowData,
  _pageNo = 0,
  _pageSize = 300
) => {
  getRowData(
    `/oms/LoadingPoint/GetLoadingSupervisorConfirmation?isTransferChallan=false&statusId=${values?.type?.value}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}&pageNo=${_pageNo}&pageSize=${_pageSize}`
    // `/oms/LoadingPoint/GetPackerLoadingConfirmation?isTransferChallan=false&statusId=${values?.type?.value}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}&pageNo=${_pageNo}&pageSize=${_pageSize}`
  );
};

// fetch packer forcely complete data
export const fetchPackerForceCompleteData = (obj) => {
  // destructure
  const {
    getPackerForcelyCompleteData,
    selectedBusinessUnit,
    profileData,
    values,
    pageNo = 0,
    pageSize = 100,
  } = obj;

  const { fromDate, toDate, search, shipPoint, reportType } = values;

  // search
  const searchTerm = search ? `&SearchTerm=${search}` : "";

  // api function
  getPackerForcelyCompleteData(
    `/oms/Shipment/GetShipmentPasignation?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&ShipmentId=${shipPoint?.value}&ReportType=${reportType?.value}&FromDate=${fromDate}&Todate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchTerm}`
  );
};

// power bi

// group id
export const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
// power bi
export const reportId = `fe886d74-87ab-42e5-8695-b4be96e51aca`;
// parameter values
export const parameterValues = (values) => {
  const shiftWisePackerInformation = [
    { name: "fromdate", value: `${values?.fromDate}` },
    { name: "todate", value: `${values?.toDate}` },
    { name: "ViewType", value: `${+values?.viewType?.value}` },
  ];

  return shiftWisePackerInformation;
};

// handle card number change
export const handleCardNumberChange = (obj) => {
  // destructure
  const {
    e,
    setFieldValue,
    getReportData,
    getTLMDDL,
    selectedBusinessUnit,
    setShipPointIdForCementTlmLoadFromPacker,
    getPackerList,
    profileData,
    setPackerList,
  } = obj;

  // screen width
  const screenWidth = window.screen.width;
  // if screen width is less than 575
  const isMobileDevice = screenWidth < 575 ? true : false;
  // Check if the Enter key is pressed
  const isEnterKeyPress = e.key === "Enter" || e.keyCode === 13;

  // handle card number details if enter key press or mobile device button press
  if (isEnterKeyPress || isMobileDevice) {
    setFieldValue("shipmentCode", e.target.value);

    // get report data & update formik field
    getReportData(
      // `/wms/Delivery/GetDeliveryPrintInfoManual?businessUnitId=${selectedBusinessUnit?.value}&shipmentCode=${e.target.value}`,
      `/wms/Delivery/GetDeliveryPrintInfoByVehicleCardNumber?strCardNumber=${e.target.value}`,
      (res) => {
        // get tlm ddl
        getTLMDDL(
          `/wms/AssetTransection/GetLabelNValueForDDL?BusinessUnitId=${
            selectedBusinessUnit?.value
          }&TypeId=1&RefferencePKId=${
            selectedBusinessUnit?.value === 4 ? res?.objHeader?.packerId : 1
          }&ShipPointId=${res?.objHeader?.shipPointId || 0}`
        );

        // for cement business unit & use in packer change
        setShipPointIdForCementTlmLoadFromPacker(res?.objHeader?.shipPointId);
        // get packer list & update
        getPackerList(
          `/mes/WorkCenter/GetWorkCenterListByTypeId?WorkCenterTypeId=1&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,

          (resData) => {
            // set ddl state
            setPackerList(
              resData?.map((item) => ({
                ...item,
                value: item?.workCenterId,
                label: item?.workCenterName,
              }))
            );
          }
        );

        // destructure value
        const { packerName, packerId } = res?.objHeader;

        // set formik state value
        setFieldValue("packerName", {
          value: packerId !== 0 ? packerId : 0,
          label: packerName !== null ? packerName : "N/A",
        });

        setFieldValue("shippingPoint", res?.objHeader?.shipPointName || "");
        setFieldValue("vehicleNumber", res?.objHeader?.strVehicleName || "");
        setFieldValue("driver", res?.objHeader?.driverName || "");
        setFieldValue(
          "deliveryDate",
          _dateFormatter(res?.objHeader?.pricingDate) || ""
        );
      }
    );
  }
};

// ! edit packer forcely complete edit (need to work)
export const getDeliveryShippingInfoById = (
  item,
  profileData,
  getShippingInfo,
  setOpen
) => {
  getShippingInfo(
    `oms/LoadingPoint/CompletePackerForcely?shipmentId=${item?.shipmentId}&actionBy=${profileData?.userId}&tlm=3&brustingQuantity=0&packerId=241`,
    () => setOpen(true)
  );
};
