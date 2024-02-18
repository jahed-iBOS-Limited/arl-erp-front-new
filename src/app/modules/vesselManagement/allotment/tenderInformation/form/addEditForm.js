import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import { GetDomesticPortDDL } from "../../loadingInformation/helper";
import { editTenderInfo, tenderInfoApprove } from "../helper";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  motherVessel: "",
  programNo: "",
  item: "",
  cnf: "",
  steveDore: "",
  lotNo: "",
  type: "badc",
  UoM: { value: 1, label: "Ton" },
  programQuantity: "",
  weight: "",
  award: "",
  port: "",
  surveyor: "",
  surveyorRate: "",
  cnfRate: "",
  steveDoreRate: "",
  hatchLabour: "",
  hatchLabourRate: "",
  organization: "",
  hasTransportBill: { value: true, label: "Yes" },
};

export default function TenderInformationCreateForm() {
  const { id, type } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [, postData, loading] = useAxiosPost();
  const [portDDL, setPortDDL] = useState([]);
  const { state } = useLocation();
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    if (id) {
      const {
        motherVesselName,
        motherVesselId,
        program,
        itemId,
        itemName,
        uomid,
        uomname,
        programQnt,
        lotNo,
        award,
        stevdoreId,
        stevdoreName,
        cnfid,
        cnfname,
        netWeight,
        portName,
        portId,
        serveyorId,
        serveyorName,
        cnfrate,
        stevdorRate,
        serveyorRate,
        hatchLabourId,
        hatchLabour,
        hatchLabourRate,
        isTruckBill,
        organizationId,
        organizationName,
      } = state;
      const singleInfo = {
        motherVessel: {
          value: motherVesselId,
          label: motherVesselName,
        },
        programNo: program,
        item: {
          value: itemId || 0,
          label: itemName,
        },
        cnf: {
          value: cnfid || 0,
          label: cnfname,
        },
        steveDore: {
          value: stevdoreId || 0,
          label: stevdoreName,
        },
        surveyor: {
          value: serveyorId || 0,
          label: serveyorName,
        },
        lotNo: lotNo,
        type: organizationId === 73245 ? "bcic" : "badc",
        UoM: {
          value: uomid || 0,
          label: uomname,
        },
        programQuantity: programQnt,
        weight: netWeight,
        award: award,
        cnfRate: cnfrate,
        steveDoreRate: stevdorRate,
        surveyorRate: serveyorRate,
        hatchLabourRate: hatchLabourRate,
        port: {
          label: portName || "",
          value: portId || 0,
        },
        hatchLabour: {
          label: hatchLabour || "",
          value: hatchLabourId || 0,
        },
        hasTransportBill: {
          label: isTruckBill ? "Yes" : "No",
          value: isTruckBill || 0,
        },
        organization: {
          label: organizationName || "",
          value: organizationId || 0,
        },
      };
      setSingleData(singleInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const saveHandler = async (values, cb) => {
    const payload = {
      accountId: accId || 0,
      businessUnitId: buId || 0,
      lotNo: values?.lotNo || 0,
      award: values?.award || "",
      program: values?.programNo || "",
      motherVesselId: values?.motherVessel?.value || 0,
      motherVesselName: values?.motherVessel?.label || "",
      cnfid: values?.cnf?.value || 0,
      cnfname: values?.cnf?.label || "",
      stevdoreId: values?.steveDore?.value || 0,
      stevdoreName: values?.steveDore?.label || "",
      programQnt: +values?.programQuantity || 0,
      netWeight: values?.weight || 0,
      itemId: values?.item?.value || 0,
      itemName: values?.item?.label || "",
      uomid: values?.UoM?.value || 0,
      uomname: values?.UoM?.label || "",
      actionby: userId || 0,
      portId: values?.port?.value || 0,
      portName: values?.port?.label || "",
      serveyorId: values?.surveyor?.value,
      serveyorName: values?.surveyor?.label,
      cnfrate: values?.cnfRate,
      stevdorRate: values?.steveDoreRate,
      serveyorRate: values?.surveyorRate,
      organizationId:
        buId === 94
          ? values?.type === "badc"
            ? 73244
            : 73245
          : values?.organization?.value,
      organizationName:
        buId === 94
          ? values?.type === "badc"
            ? "BADC"
            : "BCIC"
          : values?.organization?.label,
      hatchLabourId: values?.hatchLabour?.value,
      hatchLabour: values?.hatchLabour?.label,
      hatchLabourRate: values?.hatchLabourRate,
      isTruckBill: values?.hasTransportBill?.value,
    };
    if (id) {
      payload.programId = +id;
      editTenderInfo(payload);
    } else {
      postData(
        `/tms/LigterLoadUnload/CreateGTOGProgramInfo`,
        payload,
        () => {
          cb();
        },
        true
      );
    }
  };

  const approveTenderInformation = (values) => {
    const payload = {
      programId: +id,
      cnfid: values?.cnf?.value || 0,
      cnfname: values?.cnf?.label || "",
      stevdoreId: values?.steveDore?.value || 0,
      stevdoreName: values?.steveDore?.label || "",
      programQnt: +values?.programQuantity || 0,
      netWeight: values?.weight || 0,
      actionby: userId,
      serveyorId: values?.surveyor?.value,
      serveyorName: values?.surveyor?.label,
      cnfrate: values?.cnfRate,
      stevdorRate: values?.steveDoreRate,
      serveyorRate: values?.surveyorRate,
      hatchLabourId: values?.hatchLabour?.value,
      hatchLabour: values?.hatchLabour?.label,
      hatchLabourRate: values?.hatchLabourRate,
      isTruckBill: values?.hasTransportBill?.value,
    };
    tenderInfoApprove(payload, setDisabled);
  };

  const title = `${
    type === "Edit" ? "Edit" : type === "view" ? "View" : "Create"
  } Tender Information`;

  const preData = {
    motherVessel: state?.motherVessel,
    programNo: state?.programNo,
    item: state?.item,
    type: state?.soldToPartner?.value === 73244 ? "badc" : "bcic",
    UoM: { value: 1, label: "Ton" },
    port: state?.port,
  };

  return (
    <>
      {(isDisabled || loading) && <Loading />}
      <Form
        type={type}
        buId={buId}
        title={title}
        accId={accId}
        portDDL={portDDL}
        setLoading={setDisabled}
        saveHandler={saveHandler}
        organizationDDL={organizationDDL}
        motherVesselDDL={motherVesselDDL}
        setMotherVesselDDL={setMotherVesselDDL}
        approveTenderInformation={approveTenderInformation}
        initData={
          id ? singleData : state?.type === "redirect" ? preData : initData
        }
      />
    </>
  );
}
