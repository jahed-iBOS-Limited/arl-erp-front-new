/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getLoanSingleData, saveInventoryLoanCreate } from "../helper";
import Form from "./form";

const initData = {
  sbu: "",
  narration: "",
  createType: 1,
  issueFrom: "",
  partner: "",

  /* If Issue Form is warehouse then */
  shipPoint: "",
  lcNo: "",

  /* If warehouse */
  warehouse: "",

  lighterVessel: "",
  motherVessel: "",
  date: _todayDate(),
  surveyReportNo: "",
  item: "",
  quantity: "",
};

export default function CreateInventoryLoanForm() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [loanSingleData, setLoanSingleData] = useState("");
  const [modifySingleData, setModifySingleData] = useState("");

  const params = useParams();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const location = useLocation();

  useEffect(() => {
    getLoanSingleData(location?.state?.loanId, setLoanSingleData)
  },[location?.state?.loanId])

  useEffect(() => {
    if (loanSingleData) {
      const newRowData = {
        sbu:{value:loanSingleData?.sbuName, label:loanSingleData?.sbuName},
        narration:loanSingleData?.narration,
        createType: loanSingleData?.transTypeId,
        issueFrom: loanSingleData?.wareHouseId ? { value: 1, label: "Warehouse" } : { value: 2, label: "Shipment"},
        partner: {value:loanSingleData?.businessPartnerId, label:loanSingleData?.businessPartnerName},
        shipPoint: {value:loanSingleData?.shipmentId, label:loanSingleData?.shipmentName},
        lcNo: {value:loanSingleData?.lcid, label:loanSingleData?.lcnumber},
        warehouse: {value:loanSingleData?.wareHouseId, label:loanSingleData?.wareHouseName},
        lighterVessel: loanSingleData?.lighterVesselName,
        motherVessel: loanSingleData?.motherVesselName,
        date: _dateFormatter(loanSingleData?.transDate),
        surveyReportNo: loanSingleData?.surveyReportNo,
        item:{value:loanSingleData?.itemId, label:loanSingleData?.itemName},
        quantity: loanSingleData?.itemQty,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanSingleData]);

  const saveHandler = async (values, cb) => {
    if (!params?.id) {
      const payload = {
        SbuId: values?.sbu?.value,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        businessPartnerId: +values?.partner?.value || 0,
        businessPartnerName: values?.partner?.label || " ",
        transTypeId: values?.createType,
        transTypeName: values?.createType === 1 ? "Issue" : "Receive",
        wareHouseId: +values?.warehouse?.value || 0,
        wareHouseName: values?.warehouse?.label || " ",
        shipmentId: +values?.shipment?.value || 0,
        shipmentName: values?.shipment?.label || " ",
        lcid: +values?.lcNo?.value || 0,
        lcnumber: +values?.lcNo?.label || " ",
        surveyReportNo: values?.surveyReportNo || " ",
        lighterVesselId: 0,
        lighterVesselName: values?.lighterVessel || " ",
        motherVesselId: 0,
        motherVesselName: values?.motherVessel || " ",
        transDate: values?.date || _todayDate(),
        itemId: +values?.item?.value || 0,
        itemName: values?.item?.label || " ",
        itemQty: +values?.quantity || 0,
        itemRate: 0,
        narration:values?.narration,
        actionBy: profileData?.userId,
      };
      console.log("Save Inventory ", payload);
      saveInventoryLoanCreate(payload, setDisabled, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={loanSingleData?.loanId ? "Inventory Loan View" : "Inventory Loan Create"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={params?.type === "viewType" || loanSingleData?.loanId}
      isHiddenReset={params?.type === "viewType" || loanSingleData?.loanId}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDto={rowDto}
        setRowDto={setRowDto}
        prId={2}
        type={params?.type}
        location={location}
        modifySingleData ={modifySingleData}
        loanSingleData ={loanSingleData}
      />
    </IForm>
  );
}
