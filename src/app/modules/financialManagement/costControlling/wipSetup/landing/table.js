/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getGeneralLedgerDDL, saveData, getByDDLId } from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";

const initData = {
  materialWIP: "",
  overheadCost: "",
};

const validationSchema = Yup.object().shape({
  materialWIP: Yup.object().shape({
    value: Yup.string().required("Material WIP is required"),
    label: Yup.string().required("Material WIP is required"),
  }),
  overheadCost: Yup.object().shape({
    value: Yup.string().required("Overhead Cost is required"),
    label: Yup.string().required("Overhead Cost is required"),
  }),
});

const WipSetupLanding = () => {
  const [isloading, setIsLoading] = useState(false);
  const [ddl, setDDL] = useState([]);
  const [singleData, setSingleData] = useState();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getGeneralLedgerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDDL
    );
    getByDDLId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setIsLoading,
      setSingleData
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const saveHandler = (values) => {
    const payload = {
      setupId: values?.id || 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      materialWipglid: values?.materialWIP?.value,
      overheadCostGlid: values?.overheadCost?.value,
      materialWipglName: values?.materialWIP?.label,
      overheadCostGlName: values?.overheadCost?.label,
      actionBy: profileData?.userId,
    };
    saveData(payload, setIsLoading);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData || initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {});
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
          <Form>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="WIP Setup">
                <CardHeaderToolbar>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isloading && <Loading />}
                <div className="form-group global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="materialWIP"
                      options={ddl}
                      value={values?.materialWIP}
                      label="Material WIP"
                      onChange={(valueOption) => {
                        setFieldValue("materialWIP", valueOption);
                      }}
                      placeholder="Material WIP"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="overheadCost"
                      options={ddl}
                      value={values?.overheadCost}
                      label="Overhead Cost"
                      onChange={(valueOption) => {
                        setFieldValue("overheadCost", valueOption);
                      }}
                      placeholder="Overhead Cost"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default WipSetupLanding;
