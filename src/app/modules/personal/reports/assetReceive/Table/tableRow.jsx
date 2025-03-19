/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import { useSelector, shallowEqual } from "react-redux";
import {
  getAssetReceiveReportData,
} from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";


const validationSchema = Yup.object().shape({})

export function TableRow(props) {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [empType, setEmpType] = useState([]);

  //Get Api Data
  // useEffect(() => {
  //   getAssetReceiveReportData(profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setGridData,
  //     setLoading,
  //     pageNo,
  //     pageSize)
  // }, [profileData?.accountId, selectedBusinessUnit?.value]);



  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getAssetReceiveReportData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      empType,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };

 const onChangeForAssetReceiveReport = (value) =>{
  getAssetReceiveReportData(
    profileData?.accountId,
    selectedBusinessUnit?.value,
    profileData?.userId,
    +value,
    setGridData,
    setLoading,
    pageNo,
    pageSize
  );
  }


  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };


  return (
    <>
      <ICustomCard title="Asset Receive">
        <>
          <Formik
            enableReinitialize={true}
            initialValues={{}}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => { }}
          >
            {({ errors, touched, setFieldValue, isValid, values }) => (
              <>
                <div className="row">
                  <div className="col-lg-12">
                    {loading && <Loading />}
                    <PaginationSearch
                      placeholder="Asset Name And Code Search"
                      paginationSearchHandler={paginationSearchHandler}
                    />
                    <Form>
                      <div role="group" aria-labelledby="my-radio-group" className="m-3">
                        <label>
                          <Field type="radio" name="picked"
                          onClick={(e)=>{
                            onChangeForAssetReceiveReport(e.target.value)
                            setEmpType(+e.target.value)
                          }}
                          
                          value="1" />
                         Assign By
                      </label>
                        <label className="ml-3">
                          <Field type="radio" name="picked"
                          onClick={(e)=>{
                            onChangeForAssetReceiveReport(e.target.value)
                            setEmpType(+e.target.value)
                          }}
                          value="2" />
                        Responsible Person
                       </label>
                      </div>
                    </Form>
                    <div className='table-responsive'>
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Asset Name</th>
                          <th>Asset Description</th>
                          <th>Employee Code</th>
                          <th>Employee Name</th>
                          {/* <th>Employee Email</th> */}
                          <th>Responsible Employee Name</th>
                          <th>Using Department Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.length > 0 &&
                          gridData?.data.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td style={{ width: "30px" }} className="text-center">
                                  {index + 1}
                                </td>
                                <td>
                                  <span className="pl-2">{item?.assetName}</span>
                                </td>
                                <td>
                                  <span className="pl-2">{item?.assetDescription}</span>
                                </td>
                                <td>
                                  <span className="pl-2">{item?.employeeCode}</span>
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.employeeFirstName}
                                  </span>
                                </td>
                                {/* <td>
                                  <span className="pl-2">
                                    {item?.employeeEmail}
                                  </span>
                                </td> */}
                                <td>
                                  <span className="pl-2">
                                    {item?.responsibleEmpName}
                                  </span>
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item.usingDepartmentName}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  />
                )}
              </>
            )}
          </Formik>
        </>
      </ICustomCard>
    </>
  );
}
