import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../_chartinghelper/_dateFormatter";
import { _todayDate } from "../_chartinghelper/_todayDate";
import { imarineBaseUrl } from "../../../App";

const validateTimeCharterer = (voyageType, name) => {
  if (+voyageType?.value === 1) {
    return Yup.string().required(`${!name ? "This field" : name} is required`);
  } else {
    return Yup.string();
  }
};

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel Name is required"),
    value: Yup.string().required("Vessel Name is required"),
  }),
  hireType: Yup.object().shape({
    label: Yup.string().required("Ship Type is required"),
    value: Yup.string().required("Ship Type is required"),
  }),
  voyageType: Yup.object().shape({
    label: Yup.string().required("Voyage Type is required"),
    value: Yup.string().required("Voyage Type is required"),
  }),
  startDate: Yup.string().required("Voyage Start Date is required"),
  completionDate: Yup.string().required("Voyage Completion Date is required"),
  voyageDuration: Yup.string().required("Voyage Duration is required"),
  chartererVoyageCode: Yup.object().when("fromCharterer", {
    is: true,
    then: Yup.object()
      .shape({
        value: Yup.string().required("Charterer Voyage Code is required"),
        label: Yup.string().required("Charterer Voyage Code is required"),
      })
      .typeError("Charterer Voyage Code is required"),
    otherwise: Yup.object(),
  }),

  /* Validation For Time Charterer */
  brokerCommission: Yup.object().when("voyageType", (voyageType) =>
    validateTimeCharterer(voyageType, "Broker Commission")
  ),
  addressCommission: Yup.object().when("voyageType", (voyageType) =>
    validateTimeCharterer(voyageType, "Address Commission")
  ),
  charterName: Yup.object().when("voyageType", (voyageType) => {
    if (+voyageType?.value === 1) {
      return Yup.object().shape({
        value: Yup.string().required("Charter Name is required"),
        label: Yup.string().required("Charter Name is required"),
      });
    } else {
      return Yup.object();
    }
  }),
  startPort: Yup.object().when("voyageType", (voyageType) => {
    if (+voyageType?.value === 1) {
      return Yup.object().shape({
        value: Yup.string().required("This Field is required"),
        label: Yup.string().required("This Field is required"),
      });
    } else {
      return Yup.object();
    }
  }),
  endPort: Yup.object().when("voyageType", (voyageType) => {
    if (+voyageType?.value === 1) {
      return Yup.object().shape({
        value: Yup.string().required("This Field is required"),
        label: Yup.string().required("This Field is required"),
      });
    } else {
      return Yup.object();
    }
  }),
  lsmgoPrice: Yup.object().when("voyageType", (voyageType) =>
    validateTimeCharterer(voyageType, "LSMGO")
  ),
  lsifoPrice: Yup.object().when("voyageType", (voyageType) =>
    validateTimeCharterer(voyageType, "LSFO")
  ),
  iloch: Yup.object().when("voyageType", (voyageType) =>
    validateTimeCharterer(voyageType, "iloch")
  ),
  cve30Days: Yup.object().when("voyageType", (voyageType) =>
    validateTimeCharterer(voyageType, "C/V/E 30 Days")
  ),
  dailyHire: Yup.object().when("voyageType", (voyageType) =>
    validateTimeCharterer(voyageType, "Daily Hire")
  ),
});

export const getVoyageLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setLoading,
  setter,
  /* Optinal */
  voyageNo,
  vesselName,
  status
) => {
  setLoading(true);

  const voyageNoStr = voyageNo ? `&VoyageNo=${voyageNo}` : "";
  const vesselNameStr = vesselName ? `&searchByVesselName=${vesselName}` : "";
  const statusStr = status ? `&type=${status}` : "";

  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVoyageLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}${voyageNoStr}${statusStr}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${vesselNameStr}`
    );

    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const createVoyage = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/Voyage/CreateVoyage`,
      data
    );
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editVoyage = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Voyage/EditVoyage`,
      data
    );
    toast.success(res?.data?.message, { toastId: 456789 });
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

export const editVoyageRow = async (data, getByIdCalled, cb) => {
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Voyage/EditVoyageRow`,
      data
    );
    toast.success(res?.data?.message, { toastId: 456 });
    getByIdCalled();
    cb && cb();
  } catch (error) {
    toast.warn(error?.response?.data?.message || error?.message, {
      toastId: 123456,
    });
  }
};

export const editVoyageTimeCharterer = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Voyage/EditVoyageForTimeChtr`,
      data
    );
    setLoading(false);
    toast.success(res?.data?.message, { toastId: 456 });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || error?.message, {
      toastId: 123456,
    });
  }
};

export const DeleteVoyage = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.delete(
      `${imarineBaseUrl}/domain/Voyage/DeleteVoyage?voyageId=${id}`
    );
    if (res?.status === 200) {
      cb();
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const activeInactiveVoyage = async (id, status, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Voyage/ActiveOrInActive?voyageId=${id}&activeOrInActive=${status}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetOwnerVesselCharterVoyageID = async (
  vesselId,
  setFieldValue,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/PortPDA/GetOwnerVesselCharterVoyageID?vesselId=${vesselId}`
    );
    setFieldValue("chartererVoyageCode", res?.data);
    setLoading(false);
  } catch (error) {
    setFieldValue("chartererVoyageCode", "");
    setLoading(false);
  }
};

