import React from "react";
import { Form } from "formik";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function _Form({
  btnRef,
  loading,
  dataChangeHandler,
  shipPointDDL,
  getLandingData,
  selectedAll,
  allSelect,
  rowData,
  setRowData,
  formikprops,
  totalMaker,
}) {
  const { values, errors, touched, setFieldValue, handleSubmit } = formikprops;

  return (
    <>
      {loading && <Loading />}

      <Form className="form form-label-right">
        <div className="row global-form">
          <div className="col-lg-3">
            <label>From Date</label>
            <InputField
              value={values?.fromDate}
              name="fromDate"
              placeholder="Date"
              type="date"
              onChange={(e) => {
                setFieldValue("fromDate", e.target.value);
              }}
            />
          </div>

          <div className="col-lg-3">
            <label>To Date</label>
            <InputField
              value={values?.toDate}
              name="toDate"
              placeholder="Date"
              type="date"
              onChange={(e) => {
                setFieldValue("toDate", e.target.value);
              }}
            />
          </div>

          <div className="col-lg-3">
            <NewSelect
              name="shipPoint"
              options={shipPointDDL}
              value={values?.shipPoint}
              label="Ship Point"
              onChange={(valueOption) => {
                setRowData([]);
                setFieldValue("shipPoint", valueOption);
              }}
              placeholder="Ship Point"
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="col-lg-3 d-flex align-items-center">
            <button
              type="button"
              className="btn btn-primary mt-4 mr-4"
              disabled={!values?.shipPoint?.value}
              onClick={() => {
                setRowData([]);
                getLandingData(values, 0, 2000);
              }}
            >
              View
            </button>
          </div>
        </div>

        <>
          {rowData?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th
                      className="text-center cursor-pointer"
                      style={{ width: "30px" }}
                    >
                      <input
                        type="checkbox"
                        value={selectedAll()}
                        checked={selectedAll()}
                        onChange={() => allSelect(!selectedAll())}
                      />
                    </th>
                    <th style={{ width: "30px" }}>SL</th>
                    <th style={{ width: "100px" }}>Client Name</th>
                    <th style={{ width: "70px" }}>Demand Date</th>
                    <th style={{ width: "70px" }}>Type of work</th>
                    <th style={{ width: "220px" }}>Item/Qty</th>
                    <th style={{ width: "195px" }}>Casting Date/Time</th>
                    <th style={{ width: "100px" }}>Remarks</th>
                    <th>Marketing Concern</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((td, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          value={td?.isSelected}
                          checked={td?.isSelected}
                          onChange={() => {
                            dataChangeHandler(
                              index,
                              "isSelected",
                              !td.isSelected
                            );
                          }}
                        />
                      </td>
                      <td className="text-center">{index + 1}</td>
                      <td>{td?.strCustomerName}</td>
                      <td>{_dateFormatter(td?.dteDemandDate)}</td>
                      <td>{td?.strWorkTypeName}</td>
                      <td>
                        <table>
                          <tbody>
                            {td?.list?.map((item, nestedIndex) => (
                              <tr>
                                <td
                                  className="text-left"
                                  style={{ border: "none", width: "65%" }}
                                >
                                  {item?.strItem}
                                </td>
                                <td style={{ border: "none", width: "35%" }}>
                                  <InputField
                                    value={item?.numQuantity}
                                    name="numQuantity"
                                    placeholder="Lifting Qty"
                                    type="number"
                                    onChange={(e) => {
                                      dataChangeHandler(
                                        index,
                                        "numQuantity",
                                        e?.target?.value,
                                        nestedIndex?.toString()
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td>
                        <input
                          style={{ width: "195px" }}
                          value={td?.dteCastingDate}
                          name="dteCastingDate"
                          type="datetime-local"
                          className="form-control"
                          onChange={(e) => {
                            dataChangeHandler(
                              index,
                              "dteCastingDate",
                              e?.target?.value
                            );
                          }}
                        />
                      </td>
                      <td>
                        <input
                          value={td?.strRemarks}
                          name="strRemarks"
                          type="text"
                          className="form-control"
                          onChange={(e) => {
                            dataChangeHandler(
                              index,
                              "strRemarks",
                              e?.target?.value
                            );
                          }}
                        />
                      </td>
                      <td>{td?.strCastingProcedureBy}</td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan="5" className="text-right">
                      <strong>Total</strong>
                    </td>
                    <td colSpan="1" className="text-right">
                      <strong>{totalMaker}</strong>
                    </td>
                    <td colSpan="10"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>

        <button
          type="submit"
          style={{ display: "none" }}
          ref={btnRef}
          onSubmit={() => handleSubmit()}
        ></button>
      </Form>
    </>
  );
}
