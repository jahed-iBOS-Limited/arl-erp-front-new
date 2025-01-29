/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PaginationTable from "../../../chartering/_chartinghelper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { ITable } from "../../../_helper/_table";
import { _todayDate } from "../../../_helper/_todayDate";
import "./style.css";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shift: "",
};
export default function BilletConsumption() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const [, deleteHandler] = useAxiosPost();

  const history = useHistory();
  const setPositionHandler = (pageNo, pageSize, values) => {
    getlandingData(
      `/mes/MSIL/GetRollingBilletConsumptionLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  const rowDeleteHandler = (id, values) => {
    IConfirmModal({
      message: `Are you sure to delete?`,
      yesAlertFunc: () => {
        deleteHandler(
          `/mes/MSIL/DeleteRollingBilletConsumption?billetConsumptionId=${id}`,
          null,
          () => {
            getlandingData(
              `/mes/MSIL/GetRollingBilletConsumptionLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
            );
          },
          true
        );
      },
      noAlertFunc: () => {},
    });
  };

  return (
    <div>
      <ITable
        link="/production-management/msil-Rolling/BilletConsumption/create"
        title="Billet Consumption"
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {lodar && <Loading />}
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      min={values?.fromDate}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shift"
                      options={[
                        { value: "", label: "ALL" },
                        { value: "A", label: "A" },
                        { value: "B", label: "B" },
                        { value: "C", label: "C" },
                        { value: "General", label: "General" },
                      ]}
                      value={values?.shift}
                      label="Shift"
                      onChange={(valueOption) => {
                        setFieldValue("shift", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getlandingData(
                          `/mes/MSIL/GetRollingBilletConsumptionLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                      className="btn btn-primary mt-1"
                      disabled={
                        !values?.fromDate || !values?.toDate || !values?.shift
                      }
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div
                  style={{ marginTop: "15px" }}
                  className="loan-scrollable-table"
                >
                  <div className="scroll-table _table billet-consumption-wrapper">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>Main Product Name</th>
                            <th style={{ minWidth: "250px" }}>
                              Re-Heating Billet Consumed Wt Kgs Per Billet
                            </th>
                            <th>Re-Heating Billet Consumed in Pcs</th>
                            <th>Re-Heating Billet Consumed in Kgs</th>
                            <th style={{ minWidth: "250px" }}>
                              Direct Charging Billet Consumed Wt Kgs Per Billet
                            </th>
                            <th style={{ minWidth: "250px" }}>
                              Direct Charging Billet Consumed in Pcs
                            </th>
                            <th style={{ minWidth: "250px" }}>
                              Direct Charging Billet Consumed in Kgs
                            </th>
                            <th>Total Billet consumption in pcs</th>
                            <th>Total Billet Consumed in Kgs</th>
                            <th style={{ minWidth: "60px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {landigData?.data?.length > 0 &&
                            landigData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td className="text-center">
                                  {item?.strShift}
                                </td>
                                <td>{item?.strMainItemName}</td>
                                <td className="text-center">
                                  {item?.numReHeatingBilletConsumedWtKgsPerBillet.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.intReHeatingBilletConsumedInPcs.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.numReHeatingBilletConsumedInKgsCal.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.numDirectChargingBilletConsumedWtKgsPerBillet.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.intDirectChargingBilletConsumedInPcs.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.numDirectChargingBilletConsumedInKgsCal.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.intTotalBilletConsumptionInPcsCal.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.numTotalBilletConsumptionInKgsCal.toFixed(
                                    2
                                  )}
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <IEdit
                                        onClick={() => {
                                          history.push({
                                            pathname: `/production-management/msil-Rolling/BilletConsumption/edit/${item?.intBilletConsumptionId}`,
                                            state: { ...item },
                                          });
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <span
                                        className="delete-btn"
                                        onClick={() => {
                                          rowDeleteHandler(
                                            item?.intBilletConsumptionId,
                                            values
                                          );
                                        }}
                                      >
                                        <IDelete />
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {landigData?.data?.length > 0 && (
                    <PaginationTable
                      count={landigData.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ITable>
    </div>
  );
}
