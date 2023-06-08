import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from '../../../../../_metronic/_partials/controls';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import Loading from '../../../_helper/_loading';

const AelReportLanding = () => {
  const [rowData, getRowData, lodar] = useAxiosGet();
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    getRowData(
      `/hcm/Training/AelEventLanding`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => { }}>
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"AEL Event"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/pos-management/event/aelEvent/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="po_custom_search row">
                  <div className="col-md-3 input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search here..."
                      onChange={(e) => {
                        if (e.target.value === "") {
                          getRowData(
                            `/hcm/Training/AelEventLanding`
                          );
                        } else {
                          setSearchValue(e.target.value);
                        }

                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          getRowData(
                            `/hcm/Training/AelEventLanding?search=${searchValue}`
                          );
                        }
                      }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          getRowData(
                            `/hcm/Training/AelEventLanding?search=${searchValue}`
                          );
                        }}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Date</th>
                          <th>Product</th>
                          <th>Enroll</th>
                          <th>Employee Name</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Cluster</th>
                          <th>Mobile</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">{_dateFormatter(item?.dteCreatedDate)}</td>
                              <td>{item?.strProductName}</td>
                              <td className="text-center">{item?.intEmployeeId}</td>
                              <td>{item?.strEmployeeName}</td>
                              <td>{item?.strDesignationName}</td>
                              <td>{item?.strDepartmentName}</td>
                              <td>{item?.strCluster}</td>
                              <td>{item?.strMobile}</td>
                              <td className="text-center">{item?.numQuantity}</td>
                              <td className="text-center">{item?.numRate}</td>
                              <td className="text-center">{item?.numAmount}</td>
                            </tr>
                          ))}
                        <tr>
                          <td colSpan="9" className="text-right">Total</td>

                          <td className="text-center">{rowData?.reduce((a, b) => a + (b.numQuantity || 0), 0)}</td>
                          <td className="text-center"></td>
                          <td className="text-center">{rowData?.reduce((a, b) => a + (b.numAmount || 0), 0)}</td>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  )
}

export default AelReportLanding