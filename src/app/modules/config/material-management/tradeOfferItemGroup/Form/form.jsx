/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";

// Validation schema
const validationSchema = Yup.object().shape({
  tradeOfferItemGroupName: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Trade offer item group is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  itemSearchDDL,
  rowDto,
  setRowDto,
  remover,
  setter,
  id,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values }, () => {
            resetForm(initData);
            setRowDto([]);
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
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <IInput
                    value={values?.tradeOfferItemGroupName}
                    label="Trade Offer Item Group"
                    name="tradeOfferItemGroupName"
                    disabled={id ? true : false}
                  />
                </div>

                <div className="col-lg-4">
                  <ISelect
                    label="Item Search"
                    options={itemSearchDDL}
                    value={values?.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-4">
                  <button
                    onClick={() => {
                      const obj = {
                        ...values,
                        tradeOfferItemGroupName: values.tradeOfferItemGroupName,
                        itemId: values.item?.value,
                        itemName: values.item?.label,
                      };
                      setter(obj);
                    }}
                    style={{ marginTop: "24px" }}
                    className="btn btn-primary ml-2"
                    disabled={!values.item || !values.tradeOfferItemGroupName}
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Row d tos */}
              <div className="mt-3">
                {rowDto.length ? (
                 <div className="table-responsive">
                   <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Group Name</th>
                        <th>#Of Items</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {console.log(values)}
                      {rowDto.map((itm, idx) => (
                        <tr key={itm?.itemId}>
                          <td>{values?.tradeOfferItemGroupName}</td>
                          <td>{itm?.itemName}</td>
                          <td className="text-center">
                            <span>
                              <i
                                onClick={() => remover(itm?.itemId)}
                                className="fa fa-trash deleteBtn"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
                ) : (
                  ""
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
