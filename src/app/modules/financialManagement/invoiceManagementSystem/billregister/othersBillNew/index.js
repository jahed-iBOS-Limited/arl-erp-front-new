import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, shallowEqual } from "react-redux";

// import GridData from "./grid";

import { useHistory } from "react-router";

import SalesInvoiceGridData from "./grid";
import { _todayDate } from "../../../_helper/_todayDate";
import {
  Card,
  ModalProgressBar,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import { getOrganizationalUnitUserPermission, getSalesInvoiceLanding, getSBUListDDL } from "./helper";
import NewSelect from "../../../_helper/_select";

const initData = {
  order: "",
  purchaseOrderNo: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  contactPerson: "",
  contactNo: "",
  projectName: "",
  delivery: "",
  challanNo: "",
};
// Validation schema
const validationSchema = Yup.object().shape({});

function OthersBill() {
  const [disabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [sbuDDL, setSbuDDL] = useState([])
  const [plantDDL, setPlantDDL] = useState([])
  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getSBUListDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL)
      getOrganizationalUnitUserPermission(profileData?.userId, profileData?.accountId, selectedBusinessUnit?.value, setPlantDDL)
    }

  }, [profileData, selectedBusinessUnit])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Others Bill">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/invoicemanagement-system/othersBill/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {disabled && <Loading />}
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom">
                    <div className="col-lg-3">
                      <NewSelect
                        name="billName"
                        options={sbuDDL || []}
                        value={values?.sbu}s
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plantDDL || []}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>


                    <div className="col-lg-1 mr-1">
                      <button
                        onClick={() => {
                          //   dispatch(setBillregisterLandingAtion(values));
                          getSalesInvoiceLanding(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.fromDate,
                            values?.toDate,
                            pageNo,
                            pageSize,
                            setDisabled,
                            setRowDto
                          );
                          //   ViewOnChangeHandler(values);
                        }}
                        style={{ marginTop: "19px" }}
                        className="btn btn-primary ml-2 mr-2"
                        type="button"
                        disabled={!values?.fromDate || !values?.toDate}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <SalesInvoiceGridData
                    rowDto={rowDto}
                    values={values}
                    profileData={profileData}
                    selectedBusinessUnit={selectedBusinessUnit}
                    pageNo={pageNo}
                    setPageNo={setPageNo}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setLoading={setDisabled}
                  // cb={cb}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}

export default OthersBill;
