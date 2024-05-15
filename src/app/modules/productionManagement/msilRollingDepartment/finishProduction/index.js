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

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shift: { value: "", label: "All" },
};
export default function FinishProduction() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const [, deleteHandler] = useAxiosPost();

  const history = useHistory();

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getlandingData(
      `/mes/MSIL/GetRollingFinishProductLanding?FromDate=${values?.fromDate ||
        _todayDate()}&ToDate=${values?.toDate || _todayDate()}&Shift=${
        values?.shift?.value
      }&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  const rowDeleteHandler = (id, values) => {
    IConfirmModal({
      message: `Are you sure to delete?`,
      yesAlertFunc: () => {
        deleteHandler(
          `/mes/MSIL/DeleteRollingFinishedProduct?finishedProductionId=${id}`,
          null,
          () => {
            getlandingData(
              `/mes/MSIL/GetRollingFinishProductLanding?FromDate=${values?.fromDate ||
                _todayDate()}&ToDate=${values?.toDate || _todayDate()}&Shift=${
                values?.shift?.value
              }&pageNumber=${pageNo}&pageSize=${pageSize}`
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
        link="/production-management/msil-Rolling/FinishProduction/create"
        title="Finish Production"
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
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shift"
                      options={[
                        { value: "", label: "All" },
                        { value: "A", label: "A" },
                        { value: "B", label: "B" },
                        { value: "C", label: "C" },
                        { value: "General", label: "General" },
                      ]}
                      value={values?.shift}
                      label="Shift"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("shift", valueOption);
                        } else {
                          setFieldValue("shift", { value: "", label: "All" });
                        }
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getlandingData(
                          `/mes/MSIL/GetRollingFinishProductLanding?FromDate=${values?.fromDate ||
                            _todayDate()}&ToDate=${values?.toDate ||
                            _todayDate()}&Shift=${
                            values?.shift?.value
                          }&pageNumber=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                      className="btn btn-primary"
                      disabled={false}
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "50px" }}>SL</th>
                          <th>Date</th>
                          <th>Shift</th>
                          <th>Product Name</th>
                          <th>Production [kgs]</th>
                          <th>Rod Quantity [kgs]</th>
                          <th style={{ width: "60px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landigData?.data?.length > 0 &&
                          landigData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td style={{ width: "50px" }}>{index + 1}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteDate)}
                              </td>
                              <td>{item?.strShift}</td>
                              <td>{item?.strMainItemName}</td>
                              <td className="text-center">
                                {item?.numProductionQtyKgs}
                              </td>
                              <td className="text-center">
                                {item?.numOddCutRodQtyKgs}
                              </td>
                              <td className="text-center">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <IEdit
                                      onClick={() => {
                                        history.push({
                                          pathname: `/production-management/msil-Rolling/FinishProduction/edit/${item?.intFinishProductionId}`,
                                          state: { ...item },
                                        });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span
                                      onClick={() => {
                                        rowDeleteHandler(
                                          item?.intFinishProductionId,
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
              </Form>
            </>
          )}
        </Formik>
      </ITable>
    </div>
  );
}
