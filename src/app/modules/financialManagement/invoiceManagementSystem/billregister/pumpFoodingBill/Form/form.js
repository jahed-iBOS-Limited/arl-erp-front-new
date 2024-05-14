import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React from "react";
import * as Yup from "yup";
import TextArea from "../../../../../_helper/TextArea";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import InputField from "../../../../../_helper/_inputField";
// import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import NewSelect from "../../../../../_helper/_select";
import FromDateToDateForm from "../../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../../_helper/iButton";
import { empAttachment_action } from "../../helper";
import { insertDataInExcel } from "../helper";

const validationSchema = Yup.object().shape({
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  rowData,
  setFileObjects,
  fileObjects,
  warehouseDDL,
  resetBtnRef,
  getRows,
  headers,
  rowDataHandler,
  allSelect,
  selectedAll,
  setUploadedImage,
}) {
  const [open, setOpen] = React.useState(false);
  const generateExcel = (values, pageSize) => {
    getRows(values, insertDataInExcel);
  };
  let totalBillAmount = 0;
  let totalApproveAmount = 0;
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);

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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-12">
                  <div className="row align-items-end">
                    <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={
                          [{ value: "", label: "All" }, ...warehouseDDL] || []
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
                    <FromDateToDateForm
                      obj={{
                        values,
                        setFieldValue,
                      }}
                    />
                    <IButton
                      colSize={"col-lg-3"}
                      onClick={() => {
                        getRows(values);
                      }}
                      disabled={!values?.warehouse}
                    />
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
                    {/* <div className="col-lg-3">
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
                    </div> */}
                    <div className="col-lg-6">
                      <label>Narration</label>
                      <TextArea
                        value={values?.narration}
                        label="Narration No"
                        name="narration"
                        placeholder="Narration"
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                      {/* {values?.attachmentId && (
                        <IView
                          classes="purchaseInvoiceAttachIcon"
                          clickHandler={() => {
                            dispatch(
                              getDownlloadFileView_Action(values?.attachmentId)
                            );
                          }}
                        />
                      )} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-1 ">
                {rowData?.data?.length > 0 && (
                  <button
                    style={{ marginLeft: "10px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => generateExcel(values)}
                  >
                    Export Excel
                  </button>
                )}
                <div
                  className="col d-flex justify-content-end"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total : </span>
                  <span>
                    {_fixedPoint(
                      rowData?.data
                        ?.filter((item) => item?.isSelected)
                        ?.reduce((total, cur) => total + cur?.approveAmount, 0),
                      true,
                      0
                    )}
                  </span>
                </div>
                <div className="col-lg-12 mt-4">
                  <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th
                          onClick={() => allSelect(!selectedAll())}
                          style={{ width: "30px" }}
                        >
                          <input
                            type="checkbox"
                            value={selectedAll()}
                            checked={selectedAll()}
                            onChange={() => {}}
                          />
                        </th>

                        {headers?.map((th) => (
                          <th key={th}>{th}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.map((item, index) => {
                        totalBillAmount += item?.billAmount;
                        totalApproveAmount += item?.approveAmount;
                        return (
                          <tr key={index}>
                            <td
                              onClick={() => {
                                rowDataHandler(
                                  "isSelected",
                                  index,
                                  !item.isSelected
                                );
                              }}
                              className="text-center"
                              style={
                                item?.isSelected
                                  ? {
                                      backgroundColor: "#aacae3",
                                      width: "30px",
                                    }
                                  : { width: "30px" }
                              }
                            >
                              <input
                                type="checkbox"
                                value={item?.isSelected}
                                checked={item?.isSelected}
                                onChange={() => {}}
                              />
                            </td>

                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.employeeName}</td>
                            <td>{item?.employeeId}</td>
                            <td>{item?.workplaceName}</td>
                            <td>{item?.empDesignation}</td>
                            <td>{_dateFormatter(item?.date)}</td>
                            <td>{item?.startTime}</td>
                            <td>{_dateFormatter(item?.endDate)}</td>
                            <td>{item?.endTime}</td>
                            {/* <td>{item?.hours}</td> */}
                            <td className="text-right">{item?.billAmount}</td>
                            <td className="text-right">
                              {item?.approveAmount}
                            </td>
                            <td>{item?.remarks}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={10} className="text-right">
                          <b>Total </b>
                        </td>
                        <td className="text-right">
                          <b>{_fixedPoint(totalBillAmount, true, 0)}</b>
                        </td>
                        <td className="text-right">
                          <b>{_fixedPoint(totalApproveAmount, true, 0)}</b>
                        </td>
                        <td></td>
                      </tr>
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
              filesLimit={1}
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
                empAttachment_action(fileObjects).then((data) => {
                  setUploadedImage(data);
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
