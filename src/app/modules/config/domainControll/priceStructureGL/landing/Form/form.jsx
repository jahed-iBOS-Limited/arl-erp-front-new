/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../../_helper/_select";
import Loading from "./../../../../../_helper/_loading";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  generalLeadgerDDL,
  componentData,
  loading,
  rowDtoChangeHandler
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
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
            <Form className="form form-label-right">
              <div className="row">
                <>
                  {loading && <Loading />}
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Component Name</th>
                        <th>General Ledger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {componentData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {item?.priceComponentName}
                          </td>
                          <td>
                            <NewSelect
                              name="generalLeadger"
                              options={generalLeadgerDDL}
                              value={item?.selectedGeneralLeadger }
                              errors={errors}
                              touched={touched}
                              onChange={(valueOption) => {
                                rowDtoChangeHandler("selectedGeneralLeadger", valueOption, index)
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
