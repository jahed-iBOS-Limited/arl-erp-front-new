import React, { useCallback, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation,useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { getTaxAccountingJournalByCode } from "../../form/helper";
import Form from "./form";

const initData = {
  id: undefined,
  partnerType: "",
  sbu: "",
  cashGLPlus: "",
  receiveFrom: "",
  headerNarration: "",
  partner: "",
  profitCenter: "",
  transaction: "",
  gl: "",
  amount: "",
  narration: "",
  paidTo: "",
  costCenter: "",
  trasferTo: "",
  gLBankAc: "",
  transactionDate: _todayDate(),
};

export default function CashJournalEditForm({
  history,
  match: {
    params: { id },
  },
})
 {
   const {journalCode} = useParams();
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const location = useLocation();
  const [singleItem, setSingleItem] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);

  useEffect(() => {
    if(journalCode){
      getTaxAccountingJournalByCode( journalCode, setSingleItem);
    }
  },[journalCode])

  useEffect(() => {
    if (singleItem?.objRow?.length > 0) {
      setRowDto(singleItem?.objRow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleItem]);
  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let netAmount = useCallback(
    rowDto?.reduce((total, value) => total + +value?.amount, 0),
    [rowDto]
  );
  //save event Modal (code see)
  // const IConfirmModal = (props) => {
  //   const { title, message, noAlertFunc } = props;
  //   return confirmAlert({
  //     title: title,
  //     message: message,
  //     buttons: [
  //       {
  //         label: "Ok",
  //         onClick: () => noAlertFunc(),
  //       },
  //     ],
  //   });
  // };

  const saveHandler = async (values, cb) => {
    if (journalCode && profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowDto?.length === 0) {
        toast.warn("Please add transaction");
      } else {
   // edit api call
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values) => {
    const count = rowDto?.filter(
      (item) => item?.transaction?.value === values?.transaction?.value
    ).length;
    if (count === 0) {
      setRowDto([...rowDto, values]);
    } else {
      toast.warn("Not allowed to duplicate transaction");
    }
  };
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  return (
    <IForm
      title={`${journalCode?"Edit":"Create"} ${
        location?.state?.accountingJournalTypeId === 1
          ? "Cash Receipts Journal"
          : location?.state?.accountingJournalTypeId === 2
          ? "Cash Payments Journal"
          : "Cash Transfer Journal"
      }`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={journalCode ? singleItem?.objHeader : (singleData || initData)}
        journalCode={journalCode}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        headerData={location?.state}
        setter={setter}
        rowDto={rowDto}
        remover={remover}
        setRowDto={setRowDto}
        netAmount={netAmount}
        singleItem={singleItem}
      />
    </IForm>
  );
}
