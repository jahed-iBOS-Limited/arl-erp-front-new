import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { GetPendingUnloadLabourBillAmount } from "../../../../financialManagement/invoiceManagementSystem/billregister/helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  saveHandler,
  gridData,
  buId,
  setFileObjects,
  fileObjects,
  accId,
  setGridData,
  shippointDDL,
  setDisabled,
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
            setGridData([]);
            setFileObjects([]);
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
          <ICustomCard title="Labour Cost Report">
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-12">
                  <div className="row align-items-end">
                    <div className="col-lg-3">
                      <label>Supplier Name</label>
                      <SearchAsyncSelect
                        selectedValue={values.supplier}
                        handleChange={(valueOption) => {
                          setGridData([]);
                          setFieldValue("supplier", valueOption);
                        }}
                        loadOptions={(v) => {
                          if (v.length < 3) return [];
                          return axios
                            .get(
                              `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                              }));
                              return updateList;
                            });
                        }}
                      />
                      <FormikError
                        errors={errors}
                        name="supplier"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="Select Shippoint"
                        options={shippointDDL || []}
                        value={values?.shippoint}
                        name="shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shippoint", valueOption);
                        }}
                        placeholder="Ship Point"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From date"
                          type="date"
                        />
                        <InputField
                          value={values?.fromTime}
                          type="time"
                          name="fromTime"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To date"
                          type="date"
                        />
                        <InputField
                          value={values?.toTime}
                          type="time"
                          name="toTime"
                        />
                      </div>
                    </div>

                    <div className="col d-flex justify-content-end align-content-center mt-2">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={!values?.supplier || !values?.shippoint}
                        onClick={() => {
                          setGridData([]);
                          GetPendingUnloadLabourBillAmount(
                            accId,
                            buId,
                            values?.supplier?.value,
                            values?.shippoint?.value,
                            values?.fromDate,
                            values?.toDate,
                            values?.fromTime,
                            values?.toTime,
                            setGridData,
                            setDisabled
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.billNo}
                        label="Bill No"
                        name="billNo"
                        placeholder="Bill No"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={_dateFormatter(values?.billDate)}
                        label="Bill Date"
                        type="date"
                        name="billDate"
                        placeholder="Bill Date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={_dateFormatter(values?.paymentDueDate)}
                        label="Payment Due Date"
                        type="date"
                        name="paymentDueDate"
                        placeholder="Payment Due Date"
                      />
                    </div>
                  </div> */}
                  {/* <div className="row align-items-end">
                    <div className="col-9">
                      <InputField
                        value={values?.narration}
                        label="Narration No"
                        name="narration"
                        placeholder="Narration"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="row align-items-end">
                        <div className="col-5">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => setOpen(true)}
                          >
                            Attachment
                          </button>
                          {values?.attachmentId && (
                            <IView
                              classes="purchaseInvoiceAttachIcon"
                              clickHandler={() => {
                                dispatch(
                                  getDownlloadFileView_Action(
                                    values?.attachmentId
                                  )
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="row mt-1 ">
                <div className="col-lg-12">
                  {/* <div
                    className="d-flex justify-content-end align-items-center"
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    <span>Total : </span>
                    <span>
                      {numberWithCommas(
                        gridData?.reduce(
                          (a, b) =>
                            Number(a) +
                            (b.checked ? Number(b.approvedAmount) : 0),
                          0
                        )
                      )}
                    </span>
                  </div> */}

                  <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm">
                    <thead className="bg-secondary">
                      <tr>
                        {/* <th style={{ width: "30px" }}>
                          <input
                            type="checkbox"
                            checked={
                              gridData?.length > 0
                                ? gridData?.every((item) => item?.checked)
                                : false
                            }
                            onChange={(e) => {
                              setGridData(
                                gridData?.map((item) => {
                                  return {
                                    ...item,
                                    checked: e?.target?.checked,
                                  };
                                })
                              );
                            }}
                          />
                        </th> */}
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Shipment Code</th>
                        <th>Challan No.</th>
                        <th className="text-right">Labour Qty</th>
                        <th className="text-right">Labour Rate</th>
                        <th className="text-right">Net Amount</th>
                        <th style={{ width: "215px" }}>Bill Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          {/* <td className="text-center align-middle">
                            <input
                              type="checkbox"
                              // value = {item?.checked ? true:false}
                              checked={item?.checked}
                              onChange={(e) => {
                                item["checked"] = e.target.checked;
                                setGridData([...gridData]);
                              }}
                            />
                          </td> */}
                          <td className="text-center align-middle">
                            {index + 1}
                          </td>
                          <td>{item?.shipmentCode}</td>
                          <td>{item?.challanNo}</td>
                          <td className="text-right">
                            {item?.totalItemQty || 0}
                          </td>
                          <td className="text-right">
                            {item?.labourRate || item?.handlingCostRate || 0}
                          </td>
                          <td className="text-right">
                            {item?.labourBillAmount}
                          </td>
                          <td style={{ width: "100px" }} className="text-right">
                            {/* <InputField
                              value={item?.approvedAmount}
                              name="approvedAmount"
                              placeholder="Bill Amount"
                              onChange={(e) => {
                                item.approvedAmount = e.target.value;
                                setGridData([...gridData]);
                              }}
                            /> */}
                            {item?.approvedAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
            {/* <DropzoneDialogBase
              filesLimit={5}
              acceptedFiles={["image/*", "application/pdf"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={100000000000000}
              open={open}
              onAdd={(newFileObjs) => {
                setFileObjects([].concat(newFileObjs));
              }}
              onDelete={(deleteFileObj) => {
                const newData = fileObjects.filter(
                  (item) => item.file.name !== deleteFileObj.file.name
                );
                setFileObjects(newData);
              }}
              onClose={() => setOpen(false)}
              onSave={() => {
                setOpen(false);
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            /> */}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
