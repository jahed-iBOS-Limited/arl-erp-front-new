import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../_helper/_card";
import ICustomTable from "../../../_helper/_customTable";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import {
  deleteFuelLog,
  GetVehicleDDL,
  getVehicleLogPurchaseDetails,
} from "./helper";
import PaginationTable from "../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import IDelete from "../../../_helper/_helperIcons/_delete";

const FuelLogModify = () => {
  const initData = {
    vehicleNumber: "",
    fromDate: "",
    toDate: "",
  };

  const headers = [
    "SL",
    "Expense Date",
    "Vehicle Number",
    "Driver Name",
    "Cash Amount",
    "Credit Amount",
    "Total Amount",
    "Expense ID",
    "Action",
  ];

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehicleDDL, setVehicleDDL] = useState([]);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    GetVehicleDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVehicleDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const girdDataFunc = (pageNo = 0, pageSize = 15, values) => {
    getVehicleLogPurchaseDetails(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vehicleNumber?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    girdDataFunc(pageNo, pageSize, values);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          girdDataFunc(pageNo, pageSize, values);
        }}
      >
        {({ values, setFieldValue, touched, errors, handleSubmit }) => (
          <ICard title="Fuel Log Modify">
            {loading && <Loading />}
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="vehicleNumber"
                      options={vehicleDDL || []}
                      value={values?.vehicleNumber}
                      label="Vehicle Number"
                      onChange={(valueOption) => {
                        setFieldValue("vehicleNumber", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Select Vehicle Number"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="From Date"
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="To Date"
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                    />
                  </div>

                  <div className="col d-flex justify-content-end align-items-center ">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="btn btn-primary mt-2"
                      disabled={
                        !values?.vehicleNumber ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {gridData?.data?.length > 0 && (
              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{_dateFormatter(item?.dteExpenseDate)}</td>
                      <td>{item?.strVehicleNumber}</td>
                      <td>{item?.strDriverName}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.numCashAmount, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.numCreditAmount, true)}
                      </td>
                      <td>
                        {_fixedPoint(
                          item?.numCashAmount + item?.numCreditAmount,
                          true
                        )}
                      </td>
                      <td>{item?.intExpenseId}</td>
                      <td className="text-center">
                        {!item?.intExpenseId && (
                          <span
                            onClick={() => {
                              deleteFuelLog(
                                {
                                  vehicleLogId: item?.intVehicleLogId,
                                  fuelPurchaseId: item?.intFuelPurchaseId,
                                },
                                setLoading,
                                () => {
                                  girdDataFunc(pageNo, pageSize, values);
                                }
                              );
                            }}
                          >
                            <IDelete></IDelete>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </ICustomTable>
            )}
            {gridData?.data?.length > 0 && (
              <PaginationTable
                count={gridData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
              />
            )}
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default FuelLogModify;
