/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loading from "./../../../../_helper/_loading";
import {
  createInvTransaction,
  getShopFloorTransactionTypeDDL,
  getSingleData,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  transactionDate: _todayDate(""),
  referenceType: "",
  referenceCode: "",
  receiveFrom: "",
  transferTo: "",
  item: "",
  qty: "",
  checkbox: false,
};

export default function ShopFloorInvTransCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");
  const location = useLocation();
  const params = useParams();

  const [transactionTypeDDL, setTransactionTypeDDL] = useState([]);
  const [shopFloorRefCodeDDL, setShopFloorRefCodeDDL] = useState([]);
  const [transerDDL, setTransferDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);

  useEffect(() => {
    getShopFloorTransactionTypeDDL(setTransactionTypeDDL);
  }, []);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const saveHandler = async (values, cb) => {
    const quantityFilter = rowDto?.filter(
      (item) =>
        +item?.qty > 0 ||
        +item?.transactionQuantity > 0 ||
        +item?.numTransactionQuantity > 0
    );

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
        // edit payload
      } else {
        if (quantityFilter?.length > 0) {
          // obj row for bank receipt and bank payment
          let objRow = quantityFilter?.map((item) => ({
            shopFloorInventoryTransactionId: 0,
            shopFloorInventoryTransactionCode: "string",
            itemTypeId: +item?.itemTypeId || item?.item?.itemTypeId,
            itemId: +item?.itemId || +item?.item?.value,
            itemCode: item?.itemCode || item?.item?.code,
            itemName: item?.itemName || item?.item?.itemName || item?.item?.label,
            uoMid: +item?.uoMid || +item?.item?.baseUomid,
            uoMname:
              item?.uoMname ||
              item?.item?.baseUomName ||
              item?.item?.description,
            transactionQty: +item?.transactionQuantity || +item?.qty,
            transactionRate: 0,
            transactionValue: 0,
            actionBy: +profileData?.userId,
          }));
          const payload = {
            header: {
              shopFloorInventoryTransactionCode: "string",
              transactionDateTime: values?.transactionDate,
              transactionTypeId: +values?.referenceType?.value,
              transactionTypeName: values?.referenceType?.label,
              referenceTypeId: +values?.referenceType?.value,
              referenceType: values?.referenceType?.label,
              referenceId: +values?.referenceCode?.value || 0,
              referenceCode: values?.referenceCode?.label || "",
              accountId: +profileData?.accountId,
              businessUnitId: +selectedBusinessUnit?.value,
              plantId: +location?.state?.selectedPlant?.value,
              shopFloorId: +location?.state?.selectedShopFloorDDL?.value,
              receiveFromId:
                values?.referenceType?.label === "Receive From Warehouse" ||
                values?.referenceType?.label === "Receive From Shop Floor"
                  ? rowDto[0].wareHouseId
                  : 0,
              isReceived: 0,
              actionBy: +profileData?.userId,
              transferTo: values?.transferTo?.value || 0,
            },
            row: objRow,
          };

          // transfer to condition
          if (
            values?.referenceType?.value === 4 ||
            values?.referenceType?.value === 5 ||
            values?.referenceType?.value === 7
          ) {
            if (values?.transferTo) {
              if (values?.referenceType?.label === "Transfer to Warehouse") {
                createInvTransaction(payload, 1, cb, setDisabled);
              } else {
                createInvTransaction(payload, 0, cb, setDisabled);
              }
            } else {
              toast.warn("Transfer To is Required");
            }
          } else {
            if (values?.referenceType?.label === "Transfer to Warehouse") {
              createInvTransaction(payload, 1, cb, setDisabled);
            } else {
              createInvTransaction(payload, 0, cb, setDisabled);
            }
          }
          setDisabled(false);
        } else {
          toast.warn("Please select at least one item with quantity");
        }
      }
    }
  };

  const setter = (values) => {
    if (values?.checkbox) {
      const payload = itemDDL?.map((e) => {
        return {
          ...values,
          item: e,
        };
      });
      setRowDto(payload);
    } else {
      const count = rowDto?.filter(
        (item) => item?.item?.value === values?.item?.value
      ).length;
      if (count === 0) {
        setRowDto([...rowDto, values]);
      } else {
        toast.warn("Not allowed to duplicate transaction");
      }
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  useEffect(() => {
    getSingleData(params.viewId, setSingleData, setRowDto);
  }, [params?.viewId]);

  return (
    <IForm
      title={
        params?.viewId
          ? "View Shop Floor Inventory Transaction"
          : "Create Shop Floor Inventory Transaction"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={params?.viewId}
      isHiddenSave={params?.viewId}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        location={location}
        transactionTypeDDL={transactionTypeDDL}
        setTransactionTypeDDL={setTransactionTypeDDL}
        shopFloorRefCodeDDL={shopFloorRefCodeDDL}
        setShopFloorRefCodeDDL={setShopFloorRefCodeDDL}
        transerDDL={transerDDL}
        setTransferDDL={setTransferDDL}
        itemDDL={itemDDL}
        setItemDDL={setItemDDL}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
