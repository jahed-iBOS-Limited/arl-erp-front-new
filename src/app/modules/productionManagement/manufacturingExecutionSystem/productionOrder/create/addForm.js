/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  createProductionOrder,
  editProductionOrder,
  getPlantDDL_api,
  getProductionOrderById,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  plantName: "",
  itemName: "",
  workCenter: "",
  bomName: "",
  salesOrderId: "",
  numOrderQty: "",
  startDate: _todayDate(),
  startTime: "",
  endDateTime: _todayDate(),
  endTime: "",
  prtNumber: "",
  isSOUseOnProductionOrderTest: false,
  boex: "",
  shopFloor: "",
  baseUomName: "",
  // bomVersion: "",
};
export default function ProductionOrderCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const [productionOrderSFG, setProductionOrderSFG] = useState([]);
  const [productionId, setProductionId]= useState([]);
  const [subPo, setSubPo]= useState([]);
  const params = useParams();

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
    }
  }, [params]);

  
  // useEffect(()=>{
  //   getPlantDDL_api(
  //     profileData?.userId,
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setPlantName
  //   );
  // }, [profileData, selectedBusinessUnit])
 

  const saveHandler = async (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          productionOrderId: +singleData?.productionOrderId,
          numOrderQty: +values?.numOrderQty,
          startDate: values?.startDate,
          startTime: values?.startTime,
          endDate: values?.endDateTime,
          endTime: values?.endTime,
          itemIdTools: +values?.itemName?.value,
          actionBy: +profileData?.userId,
        };
        editProductionOrder(payload, setDisabled);
      } else {
        const payload = {
          salesOrderId: +values?.salesOrderId,
          reffProductionOrderId: 0,
          itemId: +values?.itemName?.value,
          itemCode: values?.itemName?.code,
          itemName: values?.itemName?.label,
          billOfMaterialId: +values?.bomName?.value,
          workCenterId: +values?.workCenter?.value,
          numOrderQty: +values?.numOrderQty,
          uomid: +values.itemName?.baseUomid,
          startDate: values?.startDate,
          startTime: values?.startTime,
          endDate: values?.endDateTime,
          endTime: values?.endTime,
          accountId: +profileData?.accountId,
          plantId: +values?.plantName.value,
          businessUnitId: +selectedBusinessUnit?.value,
          itemIdTools: +values?.prtNumber?.value || 0,
          actionBy: +profileData?.userId,
        };
        createProductionOrder(payload, cb, setDisabled,profileData.accountId , selectedBusinessUnit.value, setProductionOrderSFG,setProductionId, setSubPo);
      }
    }
  };

  return (
    <IForm
      title={"Create Production Order"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
        productionOrderSFG={productionOrderSFG}
        productionId={productionId}
        subPo={subPo}
      />
    </IForm>
  );
}
