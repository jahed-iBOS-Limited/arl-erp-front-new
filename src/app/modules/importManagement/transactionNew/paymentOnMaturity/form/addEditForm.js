import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import Form from "./form";
import { getPaymentOnMaturity } from "../helper";
// import { getDays } from "../../documentRelease/helper";


const initData = {
  exchangeRate: "",
  liborRate: "",
  bankRate: "",
  totalAmount: "",
  vatAmount: "",
};

export default function AddEditFrom({
  documentReleaseValue,
  singleItem,
  setIsShowModal,
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, ] = useState({});
  const [gridData, setGridData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // const saveHandler = async (values, cb) => {
  //   const payload = gridData?.map(item =>({
  //     paymentScheduleId: item?.paymentScheduleId,
  //     accountId: profileData?.accountId,
  //     businessUnitId:  selectedBusinessUnit?.value,
  //     poId: values?.poNo?.poId,
  //     poNumber: item?.poNumber,
  //     lcId: values?.poNo?.lcId,
  //     lcNumber:item?.lcNumber,
  //     shipmentId: item?.shipmentId,
  //     dueDate: item?.paymentDate,
  //     invoiceAmount: +item?.totalPayable,
  //     paymentDate: item?.paymentDate,
  //     exChangeRate: +item?.exchangeRate,
  //     totalAmount: +item?.totalAmount,
  //     vatAmount: +item?.vatAmount
  //   }
  // ))
  //   createPaymentSchedule(payload, setDisabled,setIsShowModal)
  // };

  useEffect(() => {
    getGrid && getGrid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getGrid = () => {
    getPaymentOnMaturity(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setDisabled,
      singleItem?.poNumber,
      singleItem?.shipmentId
    );
  };

  // const calculationData = (data, index) => {
  //   data[index]["tenorDay"] = getDays(
  //     data[index]["dteStartDate"],
  //     data[index]["paymentDate"]
  //   );

  //   let monBenBDT = Number(data[index]?.totalPayable) * Number(data[index]?.exchangeRate);
  //   let netMonBenBDT = (Number(data[index]?.totalPayable) * Number(data[index]?.exchangeRate) * Number(data[index]["tenorDay"])) / 36000;

  //   let totalWithBankInterest = netMonBenBDT * Number(data[index]["bankRate"]);
  //   let totalWithLiborRate = netMonBenBDT * Number(data[index]["liborRate"]);
  //   data[index]["vatAmount"] = Number((totalWithBankInterest + totalWithLiborRate).toFixed(2));
  //   data[index]["totalAmount"] = monBenBDT + Number(data[index]["vatAmount"]);
  //   data[index]["totalWithOutVat"] = monBenBDT ;
  // };

  //set row data
  const setRowAmount = (key, index, amount, gridData, setGridData) => {
    let data = [...gridData];
    data[index][key] = amount;
    data[index]['totalAmount'] = data[index]['netPayAmount'] * data[index]['exchangeRate']
    // if (key !== "vatAmount" && key !== "totalAmount") {
    //   calculationData(data, index);
    // }
    // if(key === "vatAmount"){
    //   data[index]["totalAmount"] = Number(data[index]["totalWithOutVat"]) + Number(data[index][key])
    // }

    setGridData([...data]);
  };

  return (
    // <IForm
    //   title="Payment On Maturity"
    //   getProps={setObjprops}
    //   isDisabled={isDisabled}
    // >
    <>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={{ ...initData, ...documentReleaseValue }}
        // saveHandler={saveHandler}
        gridData={gridData}
        singleItem={singleItem}
        setRowAmount={setRowAmount}
        setGridData={setGridData}
        setIsShowModal={setIsShowModal}
        setDisabled={setDisabled}
        accountId={profileData?.accountId}
        businessUnitId={selectedBusinessUnit?.value}
        getGrid={getGrid}
      />
    </>
    // </IForm>
  );
}
