/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import {
  getAllPriceSetupInitialDDL,
  savePriceSetup,
} from "../../../material-management/priceSetup/_redux/Actions";
import {
  approveOrReject,
  // getPartnerPriceAndLimitRequestById,
  saveEditedPartnerPriceAndLimitRequest,
} from "../helper";
import Form from "./form";

const initData = {
  customer: "",
  address: "",
  contactPerson: "",
  contactNumber: "",
  paymentMode: "",
  creditLimitType: "",
  limitDays: "",
  limitAmount: "",
  itemName: "",
  rate: "",
  soName: "",
  channelName: "",
  remarks: "",

  // new fields for price setup
  conditionType: "",
  conditionTypeRef: "",
  startDate: "",
  endDate: "",
};

export default function PartnerPriceAndLimitRequestForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId, departmentId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const { id, type } = useParams();
  const { state } = useLocation();
  const [objProps] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [channelList, getChannelList] = useAxiosGet();
  const [SOList, getSOList] = useAxiosGet();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [itemList, getItemList] = useAxiosGet();
  const dispatch = useDispatch();
  const [query, setQuery] = useState(null);
  const [conditionTypeRefList, setConditionTypeRefList] = useState([]);

  const {
    conditionDDL,
    organizationDDL,
    territoryDDL,
    partnerDDL,
    distributionChannelDDL,
  } = useSelector((state) => state?.priceSetup, shallowEqual);

  useEffect(() => {
    if (query) {
      switch (query) {
        case 2:
          setConditionTypeRefList(distributionChannelDDL);

          break;
        case 1:
          setConditionTypeRefList(organizationDDL);

          break;
        case 4:
          setConditionTypeRefList(partnerDDL);

          break;
        case 3:
          setConditionTypeRefList(territoryDDL);

          break;
        default:
          setConditionTypeRefList([]);
      }
    }
  }, [query]);

  useEffect(() => {
    if (!type || type === "edit") {
      getChannelList(
        `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
      );
      getSOList(
        `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
      );
    }

    dispatch(getAllPriceSetupInitialDDL(accId, buId));

    if (id) {
      const initialValues = {
        customer: {
          value: state?.intBusinessPartnerId,
          label: state?.strPartnerName,
        },
        address: state?.strAddress,
        contactPerson: state?.strContactPersion,
        contactNumber: state?.strPhone,
        paymentMode: state?.strPaymentMode,
        creditLimitType: {
          value: state?.intCreditLimitType,
          label: state?.strCreditLimitType,
        },
        limitDays: state?.intLimitDays,
        limitAmount: state?.numCreditLimit,
        remarks: state?.strRemarks,
        soName: {
          value: state?.intSalesOrganizationId,
          label: state?.strSalesOrganizationName,
        },
        channelName: {
          value: state?.intDistributionChannel,
          label: state?.strDistributionChannel,
        },
        conditionType: {
          value: state?.conditionTypeId,
          label: state?.conditionTypeName,
        },
        conditionTypeRef: {
          value: state?.conditionReffId,
          label: state?.conditionReffName,
        },
        startDate: _dateFormatter(state?.startDate),
        endDate: _dateFormatter(state?.endDate),
      };
      setSingleData(initialValues);
      setRowData(state?.list);

      // get item list in edit mode
      if (type === "edit") {
        getItemList(
          `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${state?.intDistributionChannel}&SalesOrgId=${state?.intSalesOrganizationId}`
        );
      }
    }
  }, [accId, buId, id, type]);

  const addRow = (values, callBack) => {
    try {
      const newRow = {
        intAutoId: 0,
        intLimitPkid: 0,
        intItemId: values?.itemName?.value,
        strItemName: values?.itemName?.label,
        numProposePrice: values?.rate,
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
    if ([1]?.includes(values?.creditLimitType?.value) && !values?.limitDays) {
      return toast.warn("Please enter days limit");
    } else if (
      [2]?.includes(values?.creditLimitType?.value) &&
      !values?.limitAmount
    ) {
      return toast.warn("Please enter amount limit");
    } else if (
      [3]?.includes(values?.creditLimitType?.value) &&
      (!values?.limitDays || !values?.limitAmount)
    ) {
      return toast.warn("Please enter days and amount limit");
    }

    if (!id) {
      const payload = {
        headerData: {
          intConfigId: 0,
          intAccountId: accId,
          intBusinessUnitId: buId,
          intBusinessPartnerId: values?.customer?.value,
          strPartnerName: values?.customer?.label,
          strAddress: values?.address,
          strContactPersion: values?.contactPerson,
          strPhone: values?.contactNumber,
          strPaymentMode: values?.paymentMode,
          strRemarks: values?.remarks,
          numCreditLimit: values?.limitAmount || 0,
          isDayLimit: values?.creditLimitType?.value === 1,
          intLimitDays: values?.limitDays || 0,
          intActionBy: userId,
          isActive: true,
          isApproveByAccounts: false,
          intApproveByAccounts: 0,
          intCreditLimitType: values?.creditLimitType?.value,
          strCreditLimitType: values?.creditLimitType?.label,
          intSalesOrganizationId: values?.soName?.value,
          strSalesOrganizationName: values?.soName?.label,
          intDistributionChannel: values?.channelName?.value,
          strDistributionChannel: values?.channelName?.label,
          startDate: values?.startDate,
          endDate: values?.endDate,
          conditionTypeId: values?.conditionType?.value,
          conditionTypeName: values?.conditionType?.label,
          conditionReffId: values?.conditionTypeRef?.value,
          conditionReffName: values?.conditionTypeRef?.label,
        },
        rowData: rowData,
      };
      postData(
        `/oms/BusinessPartnerLimitNPriceApproval/CreateBusinessPartnerLimitNPriceApproval`,
        payload,
        () => {
          cb();
        },
        true
      );
    } else {
      const payload = {
        headerData: {
          intConfigId: id,
          intAccountId: accId,
          intBusinessUnitId: buId,
          intBusinessPartnerId: values?.customer?.value,
          strPartnerName: values?.customer?.label,
          strAddress: values?.address,
          strContactPersion: values?.contactPerson,
          strPhone: values?.contactNumber,
          strPaymentMode: values?.paymentMode,
          strRemarks: values?.remarks,
          numCreditLimit: values?.limitAmount || 0,
          isDayLimit: values?.creditLimitType?.value === 1,
          intLimitDays: values?.limitDays || 0,
          intActionBy: userId,
          isActive: true,
          isApproveByAccounts: false,
          intApproveByAccounts: 0,
          intCreditLimitType: values?.creditLimitType?.value,
          strCreditLimitType: values?.creditLimitType?.label,
          intSalesOrganizationId: values?.soName?.value,
          strSalesOrganizationName: values?.soName?.label,
          intDistributionChannel: values?.channelName?.value,
          strDistributionChannel: values?.channelName?.label,
          startDate: values?.startDate,
          endDate: values?.endDate,
          conditionTypeId: values?.conditionType?.value,
          conditionTypeName: values?.conditionType?.label,
          conditionReffId: values?.conditionTypeRef?.value,
          conditionReffName: values?.conditionTypeRef?.label,
        },
        rowData: rowData,
      };
      saveEditedPartnerPriceAndLimitRequest(payload, setLoading);
    }
  };

  const approveOrRejectHandler = (values, status) => {
    if (id) {
      const payloadForApprove = {
        objhead: {
          userId: userId,
          permissionLevelId: !state?.isApproveByAccounts ? 1 : 2,
          permissionFor: 2,
          configId: +id,
          businessId: buId,
          approveByAccountId: state?.isApproveByAccounts
            ? state?.intApproveByAccounts
            : userId,
          approveBySupervisorId: state?.isApproveByAccounts ? userId : 0,
          approveCreditLimit: values?.limitAmount || 0,
          approveLimitDays: values?.limitDays || 0,
        },
        objRow: rowData?.map((item) => ({
          autoId: item?.intAutoId,
          limitPkid: item?.intLimitPkid,
          approvePrice: +item?.numProposePrice,
        })),
      };
      const payloadForReject = {
        userId: userId,
        permissionLevelId: !state?.isApproveByAccounts ? 1 : 2,
        permissionFor: 2,
        configId: +id,
        businessId: buId,
      };

      const payloadForPriceSetup = rowData?.map((e) => ({
        accountId: accId,
        actionBy: userId,
        businessUnitId: buId,
        conditionReffId: values?.conditionTypeRef?.value,
        conditionTypeId: values?.conditionType?.value,
        conditionTypeName: values?.conditionType?.label,
        conditionTypeRef: values?.conditionTypeRef?.label,
        endDate: values?.endDate,
        isAllItem: false,
        itemId: e?.intItemId,
        itemName: e?.strItemName,
        startDate: values?.startDate,
      }));

      approveOrReject(
        status ? payloadForApprove : payloadForReject,
        status,
        setLoading,
        () => {
          if (status && state?.isApproveByAccounts) {
            dispatch(
              savePriceSetup({
                data: payloadForPriceSetup,
                cb: () => {},
                setDisabled: setLoading,
              })
            );
          }
        }
      );
    }
  };

  return (
    <>
      {(isLoading || loading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          id={id}
          buId={buId}
          accId={accId}
          state={state}
          viewType={type}
          addRow={addRow}
          SOList={SOList}
          rowData={rowData}
          itemList={itemList}
          deleteRow={deleteRow}
          setRowData={setRowData}
          saveHandler={saveHandler}
          getItemList={getItemList}
          channelList={channelList}
          departmentId={departmentId}
          rowDataChange={rowDataChange}
          initData={id ? singleData : initData}
          approveOrRejectHandler={approveOrRejectHandler}
          conditionDDL={conditionDDL}
          conditionTypeRefList={conditionTypeRefList}
          setQuery={setQuery}
        />
      </div>
    </>
  );
}
