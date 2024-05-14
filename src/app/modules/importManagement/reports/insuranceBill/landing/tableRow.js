/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import { _todayDate } from "../../../../_helper/_todayDate";
import { validationSchema } from "../helper";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const header = [
  {
    name: 
    "SL",
    style: {
      minWidth: "50px",
    },
  },
  {
    name: 
    "LC Number",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Date",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "PO No",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Cover Note No",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "CN Date",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Policy No",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Date",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Invoice Amt.",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Currency",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Insured BDT",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Premium  VAT Stamp",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Total  Discount",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Billing  Store",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Bill ID",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Payment,",
    style: {
      minWidth: "100px",
    },
  },
  {
    name: 
    "Discount Rcv.",
    style: {
      minWidth: "100px",
    },
  },
  ];

  const initData = {
    startDate: _todayDate(),
    endDate: _todayDate(),
    filter: "",
    provider: "",
    status: "",
  };

  const loadPoNumbers = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `imp/ImportCommonDDL/GetPONumberList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) =>
        res?.data?.map((item) => ({
          label: item?.label,
          value: item?.value,
        }))
      );
  };

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Insurance Payment">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.startDate}
                      label="Start Date"
                      placeholder="Start Date"
                      type="date"
                      name="startDate"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.endDate}
                      label="End Date"
                      placeholder="End Date"
                      type="date"
                      name="endDate"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Provider</label>
                    <SearchAsyncSelect
                      selectedValue={values?.provider}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("provider", valueOption);
                      }}
                      loadOptions={loadPoNumbers}
                      placeholder="Search by Provider"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="filter"
                      placeholder="Filter By"
                      value={values?.filter}
                      onChange={(valueOption) => {
                        setFieldValue("filter", valueOption);
                      }}
                      isSearchable={true}
                      options={[]}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      placeholder="Status"
                      value={values?.status}
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                      }}
                      isSearchable={true}
                      options={[]}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 d-flex align-items-end">
                    <button
                      className="btn btn-primary"
                      disabled={!isValid || !dirty}
                    >
                      Show
                    </button>
                  </div>
                  <div className="col-6 d-flex justify-content-end align-items-end">
                    <button className="btn btn-primary ml-3">Attach Doc</button>
                    <button className="btn btn-primary ml-3">
                      Forward Bill
                    </button>
                  </div>
                </div>
                {/* Table Start */}
                {
                  // rowDto?.length > 0 &&
                  <div className="loan-scrollable-table">
                    <div
                      style={{ maxHeight: "500px" }}
                      className="scroll-table _table"
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            {header?.length > 0 &&
                              header?.map((item, index) => (
                                <th key={index} style={item?.style}>{item?.name}</th>
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
