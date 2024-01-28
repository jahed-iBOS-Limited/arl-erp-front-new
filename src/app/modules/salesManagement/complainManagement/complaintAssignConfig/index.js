/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {};
export default function ComplainAssignConfigLanding() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [complainAssignData,getComplaiAssignData,loadComplaintAssignData] = useAxiosGet()
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const commonGridData = (
    pageNo,
    pageSize,
    searhValue
  ) => {
    console.log("pageSize",pageSize);
    console.log("pageNO",pageNo);
    getComplaiAssignData(
      `/oms/CustomerPoint/GetComplainAssignLanding?BusinessUnitId=${buId}&pageNo=${pageNo}&pageSize=${pageSize}&employeeId=${searhValue || ""}`
    )
  };
  useEffect(()=>{
    getComplaiAssignData(
      `/oms/CustomerPoint/GetComplainAssignLanding?BusinessUnitId=${buId}&pageNo=${pageNo}&pageSize=${pageSize}`
    )
  },[buId])
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
            {loadComplaintAssignData && <Loading />}
            <IForm
              title="User Role Manager"
              isHiddenReset
              isHiddenBack
              isHiddenSave
              renderProps={() => {
                return (
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        history.push("/sales-management/complainmanagement/complaintassignconfig/create");
                      }}
                    >
                      Create
                    </button>
                  </div>
                );
              }}
            >
              <Form>
              <div className="">
              <PaginationSearch
                placeholder='Search By Employee ID'
                paginationSearchHandler={(searchValue) => {
                  commonGridData(pageNo,pageSize,searchValue);
                }}
                values={values}
              />
             <div className='table-responsive'>
                <table className='table table-striped table-bordered global-table'>
                  <thead>
                   <tr>
                   <th>SL No</th>
                    <th>Employee ID</th>
                    <th>User Name</th>
                    <th>Action</th>
                   </tr>
                  </thead>
                  <tbody>
                    {
                      complainAssignData?.data?.length>0 && complainAssignData?.data?.map((item,index)=>(
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">{item?.employeeId}</td>
                          <td className="text-center">{item?.employeeName}</td>
                          <td className="text-center">
                            <span onClick={()=>{
                              history.push(`/sales-management/complainmanagement/complaintassignconfig/edit/${item?.employeeId}`,item)
                            }}>
                              <IEdit/>
                            </span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                {
                  console.log("pageSize",pageSize)
                }
             </div>
              {
                complainAssignData?.data?.length>0 && (
                  <PaginationTable
                  count={complainAssignData?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonGridData(pageNo, pageSize);
                  }}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
                )
              }
              </div>
              </Form>
            </IForm>
        </>
      )}
    </Formik>
  );
}