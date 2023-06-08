/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
// import IForm from "../../../../_helper/_form";
// import { isUniq } from "../../../../_helper/uniqChecker";
import { getInvTransactionById } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";

const initData = {
  id: undefined,
  transactionGroup: "",
  referenceType: "",
  referenceNo: "",
  transactionType: "",
  businessPartner: "",
  personnel: "",
  plant: "",
  wareHouseFrom: "",
  wareHouseTo: "",
  plantFrom: "",
  plantTo: "",
  item: "",
};

export default function InventoryTransactionView({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);

  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [singleData, setSingleData] = useState({});

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      getInvTransactionById(id, setSingleData, setRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // const rowDtoHandler = (name, value, sl) => {
  //       let data = [...rowDto];
  //       let _sl = data[sl];
  //       _sl[name] = value;
  //       setRowDto(data);
  // };

  // const remover = (payload) => {
  //       const filterArr = rowDto.filter((itm) => itm.value !== payload);
  //       setRowDto([...filterArr]);
  // };

  // const addRowDtoData = (values) => {
  //   if (isUniq("value", values?.value, rowDto)) {
  //     const newData = {
  //       ...values,
  //       location: "",
  //       stockType: "",
  //       quantity: "",
  //     };
  //     setRowDto([...rowDto, newData]);
  //   }
  // };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <ICustomCard
      title="Inventory Transaction"
      backHandler={(e) => history.goBack()}
      renderProps={(e) => {}}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        // saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        // empDDL={empDDL}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        // addRowDtoData={addRowDtoData}
        // rowDtoHandler={rowDtoHandler}
        // remover={remover}
        // transactionGrpDDL={transactionGrpDDL}
        // setRefTypeDDL={setRefTypeDDL}
        // refTypeDDL={refTypeDDL}
        // refNoDDL={refNoDDL}
        // setRefNoDDL={setRefNoDDL}
      />
    </ICustomCard>
  );
}
