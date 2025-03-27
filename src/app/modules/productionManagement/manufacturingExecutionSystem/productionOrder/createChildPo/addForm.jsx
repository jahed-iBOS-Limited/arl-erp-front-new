

import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useHistory, useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getProductionOrderById, getProductionOrderSFGById } from "../helper";
import "../subpo.css";
import Loading from "./../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";

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
  subPo,
  shopFloorId
}) {
  // console.log(productionOrderSFG,"productionOrderSFG")

  const [isDisabled, setDisabled] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const history = useHistory();

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


  }, [singleData]);

  // set data to rowDto dynamically

  const rowDtoHandler = (name, value, index, item) => {
    console.log(name, value, index);
    let xData = [...gridData];
    xData[index][name] = value;
    setGridData(xData);
  };

  useEffect(()=>{
    setGridData(productionOrderSFG);
  },[productionOrderSFG])

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
      isHiddenBack
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
        plantName={plantName}
        shopFloorId={shopFloorId}
        subPo={subPo}
        paramsId={params?.id}
      />
    </IForm>
  );
}
