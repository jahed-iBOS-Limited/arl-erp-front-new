import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  getRouteDDL,
  
  saveEditedSecondaryOrder,
  getSingleData,
} from "../helper";
import { isUniq } from "../../../../_helper/uniqChecker";
import { savSecondaryOrderAction } from "./../helper";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  partnerName: "",
  amount: "",
};

export default function PrimaryCollectionForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [routeDDL, setRouteDDL] = useState([]);
  const [beatNameDDL, setBeatNameDDL] = useState([]);
  const [outletNameDDl, setOutletNameDDL] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [itemRowDto, setItemRowDto] = useState([]);

  const params = useParams();
  console.log(singleData, "singleData");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  console.log(itemRowDto, "itemRowDto");

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getRouteDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRouteDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // get value addition view data
  useEffect(() => {
    if (id) {
      getSingleData(id, setSingleData, setItemRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const newData = singleData?.row?.map((item) => ({
      rowId: item?.rowId,
      itemId: item?.productId,
      itemName: item?.productName,
      uomId: item?.uomid,
      uomName: item?.uomname,
      orderQty: item?.orderQuantity,
      rate: item?.price,
      amount: item?.orderAmount,
      receivedAmount: item?.recievedAmount,
    }));

    if (params?.id) {
      setItemRowDto(newData);
    } else {
      setItemRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        // eslint-disable-next-line no-unused-vars
        const payload = {
          id: +id,
          businessPartnerId: values?.partnerName?.value,
          collectionDate: _todayDate(),
          amount: +values.amount,
          isReceived: true,
          actionBy: 0,
          isActive: true,
        };
        saveEditedSecondaryOrder(payload, setDisabled);
      } else {
        const payload = {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          businessPartnerId: values?.partnerName?.value,
          collectionDate: _todayDate(),
          amount: +values.amount,
          isReceived: true,
          actionBy: 0,
          isActive: true,
        };
        savSecondaryOrderAction(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (payload) => {
    if (isUniq("itemId", payload.itemId, itemRowDto)) {
      setItemRowDto([payload, ...itemRowDto]);
    }
  };

  const remover = (payload) => {
    const filterArr = itemRowDto.filter((itm) => itm.itemId !== payload);
    setItemRowDto(filterArr);
  };

  return (
    <IForm
      title={id ? "Edit Primary Collection" : "Create Primary Collection"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        itemRowDto={itemRowDto}
        routeDDL={routeDDL}
        setBeatNameDDL={setBeatNameDDL}
        beatNameDDL={beatNameDDL}
        outletNameDDl={outletNameDDl}
        setOutletNameDDL={setOutletNameDDL}
        setter={setter}
        remover={remover}
        isEdit={id || false}
      />
    </IForm>
  );
}
