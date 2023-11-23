/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import moment from "moment";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import ICustomTable from "../../../../_helper/_customTable";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";

// Validation schema

const header = [
  "SL",
  "Provider",
  "PO No",
  "Bill Number",
  "Qty",
  "Payment Date",
  "Amount (BDT)",
];

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setRowDto,
  rowDto,
  setDivisionDDL,
  setEdit,
  edit,
  isDisabled,
  shipmentDDL,
  transportTypeDDL,
  transportProviderDDL,
  setShipment,
  shipment,
  backHandler,
  setProviderId,
  gridData,
  totalQty,
  totalAmountBDT,
}) {
  console.log(gridData);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Transport Information">
              {/* <CardHeader  title={isViewPage ? "Item Basic Info" : "Edit Item Basic Info"} >  */}
              <CardHeaderToolbar>
                <>
                  <button
                    type="reset"
                    onClick={backHandler}
                    ref={resetBtnRef}
                    className="btn btn-light ml-2"
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
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
                    disabled={isDisabled}
                  >
                    Save
                  </button>
                </>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-between justify-content-center pt-2">
                {shipment?.lcNumber ? (
                  <p className="pt-5">LC Number: {shipment?.lcNumber}</p>
                ) : (
                  ""
                )}
                {shipment?.poNumber ? (
                  <p className="pt-5">PO Number: {shipment?.poNumber}</p>
                ) : (
                  ""
                )}
              </div>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row global-form">
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipment"
                            label="Shipment"
                            options={shipmentDDL}
                            placeholder="Shipment"
                            value={values?.shipment}
                            onChange={(valueOption) => {
                              setFieldValue("shipment", valueOption);
                              setShipment(valueOption);
                            }}
                            error={errors}
                            touched={touched}
                          ></NewSelect>
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="transportProvider"
                            label="Provider Name"
                            options={transportProviderDDL}
                            placeholder="Provider Name"
                            value={values?.transportProvider}
                            onChange={(valueOption) => {
                              setFieldValue("transportProvider", valueOption);
                            }}
                            error={errors}
                            touched={touched}
                          ></NewSelect>
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="transportType"
                            label="Transport Type"
                            options={transportTypeDDL}
                            placeholder="Transport Type"
                            value={values?.transportType}
                            onChange={(valueOption) => {
                              setFieldValue("transportType", valueOption);
                            }}
                            error={errors}
                            touched={touched}
                          ></NewSelect>
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.route}
                            label="Route"
                            placeholder="Route"
                            name="route"
                            type="text"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.quantity}
                            label="Quantity"
                            placeholder="Quantity"
                            name="quantity"
                            type="number"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.billNumber}
                            label="Bill Number"
                            placeholder="Bill Number"
                            name="billNumber"
                            type="number"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.serviceDate}
                            label="Service Date"
                            placeholder="Service Date"
                            name="serviceDate"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.receiveDate}
                            label="Receive Date"
                            placeholder="Receive Date"
                            name="receiveDate"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.paymentDate}
                            label="Payment Date"
                            placeholder="Payment Date"
                            name="paymentDate"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.transportCost}
                            label="Transport Cost (BDT)"
                            placeholder="Transport Cost (BDT)"
                            name="transportCost"
                            type="number"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.vat}
                            label="VAT"
                            placeholder="VAT"
                            name="vat"
                            type="number"
                          />
                        </div>
                      </>
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
            </CardBody>
            <CardBody>
              <div className="d-flex justify-content-between pt-2">
                <div className="col-lg-3 providerddl">
                  <NewSelect
                    name="provider"
                    options={transportProviderDDL}
                    value={values?.provider}
                    label="Provider"
                    onChange={(valueOption) => {
                      setProviderId(valueOption?.value);
                    }}
                    placeholder="Provider"
                    // errors={errors}
                    // touched={touched}
                    //   isDisabled={isEdit}
                  />
                </div>
              </div>
              <ICustomTable ths={header}>
                {gridData.length > 0 &&
                  gridData.map((data, index) => {
                    return (
                      <tr>
                        <td style={{ width: "30px" }} className="text-center">
                          {index + 1}
                        </td>
                        <td>
                          <span className="pl-2">
                            {data.transportProviderName}
                          </span>
                        </td>
                        <td>
                          <span className="pl-2">{data.ponumber}</span>
                        </td>
                        <td className="text-center">
                          <span className="pl-2 text-center">
                            {data.ponumber}
                          </span>
                        </td>
                        <td>
                          <span className="pl-2">{data.qty}</span>
                        </td>
                        <td>
                          <span className="pl-2">
                            {moment(data.paymentDate).format("YYYY-MM-DD")}
                          </span>
                        </td>
                        <td>
                          <span className="pl-2">{data.amountBDT}</span>
                        </td>
                      </tr>
                    );
                  })}
                {gridData.length > 0 && (
                  <tr>
                    <td></td>
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td className="text-center">{totalQty}</td>
                    <td></td>
                    <td className="text-center">{totalAmountBDT}</td>
                  </tr>
                )}
              </ICustomTable>

              {/* {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )} */}
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}
