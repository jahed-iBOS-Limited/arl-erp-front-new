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
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          shipment: "",
          product: "",
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {/* {console.log(values)} */}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Insurence Payment">
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
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ fontWeight: "900" }}>Unit: APMBD</div>
                      <div style={{ fontWeight: "900" }}>
                        PO Number: 46545651
                      </div>
                      <div style={{ fontWeight: "900", marginRight: "30px" }}>
                        LC Number: 65465
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipment"
                          label="Shipment"
                          options={[]}
                          value={values?.shipment}
                          onChange={(valueOption) => {
                            setFieldValue("shipment", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="product"
                          options={[]}
                          label="Product"
                          value={values?.product}
                          onChange={(valueOption) => {
                            setFieldValue("product", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      {/* <div className="col-lg-3">
                        <button
                          className="btn btn-primary"
                          // disabled={}
                          style={{ marginTop: "15px" }}
                          type="button"
                          onClick={() => {}}
                        >
                          Show
                        </button>
                      </div> */}

                      {/* last div */}
                    </div>
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
                              <th style={{ width: "20px" }}>SL</th>
                              <th>Particles</th>
                              <th style={{ width: "150px" }}>Amount BDT</th>
                              <th style={{ width: "150px" }}>Amount (BDT)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Invoice Amount BDT</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Total Customs</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>Port Charges</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>Shipping Charges</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>5</td>
                              <td>CNF Payment</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>6</td>
                              <td>Transport</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>7</td>
                              <td>Inspectin/Survey</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>8</td>
                              <td>Cleaning</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>9</td>
                              <td>Unloading</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>10</td>
                              <td>Insurance</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>11</td>
                              <td>Document Acceptnce/Release</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>12</td>
                              <td>Bank Charge and Commission</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>13</td>
                              <td>Interest Paid</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td></td>
                              <td
                                colspan="1"
                                style={{
                                  fontWeight: "900",
                                  textAlign: "right",
                                }}
                              >
                                Interest Paid
                              </td>
                              <td></td>
                              <td
                                style={{
                                  fontWeight: "900",
                                  textAlign: "right",
                                }}
                              >
                                12000
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td
                                style={{
                                  fontWeight: "900",
                                  textAlign: "right",
                                }}
                                colspan="1"
                              >
                                Deductions
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>14</td>
                              <td>VAT(100%)</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>15</td>
                              <td>AT</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td>16</td>
                              <td>ANT</td>
                              <td className="text-right">12000</td>
                              <td className="text-right"></td>
                            </tr>
                            <tr>
                              <td></td>
                              <td
                                colspan="1"
                                style={{
                                  fontWeight: "900",
                                  textAlign: "right",
                                }}
                              >
                                Total Deduction of VAT and TAX
                              </td>
                              <td className="text-right"></td>
                              <td
                                className="text-right"
                                style={{ fontWeight: "900" }}
                              >
                                12000
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td
                                colspan="1"
                                style={{
                                  fontWeight: "900",
                                  textAlign: "right",
                                }}
                              >
                                Net Landing Cost Excluding VAT and TAX
                              </td>
                              <td className="text-right"></td>
                              <td
                                className="text-right"
                                style={{ fontWeight: "900" }}
                              >
                                12000
                              </td>
                            </tr>
                            {/* {gridData?.data?.length > 0 &&
                            gridData?.data?.map((item, index) => (
                            ))} */}
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
