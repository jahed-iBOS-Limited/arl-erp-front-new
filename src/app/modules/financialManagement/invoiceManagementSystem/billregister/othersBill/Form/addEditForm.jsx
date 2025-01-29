import React, { useState, } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "./../../../../../_helper/_form";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import Loading from "./../../../../../_helper/_loading";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { compressfile } from "../../../../../_helper/compressfile";
import { attachmentUpload } from "../../../../../_helper/attachmentUpload";
import { postOthersBillEntry } from "../helper";

const initData = {
  partnerType: "",
  partner: "",
  billAmount:0,
  narration:"",
  billDate:_todayDate()
};

export default function OthersBillForm({ landingValue }) {
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);



  const saveHandler = async (values, cb) => {
    try {
      const compressedFile = fileObjects?.length > 0 ? await compressfile(fileObjects?.map((f) => f.file)) : [];
      const uploadedData = compressedFile?.length>0 ?  await attachmentUpload(compressedFile) : [];
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        sbuId: landingValue?.sbu?.value,
        plantId: landingValue?.plant?.value,
        partnerTypeId: values?.partnerType?.value,
        partnerType: values?.partnerType?.label,
        partnerId: values?.partner?.value,
        partnerName: values?.partner?.label,
        narration: values?.narration,
        billAmount: values?.billAmount,
        actionById: profileData?.userId,
        billDate: values?.billDate,
        imageString: uploadedData?.length > 0 ? uploadedData.map(item=>({imageId:item?.id})):[{imageId:""}]
      }
      postOthersBillEntry(payload, cb)
    } catch (error) {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});
  return (
    <div className="purchaseInvoice">
      <IForm
        title="Fuel Bill Invoice"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          profileData={profileData}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          setDisabled={setDisabled}

        />
      </IForm>
    </div>
  );
}
