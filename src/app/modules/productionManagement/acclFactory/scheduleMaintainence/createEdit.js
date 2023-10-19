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
  machineName: {
    value: 100,
    label: "Machine 1",
  },
  // parts: "",
  maintenanceType: "",
  scheduleEndDate: _todayDate(),
  frequency: "",
  maintenanceTask: "",
  responsiblePerson: "",
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
      maintenanceTypeId: values?.maintainenceType?.value,
      maintenanceTypeName: values?.maintainenceType?.label,
      plantId: values?.plant?.value,
      plantName: values?.plant?.label,
      maintainanceTask: values?.maintenanceTask,
      resposiblePersonId: values?.responsiblePerson?.value,
      resposiblePersonName: values?.responsiblePerson?.label,
      frequency: values?.frequency?.value,
      actionBy: profileData?.userId,
    };
    setRowData([...rowData, obj]);

    setFieldValue("plant", "");
    // setFieldValue("machineName", "");
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
                        name="maintainenceType"
                        options={[
                          { value: 1, label: "Electrical" },
                          { value: 2, label: "Mechanical" },
                        ]}
                        value={values?.maintainenceType}
                        label="Maintainence Type"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("maintainenceType", valueOption);
                          } else {
                            setFieldValue("maintainenceType", "");
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
                          { value: 1, label: "Daily" },
                          { value: 2, label: "Weekly" },
                          { value: 2, label: "Monthly" },
                          { value: 2, label: "Yearly" },
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
                    {/* https://deverp.ibos.io/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=1&search=tamk
                     */}
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
                        className="btn btn-primary  mt-5"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Date</th>
                          <th>Machine</th>
                          <th>Frequency</th>
                          <th>Maintenance Task</th>
                          <th>Responsible</th>
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
                              <td>{item?.frequency}</td>
                              <td>{item?.maintainanceTask}</td>
                              <td>{item?.resposiblePersonName}</td>
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
