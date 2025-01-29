/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../../_metronic/_partials/controls";
import numberWithCommas from "../../../../../../_helper/_numberWithCommas";
import { packingValidationSchema } from "../helper";
// Validation schema

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setter,
  remover,
  setRowDto,
  rowDto,
  packingTypeDDL,
  gridData,
  deletePacking,
  poNumber,
  lcNumber,
  shipmentCode,
  shippedQuantity,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={packingValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Packing Information">
                {/* <CardHeader  title={isViewPage ? "Item Basic Info" : "Edit Item Basic Info"} >  */}
                <CardHeaderToolbar>
                  <>
                    <button
                      type="reset"
                      // onClick={resetBtnClick}
                      ref={resetBtnRef}
                      className="btn btn-light ml-2"
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12 text-center">
                    <span>
                      <span style={{ fontWeight: "bold" }}>PO Number :</span>
                      <span>{poNumber}</span>
                    </span>
                    <span className="ml-5">
                      <span style={{ fontWeight: "bold" }}>LC Number :</span>
                      <span>{lcNumber}</span>
                    </span>
                    <span className="ml-5">
                      <span style={{ fontWeight: "bold" }}>
                        Shipment Code :
                      </span>
                      <span>{shipmentCode}</span>
                    </span>
                    <span className="ml-5">
                      <span style={{ fontWeight: "bold" }}>
                        Shipped Quantity :
                      </span>
                      <span>{numberWithCommas(shippedQuantity)}</span>
                    </span>
                    <span
                      className="ml-5"
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      Remaining Qty :{" "}
                      {numberWithCommas(
                        shippedQuantity -
                          (gridData.reduce((a, b) => {
                            return a + b.quantity;
                          }, 0) +
                            rowDto.reduce((a, b) => {
                              return a + b.quantity;
                            }, 0))
                      )}
                    </span>
                  </div>
                  <div className="col-lg-12">
                    <div className="row global-form">
                      <>
                        {/* <div className='col-lg-12'>
                          <span>
                            <span
                              style={{ fontWeight: "bold", fontSize: "12px" }}
                            >
                              Remaining Qty :{" "}
                              {numberWithCommas(
                                shippedQuantity -
                                  (gridData.reduce((a, b) => {
                                    return a + b.quantity;
                                  }, 0) +
                                    rowDto.reduce((a, b) => {
                                      return a + b.quantity;
                                    }, 0))
                              )}
                            </span>
                          </span>
                        </div> */}
                        <div className="col-lg-3">
                          <NewSelect
                            name="packingType"
                            options={packingTypeDDL}
                            value={values?.packingType}
                            label="Packing Type"
                            onChange={(valueOption) => {
                              setFieldValue("packingType", valueOption);
                            }}
                            placeholder="Packing Type"
                            errors={errors}
                            touched={touched}
                            //   isDisabled={isEdit}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.quantity}
                            label="Quantity"
                            placeholder="Quantity"
                            name="quantity"
                            type="number"
                            required
                            min="1"
                            // step='1'
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.insideDescription}
                            label="Inside Description (Optional)"
                            placeholder="Inside Description"
                            name="insideDescription"
                            type="text"
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>
                            <a
                              href="https://www.track-trace.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "underline" }}
                            >
                              BL No (Optional)
                            </a>
                          </label>
                          <InputField
                            value={values?.blno}
                            placeholder="BL No"
                            name="blno"
                            type="text"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.bldate}
                            label="BL Date"
                            placeholder="BL Date"
                            name="bldate"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Due Date</label>
                          <InputField
                            value={values?.dueDate}
                            name="dueDate"
                            placeholder="Due Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("dueDate", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <button
                            onClick={() => setter(values)}
                            style={{ marginTop: "14px" }}
                            type="button"
                            className="btn btn-primary"
                            disabled={
                              !values?.packingType ||
                              !values?.quantity ||
                              values?.quantity < 1
                            }
                          >
                            Add
                          </button>
                        </div>
                      </>
                    </div>
                    {rowDto.length > 0 && (
                      <div className="react-bootstrap-table table-responsive">
                        <table className="global-table table">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Pack Type</th>
                              <th>Quantity</th>
                              <th>Inside Description</th>
                              <th>BL No</th>
                              <th>Due Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.packTypeName}
                                </td>
                                <td className="text-center">
                                  {item?.quantity}
                                </td>
                                <td className="ml-2">
                                  {item?.insideDescription}
                                </td>
                                <td className="text-center">{item?.blno}</td>
                                <td className="text-center">{item?.dueDate}</td>
                                <td className="text-center align-middle">
                                  <IDelete remover={remover} id={index} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
                  // onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </Card>
            <Card>
              <div className="d-flex justify-content-between">
                <p className="landingHeader">Packing Landing List</p>
                {/* <span className="mt-2">
                  <span style={{ fontWeight: 'bold', marginRight: 5 }}>Remaining Qty : {numberWithCommas(shippedQuantity - (gridData.reduce((a, b) => {
                    return a + b.quantity
                  }, 0) + rowDto.reduce((a, b) => {
                    return a + b.quantity
                  }, 0)))}</span>
                </span> */}
              </div>
              <div className="react-bootstrap-table table-responsive">
                <table className="global-table table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Pack Type</th>
                      <th>Quantity</th>
                      <th>Inside Description</th>
                      <th>BL No</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-center">{item?.packTypeName}</td>
                        <td className="text-center">{item?.quantity}</td>
                        <td className="ml-2">{item?.insideDescription}</td>
                        <td className="text-center">{item?.blno}</td>
                        <td className="text-center align-middle">
                          <span onClick={() => deletePacking(item?.packingId)}>
                            <IDelete />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
