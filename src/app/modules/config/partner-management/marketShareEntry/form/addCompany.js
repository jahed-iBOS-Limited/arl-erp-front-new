import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";

const initData = {
  companyName: "",
  address: "",
};

export default function AddCompanyForm({ setShow }) {
  const [, postData, isLoading] = useAxiosPost();
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      businessUnitId: buId,
      companyName: values?.companyName,
      address: values?.address,
      isActive: true,
      actionby: userId,
    };
    postData(
      `/tms/LigterLoadUnload/CreateMarketShareCompany`,
      payload,
      () => {
        cb();
        setShow(false);
      },
      true
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values }) => (
          <>
            {isLoading && <Loading />}
            <Card>
              <ModalProgressBar />
              <CardHeader title={`Add a new company`}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={handleSubmit}
                      disabled={!values?.companyName || !values?.address}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <InputField
                          label="Company name"
                          value={values?.companyName}
                          name="companyName"
                          placeholder="Company Name"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputField
                          label="Address"
                          value={values?.address}
                          name="address"
                          placeholder="Address"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
