/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  getRouteDDL,
  saveEditedSecondaryOrder,
  getSingleData,
} from "../helper";
import { savSecondaryOrderAction } from "./../helper";

const initData = {
  routeName: "",
  beatName: "",
  outlateName: "",
  item: "",
  orderQty: "",
  rate: "",
  receivedAmount: "",
  territoryName: "",
  distributorName: "",
  distributionChannel: "",
};

export default function SecondaryOrderForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [routeDDL, setRouteDDL] = useState([]);
  const [beatNameDDL, setBeatNameDDL] = useState([]);
  const [outletNameDDl, setOutletNameDDL] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [itemRowDto, setItemRowDto] = useState([]);
  const [rowData, setRowData] = useState([]);

  const params = useParams();
  console.log(singleData, "singleData");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  console.log(itemRowDto, "itemRowDto");

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getRouteDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRouteDDL
      );
     // getItemDDL(setItem);
    }
  }, [profileData, selectedBusinessUnit]);

  // get value addition view data
  useEffect(() => {
    if (id) {
      getSingleData(id, setSingleData, setItemRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

   // Count Sum of Order amount
   let totalAmount = rowData?.reduce(
    (total, obj) => total + +obj?.orderQty * obj?.rate,
    0
  );

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowData];
    let _sl = data[sl];
    _sl[name] = +value;
    setRowData(data);
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const newData = singleData?.row?.map((item) => ({
      rowId: item?.rowId,
      itemId: item?.productId,
      itemName: item?.productName,
      uomId: item?.uomid,
      uomName: item?.uomname,
      orderQty: item?.orderQuantity,
      rate: item?.price,
      amount: item?.orderAmount,
      receivedAmount: item?.recievedAmount,
    }));

    if (params?.id) {
      setRowData(newData);
    } else {
      setRowData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        // eslint-disable-next-line no-unused-vars
        const payload = {
          editAttribute: {
            orderId: +id,
            totalOrderAmount: totalAmount,
            receiveAmount: +values?.receivedAmount,
          },
          editAttributeValue: rowData?.map((item) => {
            return {
              rowId: item?.rowId || 0,
              itemId: item?.itemId,
              itemName: item?.itemName,
              orderId: +id,
              orderQuantity: item?.orderQty,
              rate: item?.rate,
              orderAmount: item?.orderQty * item?.rate, // item?.amount,
              uomid: item?.uomId,
              uomname: item?.uomName,
            };
          }),
        };
        saveEditedSecondaryOrder(payload, setDisabled);
      } else {
        const payload = {
          secondaryOrder: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            routeId: values?.routeName?.value,
            routeName: values?.routeName?.label,
            beatId: values?.beatName?.value,
            beatName: values?.beatName?.label,
            outletid: values?.outlateName?.value,
            outletName: values?.outlateName?.label,
            receiveAmount: +values?.receivedAmount,
            businessPartnerId: values.distributorName.value,
            businessPartnerName: values.distributorName.label,
            totalOrderAmount: totalAmount,
            territoryId: values?.territoryName?.value,
            territoryName: values?.territoryName?.label,
            distributionChannelId: values?.distributionChannel?.value,
            distributionChannelName: values?.distributionChannel?.label,
            actionBy: profileData?.userId,
          },
          attibute: rowData?.map((item) => {
            return {
              itemId: item?.itemId,
              itemName: item?.itemName,
              orderQuantity: item?.orderQty,
              rate: item?.rate,
              uomid: item.uomId,
              uomname: item.uomName,
              orderAmount: item?.orderQty * item?.rate, //item?.amount,
            };
          }),
        };
        savSecondaryOrderAction(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title={id ? "Edit Retail Order" : "Create Retail Order"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        itemRowDto={itemRowDto}
        routeDDL={routeDDL}
        setBeatNameDDL={setBeatNameDDL}
        beatNameDDL={beatNameDDL}
        outletNameDDl={outletNameDDl}
        setOutletNameDDL={setOutletNameDDL}
        isEdit={id || false}
        setRowData={setRowData}
        rowData={rowData}
        rowDtoHandler={rowDtoHandler}
        totalAmount={totalAmount}
      />
    </IForm>
  );
}
