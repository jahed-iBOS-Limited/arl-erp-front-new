import React, { useState } from "react";
import { Formik, Form } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { getItemDDL, retailPriceAttachment_action } from "../helper";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";
import { useDispatch } from "react-redux";
import IView from "./../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  // DDL
  distributionChannelDDL,
  itemDDL,
  setItemDDL,
  // Other
  rowData,
  setRowData,
  accountId,
  buId,
  rowDataHandler,
  isEdit,
  remover,
  setFileObjects,
  fileObjects,
  uploadImage,
  setUploadImage,
}) {
  const dispatch = useDispatch();

  // image attachment
  const [open, setOpen] = useState(false);
  const [rowAttachBtnIndx, setRowAttachBtnIndx] = useState("");
  // Handle tprate when On change
  const handleInputChange = (index, value, name) => {
    if (value < 0) {
      let newRowData = [...rowData];
      newRowData[index][name] = "";
      setRowData(newRowData);
    } else {
      let newRowData = [...rowData];
      newRowData[index][name] = value;
      newRowData[index].itemRate =
        newRowData[index][name] / newRowData[index]?.packageQuantity;
      setRowData(newRowData);
    }
  };

  const rowLableAttachmentUpdate = (imageId) => {
    const newRowData = [...rowData];
    newRowData[rowAttachBtnIndx].productImage = imageId[0]?.id || "";
    setRowData(newRowData);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setRowData([]);
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
          <Form className="global-form form form-label-right">
            <div className="form-group row">
              <div className="col-lg-3">
                <NewSelect
                  name="distribution"
                  options={distributionChannelDDL}
                  value={values?.distribution}
                  label="Distribution"
                  onChange={(valueOption) => {
                    setFieldValue("distribution", valueOption);
                    getItemDDL(accountId, buId, valueOption?.value, setItemDDL);
                  }}
                  placeholder="Distribution"
                  errors={errors}
                  touched={touched}
                  isDisabled={rowData?.length > 0}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="item"
                  options={itemDDL}
                  value={values?.item}
                  label="Item Name"
                  onChange={(valueOption) => {
                    setFieldValue("item", valueOption);
                    setFieldValue("UoM", valueOption?.uomName || "");
                    setFieldValue("UoMId", valueOption?.uomId);
                    setFieldValue("rate", valueOption?.rate || "");
                    setFieldValue("itemCode", valueOption?.name || "");
                    setFieldValue("tprate", "");
                    setFieldValue("dprate", "");
                    setFieldValue("packageQuantity", "");
                    setFieldValue("rate", "");
                    setFieldValue("itemBanglaName", "");
                    setFieldValue("productImage", "");
                    setFileObjects([]);
                  }}
                  placeholder="Item Name"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>UoM</label>
                <InputField
                  value={values?.UoM}
                  name="UoM"
                  placeholder="UoM"
                  disabled={true}
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>TP Rate</label>
                <InputField
                  value={values?.tprate}
                  name="tprate"
                  placeholder="TP Rate"
                  type="number"
                  min="0"
                  onChange={(e) => {
                    setFieldValue(
                      "rate",
                      Math.abs(e.target.value) / values?.packageQuantity
                    );
                    setFieldValue("tprate", Math.abs(e.target.value));
                  }}
                />
              </div>
              <div className="col-lg-3">
                <label>DP Rate</label>
                <InputField
                  value={values?.dprate}
                  name="dprate"
                  placeholder="DP Rate"
                  type="number"
                  min="0"
                />
              </div>
              <div className="col-lg-3">
                <label>Package Quantity</label>
                <InputField
                  value={values?.packageQuantity}
                  name="packageQuantity"
                  placeholder="Package Quantity"
                  type="number"
                  min="1"
                  onChange={(e) => {
                    setFieldValue(
                      "rate",
                      values?.tprate / Math.abs(e.target.value)
                    );
                    setFieldValue("packageQuantity", Math.abs(e.target.value));
                  }}
                />
              </div>
              <div className="col-lg-3">
                <label>Rate</label>
                <InputField
                  value={values?.rate}
                  name="rate"
                  placeholder="Rate"
                  onChange={(e) => {
                    NegetiveCheck(e.target.value, setFieldValue, "rate");
                  }}
                  type="number"
                  min="0"
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <label>Bangla Name</label>
                <InputField
                  value={values?.itemBanglaName || ""}
                  name="itemBanglaName"
                  placeholder="Bangla Name"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="productType"
                  options={[
                    { value: 1, label: "Mandatory" },
                    { value: 2, label: "Focus" },
                    { value: 3, label: "Others" },
                  ]}
                  value={values?.productType}
                  label="Product Type"
                  onChange={(valueOption) => {
                    setFieldValue("productType", valueOption);
                  }}
                  placeholder="Product Type"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-4">
                <button
                  className="btn btn-primary mr-2"
                  type="button"
                  onClick={() => {
                    setOpen(true);
                    setRowAttachBtnIndx("");
                  }}
                  style={{ marginTop: "20px" }}
                >
                  Attachment
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: "20px" }}
                  onClick={() => {
                    rowDataHandler(values, setFieldValue);
                    setRowAttachBtnIndx("");
                    setUploadImage("");
                  }}
                  disabled={
                    !values?.UoM ||
                    !values?.rate ||
                    !values?.item ||
                    !values?.distribution ||
                    !values?.itemBanglaName ||
                    !values?.packageQuantity ||
                    !values?.tprate ||
                    !values?.dprate ||
                    !values?.productType
                  }
                >
                  Add
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Bangla Name</th>
                  <th>Item Name</th>
                  <th style={{ width: "90px" }}>Item Code</th>
                  <th style={{ width: "90px" }}>UoM</th>
                  <th style={{ width: "60px" }}>DP Rate</th>
                  <th style={{ width: "60px" }}>TP Rate</th>
                  <th style={{ width: "60px" }}>Package Quantity</th>
                  <th style={{ width: "60px" }}>Rate</th>
                  <th style={{ width: "190px" }}>Image</th>
                  {!isEdit && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {rowData?.length > 0 &&
                  rowData?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {index + 1}
                        </td>
                        <td>
                          <span className="pl-2">{item?.itemBanglaName}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.itemName}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.itemCode}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.uomName}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.dprate ?? 0}</span>
                        </td>
                        <td style={{ width: "120px" }}>
                          {/* When Create Mode */}
                          {!isEdit && (
                            <span className="pl-2">{item?.tprate ?? 0}</span>
                          )}
                          {/* When Edit Mode */}
                          {isEdit && (
                            <input
                              style={{ width: "120px", height: "20px" }}
                              className="form-control"
                              name="tprate"
                              type="number"
                              min="0"
                              step="any"
                              value={item?.tprate ?? 0}
                              onChange={(e) => {
                                handleInputChange(
                                  index,
                                  e.target.value,
                                  "tprate"
                                );
                              }}
                            />
                          )}
                        </td>
                        <td>
                          <span className="pl-2">{item?.packageQuantity}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {item?.itemRate.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <div className="text-center">
                            {/* When Edit Mode */}
                            {isEdit && (
                              <button
                                className="btn btn-primary mr-2"
                                type="button"
                                onClick={() => {
                                  setOpen(true);
                                  setRowAttachBtnIndx(index);
                                }}
                              >
                                Attachment
                              </button>
                            )}

                            {item?.productImage && (
                              <>
                                <IView
                                  classes="purchaseInvoiceAttachIcon"
                                  clickHandler={() => {
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.productImage
                                      )
                                    );
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </td>
                        {!isEdit && (
                          <td className="text-center">
                            <IDelete remover={remover} id={index} />
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>

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
                  (item) => item.file.name !== deleteFileObj.file.name
                );
                setFileObjects(newData);
              }}
              onClose={() => setOpen(false)}
              onSave={() => {
                retailPriceAttachment_action(fileObjects).then((data) => {
                  setUploadImage(data);
                  if (rowAttachBtnIndx === 0 || rowAttachBtnIndx) {
                    rowLableAttachmentUpdate(data);
                    setRowAttachBtnIndx("");
                    setFileObjects([]);
                  }
                });
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />

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
  );
}

export default _Form;
