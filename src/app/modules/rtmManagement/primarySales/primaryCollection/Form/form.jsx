import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  partnerName: Yup.string()
    .required("Partner Name Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  routeDDL,
  setBeatNameDDL,
  beatNameDDL,
  outletNameDDl,
  setOutletNameDDL,
  item,
  itemRowDto,
  setter,
  remover,
  isEdit,
}) {

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
            {/* {disableHandler(!isValid)} */} 
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="partnerName"
                      options={routeDDL}
                      value={values?.partnerName}
                      label="Partner Name"
                      onChange={(valueOption) => {
                        setFieldValue("partnerName", valueOption);
                      }}
                      isDisabled= {isEdit}
                      placeholder="Partner Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  
                  <div className="col-lg-3">
                    <InputField
                      type="number"
                      value={values?.amount}
                      label="Amount"
                      placeholder="Amount"
                      name="amount"
                      min="0"
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <button
                      onClick={() => {
                        const obj = {
                          itemId: values?.item?.value,
                          itemName: values?.item?.label,
                          uomId: values?.item?.uomId,
                          uomName: values?.item?.uomName,
                          orderQty: values?.orderQty,
                          rate: values?.rate,
                          amount: values?.orderQty * values?.rate,
                          receivedAmount: values?.receivedAmount
                        };
                        setter(obj);
                      }}
                      className="btn btn-primary"
                      disabled={
                        !values?.item ||
                        !values?.orderQty ||
                        values?.orderQty < 0 ||
                        !values?.rate ||
                        values?.rate < 0 ||
                        !values?.receivedAmount
                      }
                      type="button"
                      style={{ marginTop: "22px" }}
                    >
                      Add
                    </button>
                  </div> */}
                </div>
              </div>
              {/* item table */}
              {/* <div className="">
                <div className="">
                  {itemRowDto?.length >= 0 ? (
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>UOM</th>
                          <th>Rate</th>
                          <th>Order Qty</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemRowDto.map((itm, idx) => {
                          return (
                            <tr key={idx}>
                              <td className="text-center">{idx + 1}</td>
                              <td>
                                <div>
                                  <div className="pl-2">{itm?.itemName}</div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="pl-2">{itm?.uomName}</div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="text-right pr-2">
                                    {itm?.rate}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="text-right pr-2">
                                    {itm?.orderQty}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="text-right pr-2">
                                    {itm?.amount}
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">
                                <IDelete remover={remover} id={itm?.itemId} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    ""
                  )}
                </div>
              </div> */}

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
