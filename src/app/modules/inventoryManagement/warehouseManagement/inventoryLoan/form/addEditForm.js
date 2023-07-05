/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  sbu: "",
  narration: "",
  createType: 1,
  issueFrom: "",
  partner: "",
  /* If Issue Form is warehouse then */
  shipment: "",
  lcNo: "",
  /* If warehouse */
  warehouse: "",
  lighterVessel: "",
  motherVessel: "",
  date: _todayDate(),
  surveyReportNo: "",
  item: "",
  itemRate: "",
  quantity: "",
};

export default function CreateInventoryLoanForm({ loanType }) {
  const [rowDto, setRowDto] = useState([]);

  const params = useParams();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [, saveData, saveDataLoader] = useAxiosPost()
  const location = useLocation();
  const saveHandler = async (values, cb) => {
    if (!params?.id) {
      const payload = {
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intPlantId: 0,
        intSbuId: values?.sbu?.value,
        intBusinessPartnerId: +values?.partner?.value,
        strBusinessPartnerName: values?.partner?.label,
        intLoanTypeId: loanType,
        intLoanTypeName: loanType === 1 ? "Internal Loan" : "External Loan",
        intTransTypeId: values?.createType,
        strTransTypeName: values?.createType === 1 ? "Issue" : "Receive",
        intWareHouseId: +values?.warehouse?.value || 0,
        strWareHouseName: values?.warehouse?.label || "",
        intLcid: +values?.lcNo?.value || 0,
        strLcnumber: +values?.lcNo?.label || "",
        intShipmentId: +values?.shipment?.value || 0,
        strShipmentName: values?.shipment?.label || "",
        strSurveyReportNo: values?.surveyReportNo || "",
        intLighterVesselId: 0,
        strLighterVesselName: values?.lighterVessel || "",
        intMotherVesselId: 0,
        strMotherVesselName: values?.motherVessel || "",
        dteTransDate: values?.date || _todayDate(),
        intItemId: +values?.item?.value || 0,
        strItemName: values?.item?.label || "",
        strItemCode: values?.item?.code,
        strUomName: values?.item?.uomName,
        numItemQty: +values?.quantity || 0,
        numItemRate: +values?.itemRate || 0,
        numItemAmount: (+values?.itemRate * +values?.quantity) || 0,
        strNarration: values?.narration,
        intActionBy: profileData?.userId,
        intFromOrToBusinessUnitId: selectedBusinessUnit?.value,
        strFromOrToBusinessUnitName: selectedBusinessUnit?.label,
        intLoanId: 0,
      };
      saveData(`/wms/InventoryLoan/CreateInvItemloan`, payload, cb, true)
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Create External Loan"}
      getProps={setObjprops}
    >
      {saveDataLoader && <Loading />}
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
      />
    </IForm>
  );
}
