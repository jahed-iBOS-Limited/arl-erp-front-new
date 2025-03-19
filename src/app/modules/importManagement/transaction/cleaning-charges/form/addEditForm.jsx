import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import Form from "./form";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
const initData = {
  shipment: "",

  providerName: "",

  serviceDate: _dateFormatter(new Date()),

  amount: "",

  paymentDate: _dateFormatter(new Date()),
};

export default function AddEditFrom({
  history,
  match: {
    params: { pId },
  },
}) {
  const [isDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setter = (values, setFieldValue) => {};

  const remover = (i) => {
    const filterData = rowDto.filter((item, index) => i !== index);
    setRowDto(filterData);
  };

  const saveHandler = (values, cb) => {};
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Transport Information"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        setter={setter}
        // warehouseList={warehouseList}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        history={history?.location?.state}
        pId={pId}
      />
    </IForm>
  );
}
