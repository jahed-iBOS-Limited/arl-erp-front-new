import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _firstDateofMonth } from '../../../../_helper/_firstDateOfCurrentMonth';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { getSBUDDL } from '../../../../transportManagement/report/productWiseShipmentReport/helper';
import {
  createJV,
  createTradeCommissionJV,
  createTradeDamageJV,
  createTradeForeinJV,
  getCommissionReport,
  getCommissionStatus,
  getTradeCommissionData,
} from '../helper';
import CommissionReportAndJVForm from './form';
import CommissionReportAndJVTable from './table';
import CommissionReportAndJVTableTwo from './tableTwo';
import DamangeReportAndJVTable from './damageJV';
import { toast } from 'react-toastify';

const initData = {
  reportType: { value: 1, label: 'Pending' },
  type: '',
  month: '',
  year: '',
  commissionRate: '',
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  sbu: '',
  channel: '',
  region: '',
  area: '',
  transactionHead: '',
  narration: '',
  profitCenter: '',
  costCenter: '',
  costElement: '',
  status: { value: true, label: 'Non-Reversed' },
};

// Government subsidy ids for six business units - (bongo, batayon, arl traders, direct trading, daily trading, eureshia)
const idSet1 = [8, 9, 10, 11, 12, 13, 21];
const idSet2 = [14, 15, 16, 17, 18, 19, 20, 25, 22, 26, 27, 34];
// akij agro feed commission type list
const akijAgroFeedCommissionTypeList = [42, 43, 44, 45, 46, 47];
const allIds = [...idSet1, ...idSet2, 41, ...akijAgroFeedCommissionTypeList];

