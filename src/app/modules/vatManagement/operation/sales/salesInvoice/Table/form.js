import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { getGridData, getVatBranches } from "../helper";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import NewSelect from "./../../../../../_helper/_select";
import InputField from "./../../../../../_helper/_inputField";

export function SearchForm({ onSubmit, setGridData, setLoading }) {
  const [taxBranchDDL, setTaxBranchDDL] = useState("");
  const history = useHistory();

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      salesLanding: state?.localStorage?.salesLanding,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, salesLanding } = storeData;

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit?.value) {
      getVatBranches(
        profileData.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      taxBranchDDL[0]?.value
    ) {
      getGridData(
        profileData.accountId,
        selectedBusinessUnit?.value,
        salesLanding?.taxBranch?.value || taxBranchDDL[0]?.value,
        salesLanding?.fromDate,
        salesLanding?.toDate,
        setGridData,
        setLoading
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, taxBranchDDL]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...salesLanding,
          taxBranch: salesLanding?.taxBranch
            ? salesLanding?.taxBranch
            : taxBranchDDL[0],
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values);
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <Form>
            <div
              className="text-right"
              style={{
                paddingBottom: "10px",
                marginTop: "-41px",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                // ref={btnRef}
                onClick={() =>
                  history.push({
                    pathname: "/operation/sales/salesInvoice/create",
                    state: { taxBranch: values.taxBranch },
                  })
                }
              >
                Create New
              </button>
            </div>
            <div className="row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="taxBranch"
                  options={taxBranchDDL || []}
                  value={values?.taxBranch}
                  label="Select Branch"
                  onChange={(valueOption) => {
                    setFieldValue("taxBranch", valueOption);
                  }}
                  placeholder=" Branch"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.fromDate}
                  label="From Date"
                  // disabled={id ? true : false}
                  type="date"
                  name="fromDate"
                  placeholder="From Date"
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.toDate}
                  label="To Date"
                  // disabled={id ? true : false}
                  type="date"
                  name="toDate"
                  placeholder="To Date"
                />
              </div>

              <div className="col-lg-3">
                <button
                  type="submit"
                  class="btn btn-primary"
                  style={{ marginTop: "16px" }}
                  // ref={btnRef}
                  onSubmit={() => {
                    handleSubmit();
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
