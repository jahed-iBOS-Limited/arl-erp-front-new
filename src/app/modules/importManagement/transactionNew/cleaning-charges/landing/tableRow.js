/* eslint-disable react-hooks/exhaustive-deps */
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
import PaginationSearch from "../../../../_helper/_search";
import ICustomTable from "./../../../../_helper/_customTable";

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
  const header = ["Bill No", "Payment Date", "Amount (BDT)"];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {/* {console.log(values)} */}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Transport Charges Payment Info">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/managementImport/transaction/cleaning-charges/create`,
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
                    </div>
                    <ICustomTable ths={header}>
                      {gridData?.data?.length > 0 &&
                        gridData?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <span className="pl-2">{`${item?.userReferenceName}`}</span>
                              </td>
                              <td>
                                <span className="pl-2">{`${item?.userReferenceName}`}</span>
                              </td>
                              <td>
                                <span className="pl-2 text-right">{`${item?.userReferenceName}`}</span>
                              </td>
                            </tr>
                          );
                        })}
                      <tr>
                        <td
                          style={{ fontWeight: "900" }}
                          calssName="text-right"
                        >
                          Total
                        </td>
                        <td></td>
                        <td classname="text-right"></td>
                      </tr>
                    </ICustomTable>
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
