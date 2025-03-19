import { Form, Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function PreRawMaterialReceiveForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  itemDDL,
  supplierDDL,
  validationSchema,
  id,
  itemList,
  setItemList,
}) {
  const removeHandler = (index) => {
    const data = itemList?.filter((item, i) => i !== index);
    setItemList([...data]);
  };
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
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group  global-form">
                <div className="row">
                  <div className="col-lg-4">
                    <InputField
                      value={values?.receiveDate}
                      label="Receive Date"
                      name="receiveDate"
                      type="date"
                      disabled={id}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      isDisabled={id}
                      name="supplierName"
                      options={supplierDDL || []}
                      value={values?.supplierName}
                      label="Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputField
                      value={values?.numberOfTruck}
                      label="Truck Number"
                      name="numberOfTruck"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("numberOfTruck", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <h6 style={{ marginTop: "25px" }}>Add Item:</h6>
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemName"
                      options={itemDDL || []}
                      value={values?.itemName}
                      label="Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("itemName", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.receiveQty}
                      label="Receive Qty"
                      name="receiveQty"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        setFieldValue("receiveQty", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.numLessQty}
                      label="Less Qty"
                      name="numLessQty"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        setFieldValue("numLessQty", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.numOverSizeQty}
                      label="Over Size Qty"
                      name="numOverSizeQty"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        setFieldValue("numOverSizeQty", e.target.value);
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "17px", marginLeft: "20px" }}>
                    <button
                      onClick={() => {
                        if (!values?.itemName?.value)
                          return toast.warn("Item is required");
                        if (!values?.receiveQty)
                          return toast.warn("Receive Qty is required");
                        if (!values?.numLessQty)
                          return toast.warn("Less Qty is required");
                        if (!values?.numOverSizeQty)
                          return toast.warn("Over Size Qty is required");
                        setItemList([
                          {
                            intRowId: 0,
                            intPreRawMaterialReceiveId: 0,
                            intItemId: values?.itemName?.value,
                            strItemName: values?.itemName?.label,
                            intUoMid: values?.itemName?.intBaseUOMId,
                            strUoMname: values?.itemName?.strBaseUOM,
                            numReceiveQty: values?.receiveQty,
                            numLessQty: values?.numLessQty,
                            numOverSizeQty: values?.numOverSizeQty,
                            isActive: true,
                          },
                          ...itemList,
                        ]);
                        setFieldValue("itemName", "");
                        setFieldValue("receiveQty", "");
                        setFieldValue("numLessQty", "");
                        setFieldValue("numOverSizeQty", "");
                      }}
                      className="btn btn-primary"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>SL</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Receive Qty</th>
                          <th>Less Qty</th>
                          <th>Over Size Qty</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemList?.length > 0 &&
                          itemList.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strItemName}</td>
                              <td>{item?.strUoMname}</td>
                              <td className="text-center">
                                {item?.numReceiveQty}
                              </td>
                              <td className="text-center">
                                {item?.numLessQty}
                              </td>
                              <td className="text-center">
                                {item?.numOverSizeQty}
                              </td>
                              <td className="text-center">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">{"Remove"}</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      className={`fa fa-trash`}
                                      onClick={() => {
                                        removeHandler(index);
                                      }}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
