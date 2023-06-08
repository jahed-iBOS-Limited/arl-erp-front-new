import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getItemRequestGridData,
  GetLoadUnloadLabourBillTopSheet,
} from "../helper";
import Table from "./table";
import {
  GetPendingUnloadLabourBillAmount,
  getShippointDDL,
} from "../../../../financialManagement/invoiceManagementSystem/billregister/helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";

const initData = {
  reportType: { value: 1, label: "Details" },
  shipPoint: "",
  supplier: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toTime: _todaysEndTime(),
};

const LoadUnloadBill = () => {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shipPointDDL, setShipPointDDL] = useState([]);

  const getData = (values) => {
    const typeId = values?.reportType?.value;
    if ([4].includes(buId)) {
      if (typeId === 1) {
        GetPendingUnloadLabourBillAmount(
          accId,
          buId,
          values?.supplier?.value || 0,
          values?.shipPoint?.value,
          values?.fromDate,
          values?.toDate,
          values?.fromTime,
          values?.toTime,
          setRowData,
          setLoading
        );
      } else if (typeId === 2) {
        GetLoadUnloadLabourBillTopSheet(
          accId,
          buId,
          values?.fromTime,
          values?.toTime,
          values?.shipPoint?.value,
          setRowData,
          setLoading
        );
      }
    } else {
      getItemRequestGridData(
        accId,
        buId,
        values?.fromDate,
        values?.toDate,
        setRowData,
        setLoading
      );
    }
  };

  useEffect(() => {
    getShippointDDL(userId, accId, buId, setShipPointDDL);
    if (buId !== 4) {
      getData(initData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const shipPointList = (values) => {
    return values?.reportType?.value === 1
      ? shipPointDDL
      : [{ value: 0, label: "All" }, ...shipPointDDL];
  };

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Load Unload Bill">
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  {buId === 4 ? (
                    <>
                      <div className="col-md-3">
                        <NewSelect
                          name="reportType"
                          label="Report Type"
                          placeholder="Report Type"
                          value={values?.reportType}
                          options={[
                            { value: 1, label: "Details" },
                            { value: 2, label: "Top Sheet" },
                          ]}
                          onChange={(e) => {
                            setFieldValue("reportType", e);
                            setRowData([]);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <NewSelect
                          name="shipPoint"
                          label="Ship Point"
                          placeholder="Ship Point"
                          value={values?.shipPoint}
                          options={shipPointList(values) || []}
                          onChange={(e) => {
                            setFieldValue("shipPoint", e);
                            setRowData([]);
                          }}
                          isDisabled={!values?.reportType}
                        />
                      </div>
                      <FromDateToDateForm
                        obj={{
                          values,
                          setFieldValue,
                          time: values?.reportType?.value === 1,
                        }}
                      />

                      {values?.reportType?.value === 1 && (
                        <div className="col-md-3">
                          <label>Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values?.supplier}
                            handleChange={(valueOption) => {
                              setRowData([]);
                              setFieldValue("supplier", valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/oms/BillPosting/GetlaboursuppliernamebyShipPoint?SearchTerm=${v}&BusinessUnitId=${buId}&ShipPointId=${values?.shipPoint?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
                                )
                                .then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    label: item?.strLaborSupplierName,
                                    value: item?.intLaborSupplierId,
                                  }));
                                  return updateList;
                                });
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <FromDateToDateForm obj={{ values, setFieldValue }} />
                    </>
                  )}
                  <IButton
                    onClick={() => {
                      getData(values);
                    }}
                  />
                </div>
              </div>
              {rowData?.length > 0 && (
                <Table rowData={rowData} buId={buId} values={values} />
              )}
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default LoadUnloadBill;
