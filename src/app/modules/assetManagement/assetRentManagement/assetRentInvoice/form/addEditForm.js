/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getBusinessPartnerDDL,
  getSBUListDDL,
  getAssetRentInfoForInvoice,
  saveAssetRentInvoice,
  getAssetRentInvoiceById,
} from "../helper";
import Form from "./form";

const initData = {
  date: _todayDate(),
  partner: "",
  sbu: "",
  salesOrganization: "",
};

export default function AssetRentInvoiceForm() {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { id, type } = useParams();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [sbuDDL, setSBUDDL] = useState([]);
  const [totalRentAmount, setTotalRentAmount] = useState(0);
  const [rowDtoById, setRowDtoById] = useState([]);

  useEffect(() => {
    getBusinessPartnerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPartnerDDL
    );
    getSBUListDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSBUDDL
    );
    if (id) {
      getAssetRentInvoiceById(id, setSingleData, setRowDtoById, setLoading);
    }
  }, [id, profileData, selectedBusinessUnit]);

  const getRowData = (values) => {
    getAssetRentInfoForInvoice(
      selectedBusinessUnit?.value,
      values?.sbu?.value,
      values?.partner?.value,
      values?.date,
      setLoading,
      setRowDto
    );
  };

  // const allCheck = () => {
  //   const checked = rowDto?.filter((item) => item?.isSelect)?.length;
  // };

  const getTotalAmount = (newRowDto) => {
    const total = newRowDto
      ?.filter((item) => item?.isSelect)
      ?.reduce((acc, curr) => acc + curr?.rentAmount, 0);
    setTotalRentAmount(total);
  };
  const rowDataHandler = (key, value, index) => {
    const newRowDto = [...rowDto];
    newRowDto[index][key] = value;
    setRowDto(newRowDto);
    getTotalAmount(newRowDto);
  };

  const saveHandler = async (values, cb) => {
    const rowList = rowDto
      ?.filter((item) => item?.isSelect)
      ?.map((item) => {
        return {
          rentAssetId: item?.rentAssetId,
          rentTypeId: item?.rentTypeId,
          rentTypeName: item?.rentTypeName,
          rentFromDate: item?.rentFromDate,
          rentToDate: item?.rentToDate,
          currencyId: item?.currencyId,
          currencyName: item?.currencyName,
          rentRate: item?.rentRate,
          rentAmount: item?.rentAmount,
        };
      });
    const totalAmount = rowList?.reduce((acc, cur) => {
      return acc + cur?.rentAmount;
    }, 0);

    const payload = {
      objHeader: {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        sbuId: values?.sbu?.value,
        sbuName: values?.sbu?.label,
        businessPartnerId: values?.partner?.value,
        businessPartnerName: values?.partner?.label,
        totalInvoiceAmount: totalAmount,
        invoiceDate: values?.date,
        actionBy: profileData?.userId,
        salesOrganizationId: values?.salesOrganization?.value,
        salesOrganizationName: values?.salesOrganization?.label,
      },
      objRowList: rowList,
    };
    if (!id) {
      saveAssetRentInvoice(payload, setLoading, cb);
    } else {
      // editAssetRent(payload, setDisabled, cb);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        type={type}
        sbuDDL={sbuDDL}
        partnerDDL={partnerDDL}
        rowDataHandler={rowDataHandler}
        getRowData={getRowData}
        totalRentAmount={totalRentAmount}
        getTotalAmount={getTotalAmount}
        rowDtoById={rowDtoById}
        setLoading={setLoading}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </>
  );
}
