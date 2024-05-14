import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { GetPendingFuelVehicleCost_api } from "../../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../_helper/_select";
import IView from "../../../../../_helper/_helperIcons/_view";
import numberWithCommas from "../../../../../_helper/_numberWithCommas";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import Axios from "axios";
import FormikError from "./../../../../../_helper/_formikError";
const validationSchema = Yup.object().shape({
  supplier: Yup.object()
    .nullable()
    .required("Supplier is Required"),
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  gridData,
  selectedBusinessUnit,
  setFileObjects,
  fileObjects,
  supplierDDL,
  accountId,
  setGridData,
  // setUploadImage,
  warehouseDDL,
  resetBtnRef,
  setDisabled,
  profileData,
  headerData,
}) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
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
                      <NewSelect
                        name="supplier"
                        options={supplierDDL || []}
                        value={values?.supplier}
                        label="Supplier"
                        onChange={(v) => {
                          setGridData([]);
                          setFieldValue("supplier", v);
                        }}
                        placeholder="Supplier"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-3">
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
                              profileData?.accountId
                            }&UnitId=${
                              selectedBusinessUnit?.value
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
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={
                          [{ value: 0, label: "All" }, ...warehouseDDL] || []
                        }
                        value={values?.warehouse}
                        label="Warehouse"
                        onChange={(v) => {
                          setFieldValue("warehouse", v);
                        }}
                        placeholder="Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        placeholder="From Date"
                        name="fromDate"
                        type="date"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        placeholder="To Date"
                        name="toDate"
                        type="date"
                        touched={touched}
                      />
                    </div>
                    <div className="col-auto mr-auto">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setGridData([]);
                          GetPendingFuelVehicleCost_api(
                            accountId,
                            selectedBusinessUnit?.value,
                            values?.supplier?.value,
                            values?.warehouse?.value || 0,
                            values?.fromDate,
                            values?.toDate,
                            setGridData,
                            setDisabled
                          );
                        }}
                        disabled={!values?.supplier}
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
                </div>
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm">
                    <thead className="bg-secondary">
                      <tr>
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
                        <th>Slip No.</th>
                        <th>Warehouse</th>
                        <th>Shipment Date</th>
                        <th>Vehicle In Date</th>
                        <th>Fuel Purchase Date</th>
                        <th>Vehicle No</th>
                        <th>Fuel Station</th>
                        <th>Fuel Type</th>
                        <th>Fuel Qty</th>
                        <th>Net Amount</th>
                        <th>Bill Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
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
                          <td className="text-center align-middle">
                            {index + 1}
                          </td>
                          <td>{item?.fuelMemoNo}</td>
                          <td>{item?.warehouseName}</td>
                          <td>
                            {item?.shipmentDate &&
                              _dateFormatter(item?.shipmentDate)}
                          </td>

                          <td>
                            {item?.vehicleInDate &&
                              _dateFormatter(item?.vehicleInDate)}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.fuelDate)}
                          </td>
                          <td>{item?.vehicleNo}</td>
                          <td>{item?.fuelStationName}</td>
                          <td>{item?.fuelTypeName}</td>
                          <td className="text-right">{item?.fuelQty}</td>
                          <td className="text-right">
                            {item?.totalCost >= 0
                              ? numberWithCommas(item?.totalCost)
                              : `(${numberWithCommas(
                                  Math.abs(item?.totalCost)
                                )})`}
                          </td>
                          <td style={{ width: "100px" }}>
                            <InputField
                              value={item?.approvedAmount}
                              name="approvedAmount"
                              placeholder="Bill Amount"
                              onChange={(e) => {
                                item.approvedAmount = e.target.value;
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
                setOpen(false);
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
