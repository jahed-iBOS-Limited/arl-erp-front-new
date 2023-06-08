import React from "react";
import { Formik } from "formik";
import InputField from "./../../../../_helper/_inputField";
import { getDeliveryItem } from "../helper";
import { useHistory } from "react-router-dom";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
import Loading from "./../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls/Card";
import { ModalProgressBar } from "./../../../../../../_metronic/_partials/controls/ModalProgressBar";

export default function _Form({
  initData,
  saveHandler,
  isLoading,
  rowData,
  setRowData,
  setIsLoading,
  isEdit,
  chalanDDL,
  totalQTY,
  receiveAmount,
}) {
  const history = useHistory();

  // Handle Row data's (Rate * Receive Quantity)
  const quantityHandler = (value, index) => {
    if (+value >= 0) {
      let newRowData = [...rowData];
      newRowData[index]["receiveQTY"] = +value;
      newRowData[index]["receiveAmount"] = +rowData[index]?.rate * +value;
      setRowData(newRowData);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={
                  !isEdit
                    ? "Create Delivery Confirmation"
                    : "Edit Delivery Confirmation"
                }
              >
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={() => history.goBack()}
                    className="btn btn-secondary back-btn mr-2"
                  >
                    <i className="fa fa-arrow-left mr-1"></i>
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => resetForm(initData)}
                    className="btn btn-secondary reset-btn mr-2"
                  >
                    Reset
                  </button>
                  <button
                    disabled={isLoading}
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary save-btn"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isLoading && <Loading />}
                <form onSubmit={handleSubmit}>
                  <div className="global-form">
                    {/* Form */}
                    <div className="row mb-2">
                      <div className="col-lg-3">
                        <NewSelect
                          name="chalan"
                          options={chalanDDL || []}
                          value={values?.chalan}
                          label="Chalan No*"
                          onChange={(valueOption) => {
                            setFieldValue("chalan", valueOption);
                          }}
                          isDisabled={isEdit}
                          placeholder="Chalan No"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {!isEdit && (
                        <div className="col-lg-3">
                          <button
                            disabled={!values?.chalan}
                            onClick={() => {
                              getDeliveryItem(
                                values?.chalan?.value,
                                setIsLoading,
                                setRowData
                              );
                            }}
                            type="button"
                            style={{ marginTop: "16px" }}
                            className="btn btn-primary"
                          >
                            Show
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="row mb-4">
                      <div className="col-lg-3">
                        <label>Total QTY</label>
                        <InputField
                          value={totalQTY}
                          name="totalQTY"
                          placeholder="Total QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                          min="0"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Received Amount</label>
                        <InputField
                          value={receiveAmount}
                          name="receiveAmount"
                          placeholder="Receive Amount"
                          type="number"
                          min="0"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Rate</th>
                          <th>Order Qty</th>
                          <th>Order Amount</th>
                          <th style={{ width: "100px" }}>Receive QTY</th>
                          <th>Receive Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{item?.itemName}</td>
                                <td>{item?.uomName}</td>
                                <td className="text-right">
                                  {_formatMoney(item?.rate)}
                                </td>
                                <td className="text-right">{item?.orderQTY}</td>
                                <td className="text-right">
                                  <span className="mr-2">
                                    {_formatMoney(item?.orderAmmount)}
                                  </span>
                                </td>
                                <td>
                                  <input
                                    name="receiveQTY"
                                    value={item?.receiveQTY || ""}
                                    onChange={(e) =>
                                      quantityHandler(e.target.value, index)
                                    }
                                    //className="form-control"
                                    type="number"
                                    min="0"
                                    placeholder="Qty"
                                    className="form-control"
                                  />
                                </td>
                                <td className="text-right">
                                  <span className="mr-2">
                                    {_formatMoney(item?.receiveAmount)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
