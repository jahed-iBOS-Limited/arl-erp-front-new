import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../_helper/_customCard";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { setEmployeeRegisterLandingAction } from "../../../_helper/reduxForLocalStorage/Actions";
import { getDriverNameDDL_api, getEmployeeRegisterLanding } from "./helper";

const EmployeeRegisterLanding = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // state
  const [driverNameDDL, setDriverNameDDL] = useState([]);
  const [landingData, setLandingData] = useState([]);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const dispatch = useDispatch();
  // Redux store data
  const {
    profileData,
    selectedBusinessUnit,
    employeeRegisterLanding,
  } = useSelector(
    (state) => ({
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      employeeRegisterLanding: state?.localStorage?.employeeRegisterLanding,
    }),
    shallowEqual
  );

  // get initial data
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDriverNameDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDriverNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getEmployeeRegisterLanding(
      values?.travelDateFrom,
      values?.travelDateTo,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      values?.driverName?.value,
      setLandingData,
      setLoading
    );
  };

  const gridDataFunc = (pageNo, pageSize, values) => {
    getEmployeeRegisterLanding(
      values?.travelDateFrom,
      values?.travelDateTo,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      values?.driverName?.value,
      setLandingData,
      setLoading
    );
  };

  useEffect(() => {
    if(employeeRegisterLanding?.driverName?.value){
      gridDataFunc(pageNo, pageSize, employeeRegisterLanding)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeRegisterLanding])
  return (
    <ICustomCard title='Employee Register'>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...employeeRegisterLanding,
          driverName: employeeRegisterLanding?.driverName?.value
            ? employeeRegisterLanding?.driverName
            : driverNameDDL[0] || "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <Form className='form form-label-right'>
              <div className='global-form'>
                {/* Row */}
                <div className='row'>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='driverName'
                      options={driverNameDDL}
                      value={values?.driverName}
                      label='Driver Name'
                      onChange={(valueOption) => {
                        setFieldValue("driverName", valueOption);
                        setLandingData([])
                      }}
                      placeholder='Driver Name'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-2'>
                    <label>Travel Date From</label>
                    <InputField
                      value={values?.travelDateFrom}
                      name='travelDateFrom'
                      placeholder='Travel Date From'
                      type='date'
                    />
                  </div>
                  <div className='col-lg-2'>
                    <label>Travel Date To</label>
                    <InputField
                      value={values?.travelDateTo}
                      name='travelDateTo'
                      placeholder='Travel Date To'
                      type='date'
                    />
                  </div>
                  <div className='col-lg-3' style={{ marginTop: "14px" }}>
                    <button
                      onClick={() => {
                        dispatch(setEmployeeRegisterLandingAction(values));
                        gridDataFunc(pageNo, pageSize, values);
                      }}
                      type='button'
                      className='btn btn-primary mr-2'
                      disabled={
                        !values?.driverName ||
                        !values?.travelDateFrom ||
                        !values?.travelDateTo
                      }
                    >
                      View
                    </button>

                    <button
                      type='button'
                      className='btn btn-primary'
                      disabled={
                        values.travelDateFrom === "" ||
                        values.travelDateTo === "" ||
                        values.driverName === ""
                      }
                      onClick={() => {
                        dispatch(setEmployeeRegisterLandingAction(values));
                        history.push({
                          pathname:
                            "/transport-management/routecostmanagement/employeeRegister/create",
                          state: {
                            values,
                            landingData,
                          },
                        });
                      }}
                    >
                      Create Register
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              {landingData?.data?.length > 0 && (
             <div className="table-responsive">
                 <table className='table table-striped table-bordered global-table'>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Shipment Date</th>
                      <th>Shipment Code</th>
                      <th>Partner Name</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Vehicle No</th>
                      <th>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingData?.data?.length &&
                      landingData?.data?.map((data, i) => (
                        <tr key={i + 1}>
                          <td>{i + 1}</td>
                          <td>{_dateFormatter(data.shipmentDate)}</td>
                          <td>{data.shipmentCode}</td>
                          <td>{data.partnerName}</td>
                          <td>{data.shipPointAddress}</td>
                          <td>{data.partnerAddress}</td>
                          <td>{data.vehicleNo}</td>
                          <td>{data.totalCost}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
             </div>
              )}
              {landingData?.data?.length > 0 && (
                <PaginationTable
                  count={landingData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default EmployeeRegisterLanding;
