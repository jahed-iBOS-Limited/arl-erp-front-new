// /* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getItemNameDDL_api,
  // GetSalesTargetView,
  getTerritoryDDL_api,
  getTransactionTypeDDL_api,
  editSalesTarget,
  saveSalesTarget,
  GetSalesTargetRtmView,
  getCustomerNameDDL_api,
} from "../helper";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";

const initData = {
  territoryName: "",
  customerName: "",
  month: "",
  year: "",
  totalAmount: "",
  startDate: "",
  endDate: "",
  itemName: "",
  rate: "",
  quantity: "",
};

export default function SalesTargetCreateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const location = useLocation();
  const [total, setTotal] = useState({ totalAmount: 0 });
  const setter = (payload) => {
    // if (isUniq("shipPointId", payload.shipPointId, rowDto)) {
    //   const { accountId, userId: actionBy } = profileData;
    //   const { value: businessunitid } = selectedBusinessUnit;

    // }
    setRowDto([...rowDto, payload]);
  };
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit?.value) {
      getTerritoryDDL_api(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTerritoryDDL
      );
      getTransactionTypeDDL_api(setTransactionType);
      getItemNameDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //SingleData to view
  const [singleData, setSingleData] = useState("");
  useEffect(() => {
    if (params?.id) {
      GetSalesTargetRtmView(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.territory,
        location?.state?.month,
        location?.state?.year,
        setSingleData,
        setRowDto
      );
      getCustomerNameDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.territory,
        setCustomerNameDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // // Show when in edit mode, rowData
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const newData = singleData?.row?.map((item) => ({
      itemId: item?.itemId,
      itemName: item?.itemName,
      rate: item?.price,
      quantity: item?.quantity,
      targetId: 0,
      totalAmount: item?.totalAmount,
    }));

    if (params?.id) {
      setRowDto(newData);
    } else {
      setRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const editRowDto = rowDto?.map((item, index) => ({
          targetId: 0,
          itemId: item?.itemName?.value,
          quantity: item?.quantity,
          price: item?.rate,
          totalAmount: item?.quantity * item?.rate,
        }));
        const payload = {
          objHeader: {
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            targetMonth: location?.state?.values?.month?.value,
            targetYear: location?.state?.values?.year?.value,
            territoryId: location?.state?.values?.territoryName?.value,
            actionBy: profileData?.userId,
            currentDate: "2021-01-13T11:49:00.509Z",
            fromDate: values?.startDate,
            toDate: values?.endDate,
          },
          objRowList: editRowDto,
        };
        editSalesTarget(payload, setDisabled);
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
        }
      } else {
        const newRowDto = rowDto.map((itm, index) => ({
          targetId: 0,
          itemId: itm?.itemName?.value,
          quantity: itm?.quantity,
          price: itm?.rate,
          totalAmount: itm?.quantity * itm?.rate,
        }));
        const payload = {
          objCreateHeader: {
            accountId: profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            targetMonth: location?.state?.values?.month?.value,
            targetYear: location?.state?.values?.year?.value,
            territoryId: location?.state?.values?.territoryName?.value,
            actionBy: profileData?.userId,
            currentDate: "2021-01-12T09:07:59.892Z",
            fromDate: values?.startDate,
            toDate: values?.endDate,
          },
          objCreateRowList: newRowDto,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          saveSalesTarget(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
      
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    let totalQR = 1;
    let total = 0;
    if (rowDto?.length) {
      for (let i = 0; i < rowDto?.length; i++) {
        totalQR = +rowDto[i].quantity * +rowDto[i].rate;
        total = totalQR;
        totalAmount += total;
      }
    }
    setTotal({ totalAmount });
  }, [rowDto]);

  return (
    <IForm
      title="Create Sales Target"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit?.value}
        territoryDDL={territoryDDL}
        transactionType={transactionType}
        itemNameDDL={itemNameDDL}
        isEdit={id || false}
        total={total}
        rowDto={rowDto}
        state={location.state}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
        setCustomerNameDDL={setCustomerNameDDL}
        customerNameDDL={customerNameDDL}
      />
    </IForm>
  );
}
