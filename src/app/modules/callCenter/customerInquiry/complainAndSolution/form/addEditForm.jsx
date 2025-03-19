/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams, useLocation } from "react-router";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { editComplain } from "../helper";
import Form from "./form";

const initData = {
  channel: "",
  client: "",
  supplyDate: _todayDate(),
  complainDate: _todayDate(),
  complainType: "",
  causeOfComplain: "",
  contactPerson: "",
  contactNumber: "",
  siteAddress: "",
  details: "",
  soName: { value: 6, label: "LOCAL SALES" },
  itemName: "",
  deliveredQuantity: "",
  clientMeasurementQuantity: "",
  workOrderQuantity: "",
  problemQuantity: "",
  comment: "",
};

export default function ComplainAndSolutionForm() {
  // get user data from store
  const {
    profileData: {
      accountId: accId,
      userId,
      employeeId: empId,
      employeeFullName: empName,
    },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { id, type } = useParams();
  const { state } = useLocation();
  const [objProps] = useState({});
  const [channelList, getChannelList] = useAxiosGet();
  const [itemList, getItemList] = useAxiosGet();
  const [SOList, getSOList] = useAxiosGet();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});

  useEffect(() => {
    if (!type) {
      getChannelList(
        `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
      );
      getSOList(
        `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
      );
    }
    if (type) {
      const {
        supplyDate,
        siteAddress,
        complainRow,
        complainDate,
        contactNumber,
        problemDetaills,
        complainTypeName,
        businessPartnerId,
        causeofCompalinName,
        businessPartnerName,
      } = state;
      const initDataForEdit = {
        client: {
          value: businessPartnerId,
          label: businessPartnerName,
        },
        supplyDate: _dateFormatter(supplyDate),
        complainDate: _dateFormatter(complainDate),
        complainType: complainTypeName,
        causeOfComplain: causeofCompalinName,
        contactPerson: "",
        contactNumber: contactNumber,
        siteAddress: siteAddress,
        details: problemDetaills,
      };
      setSingleData(initDataForEdit);

      setRowData(
        complainRow?.map((item) => ({
          ...item,
          intAutoId: item?.autoId,
          complainId: item?.complainId,
          itemId: item?.itemId,
          itemName: item?.itemName,
          deliverdQnt: item?.supplyQuantity,
          clientMeasurementQnt: item?.clientMeasurementQnt,
          workOrderQnt: item?.workOrderQuantity,
          problemQnt: item?.approvedQty,
        }))
      );
    }
  }, [accId, buId, type, id]);

  const addRow = (values, callBack) => {
    if (rowData?.find((item) => item?.itemId === values?.itemName?.value)) {
      return toast.warn("Item already added");
    }
    try {
      const newRow = {
        intAutoId: 0,
        complainId: 0,
        itemId: values?.itemName?.value,
        itemName: values?.itemName?.label,
        deliverdQnt: values?.deliveredQuantity,
        clientMeasurementQnt: values?.clientMeasurementQuantity,
        workOrderQnt: values?.workOrderQuantity,
        problemQnt: values?.problemQuantity,
      };
      setRowData([...rowData, newRow]);
      callBack();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRow = (index) => {
    const newRow = [...rowData];
    newRow.splice(index, 1);
    setRowData(newRow);
  };

  const rowDataChange = (index, key, value) => {
    const newRow = [...rowData];
    newRow[index][key] = value;
    setRowData(newRow);
  };

  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = {
        objHead: {
          intComplainId: 0,
          accountId: accId,
          businessUnitId: buId,
          complainTypeId: 0,
          complainTypeName: values?.complainType,
          complainName: "",
          address: values?.siteAddress,
          contactNumber: values?.contactNumber,
          problemDetails: values?.details,
          isSolve: false,
          actionBy: userId,
          concernEnroll: state?.concernEnroll,
          concernName: state?.concernName,
          supplyDate: values?.supplyDate,
          complainDate: values?.complainDate,
          causeofCompalinId: 0,
          causeofCompalinName: values?.causeOfComplain,
          businessPartnerId: values?.client?.value,
          businessPartnerName: values?.client?.label,
          contactPerson: values?.contactPerson,
        },
        objRow: rowData,
      };
      postData(
        `/oms/Complains/CreateSiteComplainInfo`,
        payload,
        () => {
          cb();
        },
        true
      );
    } else {
      const payload = {
        objHead: {
          intComplainId: id,
          accountId: accId,
          businessUnitId: buId,
          complainTypeId: 0,
          complainTypeName: values?.complainType,
          complainName: "",
          address: values?.siteAddress,
          contactNumber: values?.contactNumber,
          problemDetails: values?.details,
          isSolve: false,
          actionBy: userId,
          concernEnroll: empId,
          concernName: empName,
          supplyDate: values?.supplyDate,
          complainDate: values?.complainDate,
          causeofCompalinId: 0,
          causeofCompalinName: values?.causeOfComplain,
          businessPartnerId: values?.client?.value,
          businessPartnerName: values?.client?.label,
          contactPerson: values?.contactPerson,
        },
        objRow: rowData,
      };
      editComplain(payload, setLoading);
    }
  };

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          id={id}
          buId={buId}
          accId={accId}
          state={state}
          viewType={type}
          addRow={addRow}
          userId={userId}
          SOList={SOList}
          rowData={rowData}
          itemList={itemList}
          deleteRow={deleteRow}
          setRowData={setRowData}
          setLoading={setLoading}
          saveHandler={saveHandler}
          channelList={channelList}
          getItemList={getItemList}
          rowDataChange={rowDataChange}
          loading={loading || isLoading}
          initData={id ? singleData : initData}
        />
      </div>
    </>
  );
}
