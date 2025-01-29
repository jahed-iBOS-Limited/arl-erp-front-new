/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useHistory, useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getProductionOrderById, getProductionOrderSFGById } from "../helper";
import ICard from "../../../../_helper/_card";
import "../subpo.css";
import Loading from "./../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router";
const initData = {
  startDateTime: _todayDate(),
  startTime: "",
  endDateTime: "",
  endTime: "",
  prtNumber: "",
  workCenter: "",
  bomName: "",
};

export default function CreateSubPOForm({
  productionOrderSFG,
  productionId,
  plantName,
}) {
  // console.log(productionOrderSFG,"productionOrderSFG")

  const [isDisabled, setDisabled] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const history = useHistory();
  // console.log(gridData,"gridData")
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (params?.id) {
      getProductionOrderById(params?.id, setSingleData);
      getProductionOrderSFGById(
        params?.id || productionId?.key,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, params || productionId]);

  useEffect(() => {
    if (singleData) {
      getProductionOrderSFGById(
        params?.id,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        singleData?.numOrderQty
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  // set data to rowDto dynamically

  const rowDtoHandler = (name, value, index, item) => {
    console.log(name, value, index);
    let xData = [...gridData];
    xData[index][name] = value;
    setGridData(xData);
  };

  const saveHandler = async (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // unnecessary
      const payload = {
        productionOrderId: +gridData?.productionOrderId,
        itemId: +gridData?.itemId,
        itemCode: gridData?.itemCode,
        itemName: gridData?.itemName,
        billOfMaterialId: 0,
        workCenterId: 0,
        numOrderQty: 0,
        uomid: +gridData?.uomid,
        startDateTime: "2020-12-21T10:22:29.087Z",
        endDateTime: "2020-12-21T10:22:29.087Z",
        itemIdTools: 0,
        actionBy: 0,
      };
    } else {
      setDisabled(false);
    }
  };

  const backHandler = () => {
    history.goBack();
  };

  return (
    <IForm
      title={"Create Sub-PO"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset
      isHiddenSave
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        singleData={singleData}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
        gridData={params?.id ? gridData : productionOrderSFG}
        setGridData={setGridData}
        history={history}
        rowDtoHandler={rowDtoHandler}
        productionId={productionId}
        productionOrderSFG={productionOrderSFG}
        paramsId={params?.id}
      />
    </IForm>
  );
}
