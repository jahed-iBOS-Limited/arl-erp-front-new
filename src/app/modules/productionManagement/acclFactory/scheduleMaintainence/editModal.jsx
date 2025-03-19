import React, { useEffect, useState } from "react";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { Form, Formik } from "formik";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { toast } from "react-toastify";

const initData = {
  plant: "",
  machineName: "",
  maintenanceType: "",
  scheduleEndDate: "",
  frequency: "",
  responsiblePerson: "",
  maintenanceTask: "",
};

const EditModal = ({
  landingValues,
  getData,
  setIsShowEditModal,
  profileData,
  selectedBusinessUnit,
  clickedRowData,
  setClickedRowData,
}) => {
  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [
    machineDDL,
    getMachineDDL,
    machineDDLloader,
    setMachineDDL,
  ] = useAxiosGet();

  useEffect(() => {
    if (clickedRowData) {
      initData.plant = {
        value: clickedRowData?.plantId,
        label: clickedRowData?.plantName,
      };
      initData.machineName = {
        value: clickedRowData?.machineId,
        label: clickedRowData?.machineName,
      };
      initData.maintenanceType = {
        value: clickedRowData?.maintenanceTypeId,
        label: clickedRowData?.maintenanceTypeName,
      };
      initData.scheduleEndDate = _dateFormatter(
        clickedRowData?.scheduleEndDateTime
      );
      initData.frequency = {
        value: clickedRowData?.frequency,
        label: clickedRowData?.frequency,
      };
      initData.responsiblePerson = {
        value: clickedRowData?.resposiblePersonId,
        label: clickedRowData?.resposiblePersonName,
      };
      initData.maintenanceTask = clickedRowData?.maintainanceTask;

      getPlantDDL(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`,
        () => {
          getMachineDDL(
            `/mes/ScheduleMaintenance/GetAllmachineListDDL?BusinessUnitId=${selectedBusinessUnit?.value}&Plant=${clickedRowData?.plantId}`
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedRowData]);

  const saveHandler = (values, cb) => {
    if (!values?.plant) {
      return toast.warn("Plant is required");
    }
    if (!values?.machineName) {
      return toast.warn("Machine Name is required");
    }
    if (!values?.maintenanceType) {
      return toast.warn("Maintenance Type is required");
    }
    if (!values?.scheduleEndDate) {
      return toast.warn("Schedule End Date is required");
    }
    if (!values?.frequency) {
      return toast.warn("Frequency is required");
    }
    if (!values?.responsiblePerson) {
      return toast.warn("Responsible Person is required");
    }
    if (!values?.maintenanceTask) {
      return toast.warn("Maintenance Task is required");
    }
    const payload = {
      scheduleMaintenanceId: clickedRowData?.scheduleMaintenanceId,
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
    saveData(
      `/mes/ScheduleMaintenance/ScheduleMaintenanceEditALL`,
      payload,
      cb,
      true
    );
  };

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
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          getData(landingValues);
          setIsShowEditModal(false);
          setClickedRowData(null);
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
          {(saveDataLoader || plantDDLloader || machineDDLloader) && (
            <Loading />
          )}
          <IForm
            title="Schedule Maintainence"
            isHiddenBack={true}
            isHiddenReset={true}
            getProps={setObjprops}
          >
            <Form>
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
                          setFieldValue("machineName", "");
                          getMachineDDL(
                            `/mes/ScheduleMaintenance/GetAllmachineListDDL?BusinessUnitId=${selectedBusinessUnit?.value}&Plant=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue("plant", "");
                          setFieldValue("machineName", "");
                          setMachineDDL([]);
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
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default EditModal;
