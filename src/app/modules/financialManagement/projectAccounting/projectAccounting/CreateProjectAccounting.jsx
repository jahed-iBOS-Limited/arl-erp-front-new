import * as yup from "yup";
import React from "react";
// import NewSelect from "../../../_helper/_select";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";

import Loading from "../../../_helper/_loading";
import { CardHeader, Card } from "@material-ui/core";
import { Form, Formik } from "formik";

import {
  CardBody,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import { IInput } from "../../../_helper/_input";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import FormikError from "../../../_helper/_formikError";
import axios from "axios";
import moment from "moment/moment";
import { createProjectDescription } from "./projectApi";
import NewSelect from "../../../_helper/_select";
import { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { useState } from "react";
import { ISelect } from "../../../_helper/_inputDropDown";

// init data
const initData = {
  intProjectId: 0,
  strProjectName: "",
  strLocation: "",
  intOwnerId: 0,
  intGlId: 0,
  intSubGlId: 0,
  dteStartDate: "",
  dteEndDate: "",
  numExpectedValue: "",
};

// validation schema
const validationSchema = yup.object().shape({
  strProjectName: yup
    .string()
    .required("Project Name is required")
    .typeError("Project Name is required"),
  strLocation: yup.string(),
  numExpectedValue: yup
    .number("please enter a number")
    .required("Expected value is required")
    .typeError("Expected value is required"),
  intOwnerId: yup
    .object({ label: yup.string(), value: yup.number() })
    .required("Owner is required")
    .typeError("Owner is required"),
  intGlId: yup
    .object({ label: yup.string(), value: yup.number() })
    .required("General ledger is required")
    .typeError("General ledger is required"),
  intSubGlId: yup
    .object({ label: yup.string(), value: yup.number() })
    .required("Business Transaction is required")
    .typeError("Business Transaction is required"),
  dteStartDate: yup
    .date()
    .required("Start Date is required")
    .typeError("Start Date is required"),
  dteEndDate: yup
    .date()
    .required("End Date is required")
    .typeError("End Date is required"),
});

const CreateProjectAccounting = ({
  setProject,
  projectDescription = {},
  isEdit = false,
}) => {
  // get account data
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const [generalLedger, setGeneralLedger] = useState([]);
  const [businessTransaction, setBusinessTransaction] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [, postData, loading] = useAxiosPost();
  const [, getData] = useAxiosGet();

  const initPayload = {
    intProjectId: 0,
    intAccountId: profileData?.accountId,
    intBusinessUnitId: selectedBusinessUnit?.value,
    strProjectName: "",
    strLocation: "",
    intOwnerId: "",
    intGlId: "",
    intSubGlId: "",
    strOwner: "",
    dteStartDate: " ",
    dteEndDate: " ",
    numExpectedValue: 0,
    intStatusId: 0,
    isActive: true,
    intCreatedBy: profileData?.userId,
    intUpdatedBy: 0,
  };

  // general ledgerddl
  useEffect(() => {
    getData(
      `/fino/FinanceCommonDDL/GetGeneralLedegerDDL?accountId=${profileData?.accountId}`,
      (res) => {
        // console.log('first',res)
        setGeneralLedger(res);
      }
    ); // eslint-disable-next-line
  }, []);

  // general ledgerddl
  useEffect(() => {
    isEdit && setIsDisable(false);

    // eslint-disable-next-line
  }, [isEdit]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        isEdit
          ? {
              ...projectDescription,
              intOwnerId: {
                label: projectDescription?.strOwner,
                value: projectDescription?.intOwnerId,
              },
              intGlId: {
                label: projectDescription?.strGl,
                value: projectDescription?.intGlId,
              },
              intSubGlId: {
                label: projectDescription?.strSubGl,
                value: projectDescription?.intSubGlId,
              },
              dteStartDate: moment(projectDescription?.dteStartDate).format(
                "YYYY-MM-DD"
              ),
              dteEndDate: moment(projectDescription?.dteEndDate).format(
                "YYYY-MM-DD"
              ),
            }
          : initData
      }
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        createProjectDescription(
          isEdit,
          projectDescription,
          values,
          profileData,
          postData,
          setProject,
          initPayload
        );
        // console.log(values)
        !isEdit && resetForm();
      }}
    >
      {({
        errors,
        handleChange,
        touched,
        setFieldValue,
        resetForm,
        values,
        handleBlur,
      }) => (
        <>
          <Form className="form form-label-right">
            <Card>
              {true && <ModalProgressBar />}
              <div className="d-flex justify-content-between align-items-center">
                <CardHeader title={"Create Project"}>
                  <CardHeaderToolbar></CardHeaderToolbar>
                </CardHeader>
                <ButtonStyleOne
                  type="submit"
                  label={"Save"}
                  style={{ marginRight: "15px", padding: "5px 15px" }}
                  disabled={loading}
                />
              </div>
              <CardBody className="pt-0 px-4">
                {loading && <Loading />}
                <div className="row global-form">
                  {/* project Name */}
                  <div className="col-md-3">
                    <div>
                      <span style={{ paddingRight: "10px" }}>Project Name</span>
                      <IInput
                        value={values.strProjectName || ""}
                        name="strProjectName"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* project Owner */}
                  <div className="col-md-3" style={{ marginTop: "" }}>
                    <div className="mr-2">
                      <span style={{ paddingRight: "10px" }}>Owner</span>

                      <SearchAsyncSelect
                        menuPosition="fixed"
                        name="intOwnerId"
                        label="Owner"
                        selectedValue={values?.intOwnerId}
                        handleChange={(valueOption) => {
                          setFieldValue("intOwnerId", valueOption);
                        }}
                        loadOptions={(value) => {
                          if (value?.length < 2) return [];
                          return axios
                            .get(
                              `/fino/ProjectAccounting/EmployeeDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${value}`
                            )
                            .then((response) => {
                              return response.data;
                            });
                        }}
                        placeholder="Search by Owner Name (min 3 letter)"
                      />
                      <FormikError
                        errors={errors}
                        touched={touched}
                        name="intOwnerId"
                      />
                    </div>
                  </div>
                  {/* general ledger */}
                  <div className="col-md-3" style={{ marginTop: "-5px" }}>
                    <NewSelect
                      menuPosition="fixed"
                      name="intGlId"
                      options={[...generalLedger]}
                      // options={[{label:'a',value:1},{label:'b',value:2}]}
                      value={values.intGlId || ""}
                      label="General Ledger"
                      onChange={(valueOption) => {
                        valueOption?.value
                          ? setIsDisable(false)
                          : setIsDisable(true);
                        valueOption?.value &&
                          getData(
                            `/fino/FinanceCommonDDL/GetBusinessTransactionDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&generalLedgerId=${valueOption?.value}`,
                            (res) => {
                              const modifiedData = res?.map((item) => ({
                                label: item?.buesinessTransactionName,
                                value: item?.buesinessTransactionId,
                                ...item,
                              }));
                              setBusinessTransaction(modifiedData);
                            }
                          );
                        setFieldValue("intGlId", valueOption);
                      }}
                      placeholder="General Ledger"
                    />
                    <FormikError
                      errors={errors}
                      touched={touched}
                      name="intGlId"
                    />
                  </div>
                  {/* business transaction */}
                  <div className="col-md-3" style={{ marginTop: "-5px" }}>
                    <ISelect
                      menuPosition="fixed"
                      label="Business Transaction"
                      options={[...businessTransaction]}
                      value={values.intSubGlId || ""}
                      name="intSubGlId"
                      setFieldValue={setFieldValue}
                      isDisabled={isDisable}
                      onChange={(valueOption) => {
                        setFieldValue("intSubGlId", valueOption);
                      }}
                      placeholder="Business Transaction"
                    />
                    <FormikError
                      errors={errors}
                      touched={touched}
                      name="intSubGlId"
                    />
                    {/* <NewSelect
                        menuPosition="fixed"
                        disable={true}
                        name="intSubGlId"
                        options={[...businessTransaction]}
                        // options={[{label:'a',value:1},{label:'b',value:2}]}
                        value={values.intSubGlId || ''}
                        label="Business Transaction"
                        onChange={(valueOption) => {
                          setFieldValue("intSubGlId", valueOption);
                        }}
                        placeholder="Business Transaction"
                        errors={errors}
                        touched={touched}
                      /> */}
                  </div>
                  {/* location */}
                  <div className="col-md-3">
                    <div>
                      <span style={{ paddingRight: "10px" }}>Location</span>
                      <IInput
                        value={values.strLocation || ""}
                        name="strLocation"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* project startDate */}
                  <div className="col-md-3">
                    <div>
                      <div style={{ width: "80px" }}>Start Date</div>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.dteStartDate}
                        name="dteStartDate"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("dteStartDate", e.target.value);
                        }}
                        type="date"
                      />
                      <FormikError
                        errors={errors}
                        touched={touched}
                        name="dteStartDate"
                      />
                    </div>
                  </div>

                  {/* project End date */}
                  <div className="col-md-3 ">
                    <div>
                      <div style={{ width: "80px" }}>End Date</div>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.dteEndDate}
                        name="dteEndDate"
                        onChange={(e) => {
                          setFieldValue("dteEndDate", e.target.value);
                        }}
                        type="date"
                      />
                      <FormikError
                        errors={errors}
                        touched={touched}
                        name="dteEndDate"
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-3 col-lg-2">
                    
                  </div> */}

                  <div className="col-md-3">
                    <div className="">
                      <span style={{ paddingRight: "10px" }}>
                        Expected Value
                      </span>
                      <IInput
                        value={values.numExpectedValue || ""}
                        name="numExpectedValue"
                        onChange={handleChange}
                      />
                      {errors.numExpectedValue && touched.numExpectedValue && (
                        <p>{}</p>
                      )}
                    </div>
                  </div>
                  {/* save btn */}
                </div>
              </CardBody>
            </Card>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CreateProjectAccounting;
