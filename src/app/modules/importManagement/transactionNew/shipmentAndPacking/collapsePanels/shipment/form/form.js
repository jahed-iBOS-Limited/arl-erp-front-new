/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../../../_helper/_inputField";
import { toast } from "react-toastify";
import { validationSchema } from "../helper";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../../_metronic/_partials/controls";
import numberWithCommas from "../../../../../../_helper/_numberWithCommas";
import { DropzoneDialogBase } from "material-ui-dropzone";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";
import { empAttachment_action } from "../../../../../../humanCapitalManagement/humanResource/employeeInformation/helper";
import NewSelect from "../../../../../../_helper/_select";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../../../_helper/_redux/Actions";

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  setter,
  remover,
  setRowDto,
  rowDto,
  setEdit,
  isDisabled,
  saveHandler,
  shipByDDL,
  setIndex,
  setShippedQuantity,
  poNumber,
  lcNumber,
  totalPoAmount,
  totalAddedAmount,
  totalShippedAmount,
  tollerence,
  open,
  setOpen,
  setFileObjects,
  fileObjects,
  setUploadImage,
  type,
  cnfAgency,
  getTotalAmount,
  shipmentId,
  getTotalShippedAmount,
  motherVesselDDl,
}) {
  const [isPartial, setIsPartial] = useState(false);
  useEffect(() => {
    if (checkTollerence()) {
      toast.warn("You exceeded the Tolerance amount");
    }
  }, [rowDto]);

  const checkTollerence = (data, key) => {
    const po = getTotalAmount(rowDto, "poquantity");
    const sum = po + po * (tollerence / 100);
    const newAddedAmountg =
      getTotalAmount(rowDto, "addedQuantity") +
      getTotalAmount(rowDto, "shippedQuantity");
    return sum < newAddedAmountg;
  };
  const dispatch = useDispatch();
  const addQuantityHandler = (rowDto, e, index, values, setFieldValue) => {
    const data = [...rowDto];
    data[index]["shippedQuantity"] = e.target.value;
    data[index]["totalQuantity"] =
      parseInt(data[index]["shippedQuantity"]) +
      parseInt(data[index]["addedQuantity"]);
    setFieldValue(
      "invoiceAmount",
      getTotalAmount(data, "shippedQuantity") +
        Number(values?.freightCharge) +
        Number(values?.packingCharge)
    );
    setRowDto([...data]);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (checkTollerence()) {
            toast.warn("You exceeded the Tolerance amount");
            return;
          }
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
              <CardHeader
                title={
                  type === "view"
                    ? "View Shipment"
                    : type === "edit"
                    ? "Edit Shipment"
                    : "Create Shipment"
                }
              >
                <CardHeaderToolbar>
                  <>
                    {type === "view" ? (
                      false
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                        disabled={isDisabled}
                      >
                        Save
                      </button>
                    )}
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <Form onSubmit={handleSubmit} className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12 d-flex justify-content-center">
                    <span>
                      <span style={{ fontWeight: "900", marginLeft: "30px" }}>
                        PO Number:
                      </span>
                      <span style={{ fontWeight: "900" }}>{poNumber}</span>
                    </span>
                    <span>
                      <span
                        className="ml-5"
                        style={{ fontWeight: "900", marginLeft: "30px" }}
                      >
                        LC Number:
                      </span>
                      <span style={{ fontWeight: "900" }}>{lcNumber}</span>
                    </span>
                  </div>
                  <div className="col-lg-12">
                    <div className="row global-form">
                      <>
                        <div className="col-lg-3">
                          <label>Ship By</label>
                          <InputField
                            value={values?.shipByName}
                            name="shipByName"
                            placeholder="Ship By"
                            type="text"
                            disabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Vassel Name</label>
                          <InputField
                            value={values?.vasselName}
                            name="vasselName"
                            placeholder="Vassel Name"
                            type="text"
                            disabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>BL/AWB/TR No</label>
                          <InputField
                            value={values?.blAwbTrNo}
                            name="blAwbTrNo"
                            placeholder="BL/AWB/TR No"
                            type="text"
                            disabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>BL/AWB/TR Date</label>
                          <InputField
                            value={values?.blAwbTrDate}
                            name="blAwbTrDate"
                            placeholder="BL/AWB/TR Date"
                            type="date"
                            disabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Currency</label>
                          <InputField
                            name="currency"
                            // label="Currency"
                            value={values?.currency}
                            // value={localStorage.getItem('currencyName')}
                            placeholder="Currency"
                            errors={errors}
                            touched={touched}
                            disabled
                            type="text"
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Invoice Number</label>
                          <InputField
                            value={values?.invoiceNumber}
                            name="invoiceNumber"
                            placeholder="Invoice Number"
                            type="text"
                            disabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Invoice Date</label>
                          <InputField
                            value={values?.invoiceDate}
                            name="invoiceDate"
                            placeholder="Invoice Date"
                            type="date"
                            disabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Doc. Receive By Bank</label>
                          <InputField
                            value={values?.docReceiveByBank}
                            name="docReceiveByBank"
                            placeholder="Doc. Receive By Bank"
                            type="date"
                            disabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Packing Charge</label>
                          <InputField
                            min="0"
                            value={values?.packingCharge}
                            name="packingCharge"
                            placeholder="Packing Charge"
                            type="number"
                            disabled={type === "view" || type === "edit"}
                            onChange={(e) => {
                              setFieldValue(
                                "packingCharge",
                                e.target.value ? Number(e.target.value) : ""
                              );
                              setFieldValue(
                                "invoiceAmount",
                                getTotalAmount(rowDto, "shippedQuantity") +
                                  Number(values?.freightCharge) +
                                  Number(e.target.value)
                              );
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Freight Charge</label>
                          <InputField
                            value={values?.freightCharge}
                            disabled={type === "view" || type === "edit"}
                            name="freightCharge"
                            placeholder="Freight Charge"
                            type="number"
                            onChange={(e) => {
                              setFieldValue(
                                "freightCharge",
                                e.target.value ? Number(e.target.value) : ""
                              );
                              setFieldValue(
                                "invoiceAmount",
                                getTotalAmount(rowDto, "shippedQuantity") +
                                  Number(e.target.value) +
                                  Number(values?.packingCharge)
                              );
                            }}
                            min="0"
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Invoice Amount</label>
                          <InputField
                            value={numberWithCommas(values?.invoiceAmount)}
                            name="invoiceAmount"
                            placeholder="Invoice Amount"
                            type="text"
                            disabled
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Due Date</label>
                          <InputField
                            value={values?.dueDate}
                            name="dueDate"
                            placeholder="Due Date"
                            type="date"
                            disabled={type === "view"}
                            onChange={(e) => {
                              setFieldValue("dueDate", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="cnfProvider"
                            options={cnfAgency || []}
                            value={values?.cnfProvider}
                            label="CnF Provider"
                            onChange={(valueOption) => {
                              setFieldValue("cnfProvider", valueOption);
                            }}
                            placeholder="Select CnF Provider"
                            errors={errors}
                            touched={touched}
                            isDisabled={type === "view"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Eta Date</label>
                          <InputField
                            value={values?.dteEta}
                            name="dteEta"
                            placeholder="dteEta"
                            type="date"
                            disabled={type === "view"}
                            onChange={(e) => {
                              setFieldValue("dteEta", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Ata Date</label>
                          <InputField
                            value={values?.dteAta}
                            name="dteAta"
                            placeholder="dteAta"
                            type="date"
                            disabled={type === "view"}
                            onChange={(e) => {
                              setFieldValue("dteAta", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="motherVessel"
                            options={motherVesselDDl || []}
                            value={values?.motherVessel}
                            label="Mother Vessel"
                            onChange={(valueOption) => {
                              setFieldValue("motherVessel", valueOption);
                            }}
                            placeholder="Select Mother Vessel"
                            errors={errors}
                            touched={touched}
                            isDisabled={type === "view"}
                          />
                        </div>
                        {type !== "view" && (
                          <div className="col-lg-2">
                            <div style={{ marginTop: "14px" }}>
                              <ButtonStyleOne
                                className="btn btn-primary mr-2"
                                type="button"
                                onClick={() => setOpen(true)}
                                label="Attachment"
                              />
                            </div>

                            <DropzoneDialogBase
                              filesLimit={1}
                              acceptedFiles={["image/*", "application/pdf"]}
                              fileObjects={fileObjects}
                              cancelButtonText={"cancel"}
                              submitButtonText={"submit"}
                              maxFileSize={1000000}
                              open={open}
                              onAdd={(newFileObjs) => {
                                setFileObjects([].concat(newFileObjs));
                              }}
                              onDelete={(deleteFileObj) => {
                                const newData = fileObjects.filter(
                                  (item) =>
                                    item.file.name !== deleteFileObj.file.name
                                );
                                setFileObjects(newData);
                              }}
                              onClose={() => setOpen(false)}
                              onSave={() => {
                                setOpen(false);
                                empAttachment_action(fileObjects).then(
                                  (data) => {
                                    setUploadImage(data);
                                  }
                                );
                              }}
                              showPreviews={true}
                              showFileNamesInPreview={true}
                            />
                          </div>
                        )}
                        {values?.shipmentDocumentId && (
                          <div
                            className="col-lg-3 "
                            style={{ marginTop: "14px" }}
                          >
                            <ButtonStyleOne
                              className="btn btn-primary mr-2"
                              type="button"
                              onClick={() => {
                                dispatch(
                                  getDownlloadFileView_Action(
                                    values?.shipmentDocumentId
                                  )
                                );
                              }}
                              label="View"
                            />
                          </div>
                        )}
                        <div className="">
                          <input
                            style={{
                              width: "15px",
                              display: "inline-block",
                              marginTop: "20px",
                            }}
                            checked={isPartial}
                            className="mr-2"
                            type="checkbox"
                            onChange={(e) => {
                              setIsPartial(!isPartial);
                              if (e.target.checked && rowDto?.length) {
                                const data = rowDto.map((item) => ({
                                  ...item,
                                  shippedQuantity: 0,
                                }));
                                setRowDto(data);
                              }
                            }}
                            disabled={type === "view"}
                          />
                          <label>Is Partial</label>
                        </div>
                      </>
                    </div>
                  </div>
                  <div
                    className="col-lg-12 loan-scrollable-table employee-overall-status
                  "
                  >
                    <div className="scroll-table _table">
                      <div className="react-bootstrap-table table-responsive">
                        <table className="global-table table">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "30px" }}>SL</th>
                              <th style={{ minWidth: "70px" }}>Item Code</th>
                              <th>Item Name</th>
                              <th style={{ minWidth: "30px" }}>UoM</th>
                              <th style={{ minWidth: "80px" }}>HS Code</th>
                              <th style={{ minWidth: "70px" }}>PO Qty</th>
                              <th style={{ minWidth: "70px" }}>Added Qty</th>
                              {type !== "view" && (
                                <th style={{ width: "120px" }}>
                                  Shipment Quantity
                                </th>
                              )}
                              {/* <th style={{minWidth: "80px"}}>Total Qty</th> */}
                              {type !== "view" && type !== "edit" && (
                                <th style={{ minWidth: "60px" }}>Action</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.length &&
                              rowDto?.map((item, index) => (
                                <tr key={index}>
                                  <td style={{ minWidth: "30px" }}>
                                    {index + 1}
                                  </td>
                                  <td className="text-center">
                                    {item?.itemCode}
                                  </td>
                                  <td className="text-left">
                                    {item?.itemName}
                                  </td>
                                  <td className="text-center">
                                    {item?.uomName}
                                  </td>
                                  <td className="text-center">
                                    {item?.hscode}
                                  </td>
                                  <td className="text-center">
                                    {item?.poquantity}
                                  </td>
                                  {/* <td className="text-center">
                              {item?.addedQuantity}
                            </td> */}
                                  {type !== "view" && (
                                    <td className="text-center">
                                      <InputField
                                        style={{ height: "20px" }}
                                        placeholder="Shipped Qty"
                                        type="number"
                                        min="0"
                                        step="1"
                                        // pattern="[0-9]+"
                                        required
                                        name="shippedQuantity"
                                        // defaultValue={parseInt(item.poquantity) - parseInt(item?.addedQuantity)}
                                        disabled={
                                          type === "view" || type === "edit"
                                        }
                                        value={item?.shippedQuantity}
                                        onChange={(e) => {
                                          addQuantityHandler(
                                            rowDto,
                                            e,
                                            index,
                                            values,
                                            setFieldValue
                                          );
                                        }}
                                      />
                                    </td>
                                  )}
                                  <td className="text-center">
                                    {item?.addedQuantity}
                                  </td>
                                  {type !== "view" && type !== "edit" && (
                                    <td className="text-center align-middle">
                                      <span
                                        onClick={() => {
                                          remover(index, setFieldValue);
                                        }}
                                      >
                                        <IDelete />
                                      </span>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            {/* <tr>
                          <td colSpan="4">Total PO Amount</td>
                          <td colSpan="2" className="text-center">{getTotalAmount(rowDto,"poquantity")}</td>
                          <td colSpan="3"></td>
                        </tr>
                        <tr>
                          <td colSpan="4">Tolerance Percentage</td>
                          <td colSpan="2" className="text-center">{getTotalAmount(rowDto,"poquantity")*(Number(tollerence)/100)}</td>
                          <td colSpan="3"></td>
                        </tr>
                        <tr>
                          <td colSpan="4">Total Added Amount</td>
                          <td colSpan="2" className="text-center">{getTotalAmount(rowDto,"addedQuantity")}</td>
                          <td colSpan="3"></td>
                        </tr>
                        <tr>
                          <td colSpan="4">Total Shipped Amount</td>
                          <td colSpan="2" className="text-center">{getTotalAmount(rowDto,"shippedQuantity")}</td>
                          <td colSpan="3"></td>
                        </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="col-auto">
                    <div className="row global-form">
                      <div
                        className="col-lg-6 text-right p-2"
                        style={{ fontWeight: "bold" }}
                      >
                        Total PO Amount :
                      </div>
                      <div
                        className="col-lg-6 text-left p-2"
                        style={{ fontWeight: "bold" }}
                      >
                        {numberWithCommas(getTotalAmount(rowDto, "poquantity"))}
                      </div>
                      <div
                        className="col-lg-6 text-right p-2"
                        style={{ fontWeight: "bold" }}
                      >
                        Tolerance Percentage :
                      </div>
                      <div
                        className="col-lg-6 text-left p-2"
                        style={{ fontWeight: "bold" }}
                      >
                        {Number(tollerence)}%
                      </div>
                      {/* <div className="col-lg-6 text-right p-2" style={{ fontWeight: "bold" }}>Total PO with tollerence :</div>
                      <div className="col-lg-6 text-left p-2" style={{ fontWeight: "bold" }}>{getTotalAmount(rowDto, "poquantity") * (Number(tollerence) / 100)}</div> */}
                      {type !== "view" && (
                        <>
                          {" "}
                          <div
                            className="col-lg-6 text-right p-2"
                            style={{ fontWeight: "bold" }}
                          >
                            Total Added Amount :
                          </div>
                          <div
                            className="col-lg-6 text-left p-2"
                            style={{ fontWeight: "bold" }}
                          >
                            {numberWithCommas(
                              getTotalAmount(rowDto, "addedQuantity")
                            )}
                          </div>{" "}
                        </>
                      )}
                      {type === "view" && (
                        <>
                          <div
                            className="col-lg-6 text-right p-2"
                            style={{ fontWeight: "bold" }}
                          >
                            Total Added Amount :
                          </div>
                          <div
                            className="col-lg-6 text-left p-2"
                            style={{ fontWeight: "bold" }}
                          >
                            {numberWithCommas(
                              getTotalShippedAmount(
                                rowDto,
                                values,
                                "addedQuantity"
                              )
                            )}
                          </div>
                        </>
                      )}
                      {type !== "view" && (
                        <div
                          className="col-lg-6 text-right p-2"
                          style={{ fontWeight: "bold" }}
                        >
                          Total Shipped Amount :
                        </div>
                      )}
                      {type !== "view" && (
                        <div
                          className="col-lg-6 text-left p-2"
                          style={{ fontWeight: "bold" }}
                        >
                          {numberWithCommas(
                            getTotalShippedAmount(
                              rowDto,
                              values,
                              "shippedQuantity"
                            )
                          )}
                        </div>
                      )}
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
                  // onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
