import React, { useState } from "react";
import { getGridData } from "../helper";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

import {
  Card,
  CardHeader,
  ModalProgressBar,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import PaginationSearch from "../../../../_helper/_search";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";

export default function TableRow() {
  const [gridData] = useState({});
  const [loading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const history = useHistory();

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData();
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };
  // useEffect(() => {
  //   getInsurancePolicyDDL(setTest);
  // }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          unit: "",
          provider: "",
          filterBy: "",
          status: "",
          fromDate: _dateFormatter(new Date()),
          toDate: _dateFormatter(new Date()),
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {/* {console.log(values)} */}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Insurance Bill">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: ``,
                        state: {},
                      });
                    }}
                    className="btn btn-primary"
                    // disabled={}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  {/* Header Start */}
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="unit"
                          options={[]}
                          value={values?.unit}
                          label="Unit"
                          onChange={(valueOption) => {
                            setFieldValue("unit", valueOption);
                          }}
                          placeholder="Unit"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>From</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="provider"
                          options={[]}
                          value={values?.provider}
                          label="Provider"
                          onChange={(valueOption) => {
                            setFieldValue("provider", valueOption);
                          }}
                          placeholder="Provider"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="filterBy"
                          options={[]}
                          value={values?.filterBy}
                          label="Filter By"
                          onChange={(valueOption) => {
                            setFieldValue("filterBy", valueOption);
                          }}
                          placeholder="Filter By"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="status"
                          options={[]}
                          value={values?.status}
                          label="Status"
                          onChange={(valueOption) => {
                            setFieldValue("status", valueOption);
                          }}
                          placeholder="Status"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <button
                          className="btn btn-primary"
                          // disabled={}
                          style={{ marginTop: "15px" }}
                          type="button"
                          onClick={() => {}}
                        >
                          Show
                        </button>
                      </div>

                      {/* last div */}
                    </div>

                    {/* <div className="col-lg-2">
                      <NewSelect
                        name="plant"
                        options={[]}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                       
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    
                    
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div> */}
                    {/* <div className="col-lg-2 mt-5">
                      <button
                        className="btn btn-primary"
                        // disabled={}
                        type="button"
                        onClick={() => {
                       
                        }}
                      >
                        View
                      </button>
                    </div> */}
                  </div>

                  <div className="row cash_journal">
                    {loading && <Loading />}
                    <div className="col-lg-12">
                      <PaginationSearch
                        placeholder="Search Position/Emp. Type"
                        paginationSearchHandler={paginationSearchHandler}
                        values={values}
                      />
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ width: "15px" }}>SL</th>
                              <th>LC Number</th>
                              <th style={{ width: "50px" }}>Date</th>
                              <th style={{ width: "50px" }}>PO No</th>
                              <th>Cover Note No</th>
                              <th style={{ width: "50px" }}>CN Date</th>
                              <th>Policy No</th>
                              <th style={{ width: "50px" }}>Date</th>
                              <th>Invoice Amt.</th>
                              <th>Currency</th>
                              <th>Insured BDT</th>
                              <th>Premium</th>
                              <th>VAT</th>
                              <th>Stamp</th>
                              <th>Total</th>
                              <th>Discount</th>
                              <th>Billing</th>
                              <th>Store Bill ID</th>
                              <th>Payment</th>
                              <th>Discount Rcv.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.length > 0 &&
                              gridData?.data?.map((item, index) => (
                                <tr key={index}></tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {gridData?.data?.length > 0 && (
                      <PaginationTable
                        count={gridData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                      />
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
