import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { saveShipPointOperator } from "../helper";
import Form from "./Form";

const initData = {
  user: "",
  shipPoint: "",
};

export function ShipPointOperatorForm() {
  const [objProps, setObjprops] = useState({});
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const addRow = (values, cb) => {
    try {
      const newRow = {
        userId: values?.user?.value,
        userName: values?.user?.label,
        shippingPointId: values?.shipPoint?.value,
        shippingPointName: values?.shipPoint?.label,
        businessUnitId: buId,
        ysnActive: true,
      };
      setRowData([...rowData, newRow]);
      cb();
    } catch (error) {
      console.log("error");
    }
  };

  const removeRow = (idx) => {
    setRowData(rowData?.filter((_, i) => i !== idx));
  };

  const saveHandler = (cb) => {
    if (rowData?.length < 1) {
      return toast.warn("Please add at least one row!");
    }
    saveShipPointOperator(rowData, setLoading, () => {
      setRowData([]);
      cb();
    });
  };

  return (
    <IForm
      title={"Shipping Point Operator"}
      getProps={setObjprops}
      isDisabled={loading}
      isHiddenReset
    >
      <div className="mt-0">
        {loading && <Loading />}
        <Form
          {...objProps}
          accId={accId}
          buId={buId}
          initData={initData}
          saveHandler={saveHandler}
          shipPointDDL={shipPointDDL}
          addRow={addRow}
          removeRow={removeRow}
          rowData={rowData}
        />
      </div>
    </IForm>
  );
}
