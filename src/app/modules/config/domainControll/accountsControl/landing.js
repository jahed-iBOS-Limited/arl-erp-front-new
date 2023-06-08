/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IConfirmModal from "../../../chartering/_chartinghelper/_confirmModal";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { getAccountsControl, setAccountsControl } from "./helper";
import { IToggleButton } from "./IToggleButton";

const initData = {
  isActive: false,
};
const AccountsControlLanding = () => {
  const [isDisabled, setDisabled] = useState(false);
  const [conrolData, setControlData] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getAccountsControl(setControlData);
  }, [conrolData]);

  const [objProps, setObjprops] = useState({});

  const confirmHandler = (value) => {
    let confirmObject = {
      title: "Are you sure?",
      message: ``,
      yesAlertFunc: () => {
        setAccountsControl(profileData?.userId, value, () => {
          getAccountsControl(setControlData);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <IForm
      title={"Accounts Control"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Formik
          enableReinitialize={true}
          initialValues={{ ...initData, isActive: conrolData?.isControl }}
          // validationSchema={validationSchema}
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
              <Form className="form form-label-right">
                <div>
                  <div style={{ marginTop: "150px" }} className="col-12">
                    <div className="d-flex justify-content-center">
                      <label>Accounts Control</label>
                    </div>
                    <div className="d-flex justify-content-center accounts-control-toggle">
                      <IToggleButton
                        selected={conrolData}
                        toggleSelected={() => {
                          confirmHandler(!conrolData);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </IForm>
  );
};

export default AccountsControlLanding;
