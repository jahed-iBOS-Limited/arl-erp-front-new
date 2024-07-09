/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getSBUDDL } from "../../../../transportManagement/report/productWiseShipmentReport/helper";
import {
  createJV,
  createTradeCommissionJV,
  getCommissionReport,
  getCommissionStatus,
  getTradeCommissionData,
} from "../helper";
import CommissionReportAndJVForm from "./form";
import CommissionReportAndJVTable from "./table";
import CommissionReportAndJVTableTwo from "./tableTwo";

const initData = {
  reportType: { value: 1, label: "Pending" },
  type: "",
  month: "",
  year: "",
  commissionRate: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  sbu: "",
  channel: "",
  region: "",
  area: "",
  transactionHead: "",
  narration: "",
  status: { value: true, label: "Non-Reversed" },
};

// Government subsidy ids for six business units - (bongo, batayon, arl traders, direct trading, daily trading, eureshia)
const idSet1 = [8, 9, 10, 11, 12, 13, 21];
const idSet2 = [14, 15, 16, 17, 18, 19, 20,25, 22, 27];
const allIds = [...idSet1, ...idSet2];

const CommissionReportAndJV = () => {
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [reportTypes, getReportTypes] = useAxiosGet([]);
  const [transactionHeads, getTransactionHeads] = useAxiosGet([]);
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
    if (values?.reportType?.value === 1) {
      if ([5, 3, 6, 7, ...allIds].includes(values?.type?.value)) {
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
    const modify = _data.map((item) => {
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
    if ([5, 7, ...allIds].includes(values?.type?.value)) {
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
          rowNaration: item?.rowNarration || "",
          isProcess: false,
        })),
        img: {
          imageId: uploadedImage[0]?.id,
        },
      };

      createTradeCommissionJV(payload, setLoading);
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
    if (type === "cancel") {
      rowDataHandler(index, "isEdit", false);
      rowDataHandler(index, "commissiontaka", item?.tempCom);
    } else {
      rowDataHandler(index, "isEdit", false);
      rowDataHandler(index, "tempCom", item?.commissiontaka);
    }
  };

  const dateSetter = (values, setFieldValue) => {
    setFieldValue(
      "fromDate",
      _dateFormatter(new Date(values?.year?.value, values?.month?.value - 1, 1))
    );
    setFieldValue(
      "toDate",
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Commission report and JV">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    {(sectionIds.includes(sectionId) ||
                      departmentId === 299) && (
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
                            values?.type?.value === 6
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
                {loading && <Loading />}
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
                  }}
                />
                {/* Pending Table */}
                {values?.reportType?.value === 1 && (
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
