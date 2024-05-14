import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React from "react";
import { useDispatch } from "react-redux";
import { ToWords } from "to-words";
import * as Yup from "yup";
import FromDateToDateForm from "../../../../../_helper/commonInputFieldsGroups/dateForm";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IView from "../../../../../_helper/_helperIcons/_view";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../_helper/_select";
import { getTripCost } from "../../helper";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";

const validationSchema = Yup.object().shape({
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  gridData,
  buId,
  setFileObjects,
  fileObjects,
  accId,
  setGridData,
  resetBtnRef,
  setDisabled,
  headerData,
  warehouseDDL,
  shippointDDL,
  uploadImage,
}) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  const selectedTotalAmount = gridData?.reduce(
    (a, b) => Number(a) + (b.checked ? Number(b.netPayable) : 0),
    0
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            // setGridData(gridData.filter(item=>!item?.checked));
            setGridData([]);
            // setUploadImage([]);
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
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-12">
                  <div className="row align-items-end">
                    {/* <div className="col-lg-3">
                      <label>Supplier</label>
                      <SearchAsyncSelect
                        selectedValue={values.supplier}
                        handleChange={(valueOption) => {
                          setGridData([]);
                          setFieldValue("supplier", valueOption);
                        }}
                        loadOptions={(v) => {
                          if (v.length < 3) return [];
                          return Axios.get(
                            `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${
                              accId
                            }&UnitId=${
                              buId
                            }&SBUId=${headerData?.sbu?.value || 0}`
                          ).then((res) => {
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
                    </div> */}
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
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={warehouseDDL || []}
                        value={values?.warehouse}
                        label="Warehouse"
                        onChange={(v) => {
                          setFieldValue("warehouse", v);
                        }}
                        placeholder="Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <div className="col-auto mr-auto">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setGridData([]);
                          getTripCost(
                            accId,
                            buId,
                            values?.shippoint?.value,
                            values?.fromDate,
                            values?.toDate,
                            setGridData,
                            setDisabled
                          );
                          // InternalTransport_api(
                          //   accountId,
                          //   buId,
                          //   values?.supplier?.value,
                          //   values?.warehouse?.value,
                          //   values?.fromDate,
                          //   values?.toDate,
                          //   setGridData,
                          //   setDisabled
                          // );
                        }}
                        disabled={!values?.shippoint}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <div className="row">
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
                  </div>
                  <div className="row align-items-end">
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
                  </div>
                </div>
              </div>

              <div className="row mt-1 ">
                <div
                  className="col d-flex justify-content-end"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  <span>
                    Total: {_fixedPoint(selectedTotalAmount, true, 0)}
                  </span>
                  <span style={{ width: "100px" }}>,</span>
                  <span>
                    In Word: {toWords.convert(selectedTotalAmount.toFixed(0))}
                  </span>
                </div>
                <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm">
                    <thead className="bg-secondary">
                      {/* <tr>
                        <th>
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
                        </th>
                        <th>SL</th>
                        <th>Shipment Date</th>
                        <th>Shipment Code</th>
                        <th>Vehicle No</th>
                        <th>Challan Quantity</th>
                        <th>Net Amount</th>
                        <th>Bill Amount</th>
                      </tr> */}
                      <tr>
                        <th style={{ width: "40px" }}>
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
                        </th>
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Shipment Code</th>
                        <th>Vehicle No.</th>
                        <th>Net Payable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        // <tr key={index}>
                        //   <td className="text-center align-middle">
                        //     <input
                        //       type="checkbox"
                        //       // value = {item?.checked ? true:false}
                        //       checked={item?.checked}
                        //       onChange={(e) => {
                        //         item["checked"] = e.target.checked;
                        //         setGridData([...gridData]);
                        //       }}
                        //     />
                        //   </td>
                        //   <td className="text-center align-middle">
                        //     {index + 1}
                        //   </td>
                        //   <td>{_dateFormatter(item?.DteShipmentDate)}</td>
                        //   <td>{item?.strShipmentCode}</td>
                        //   <td>{item?.strVehicleNumber}</td>
                        //   <td>{_fixedPoint(item?.decChallanQnt)}</td>
                        //   <td>{_fixedPoint(item?.numNetPayable)}</td>

                        //   <td style={{ width: "100px" }}>
                        //     <InputField
                        //       value={item?.approvedAmount}
                        //       name="approvedAmount"
                        //       placeholder="Approved Amount"
                        //       onChange={(e) => {
                        //         if (item?.numNetPayable >= +e.target.value) {
                        //           item.approvedAmount = e.target.value;
                        //           setGridData([...gridData]);
                        //         }
                        //       }}
                        //     />
                        //   </td>
                        // </tr>
                        <tr key={index}>
                          <td className="text-center align-middle">
                            <input
                              type="checkbox"
                              // value = {item?.checked ? true:false}
                              checked={item?.checked}
                              onChange={(e) => {
                                item["checked"] = e.target.checked;
                                setGridData([...gridData]);
                              }}
                            />
                          </td>
                          <td className="text-center"> {index + 1}</td>
                          <td>{item?.shipmentCode}</td>
                          <td>{item?.vehicleNo}</td>
                          <td style={{ width: "200px" }}>
                            <InputField
                              value={item?.netPayable}
                              name="netPayable"
                              placeholder="Net Payable"
                              onChange={(e) => {
                                item.netPayable = e.target.value;
                                setGridData([...gridData]);
                              }}
                            />
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
            <DropzoneDialogBase
              filesLimit={5}
              acceptedFiles={["image/*"]}
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
                // empAttachment_action(fileObjects, setUploadImage);
                uploadImage(() => {
                  setOpen(false);
                });
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </>
        )}
      </Formik>
    </>
  );
}
