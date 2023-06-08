import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useHistory } from "react-router-dom";
import { getTaxBranchDDL } from "../helper/helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

const initData = {
  taxBranch: {},
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export function SearchForm({ onSubmit, setTaxBranchDDL, taxBranchDDL }) {

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (
      (profileData?.accountId && selectedBusinessUnit?.value &&
      profileData?.userId)
    ) {
      getTaxBranchDDL(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  const history = useHistory();


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, taxBranch: taxBranchDDL[0] }}
        // validationSchema={validationSchema}
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
                paddingBottom: "19px",
                marginTop: "-41px",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                // ref={btnRef}
                onClick={() =>
                  values.taxBranch
                    ? history.push({
                        pathname: "/mngVat/otherAdjustment/debit-note/create",
                        state: { taxBranch: values.taxBranch },
                      })
                    : history.push("/mngVat/otherAdjustment/debit-note/create")
                }
              >
                Create New
              </button>
            </div>
            <div className="row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="taxBranch"
                  options={taxBranchDDL}
                  value={values?.taxBranch}
                  label="Select Branch"
                  onChange={(valueOption) => {
                    setFieldValue("taxBranch", valueOption);
                  }}
                  placeholder="Branch"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={_dateFormatter(values?.fromDate)}
                  label="From Date"
                  // disabled={id ? true : false}
                  type="date"
                  name="fromDate"
                  placeholder="From Date"
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={_dateFormatter(values?.toDate)}
                  label="To Date"
                  // disabled={id ? true : false}
                  type="date"
                  name="toDate"
                  placeholder="To Date"
                />
              </div>

              <div className="col-lg-3">
                <button
                  disabled={
                    !values.taxBranch || !values.fromDate || !values.toDate
                  }
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginTop: "16px" }}
                  // ref={btnRef}

                  onSubmit={() => handleSubmit()}
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
