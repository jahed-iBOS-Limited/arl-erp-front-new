import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useParams } from "react-router";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import {
  CreateShippingCharge,
  EditShippingCharge,
  GetAgentDDL,
  GetBankListDDL,
  GetShippingChargeList,
  GetShippingLineDDL,
  GetSingleData,
} from "../helper";
import { GetShipmentDDL } from "../../insurance/collapsePanels/shipmentwisePolicy/helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  arivalDate: _dateFormatter(new Date()),
  billNo: "",
  description: "",
  instrument: "",
  payBank: "",
  deliveryDate: _dateFormatter(new Date()),
  amountBDT: "",
  demurrage: "",
  total: "",
  paymentDate: _dateFormatter(new Date()),
  shippingLine: "",
  agent: "",
  shipment: "",
};

export default function ShippingChargeForm() {
  const { type, pid } = useParams();
  const [isDisabled] = useState(false);
  const [objProps] = useState({});
  const [gridData, setGridData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [open, setOpen] = useState(false);

  // file upload
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  //paginationState

  // DDL
  const [agentDDL, setAgentDDL] = useState([]);
  const [shipmentDDL, setShipmentDDL] = useState([]);
  const [shippingLineDDL, setShippingLineDDL] = useState([]);
  const [bankListDDL, setBankListDDL] = useState([]);

  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    GetAgentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setAgentDDL
    );
    GetBankListDDL(setBankListDDL);
    GetShipmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShipmentDDL
    );
    GetShippingLineDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShippingLineDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    GetSingleData(pid, setSingleData);
  }, [pid]);
  useEffect(() => {
    GetShippingChargeList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (pid && profileData?.accountId && selectedBusinessUnit?.value) {
      EditShippingCharge(
        values,
        cb,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        pid
      );
    } else {
      CreateShippingCharge(
        values,
        cb,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        uploadImage,
        () => {
          GetShippingChargeList(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            setGridData
          );
        }
      );
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={type === "view" || type === "edit" ? singleData : initData}
          saveHandler={saveHandler}
          // edit={pid ? edit : false}
          viewType={type}
          open={open}
          setOpen={setOpen}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          setUploadImage={setUploadImage}
          agentDDL={agentDDL}
          shipmentDDL={shipmentDDL}
          shippingLineDDL={shippingLineDDL}
          bankListDDL={bankListDDL}
          accId={profileData?.accountId}
          buId={selectedBusinessUnit?.value}
          gridData={gridData}
        />
      </div>
    </>
  );
}
