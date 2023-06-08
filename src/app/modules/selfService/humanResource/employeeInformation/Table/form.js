import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";
import {
  getEmpStatusDDL,
  employeeBasicInformation_landing_api_Fof_Filtering,
  getempInfoGridforOwnView,
  getWorkplaceGroupDDLAction,
} from "../helper";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
};

export default function BasicInformationlLanding() {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo] = React.useState(0);
  const [pageSize] = React.useState(15);

  const [, setEmployeeStatusDDL] = useState([]);

  const [, setWorkplaceGroupDDL] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getempInfoGridforOwnView(setRowDto, setLoading, profileData?.employeeId);
    getWorkplaceGroupDDLAction(profileData?.accountId, setWorkplaceGroupDDL);
    getEmpStatusDDL(setEmployeeStatusDDL);
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    console.log("values", values);
    employeeBasicInformation_landing_api_Fof_Filtering(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowDto,
      setLoading,
      values?.employeeStatus?.value || 0,
      values?.workplaceGroup?.value || 0,
      values?.search || "",
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Basic Information"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <GridData
                    rowDto={rowDto}
                    loading={loading}
                    pageSize={pageSize}
                    pageNo={pageNo}
                    setPositionHandler={setPositionHandler}
                  />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
