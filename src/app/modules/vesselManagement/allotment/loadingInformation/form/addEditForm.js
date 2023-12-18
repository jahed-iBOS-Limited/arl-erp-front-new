import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getMotherVesselInfo } from "../../tenderInformation/helper";
import {
  CreateLighterLoadUnloadInfo,
  EditLighterLoadingInfo,
  getAllotmentDataForLoading,
  // getAllotmentInformation,
  GetDomesticPortDDL,
  getLoadingInfoByVoyageNo,
  GetShipPointDDL,
} from "../helper";
import Form from "./form";

const initData = {
  allotment: "",
  surveyNo: "",
  lighterVessel: "",
  motherVessel: "",
  supplier: "",
  lcNumber: "",
  loadingPort: "",
  unloadingPoint: "",
  sideAt: "",
  loadingStart: "",
  loadingComplete: "",
  customerPassNo: "",
  boatNote: "",
  customRotationNumber: "",
  loadingDate: _todayDate(),
  loadedQty: "",
  isComplete: false,
  programNo: "",
  organization: "",
};

export default function LoadInformationCreate({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps] = useState({});
  const { state } = useLocation();

  // All DDL
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet();
  const [singleData, setSingleData] = useState({});
  const [rowData, setRowData] = useState([]);
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    if (!type || type !== "view") {
      GetDomesticPortDDL(setDomesticPortDDL);
      GetShipPointDDL(accId, buId, setShipPointDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, type]);

  const getVessels = (values) => {
    getMotherVesselDDL(
      `/wms/FertilizerOperation/GetMotherVesselByOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${values
        ?.loadingPort?.value || 0}&OrganizationId=${values?.organization
        ?.value || 0}`
    );
  };

  const saveHandler = async (values, cb) => {
    if (true) {
      const createHeader = {
        allotmentNo: rowData[0]?.allotmentNo,
        motherVesselId: values?.motherVessel?.value,
        actionby: userId,
        customerPassNo: values?.customerPassNo || "",
        customRotationNumber: "",
      };
      const editHeader = {
        voyageNo: values?.voyageNo,
        customerPassNo: values?.customerPassNo || "",
      };
      const createData = rowData
        ?.filter((item) => item?.isSelected)
        ?.map((item) => ({
          sideAt: item?.sideAt,
          lighterVesselId: item?.lighterVesselId,
          lighterVesselName: item?.lighterVessel,
          loadingDate: _todayDate(),
          loadingStartDate: item?.loadingStart,
          loadingCompleteDate: item?.loadingComplete,
          numSurveyQnt: item?.surveyQty,
          sailingDate: item?.sailingDate,
          boatNote: item?.boatNote,
        }));
      const editData = rowData?.map((item) => ({
        rowId: item?.rowId,
        dteSideAt: item?.sideAt,
        loadingStartDate: item?.loadingStart,
        loadingCompleteDate: item?.loadingComplete,
        sailingDate: item?.sailingDate,
        surveyQnt: item?.surveyQty,
        boatNote: item?.boatNote,
      }));

      const payload = {
        headerObject: type === "edit" ? editHeader : createHeader,
        rowObject: type === "edit" ? editData : createData,
      };
      if (payload.rowObject && payload.rowObject.length > 0) {
        type === "edit"
          ? EditLighterLoadingInfo(payload, setDisabled, () => {
              cb();
              setRowData([]);
            })
          : CreateLighterLoadUnloadInfo(payload, setDisabled, () => {
              cb();
              setRowData([]);
            });
      } else {
        toast.warning("Please select at least one row");
      }
    }
  };

  useEffect(() => {
    if (id) {
      getLoadingInfoByVoyageNo(
        state?.rowId,
        id,
        setSingleData,
        setRowData,
        setDisabled
      );
    }
  }, [id, state, type]);

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "motherVessel":
        setFieldValue("motherVessel", currentValue);
        if (currentValue) {
          getMotherVesselInfo(
            currentValue?.value,
            values?.loadingPort?.value,
            setDisabled,
            (resData) => {
              setFieldValue("programNo", resData?.programNo || "");
              getAllotmentDataForLoading(
                values?.loadingPort?.value,
                currentValue?.value,
                resData?.programNo,
                setRowData,
                setDisabled,
                (resData) => {}
              );
            }
          );
        }

        break;

      case "allotment":
        setFieldValue("allotment", currentValue);
        break;

      case "lighterVessel":
        setFieldValue("lighterVessel", currentValue);

        break;

      default:
        break;
    }
  };

  const title = `${
    type === "view" ? "View" : type === "edit" ? "Edit" : "Create"
  } Loading Information`;

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        accId={accId}
        buId={buId}
        type={type}
        title={title}
        rowData={rowData}
        selectedAll={selectedAll}
        allSelect={allSelect}
        organizationDDL={organizationDDL}
        saveHandler={saveHandler}
        shipPointDDL={shipPointDDL}
        rowDataHandler={rowDataHandler}
        domesticPortDDL={domesticPortDDL}
        motherVesselDDL={motherVesselDDL}
        onChangeHandler={onChangeHandler}
        initData={id ? singleData : initData}
        getVessels={getVessels}
      />
    </>
  );
}