const CommissionReportAndJV = () => {
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [reportTypes, getReportTypes] = useAxiosGet([]);
  const [transactionHeads, getTransactionHeads] = useAxiosGet([]);
  const [, getDamageData, load] = useAxiosGet([]);
  const [open, setOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId, sectionId, departmentId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getSBUDDL(accId, buId, setSbuDDL);
    getReportTypes(
      `/wms/WmsReport/GetCommissionTypeDDL?businessUnitId=${buId}`
    );
    getTransactionHeads(
      `/wms/WmsReport/GetBusinessTransactionDDL?businessUnitId=${buId}`
    );
  }, [accId, buId]);

  const getData = (values) => {
    const ids = [8, 9, 10, 11, 12, 13];
    const typeId = ids.includes(values?.type?.value) ? 8 : values?.type?.value;
    if ([1, 3].includes(values?.reportType?.value)) {
      if (values?.type?.value === 24) {
        const apiUrl =
          values?.reportType?.value === 1
            ? `/oms/SalesReturnAndCancelProcess/GetDamageReturnForJv?SalesReturnType=2&accId=${accId}&status=${values?.status?.value}&BusuinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&CustomerId=${values?.customer?.value}&ChannelId=${values?.channel?.value}`
            : values?.reportType?.value === 3
              ? `/oms/SalesReturnAndCancelProcess/GetJVCompletedDamageReturn?SalesReturnType=2&accId=${accId}&BusuinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&CustomerId=${values?.customer?.value}&ChannelId=${values?.channel?.value}`
              : '';

        getDamageData(apiUrl, (data) => {
          setRowData(data);
        });
      } else if (
        [5, 3, 6, 7, ...allIds].includes(values?.type?.value) ||
        ([35, 36, 37, 38, 39, 52].includes(values?.type?.value) && buId === 144)
      ) {
        getTradeCommissionData(
          // values?.type?.value,
          typeId,
          accId,
          buId,
          values?.channel?.value,
          values?.region?.value || 0,
          values?.area?.value || 0,
          values?.fromDate,
          values?.toDate,
          userId,
          values?.commissionRate || 0,
          setRowData,
          setLoading
        );
      } else {
        getCommissionReport(
          accId,
          buId,
          values?.month?.value,
          values?.year?.value,
          values?.type?.value,
          userId,
          setRowData,
          setLoading
        );
      }
    } else if (values?.reportType?.value === 2) {
      getCommissionStatus(
        buId,
        values?.month?.value,
        values?.year?.value,
        typeId,
        values?.status?.value,
        setRowData,
        setLoading
      );
    }
  };

  const rowDataHandler = (index, key, value) => {
    let _data = [...rowData];
    _data[index][key] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data
      ?.filter((item) => !Boolean(item?.strCreatedJVNumber))
      .map((item) => {
        return {
          ...item,
          isSelected: value,
        };
      });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  // let totalQty = 0,
  //   totalCommission = 0,
  //   totalTargetQty = 0,
  //   totalAchievement = 0;

  const JVCrate = (values) => {
    if (values?.type?.value === 24) {
      const selectedItems = rowData?.filter((item) => item?.isSelected);
      const totalAmountForDamange = selectedItems?.reduce(
        (a, b) => a + +b?.totalReturnAmount,
        0
      );
      const ids = [8, 9, 10, 11, 12, 13];
      const commissionTypeId = ids.includes(values?.type?.value)
        ? 8
        : values?.type?.value;
      const payload = {
        headerObject: {
          accountId: accId,
          unitId: buId,
          unitName: buName,
          sbuId: values?.sbu?.value,
          commissionId: values?.transactionHead?.value,
          commissionName: values?.transactionHead?.label,
          fromDate: values?.fromDate,
          toDate: values?.toDate,
          narration: values?.narration,
          totalAmmount: totalAmountForDamange,
          actionBy: userId,
          // commissionTypeId: values?.type?.value,
          commissionTypeId: commissionTypeId,
          commissionTypeName: values?.type?.label,
        },
        rowObject: selectedItems?.map((item) => ({
          ...item,
          ammount: item?.totalReturnAmount,
          isProcess: false,
          deliveryQty: item?.totalReturnQty,
          customerId: item?.businessPartnerId,
          customerCode: item?.businessPartnerCode,
          customerName: item?.businessPartnerName,
          deliveryId: item?.deliveryId,
          rowNaration: item?.deliveryChallan,
        })),

        img: { imageId: uploadedImage[0]?.id },
      };

      createTradeDamageJV(payload, setLoading);
    } else if (
      [5, 7, ...allIds, 35, 36, 37, 38, 39, 52].includes(values?.type?.value)
    ) {
      if (
        !values?.sbu?.value &&
        !values?.transactionHead?.label &&
        !values?.narration
      ) {
        toast.dismiss(20);
        toast.warning(
          'Please provide the SBU, Transaction Head, and Narration.',
          { toastId: 20 }
        );

        return;
      }
      const selectedItems = rowData?.filter((item) => item?.isSelected);
      const totalAmount = selectedItems?.reduce(
        (a, b) => a + +b?.commissiontaka,
        0
      );

      const ids = [8, 9, 10, 11, 12, 13];
      const commissionTypeId = ids.includes(values?.type?.value)
        ? 8
        : values?.type?.value;
      const payload = {
        header: {
          accountId: accId,
          unitId: buId,
          unitName: buName,
          sbuId: values?.sbu?.value,
          commissionId: values?.transactionHead?.value,
          commissionName: values?.transactionHead?.label,
          fromDate: values?.fromDate,
          toDate: values?.toDate,
          narration: values?.narration,
          totalAmmount: totalAmount,
          actionBy: userId,
          // commissionTypeId: values?.type?.value,
          commissionTypeId: commissionTypeId,
          commissionTypeName: values?.type?.label,
        },
        row: selectedItems?.map((item) => ({
          ...item,
          ammount: item?.commissiontaka,
          rowNaration: item?.rowNarration || item?.paymentType,
          profitCenterId: values?.profitCenter?.value,
          costRevenueId: values?.costCenter?.value,
          costRevenueName: values?.costCenter?.label,
          elementId: values?.costElement?.value,
          elementName: values?.costElement?.label,
          isProcess: false,
          deliveryQty: item?.deliveryQty,
        })),
        img: {
          imageId: uploadedImage[0]?.id,
        },
      };
      if (values?.type?.value === 22) {
        const modifiedPayload = {
          headerObject: payload?.header,
          rowObject: payload?.row,
          imageObject: [payload?.img],
        };
        createTradeForeinJV(modifiedPayload, setLoading);
      } else {
        createTradeCommissionJV(payload, setLoading);
      }
    } else {
      const payload = rowData?.filter((item) => item?.isSelected);
      createJV(
        payload,
        accId,
        buId,
        values?.month?.value,
        values?.year?.value,
        values?.type?.value === 1 ? 2 : 4,
        userId,
        setLoading,
        () => {}
      );
    }
  };

  const editCommission = (index, item, type) => {
    if (type === 'cancel') {
      rowDataHandler(index, 'isEdit', false);
      rowDataHandler(index, 'commissiontaka', item?.tempCom);
    } else {
      rowDataHandler(index, 'isEdit', false);
      rowDataHandler(index, 'tempCom', item?.commissiontaka);
    }
  };

  const dateSetter = (values, setFieldValue) => {
    setFieldValue(
      'fromDate',
      _dateFormatter(new Date(values?.year?.value, values?.month?.value - 1, 1))
    );
    setFieldValue(
      'toDate',
      _dateFormatter(new Date(values?.year?.value, values?.month?.value, 0))
    );
  };

  const isDisabled = (values) => {
    return (
      loading ||
      (![5, ...allIds].includes(values?.type?.value) &&
        !(values?.month?.value && values?.year?.value)) ||
      !values?.type ||
      (values?.type?.value === 5 && !values?.commissionRate)
    );
  };

  // department ids for creating journal vouchers
  const sectionIds = [1973];
  // user for specical jv button permission
  const jvButtonPermissionUserId = [548380, 562439, 521619];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Commission report and JV">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    {(sectionIds.includes(sectionId) ||
                      departmentId === 299 ||
                      jvButtonPermissionUserId.includes(userId)) && (
                      <>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            JVCrate(values);
                          }}
                          disabled={
                            rowData?.filter((item) => item?.isSelected)
                              ?.length < 1 ||
                            loading ||
                            ([5, 7].includes(values?.type?.value) &&
                              !(
                                values?.sbu &&
                                values?.transactionHead &&
                                values?.fromDate &&
                                values?.toDate
                              )) ||
                            [6, 26]?.includes(values?.type?.value)
                          }
                        >
                          JV Create
                        </button>
                      </>
                    )}
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(loading || load) && <Loading />}
                <CommissionReportAndJVForm
                  obj={{
                    open,
                    idSet1,
                    allIds,
                    sbuDDL,
                    values,
                    getData,
                    rowData,
                    setOpen,
                    setRowData,
                    dateSetter,
                    isDisabled,
                    reportTypes,
                    setFieldValue,
                    transactionHeads,
                    setUploadedImage,
                    touched,
                    errors,
                    akijAgroFeedCommissionTypeList,
                  }}
                />
                {/* Pending Table */}
                {values?.type?.value !== 24 &&
                  values?.reportType?.value === 1 && (
                    <CommissionReportAndJVTable
                      obj={{
                        buId,
                        values,
                        rowData,
                        allSelect,
                        selectedAll,
                        editCommission,
                        rowDataHandler,
                      }}
                    />
                  )}
                {values?.type?.value === 24 &&
                  [1, 3].includes(values?.reportType?.value) && (
                    <DamangeReportAndJVTable
                      obj={{
                        buId,
                        values,
                        rowData,
                        allSelect,
                        selectedAll,
                        editCommission,
                        rowDataHandler,
                      }}
                    />
                  )}
                {/* JV Created Table */}
                {values?.reportType?.value === 2 && (
                  <CommissionReportAndJVTableTwo
                    obj={{
                      values,
                      rowData,
                      setLoading,
                      // allSelect,
                      // selectedAll,
                      // rowDataHandler,
                    }}
                  />
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default CommissionReportAndJV;
