import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { _numberValidation } from "../../../../_helper/_numberValidation";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

// Validation schema
const validationSchema = Yup.object().shape({
  ddlType :Yup.object()
  .shape({
    label: Yup.string().required("Type DDL is required"),
    value: Yup.string().required("Type DDL is required"),
  }),
  territoryTypeName: Yup.string().when("ddlType", {
    is: (ddlType) => +ddlType?.value === 1,
    then: Yup.string()
      .min(1, "Minimum 2 symbols")
      .max(100, "Maximum 100 symbols")
      .required("Territory type name is required"),
  }),
  levelPosition: Yup.number().when("ddlType", {
    is: (ddlType) => +ddlType?.value === 1,
    then: Yup.number().required("Level position is required"),
  }),

  channel: Yup.object().when("ddlType", {
    is: (ddlType) => +ddlType?.value === 2,
    then: Yup.object().shape({
      label: Yup.string().required("Channel Name is required"),
      value: Yup.string().required("Channel Name is required"),
    }),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  ty,
}) {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [channelList, getChannelList] = useAxiosGet();
  const [, saveOparetionSetup] = useAxiosPost();

  const operationSetupHandler = (values) => {
    console.log("entire oparetion handler");
    const payload = {
      businessunit: buId,
      partid: 2,
      channelid: values?.channel?.value,
      actionBy: accId,
      // partner id 2 will be hard coded ensure by monirul islam vai
    };
    saveOparetionSetup(
      `/oms/CustomerProfile/SaveOperationlSetupFirstLevelEntr`,
      payload,
      () => {},
      true
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (values?.ddlType?.value === 1) {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }
          if (values?.ddlType?.value === 2) {
            console.log("click handle ");
            operationSetupHandler(values);
            resetForm(initData);
          }
        }}
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
            {console.log(errors)}
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    value={values.ddlType || ""}
                    name="ddlType"
                    options={[
                      { value: 1, label: "Seals Territory Type" },
                      { value: 2, label: "Setup First Level Entry" },
                    ]}
                    label="Type DDL"
                    onChange={(valueOption) => {
                      setFieldValue("ddlType", valueOption);
                      if (valueOption?.value === 2) {
                        getChannelList(
                          `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
                        );
                      }
                    }}
                  />
                </div>
                {[1]?.includes(values?.ddlType?.value) && (
                  <>
                    <div className="col-lg-4">
                      <IInput
                        value={values.territoryTypeName}
                        label="Territory Type Name"
                        name="territoryTypeName"
                      />
                    </div>

                    <div className="col-lg-4">
                      <IInput
                        type="tel"
                        value={values.levelPosition}
                        label="Level Position"
                        name="levelPosition"
                        onChange={(e) => {
                          setFieldValue("levelPosition", _numberValidation(e));
                        }}
                      />
                    </div>
                  </>
                )}
                {[2]?.includes(values?.ddlType?.value) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="channel"
                        options={channelList}
                        value={values?.channelList}
                        label="Channel Name"
                        onChange={(valueOption) => {
                          setFieldValue("channel", valueOption);
                        }}
                        touched={touched}
                        errors={errors}
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
