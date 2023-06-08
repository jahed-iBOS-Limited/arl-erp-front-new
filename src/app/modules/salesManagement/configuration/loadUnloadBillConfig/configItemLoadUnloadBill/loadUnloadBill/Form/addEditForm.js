import React, { useEffect, useState } from "react";
import Form from "./form.js";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import IForm from "../../../../../../_helper/_form";
import { creata_Api, edit_API, GetLoadUnloadView } from "../helper.js";
import Loading from "../../../../../../_helper/_loading.js";

export default function CreateLoadUnloadBill() {
  const [isDisabled, setDisabled] = useState(false);
  const params = useParams();
  const [objProps, setObjprops] = useState({});

  const initData = {
    shipPoint: "",
    itemName: "",
    quantity: "1",
    loadAmount: "0",
    unloadAmount: "",
    vehicleCapacity: "",
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //singleData by id
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    if (params?.id) {
      GetLoadUnloadView(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.id,
        setSingleData,
        setDisabled
      );
    }
  }, [params, selectedBusinessUnit, profileData]);

  const saveData = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          intId: values?.intId,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          itemId: values?.itemName?.value,
          itemName: values?.itemName?.label,
          shipPointId: values?.shipPoint?.value,
          loadAmount: +values?.loadAmount,
          unloadAmount: +values?.unloadAmount,
          quantity: +values?.quantity,
          actionBy: +profileData.userId,
          vehicleCapacityId: values?.vehicleCapacity?.value
        };

        edit_API(payload, setDisabled);
      } else {
        let payload = [
          {
            itemId: values?.itemName?.value,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            itemName: values?.itemName?.label,
            shipPointId: values?.shipPoint?.value,
            loadAmount: +values?.loadAmount,
            unloadAmount: +values?.unloadAmount,
            quantity: +values?.quantity,
            actionBy: +profileData.userId,
            vehicleCapacityId: values?.vehicleCapacity?.value
          },
        ];

        creata_Api(payload, cb, setDisabled);
      }
    } else {
      console.log(values);
    }
  };
  return (
    <IForm
      title="Create Load Unload Bill Config"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveData={saveData}
        // disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit?.value}
        isEdit={params?.id || false}
        id={params?.id}
      />
    </IForm>
  );
}
