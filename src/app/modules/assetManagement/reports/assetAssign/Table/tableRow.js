/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useSelector, shallowEqual } from "react-redux";
import {
  getAssetAssignReportData,
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

  //Get Api Data
  useEffect(() => {
    getAssetAssignReportData(profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize)
  }, [profileData?.accountId, selectedBusinessUnit?.value]);



  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getAssetAssignReportData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };


  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };


  return (
    <>
      <ICustomCard title="Asset Assign">
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

                   <div className="table-responsive">
                   <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Asset Code</th>
                          <th>Asset Name</th>
                          <th>Asset Description</th>
                          <th>Employee Code</th>
                          <th>Employee Name</th>
                          {/* <th>Employee Email</th> */}
                          <th>Responsible Employee Name</th>
                          <th>Using Department Name</th>
                          <th>Manufacturer Serial No</th>
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
                                  <span className="pl-2">{item?.assetCode}</span>
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
                                <td
                                style={{width:"200px"}}
                                >
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
                                <td>
                                  <span className="pl-2">
                                    {item.manufacturerSerialNo}
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
                    count={gridData?.totalCount}
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
