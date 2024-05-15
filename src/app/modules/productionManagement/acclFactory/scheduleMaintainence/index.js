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
import { _todayDate } from "../../../_helper/_todayDate";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import PaginationTable from "../../../_helper/_tablePagination";
import EditModal from "./editModal";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../_helper/_confirmModal";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import DetailsViewModal from "./detailsViewModal";

const initData = {
  plantName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  maintenanceType: { value: 1, label: "Electrical" },
  frequency: "",
};
export default function ScheduleMaintainence() {
  const history = useHistory();
  const [isShowCompleteModal, setIsShowCompleteModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowViewModal, setIsShowViewModal] = useState(false);
  const [plantDDl, getPlantDDL, plantDDLloader] = useAxiosGet();
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [clickedRowData, setClickedRowData] = useState(null);
  const [, deteleSchedule, deleteScheduleLoader] = useAxiosPost();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getTableData(
      `/mes/ScheduleMaintenance/GetScheduleMaintenanceLanding?BusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PlantId=${values?.plantName?.value}&MaintenanceTypeId=${values?.maintenanceType?.value}&Frequency=${values?.frequency?.label}`
    );
  };

  const getData = (values) => {
    getTableData(
      `/mes/ScheduleMaintenance/GetScheduleMaintenanceLanding?BusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PlantId=${values?.plantName?.value}&MaintenanceTypeId=${values?.maintenanceType?.value}&Frequency=${values?.frequency?.label}`
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {(plantDDLloader || tableDataLoader || deleteScheduleLoader) && (
            <Loading />
          )}
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
                      options={plantDDl}
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
                          setFieldValue("maintenanceType", valueOption);
                        } else {
                          setFieldValue("maintenanceType", "");
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
                        getData(values);
                      }}
                      disabled={
                        !values?.plantName ||
                        !values?.maintenanceType ||
                        !values?.frequency ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Schedule End Date</th>
                          <th>Machine Name</th>
                          <th>Frequency</th>
                          <th>Maintenance Type</th>
                          <th>Responsible Person</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.scheduleMaintenance?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.scheduleEndDateTime)}
                            </td>
                            <td>{item?.machineName || ""}</td>
                            <td>{item?.frequency}</td>
                            <td>{item?.maintenanceTypeName}</td>
                            <td>{item?.resposiblePersonName}</td>
                            <td className="d-flex justify-content-around">
                              <span
                                onClick={() => {
                                  setClickedRowData(item);
                                  setIsShowViewModal(true);
                                }}
                              >
                                <IView />
                              </span>
                              {item?.completedDateTime === null &&
                                item?.scheduleEndDateTime > _todayDate() && (
                                  <span
                                    onClick={() => {
                                      setClickedRowData(item);
                                      setIsShowEditModal(true);
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                )}
                              {item?.completedDateTime === null &&
                                item?.scheduleEndDateTime > _todayDate() && (
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setClickedRowData(item);
                                      setIsShowCompleteModal(true);
                                    }}
                                  >
                                    <ICheckout />
                                  </span>
                                )}
                              {item?.completedDateTime === null &&
                                item?.scheduleEndDateTime > _todayDate() && (
                                  <span
                                    onClick={() => {
                                      IConfirmModal({
                                        title: `Schedule Maintainence`,
                                        message: `Are you sure to delete schedule?`,
                                        yesAlertFunc: () => {
                                          deteleSchedule(
                                            `/mes/ScheduleMaintenance/DeleteScheduleMaintenance?ScheduleId=${item?.scheduleMaintenanceId}&UserId=${profileData?.userId}`,
                                            null,
                                            (data) => getData(values),
                                            true
                                          );
                                        },
                                        noAlertFunc: () => {},
                                      });
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {tableData?.scheduleMaintenance?.length && (
                    <PaginationTable
                      count={tableData?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              </div>
            </Form>
            <IViewModal
              modelSize="lg"
              show={isShowCompleteModal}
              onHide={() => setIsShowCompleteModal(false)}
            >
              <ScheduleStatusModal
                clickedRowData={clickedRowData}
                profileData={profileData}
                selectedBusinessUnit={selectedBusinessUnit}
                setIsShowCompleteModal={setIsShowCompleteModal}
                getData={getData}
                landingValues={values}
                setClickedRowData={setClickedRowData}
              />
            </IViewModal>
            <IViewModal
              modelSize="xl"
              show={isShowEditModal}
              onHide={() => setIsShowEditModal(false)}
            >
              <EditModal
                landingValues={values}
                getData={getData}
                setIsShowEditModal={setIsShowEditModal}
                profileData={profileData}
                selectedBusinessUnit={selectedBusinessUnit}
                clickedRowData={clickedRowData}
                setClickedRowData={setClickedRowData}
              />
            </IViewModal>
            <IViewModal
              modelSize="xl"
              show={isShowViewModal}
              onHide={() => setIsShowViewModal(false)}
            >
              <DetailsViewModal
                clickedRowData={clickedRowData}
                setClickedRowData={setClickedRowData}
              />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
