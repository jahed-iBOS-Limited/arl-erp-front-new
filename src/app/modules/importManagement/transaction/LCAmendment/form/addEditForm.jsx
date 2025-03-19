/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import {
  createLCAmendment,
  updateLCAmendment,
  getSingleData,
  GetDataForForm,
  GetItemListDetailsByPOId,
  saveLcDocAmendmentRowApi,
} from "./../helper";
import { encoItemDDLAction, LCTypeDDLAction } from "../../lc-open/helper";
import IWarningModal from "../../../../_helper/_warningModal";
import { toast } from "react-toastify";

const initData = {
  lcType: "",
  LCExpiredDate: _dateFormatter(new Date()),
  lastShipmentDate: _dateFormatter(new Date()),
  dueDate: _dateFormatter(new Date()),
  incoTerms: "",
  tolarencePercentage: "",
  LCTenorDays: "",
  totalAmendmentCharge: "",
  VATOnAmendmentCharge: "",
  totalPIAmount: "",
  attachment: "",
  currency: "",
  PIAmountBDT: "",
  exchangeRate: 1,
  docLink: "",
};

export default function LCAmendmentForm() {
  const location = useLocation();
  const params = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [LCTypeDDL, setLCTypeDDL] = useState([]);
  const [formData, setFormData] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [incoTermsDDL, setIncoTermsDDL] = useState([]);
  // get singleData
  const [singleData, setSingleData] = useState("");
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (params?.pid) {
      getSingleData(params?.pid, setSingleData, setDisabled);
    }
  }, []);

  let PIAmount = itemList?.reduce((total, value) => total + value?.price, 0);

  useEffect(() => {
    if (formData?.length === 0) {
      GetDataForForm(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.ponumber,
        setFormData
      );
    }
    LCTypeDDLAction(setDisabled, setLCTypeDDL);
    encoItemDDLAction(setDisabled, setIncoTermsDDL);
  }, []);

  useEffect(() => {
    GetItemListDetailsByPOId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      location?.state?.ponumber,
      setItemList
    );
  }, []);

  const saveHandler = (values, cb) => {
    if (
      Number(values?.VATOnAmendmentCharge) >
      Number(values?.totalAmendmentCharge)
    ) {
      return toast.error("VAT can't be greater than Total Amount");
    } else if (params?.pid) {
      return updateLCAmendment(setDisabled, singleData, values, uploadImage);
    }
    return createLCAmendment(
      setDisabled,
      values,
      profileData,
      location?.state?.lcnumber,
      location?.state?.ponumber,
      location?.state?.lcid,
      selectedBusinessUnit,
      uploadImage,
      cb,
      itemList,
      PIAmount,
      location?.state?.poId,
      location?.state?.sbuId,
      location?.state?.plantId
    );
  };

  const rowDtoHandler = (name, value, sl, setFieldValue, values) => {
    let data = [...itemList];
    let _sl = data[sl];
    _sl[name] = value;
    _sl["price"] = value * _sl.basePrice;
    setItemList(data);
    let PINewAmount = data?.reduce((total, value) => total + value?.price, 0);
    setFieldValue("PIAmountBDT", +values?.exchangeRate * PINewAmount);
  };
  const saveLcDocAmendmentRowHandler = (values) => {
    const payload = {
      intLcDocAmendmentRowId: 0,
      strEditLcFieldNameJson: "",
      intLcDocAmendmentConfigId: 0,
      strLcDocAmendmentConfigName: "",
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intLcId: 0,
      strLcDocId: "",
      intAmendmentNum: 0,
      isActive: true,
      dteLastActionDateTime: new Date(),
      intLastActionBy: 0,
      dteServerDateTime: new Date(),
      intUpdateBy: 0,
    };

    saveLcDocAmendmentRowApi(payload, setDisabled, () => {
      
    });
  };
  return (
    <IForm
      title="LC Amendment"
      getProps={setObjprops}
      isDisabled={isDisabled || params?.type === "view"}
    >
      {/* {isDisabled && <Loading />} */}

      <Form
        {...objProps}
        initData={
          params?.pid ? singleData : formData
          // { ...initData, lcNo: location?.state?.lcNo, formData }
        }
        // initData={formData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        setUploadImage={setUploadImage}
        viewType={params?.type}
        location={location}
        LCTypeDDL={LCTypeDDL}
        itemList={itemList}
        incoTermsDDL={incoTermsDDL}
        rowDtoHandler={rowDtoHandler}
        PIAmount={PIAmount}
        setDisabled={setDisabled}
        saveLcDocAmendmentRowHandler={saveLcDocAmendmentRowHandler}
      />
    </IForm>
  );
}
