import React from "react";
import { Formik, Form } from "formik";
import PaginationTable from "../../../../_helper/_tablePagination";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getMonth } from "../../../../salesManagement/report/customerSalesTarget/utils";
import { toast } from "react-toastify";

export default function _Form({
  initData,
  btnRef,
  rowData,
  distributionChannelDDL,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  commonGridFunc,
  loading,
  dataChangeHandler,
  saveHandler,
}) {
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="distributionChannel"
                        options={[
                          { value: 0, label: "All" },
                          ...distributionChannelDDL,
                        ]}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          // setRowDto([]);
                          setFieldValue("distributionChannel", valueOption);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          // setRowDto([]);
                          setFieldValue("fromDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        label="From Date "
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        min={values?.fromDate}
                        onChange={(e) => {
                          // setRowDto([]);
                          setFieldValue("toDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        label="To Date "
                      />
                    </div>
                    <div className="col-lg-3 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary mt-4 mr-4"
                        disabled={!values?.distributionChannel}
                        onClick={() => {
                          commonGridFunc(values);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Start */}
              {rowData?.objdata?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Region</th>
                        <th>Item Id</th>
                        <th>Item Name</th>
                        <th>Target Year</th>
                        <th>Target Month</th>
                        <th>Target Quantity</th>
                        <th style={{ width: "150px" }}>Requisition Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.objdata?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{td?.sl}</td>
                          <td>
                            <div className="pl-2">{td?.nl5}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.itemId}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.itemName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.targetYear}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {getMonth(td?.targetMonth)}
                            </div>
                          </td>

                          <td>
                            <div className="pl-2">{td?.targetQuantity}</div>
                          </td>
                          <td>
                            <InputField
                              value={td?.requisitionQty}
                              name="requisitionQty"
                              placeholder="Requisition Quantity"
                              type="number"
                              onChange={(e) => {
                                dataChangeHandler(
                                  index,
                                  "requisitionQty",
                                  e?.target?.value
                                );
                              }}
                              onBlur={(e) => {
                                if (e?.target?.value < td?.targetQuantity) {
                                  toast.warn(
                                    "Requisition Quantity can not be less than Target Quantity"
                                  );
                                }
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {rowData?.objdata?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonGridFunc(values, pageNo, pageSize);
                  }}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
