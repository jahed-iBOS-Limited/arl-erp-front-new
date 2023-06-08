import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateTradeOfferConfiguration } from "../../helper";
import IForm from "./../../../../../_helper/_form";
import Loading from "./../../../../../_helper/_loading";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import Form from "./form";

const initData = {
  id: undefined,
  initData: "",
  offerItem: "",
  distributionChannel: "",
  toDate: _todayDate(),
  fromDate: _todayDate(),
  offerQuantity: "",
  numMinQuantity: "",
  isMinApplied: false,
  isMaxApplied: false,
  isOfferContinuous: false,
  isProportionalOffer: false,
};

export default function ItemTradeOfferSetupForm() {
  const { state: landingRowData } = useLocation();
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowDto?.length === 0) return toast.warn("Minimum one item add");
      CreateTradeOfferConfiguration(rowDto, setDisabled, cb);
    } else {
      console.log(values);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={`Trade offer setup : [${landingRowData?.itemName} - ${landingRowData?.itemCode}]`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        isEdit={id || false}
        saveHandler={saveHandler}
        setRowDto={setRowDto}
        rowDto={rowDto}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}
