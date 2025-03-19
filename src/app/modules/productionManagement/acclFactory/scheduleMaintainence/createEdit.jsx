import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import IDelete from "../../../_helper/_helperIcons/_delete";

const initData = {
  plant: "",
  machineName: "",
  maintenanceType: { value: 1, label: "Electrical" },
  scheduleEndDate: _todayDate(),
  frequency: { value: 1, label: "Daily" },
  responsiblePerson: "",
  maintenanceTask: "",
};

const ScheduleMaintainenceCreate = () => {
  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [rowData, setRowData] = useState([]);
  const [machineDDL, getMachineDDL, machineDDLloader] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/ScheduleMaintenance/ScheduleMaintenanceCreateAndEdit`,
      rowData,
      cb,
      true
    );
  };

  const deletehandler = (index) => {
    const filterArr = rowData.filter((itm, idx) => idx !== index);
    setRowData(filterArr);
  };

  const addhandler = (values, setFieldValue) => {
    const obj = {
      scheduleMaintenanceId: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      scheduleEndDateTime: values?.scheduleEndDate,
      machineName: values?.machineName?.label,
      machineId: values?.machineName?.value,
      maintenanceTypeId: values?.maintenanceType?.value,
      maintenanceTypeName: values?.maintenanceType?.label,
      plantId: values?.plant?.value,
      plantName: values?.plant?.label,
      maintainanceTask: values?.maintenanceTask,
      resposiblePersonId: values?.responsiblePerson?.value,
      resposiblePersonName: values?.responsiblePerson?.label,
      frequency: values?.frequency?.label,
      actionBy: profileData?.userId,
    };
    setRowData([...rowData, obj]);

    // setFieldValue("plant", "");
    setFieldValue("machineName", "");
    setFieldValue("maintainenceType", "");
    setFieldValue("scheduleEndDate", _todayDate());
    setFieldValue("frequency", "");
    setFieldValue("maintenanceTask", "");
    setFieldValue("responsiblePerson", "");
  };

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSupervisorAndLineManagerList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <IForm title="Create Schedule Maintainance" getProps={setObjprops}>
      {(plantDDLloader || machineDDLloader || saveDataLoader) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setRowData([]);
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
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plantDDL}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("plant", valueOption);
                            getMachineDDL(
                              `/mes/ScheduleMaintenance/GetAllmachineListDDL?BusinessUnitId=${selectedBusinessUnit?.value}&Plant=${valueOption?.value}`
                            );
                          } else {
                            setFieldValue("plant", "");
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="machineName"
                        options={machineDDL || []}
                        value={values?.machineName}
                        label="Machine Name"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("machineName", valueOption);
                          } else {
                            setFieldValue("machineName", "");
                          }
                        }}
                        placeholder="Machine Name"
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="maintenanceType"
                        options={[
                          { value: 1, label: "Electrical" },
                          { value: 2, label: "Mechanical" },
                        ]}
                        value={values?.maintenanceType}
                        label="Maintainence Type"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("maintenanceType", valueOption);
                          } else {
                            setFieldValue("maintenanceType", "");
                          }
                        }}
                        placeholder="Maintainence Type"
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Schedule End Date"
                        value={values?.scheduleEndDate}
                        name="scheduleEndDate"
                        placeholder="Date"
                        type={"date"}
                        onChange={(e) => {
                          setFieldValue("scheduleEndDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="frequency"
                        options={[
                          { value: "Daily", label: "Daily" },
                          { value: "Weekly", label: "Weekly" },
                          { value: "Monthly", label: "Monthly" },
                          { value: "Yearly", label: "Yearly" },
                        ]}
                        value={values?.frequency}
                        label="Frequency"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("frequency", valueOption);
                          } else {
                            setFieldValue("frequency", "");
                          }
                        }}
                        placeholder="Maintainence Type"
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Responsible Person</label>
                      <SearchAsyncSelect
                        selectedValue={values?.responsiblePerson}
                        handleChange={(valueOption) => {
                          setFieldValue("responsiblePerson", valueOption);
                        }}
                        loadOptions={loadSupervisorAndLineManagerList}
                        placeholder="responsiblePerson"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Maintenance Task"
                        value={values?.maintenanceTask}
                        name="maintenanceTask"
                        placeholder="Maintenance Task"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("maintenanceTask", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        type="button"
                        onClick={() => {
                          addhandler(values, setFieldValue);
                        }}
                        disabled={
                          !values?.plant ||
                          !values?.machineName ||
                          !values?.maintenanceType ||
                          !values?.scheduleEndDate ||
                          !values?.frequency ||
                          !values?.responsiblePerson ||
                          !values?.maintenanceTask
                        }
                        className="btn btn-primary  mt-5"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Date</th>
                            <th>Machine</th>
                            <th>Maintainence Type</th>
                            <th>Frequency</th>
                            <th>Responsible</th>
                            <th>Maintenance Task</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.scheduleEndDateTime}
                                </td>
                                <td>{item?.machineName}</td>
                                <td>{item?.maintenanceTypeName}</td>
                                <td>{item?.frequency}</td>
                                <td>{item?.resposiblePersonName}</td>
                                <td>{item?.maintainanceTask}</td>
                                <td className="text-center">
                                  <span
                                    onClick={() => {
                                      deletehandler(index);
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
};

export default ScheduleMaintainenceCreate;
