/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";

import { getDeliveryDetailsById, getItemTransferInById } from "../helper";
import ICard from "./../../../../../_helper/_card";
import Loading from "./../../../../../_helper/_loading";

const initData = {
  otherBranchName: "",
  otherBranchAddress: "",
  transferNo: "",
  taxItemGroupName: "",
  uomname: "",
  quantity: "",
  invoicePrice: "",
  isFree: false,
  itemType: "",
  basePrice: "",
};

export default function ItemTransferInViewForm({ id, location, typeId }) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});

  // to show data in create page right side
  const [createPageGrid, setCreatePageGrid] = useState("");

  // transfer no ddl
  const [transferNo, setTransferNo] = useState([]);

  // item type id == from landing Item Type ddl
  const itemTypeId = location?.selectedItemType?.value;
  const taxBranchId = location?.selectedTaxBranchDDL?.value;

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (id) {
      getItemTransferInById(
        itemTypeId || typeId,
        id,
        setSingleData,
        setDisabled
      );
    }
  }, [profileData]);

  // useEffect for data accord to itemTypeId - Transfer No. DDL
  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      singleData?.getByIdHeader?.referanceNo
    ) {
      getDeliveryDetailsById(
        itemTypeId || typeId,
        +singleData?.getByIdHeader?.referanceNo,
        setCreatePageGrid
      );
    }
  }, [profileData, selectedBusinessUnit, singleData]);

  useEffect(() => {
    if (itemTypeId === 1) {
      // if 1 show taxPurchaseRow
      const newData = singleData?.getByIdPurchseRow?.map((item) => ({
        taxItemGroupName: item?.taxItemGroupName,
        quantity: item?.quantity,
        uomname: item?.uomname,
        invoicePrice: item?.invoicePrice,
      }));
      if (id) {
        setRowDto(newData);
      } else {
        setRowDto([]);
      }
    } else {
      // show taxSalesRow
      const newData = singleData?.getByIdSalesRow?.map((item) => ({
        taxItemGroupName: item?.taxItemGroupName,
        quantity: item?.quantity,
        uomname: item?.uomname,
        invoicePrice: item?.basePrice,
      }));
      if (id) {
        setRowDto(newData);
      } else {
        setRowDto([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  return (
    <ICard
      getProps={setObjprops}
      isDisabled={isDisabled}
      title={"View Transfer-in"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData?.getByIdHeader : initData}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        createPageGrid={createPageGrid?.getByIdHeader}
        setCreatePageGrid={setCreatePageGrid}
        itemTypeId={itemTypeId}
        taxBranchId={taxBranchId}
        setTransferNo={setTransferNo}
        transferNo={transferNo}
        params={id}
        selectedItemType={location?.selectedItemType}
      />
    </ICard>
  );
}
