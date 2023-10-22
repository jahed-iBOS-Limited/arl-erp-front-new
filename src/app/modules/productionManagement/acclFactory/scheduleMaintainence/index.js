import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import ICheckout from "../../../_helper/_helperIcons/_checkout";
import IViewModal from "../../../_helper/_viewModal";
import ScheduleStatusModal from "./scheduleStatusModal";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import PaginationTable from "../../../_helper/_tablePagination";

const initData = {
  plantName: "",
  fromDate: "",
  toDate: "",
  maintenanceType: "",
  frequency: ""

};
export default function ScheduleMaintainence() {
  const history = useHistory();
  const [isShowModal, setIsShowModal] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [plantNameDDL, getPlantNameDDL, plantNameDDLloader] = useAxiosGet();
  const [schedulMaintenanceData, getSchedulMaintenanceData, getSchedulMaintenanceDataLoading] = useAxiosGet()


  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);


   useEffect(() => {
    getPlantNameDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
  }, []);



  const handleGetScheduleMaintenance = (pageNo, pageSize, values, cb) => {
    const buId = selectedBusinessUnit;
    const fromDate = values?.fromDate;
    const toDate = values?.toDate;
    const plantId = values?.plantName?.value;
    const maintenanceTypeId = values?.maintenanceType?.value;
    const frequency = values?.frequency?.label;
    const url = `/mes/ScheduleMaintenance/GetScheduleMaintenanceLanding?BusinessUnitId =${buId}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${fromDate}&ToDate=${toDate}&PlantId=${plantId}&MaintenanceTypeId=${maintenanceTypeId}&Frequency=${frequency}`
    getSchedulMaintenanceData(url);
  };


  const setPositionHandler = (pageNo, pageSize,values) =>{
    handleGetScheduleMaintenance(values)
  }


  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        handleGetScheduleMaintenance(pageNo, pageSize, values, () => {
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
          {false && <Loading />}
          <IForm
            title="Schedule Maintainence"
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
                      history.push(
                        "/production-management/ACCLFactory/Schedule-Maintenance/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3 ">
                    <NewSelect
                      value={values?.customerName}
                      label="Plant Name"
                      name="plantName"
                      // options={plantNameDDL}
                      options={plantNameDDL}
                      onChange={(valueOption) => {

                        if (valueOption) {
                          setFieldValue("plantName", valueOption);
                        } else {
                          setFieldValue("plantName", "");
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      type="date"
                      name="fromDate"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      type="date"
                      name="toDate"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <NewSelect
                      value={values?.maintenanceType}
                      label="Maintenance Type"
                      name="maintenanceType"
                      options={[
                        { value: 1, label: "Electrical" },
                        { value: 2, label: "Mechanical" },
                      ]}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("maintenanceType", valueOption)
                        } else {
                          setFieldValue("maintenanceType", "")

                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <NewSelect
                      value={values?.frequency}
                      label="Frequency"
                      name="frequency"
                      options={[
                        { value: 1, label: "Daily" },
                        { value: 2, label: "Weekly" },
                        { value: 3, label: "Monthly" },
                        { value: 4, label: "Yearly" },
                      ]}
                      onChange={(valueOption) => {
                        setFieldValue("frequency", valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        console.log("view button")
                      }}
                      disabled={false}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-10">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Date</th>
                        <th>Machine</th>
                        <th>Machine Parts</th>
                        <th>
                          Frequency
                        </th>
                        <th>Maintenance Type</th>
                        <th>Responsible</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[{}, {}]?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.activityName}</td>
                          <td>{item?.activityStartTime ? item?.activityStartTime : ""}</td>
                          <td>{item?.activityEndTime}</td>
                          <td>{item?.isParticipantCount ? "Yes" : "No"}</td>
                          <td>{item?.taken}</td>
                          <td>{item?.remaining}</td>
                          <td className="d-flex justify-content-around">
                            <span onClick={console.log("Edit")}>
                              <IEdit />
                            </span>
                            <span>
                              <IView />
                            </span>
                            <span onClick={() => setIsShowModal(true)}>
                              <ICheckout />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {
                    true && <PaginationTable
                    count={schedulMaintenanceData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                    values={values}
                  />
                  }
                </div>
              </div>
            </Form>
            <IViewModal
              modelSize="lg"
              show={isShowModal}
              onHide={() => setIsShowModal(false)}
            >
              <ScheduleStatusModal handleGetScheduleMaintenance={handleGetScheduleMaintenance}/>
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
