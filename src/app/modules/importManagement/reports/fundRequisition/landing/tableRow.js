import React, { useState } from "react";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { validationSchema } from "../helper";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";

const TableRow = () => {
  const [rowDto] = useState([]);
  const [loader] = useState(false);

  const header = [
    {
      name: "ID ",
      style: {
        minWidth: "50px",
      },
    },
    {
      name: "Unit",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC Bank",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Particulars",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Pay By Bank",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Description",
      style: {
        minWidth: "250px",
      },
    },
    {
      name: "Material Type",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "BDT",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Sh.",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Refference",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Note",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Insert By",
      style: {
        minWidth: "100px",
      },
    },
  ];

  const initData = {
    paymentType: "",
    startDate: _todayDate(),
    particulars: "",
    payTo: "",
    intRate: "",
    description: "",
    reference: "",
    note: "",
    startDate2: _todayDate(),
    lessAmount: "",
    discrepancy: "",
    note2: "",
  };

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Fund Requisition">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <div className="text-center">
                <b>LC Number: 12342342</b>
              </div>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="row global-form">
                      <div className="col-lg-4">
                        <NewSelect
                          name="paymentType"
                          options={[]}
                          value={values?.paymentType}
                          onChange={(valueOption) => {
                            setFieldValue("paymentType", valueOption);
                          }}
                          placeholder="Payment Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Start Date</label>
                        <InputField
                          value={values?.startDate}
                          name="startDate"
                          placeholder="From"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="particulars"
                          options={[]}
                          value={values?.particulars}
                          onChange={(valueOption) => {
                            setFieldValue("particulars", valueOption);
                          }}
                          placeholder="Particulars"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4 d-flex justify-content-start align-items-end global-form">
                        <input
                          type="radio"
                          id="po"
                          name="polc"
                          value="po"
                          className="ml-2 mr-2"
                        />
                        <label htmlFor="po" className="mr-4">
                          PO
                        </label>
                        <input
                          type="radio"
                          id="lc"
                          name="polc"
                          value="lc"
                          className="mr-2"
                        />
                        <label htmlFor="lc" className="mr-2">
                          LC
                        </label>
                      </div>
                      <div className="col-lg-4 d-flex align-items-center">
                        <NewSelect
                          name="polcDropdown"
                          options={[]}
                          value={values?.polcDropdown}
                          onChange={(valueOption) => {
                            setFieldValue("polcDropdown", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4 d-flex align-items-center">
                        <button
                          className="btn btn-primary"
                          disabled={!isValid || !dirty}
                        >
                          Get Shipment
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="payByBank"
                          options={[]}
                          value={values?.paymentType}
                          onChange={(valueOption) => {
                            setFieldValue("payByBank", valueOption);
                          }}
                          placeholder="Pay By Bank"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="payByBank"
                          options={[]}
                          value={values?.paymentType}
                          onChange={(valueOption) => {
                            setFieldValue("payByBank", valueOption);
                          }}
                          placeholder="Instrument"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Pay To</label>
                        <InputField
                          value={values?.payTo}
                          name="payTo"
                          placeholder="Pay To"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Int. Rate</label>
                        <InputField
                          value={values?.intRate}
                          name="intRate"
                          placeholder="Int. Rate"
                          type="number"
                          min={0}
                        />
                      </div>
                      <div className="col-lg-8">
                        <label>Description</label>
                        <InputField
                          value={values?.description}
                          name="description"
                          placeholder="Description"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Reference</label>
                        <InputField
                          value={values?.reference}
                          name="reference"
                          placeholder="Reference"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Note</label>
                        <InputField
                          value={values?.note}
                          name="note"
                          placeholder="Note"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="payByBank"
                          options={[]}
                          value={values?.paymentType}
                          onChange={(valueOption) => {
                            setFieldValue("payByBank", valueOption);
                          }}
                          placeholder="Agent"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="row global-form">
                      <div className="col-lg-12">
                        <label>Date</label>
                        <InputField
                          value={values?.startDate2}
                          name="startDate2"
                          placeholder="From"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-12">
                        <label>Less Amount</label>
                        <InputField
                          value={values?.lessAmount}
                          name="lessAmount"
                          placeholder="Amount"
                        />
                      </div>
                      <div className="col-lg-12 d-flex align-items-center pt-2 pb-1">
                        <input
                          type="checkbox"
                          id="discrepancy"
                          name="discrepancy"
                          className="mr-2"
                        />
                        <label htmlFor="discrepancy">Discrepancy</label>
                      </div>
                      <div className="col-lg-12 pt-2 pb-2">
                        <button className="btn btn-primary">
                          Unapproved Requisitions
                        </button>
                      </div>
                      <div className="col-lg-12">
                        <InputField
                          value={values?.note2}
                          name="note2"
                          placeholder="Note"
                          type="text"
                        />
                      </div>
                      <div className="col-auto pt-2 pb-2">
                        <button className="btn btn-primary">Calculate</button>
                      </div>
                      <div className="col-auto pt-2 pb-2 pr-0">
                        <button className="btn btn-primary">
                          Add to Budget
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Start */}
                {
                  // rowDto?.length > 0 &&
                  <div className="loan-scrollable-table">
                    <div className="scroll-table _table">
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              {header?.length > 0 &&
                                header?.map((item, index) => (
                                  <th key={index} style={item?.style}>
                                    {item?.name}
                                  </th>
                                ))}
                            </tr>
                          </thead>

                          <tbody>
                            {rowDto.length >= 0 &&
                              rowDto.map((data, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="text-center">
                                      {data?.employeeId}
                                    </div>
                                  </td>
                                  {/* <td>
                                  <div className="pl-2">
                                    {data?.employeeName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {data?.designationName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {data?.departmentName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.totalDays}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.workingDays}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.present}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.absent}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.late}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.movement}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.leave}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.offDay}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.holiday}
                                  </div>
                                </td> */}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                }
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default TableRow;