export const getVoyageById = async (
  id,
  setSingleData,
  setChartererRowData,
  setBusinessPartnerGrid,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVoyageByIdNew?VoyageId=${id}`
    );

    const headerData = res?.data?.objVoyage;
    const chartererRowDataResponse = res?.data?.objVoyageRowList;

    setSingleData({
      startDate: headerData?.voyageStartDate,
      completionDate: headerData?.voyageEndDate,
      voyageDuration: headerData?.voyageDurrition,
      hireType: {
        value: headerData?.hireTypeId,
        label: headerData?.hireTypeName,
      },
      vesselName: {
        value: headerData?.vesselId,
        label: headerData?.vesselName,
        ownerId: headerData?.ownerId || 0,
        ownerName: headerData?.ownerName || "",
      },
      ownerId: headerData?.ownerId || 0,
      ownerName: headerData?.ownerName || "",
      voyageType: {
        value: headerData?.voyageTypeId,
        label: headerData?.voyageTypeName,
      },
      currentVoyageNo: headerData?.voyageNo || "",
      chartererVoyageCode: {
        value: 0,
        label: headerData?.voyageCode,
        voyageTypeID: headerData?.voyageTypeId,
        voyageTypeName: headerData?.voyageTypeName,
        chaterId: headerData?.chaterId,
        chaterName: headerData?.chaterName,
        charterVoyageId: headerData?.intChartererVoyageId,
        charterVoyageCode: headerData?.chartererVoyageCode,
        hireTypeId: headerData?.hireTypeId,
        hireTypeName: headerData?.hireTypeName,
      },
      businessPartnerName: "",
      businessPartnerType: "",
      charterName:
        headerData?.voyageTypeId === 2
          ? ""
          : {
              value: chartererRowDataResponse[0]?.charterId,
              label: chartererRowDataResponse[0]?.charterName,
            },
      brokerName:
        headerData?.voyageTypeId === 2
          ? ""
          : {
              value: chartererRowDataResponse[0]?.brokerId,
              label: chartererRowDataResponse[0]?.brokerName,
            },
      brokerCommission:
        headerData?.voyageTypeId === 2
          ? ""
          : chartererRowDataResponse[0]?.brokerCommission,
      addressCommission:
        headerData?.voyageTypeId === 2
          ? ""
          : chartererRowDataResponse[0]?.addressCommission,
      // new added
      deliveryDate:
        headerData?.voyageTypeId === 2
          ? ""
          : chartererRowDataResponse[0]?.deliveryDateTime,
      reDeliveryDate:
        headerData?.voyageTypeId === 2
          ? ""
          : chartererRowDataResponse[0]?.reDeliveryDateTime,
      // above two are new added
      freightPercentage:
        headerData?.voyageTypeId === 2
          ? ""
          : chartererRowDataResponse[0]?.freightPercentage,
      startPort:
        headerData?.voyageTypeId === 2
          ? ""
          : {
              value: chartererRowDataResponse[0]?.loadPortId,
              label: chartererRowDataResponse[0]?.loadPortName,
            },
      endPort:
        headerData?.voyageTypeId === 2
          ? ""
          : {
              value: chartererRowDataResponse[0]?.dischargePortId,
              label: chartererRowDataResponse[0]?.dischargePortName,
            },
      cpDate:
        headerData?.voyageTypeId === 2
          ? _todayDate()
          : _dateFormatter(chartererRowDataResponse[0]?.cpDate),
      layCanFrom:
        headerData?.voyageTypeId === 2
          ? ""
          : _dateFormatter(chartererRowDataResponse[0]?.layCanFrom) ||
            _todayDate(),
      layCanTo:
        headerData?.voyageTypeId === 2
          ? ""
          : _dateFormatter(chartererRowDataResponse[0]?.layCanTo) ||
            _todayDate(),
      lsmgoPrice: chartererRowDataResponse[0]?.lsmgoPrice || "",
      lsifoPrice: chartererRowDataResponse[0]?.lsifoPrice || "",
      iloch: chartererRowDataResponse[0]?.iloch || "",
      cve30Days: chartererRowDataResponse[0]?.cveday || "",
      dailyHire: chartererRowDataResponse[0]?.dailyHire || "",
      ap: chartererRowDataResponse[0]?.apamount || "",
      others: chartererRowDataResponse[0]?.othersAmount || "",
      totalAmount: chartererRowDataResponse[0]?.totalHireAmount || "",
      dueAmount: 0,
      detention:
        headerData?.voyageTypeId === 2
          ? ""
          : chartererRowDataResponse[0]?.detention,
    });

    setChartererRowData(chartererRowDataResponse);
    setBusinessPartnerGrid(res?.data?.objStackInfoList);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getVoyageCompletionChecklist = async (
  voyageId,
  vesselId,
  voyageTypeId,
  setter,
  setLoading,
  setShow
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVoyageListIsComplete?VoyageId=${voyageId}&VesselId=${vesselId}&VoyageTypeId=${voyageTypeId}`
    );
    setter(res?.data);
    setLoading(false);
    setShow(true);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const getBusinessPartnerType = async (setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetStakeholderTypeForVoyageDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const fileDownload = async (url, fileName, setLoading) => {
  try {
    setLoading(true);

    axios({
      url: url,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
    });

    // await axios
    //   .get(url, {
    //     responseType: "blob",
    //   })
    //   .then((response) => {
    //     setLoading(false);
    //     //Create a Blob from the PDF Stream
    //     const file = new Blob([response.data], { type: "application/docx" });
    //     //Build a URL from the file
    //     const fileURL = URL.createObjectURL(file);
    //     //Open the URL on new Window
    //     const pdfWindow = window.open();
    //     pdfWindow.location.href = fileURL;
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     toast.warn(error?.response?.data?.message || "Failed, try again");
    //   });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
