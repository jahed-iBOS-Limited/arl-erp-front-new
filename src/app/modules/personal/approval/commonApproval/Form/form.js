import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  requestDate: Yup.string()
    .required("Request Date is required"),
    validTill: Yup.string()
    .required("Valid Till Date is required"),
    dueDate: Yup.string()
    .required("Due Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  itemDDL,
  remover,
  addItemtoTheGrid,
  rowlebelData,
  id,
  location,
  onChangeForItemGroup
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4 mb-5">
                  <InputField
                    value={_dateFormatter(values?.requestDate)}
                    label="Request Date"
                    disabled={id ? true : false}
                    type="date"
                    name="requestDate"
                  />
                </div>
                <div className="col-lg-4 mb-5">
                  <InputField
                    value={_dateFormatter(values?.validTill)}
                    label="Validity"
                    disabled={id ? true : false}
                    type="date"
                    name="validTill"
                  />
                </div>
                <div className="col-lg-4 mb-5">
                  <InputField
                    value={_dateFormatter(values?.dueDate)}
                    label="Due Date"
                    disabled={id ? true : false}
                    type="date"
                    name="dueDate"
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Cost Center"
                    options={itemDDL}
                    defaultValue={values?.costCenter}
                    name="costCenter"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Project Name"
                    options={itemDDL}
                    defaultValue={values?.projectName}
                    name="projectName"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-2">
                <InputField
                    value={values?.referenceId}
                    label="Reference No."
                    placeholder="Reference No."
                    name="referenceId"
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Select Item Group"
                    options={[{label:"Assets Item",value:1},{label:"Service Item",value:2},{label:"Others Item",value:3}]}
                    defaultValue={values?.itemGroup}
                    name="itemGroup"
                    onChange={valueOption => {
                      setFieldValue("itemGroup", valueOption);
                      onChangeForItemGroup(valueOption)
                    }}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Select Item"
                    options={itemDDL}
                    defaultValue={values?.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                <InputField
                    value={values?.quantity}
                    type="number"
                    min="0"
                    label="Quantity"
                    placeholder="Quantity"
                    name="quantity"
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.remarks}
                    label="Purpose"
                    placeholder="Purpose"
                    name="remarks"
                  />
                </div>
                <div className="col-lg-2 mt-9">
                      <button
                        className="btn btn-primary"
                        onClick={(e) => addItemtoTheGrid(values)}
                        type="button"
                        disabled={!values?.remarks || !values?.item || !values?.quantity || !values?.referenceId}
                      >
                        Add
                      </button>
                    </div>
              </div>

              <div className="form-group row mt-2">
                <div className="col-lg-12">
                  <div className="row px-5">
                    {/* Start Table Part */}
                    <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Ref. No.</th>
                          <th>Request Qty.</th>
                          <th>Purpose</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowlebelData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center align-middle">
                              {index + 1}
                            </td>
                            <td className="text-center align-middle">
                              {item.itemCode}
                            </td>

                            <td className="text-center align-middle table-input">
                              {item.itemName}
                            </td>
                            <td className="text-center align-middle table-input">
                              {item.referenceId}
                            </td>
                            <td className="text-center align-middle table-input">
                              {item.requestQuantity}
                            </td>
                            <td className="text-center align-middle table-input">
                              {item.remarks}
                            </td>
                            <td className="text-center align-middle table-input">
                              <span onClick={() => remover(item.itemId)}>
                                <IDelete />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                    {/* End Table Part */}
                  </div>
                </div>
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
