import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";

const initData = {
  plant: "",
  machineName: "",
  parts: "",
  maintenanceType: "",
  scheduleEndDate: "",
  frequency: "",
  maintenanceTask: "",
  responsiblePerson: "",
};

const ScheduleMaintainenceCreate = () => {
  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {};

  const addhandler = (values) => {};

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
  }, []);

  return (
    <IForm title="Create Schedule Maintainance" getProps={setObjprops}>
      {plantDDLloader && <Loading />}
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
                          } else {
                            setFieldValue("plant", "");
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">machine</div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="maintainenceType"
                        options={[
                          { value: 1, label: "Daily" },
                          { value: 2, label: "Weekly" },
                          { value: 3, label: "Monthly" },
                          { value: 4, label: "Quaterly" },
                          { value: 5, label: "Half Yearly" },
                          { value: 6, label: "Anually" },
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
                      <button
                        type="button"
                        onClick={() => {
                          addhandler(values);
                        }}
                        className="btn btn-primary  mt-5"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col-lg-12">table</div>
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
