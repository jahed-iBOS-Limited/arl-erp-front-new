import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import * as Yup from "yup";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import axios from "axios";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _todayDate } from "../../../_helper/_todayDate";
import { getPlantDDL } from "../billOfMaterial/helper";
import { set } from "lodash";
import {
  getShopFloorDDL,
  getWorkCenterNameDDL,
} from "../../configuration/routing/helper";

const initData = {
  businessUnit: "",
  territory: "",
  thana: "",
  deedNo: "",
  deedAmount: "",
  deedType: "",
  registrationDate: "",
  landQuantity: "",
  seller: "",
  buyer: "",
  csKhatian: "",
  csPlot: "",
  saKhatian: "",
  cityJaripKhatian: "",
  saPlot: "",
  rsPlot: "",
  rsKhatian: "",
  rsLandQuantity: "",
  mouza: "",
  cityJaripPlot: "",
  cityJaripPlotLand: "",
  subRegister: "",
  registrationCost: "",
  brokerAmount: "",
  // ploatNo: "",
  // dagNo: "",
  remarks: "",
  otherCost: "",
  deedYear: "",
  strRegistrationAttachment: "",
};
export default function CreateEditMachineEmpAssign() {
  const {
    businessUnitList,
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();
  const location = useLocation();
  const { state } = location;

  const [plantDDL, setPlantDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [workCenterDDL, setWorkCenterDDL] = useState([]);

  const [, onSave, loader] = useAxiosPost();
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${accountId}&search=${v}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
          value: item?.value,
          label: item?.label,
        }));
        return updateList;
      });
  };
  useEffect(() => {
    getPlantDDL(userId, accountId, buId, setPlantDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const payload = {
      intMachineAssignId: state?.intMachineAssignId
        ? state?.intMachineAssignId
        : 0,
      intAccountId: accountId,
      intBusinessUnitId: values?.businessUnit?.value,
      dteCreateDate: _todayDate(),
      intEmployeeId: values?.assignTo?.value,
      strEmployeeName: values?.assignTo?.label,
      intMachineId: values?.workCenter?.value,
      strPlantName: values?.plant?.label,
      intPlantId: values?.plant?.value,
      strMachineName: values?.workCenter?.label,
      intMonthId: +`${moment(values?.date).format("MM")}`,
      intYearId: +`${moment(values?.date).format("YYYY")}`,
      isActive: true,
      intActionBy: userId,
      intUpdateBy: userId,
    };

    onSave(
      `/mes/ProductionPlanning/CreateAndUpdateMachineAssign`,
      payload,
      cb,
      true
    );
  };
  const generateDate = (month, year) => {
    // Month is 0-indexed in JavaScript Date object, so we subtract 1 from the month
    const date = new Date(year, month - 1, 1);
    return moment(date).format("YYYY-MM-DD");
  };
  const mapStateToInitialValues = (state) => ({
    businessUnit: { value: buId, label: label },
    assignTo: { value: state?.intEmployeeId, label: state?.strEmployeeName },
    workCenter: { value: state?.intMachineId, label: state?.strMachineName },
    plant: { value: state?.intPlantId, label: state?.strPlantName },
    date: generateDate(state?.intMonthId, state?.intYearId),
  });

  const validationSchema = Yup.object().shape({
    businessUnit: Yup.object().required("Business Unit is required"),
    assignTo: Yup.object().required("Employee is required"),
    plant: Yup.object().required("Plant is required"),
    workCenter: Yup.object().required("Work center is required"),
    shopFloor: Yup.object().required("Shop Floor  is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={state ? mapStateToInitialValues(state) : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          history.push(`/production-management/mes/machine-employee-assign`);
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
          {loader && <Loading />}
          <IForm
            title={`Create Machine Employee Assign `}
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => {
                      history.push(
                        `/production-management/mes/machine-employee-assign`
                      );
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    {state?.intMachineAssignId ? `Update` : `Save`}
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                {/* bu */}
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                      getPlantDDL(
                        userId,
                        accountId,
                        valueOption?.value,
                        setPlantDDL
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Assignee Name */}
                <div className="col-lg-3">
                  <label>Assign To </label>
                  <SearchAsyncSelect
                    selectedValue={values?.assignTo}
                    handleChange={(valueOption) => {
                      setFieldValue("assignTo", valueOption);
                    }}
                    loadOptions={loadUserList}
                  />
                </div>

                {/* plant */}
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      getShopFloorDDL(
                        accountId,
                        values?.businessUnit?.value,
                        valueOption?.value,
                        setShopFloorDDL
                      );
                      //   getWorkCenterDDL(
                      //     `/mes/WorkCenter/GetWorkCenterPagination?accountId=${accountId}&businessUnitId=${values?.businessUnit?.value}&PlantId=${valueOption?.value}&status=true&PageNo=0&PageSize=100000&viewOrder=desc`,
                      //     (res) => {
                      //       const temp = res?.data?.map((item) => {
                      //         return {
                      //           ...item,
                      //           value: item?.workCenterId,
                      //           label: item?.workCenterName,
                      //         };
                      //       });
                      //       setWorkCenterDDL(temp);
                      //     }
                      //   );
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloor"
                    options={shopFloorDDL}
                    value={values?.shopFloorName}
                    label="Shop Floor"
                    onChange={(valueOption) => {
                      setFieldValue("shopFloor", valueOption);

                      setFieldValue("workCenter", "");
                      getWorkCenterNameDDL(
                        accountId,
                        values?.businessUnit?.value,
                        values?.plant?.value,
                        valueOption?.value,
                        setWorkCenterDDL
                      );
                    }}
                    placeholder="Shop Floor Name"
                    errors={errors}
                    touched={touched}
                    // isDisabled={isEdit}
                  />
                </div>
                {/* work center */}
                <div className="col-lg-3">
                  <NewSelect
                    name="workCenter"
                    options={workCenterDDL || []}
                    value={values?.workCenter}
                    label="Work Center"
                    onChange={(valueOption) => {
                      setFieldValue("workCenter", valueOption);
                    }}
                  />
                </div>

                {/* thana */}

                {/* Date date */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
