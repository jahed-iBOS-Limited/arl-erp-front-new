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

export default function CreateInventoryLoanForm({ loanType }) {
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
  }, [location?.state?.loanId])

  useEffect(() => {
    if (loanSingleData) {
      const newRowData = {
        sbu: { value: loanSingleData?.sbuName, label: loanSingleData?.sbuName },
        narration: loanSingleData?.narration,
        createType: loanSingleData?.transTypeId,
        issueFrom: loanSingleData?.wareHouseId ? { value: 1, label: "Warehouse" } : { value: 2, label: "Shipment" },
        partner: { value: loanSingleData?.businessPartnerId, label: loanSingleData?.businessPartnerName },
        shipPoint: { value: loanSingleData?.shipmentId, label: loanSingleData?.shipmentName },
        lcNo: { value: loanSingleData?.lcid, label: loanSingleData?.lcnumber },
        warehouse: { value: loanSingleData?.wareHouseId, label: loanSingleData?.wareHouseName },
        lighterVessel: loanSingleData?.lighterVesselName,
        motherVessel: loanSingleData?.motherVesselName,
        date: _dateFormatter(loanSingleData?.transDate),
        surveyReportNo: loanSingleData?.surveyReportNo,
        item: { value: loanSingleData?.itemId, label: loanSingleData?.itemName },
        quantity: loanSingleData?.itemQty,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanSingleData]);

  const saveHandler = async (values, cb) => {
    if (!params?.id) {
      const payload = {
        intSbuId: values?.sbu?.value,
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intBusinessPartnerId: +values?.partner?.value || 0,
        strBusinessPartnerName: values?.partner?.label,
        intPlantId: values?.plant?.value,
        intLoanTypeId: loanType,
        intLoanTypeName: loanType === 1 ? "Internal Loan" : "External Loan",
        intTransTypeId: values?.createType,
        strTransTypeName: values?.createType === 1 ? "Issue" : "Receive",
        intWareHouseId: +values?.warehouse?.value || 0,
        strWareHouseName: values?.warehouse?.label || " ",
        intLcid: +values?.lcNo?.value || 0,
        strLcnumber: +values?.lcNo?.label || " ",
        intShipmentId: +values?.shipment?.value || 0,
        strShipmentName: values?.shipment?.label || "",
        strSurveyReportNo: values?.surveyReportNo || "",
        intLighterVesselId: 0,
        strLighterVesselName: values?.lighterVessel || "",
        intMotherVesselId: 0,
        strMotherVesselName: values?.motherVessel || "",
        dteTransDate: values?.date || _todayDate(),
        intItemId: +values?.item?.value || 0,
        strItemName: values?.item?.label || " ",
        strItemCode: values?.item?.code,
        strUomName: values?.uom?.label,
        numItemQty: +values?.quantity || 0,
        numItemRate: 0,
        numItemAmount: Math?.abs(values?.reference?.itemAmount),
        strNarration: values?.narration,
        intActionBy: profileData?.userId,
        intFromOrToBusinessUnitId: values?.toBusinessUnit?.value,
        strFromOrToBusinessUnitName: values?.toBusinessUnit?.label,
        intLoanId: values?.reference?.loanId,
      };
      saveInventoryLoanCreate(payload, setDisabled, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={loanSingleData?.loanId ? "Inventory Loan View" : "Create External Loan"}
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
        modifySingleData={modifySingleData}
        loanSingleData={loanSingleData}
      />
    </IForm>
  );
}
