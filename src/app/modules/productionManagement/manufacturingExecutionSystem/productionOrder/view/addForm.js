/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getProductionOrderById, getRouteCostComponent } from "../helper";
import ICard from "../../../../_helper/_card";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import axios from "axios";
const initData = {
  itemName: "",
  plantName: "",
  numOrderQty: "",
  salesOrderId: "",
  bomVersion: "",
  uomName: ""
};

export default function ProductionOrderViewForm() {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const history = useHistory();
  // taxbranch ddl
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  const getViewData = async (productionOrderId, setter) => {
    try {
      const res = await axios.get(
        `/mes/ProductionOrder/GetProductionOrderById?ProductionOrderById=${productionOrderId}`
      );
      if (res.status === 200 && res?.data) {
        const index = res?.data[0];
        const newData = {
          productionOrderId: index?.productionOrderId,
          uomid: index?.uomid,
          itemName: {
            value: index?.itemId,
            label: index?.itemName + " [" + index?.itemCode + "]",
          },
          plantName: {
            value: index?.plantId,
            label: index?.plantName,
          },
          bomName: {
            value: index?.bomId,
            label: index?.bomName,
          },
          workCenter: {
            value: index?.workCenterId,
            label: index?.workCenterName,
          },
          numOrderQty: index?.orderQty,
          salesOrderId: index?.salesOrderId,
          prtNumber: {
            value: index?.ptrId,
            label: index?.ptrName,
          },
          startDate: _dateFormatter(index?.startDate),
          startTime: index?.startTime,
          endDateTime: _dateFormatter(index?.endDate),
          endTime: index?.endTime,
          bomVersion: index?.bomVersion,
          uomName: index?.uomName,
        };
        setter(newData);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (params?.id) {
      getViewData(params?.id, setSingleData);
    }
  }, [profileData, params]);
  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  const backHandler = () => {
    history.goBack();
  };
  return (
    <ICard
      getProps={setObjprops}
      isDisabled={isDisabled}
      title={"View Production Order"}
    >
      <div className="row" style={{ marginTop: "-40px" }}>
        <div className="col-lg-2 offset-10 text-right">
          <button
            onClick={backHandler}
            type="button"
            className="btn btn-secondary"
          >
            <i className="fa fa-arrow-left"></i>Back
          </button>
        </div>
      </div>
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        disableHandler={disableHandler}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
      />
    </ICard>
  );
}
