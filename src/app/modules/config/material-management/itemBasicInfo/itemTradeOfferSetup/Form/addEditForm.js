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
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";

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
  const [uploadedImage, setUploadedImage] = useState([]);
  const [, postData, loading] = useAxiosPost();
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    const offerTypeId = values?.offerType?.value;
    if (offerTypeId === 1) {
      if (rowDto?.length === 0) return toast.warn("Minimum one item add");
      CreateTradeOfferConfiguration(rowDto, setDisabled, cb);
    } else if (offerTypeId === 2) {
      const payload = {
        head: {
          promotionId: 0,
          promotionCode: "",
          promotionTypeId: values?.offerType?.value,
          promotionName: values?.offerType?.label,
          promotionStartDateTime: values?.fromDate,
          promotionEndDateTime: values?.toDate,
          remarks: values?.remarks,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          status: 0,
          actionBy: profileData?.userId,
          userName: profileData?.userName,
          channelId: values?.distributionChannel?.value,
          attachmentLink: uploadedImage[0]?.id,
        },
        row: rowDto,
      };

      postData(
        `/oms/TradeOffer/CreateTradeOfferConfigurationByRate`,
        payload,
        () => {},
        true
      );
    }
  };

  const [objProps, setObjprops] = useState({});

  const loader = isDisabled || loading;

  return (
    <IForm
      title={`Trade offer setup : [${landingRowData?.itemName} - ${landingRowData?.itemCode}]`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {loader && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        isEdit={id || false}
        saveHandler={saveHandler}
        setRowDto={setRowDto}
        rowDto={rowDto}
        setDisabled={setDisabled}
        setUploadedImage={setUploadedImage}
      />
    </IForm>
  );
}
