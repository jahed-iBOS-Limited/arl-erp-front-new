/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, shallowEqual } from "react-redux";
import GridData from "./grid";
import NewSelect from "./../../../../_helper/_select";
import { getSBUListDDL_api } from "./../helper";
import { getDisbursementcenterPasignation_api } from "./../helper";
import Loading from "./../../../../_helper/_loading";
// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  sbu: "",
};

export default function HeaderForm() {
  const [sbuDDL, setSbuDDL] = useState([]);
  const [girdData, setGirdData] = useState([]);
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  let receivepaymentAuthData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit } = receivepaymentAuthData;

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSBUListDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      sbuDDL[0]?.value
    ) {
      getDisbursementcenterPasignation_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        sbuDDL[0]?.value,
        setGirdData,
        setLoading,
        pageNo,
        pageSize
      );
    }
  }, [selectedBusinessUnit, profileData, sbuDDL]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          sbu: { value: sbuDDL[0]?.value, label: sbuDDL[0]?.label },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-3 pr-0 pl-0">
                  <NewSelect
                    name="sbu"
                    options={sbuDDL || []}
                    value={values?.sbu}
                    label="Select SBU"
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                      getDisbursementcenterPasignation_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setGirdData,
                        setLoading,
                        pageNo,
                        pageSize
                      );
                    }}
                    placeholder="Select SBU"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <GridData
                rowDto={girdData}
                loading={loading}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
                setGirdData={setGirdData}
                setLoading={setLoading}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
