import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { attachmentUploadAction } from "./helper";

const initData = {
  vessel: "",
  dockyardName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  remarks: "",
  // for rowdto
  activity: "",
  supplier: "",
  currency: "",
  budgetAmount: "",
  attachment: "",
};

const validationSchema = Yup.object().shape({
  vessel: Yup.object().shape({
    label: Yup.string().required("Vessel is required"),
    value: Yup.string().required("Vessel is required"),
  }),
  dockyardName: Yup.string().required("Dockyard Name is required"),
  fromDate: Yup.date().required("From Date is required"),
  toDate: Yup.date().required("To Date is required"),
});

export default function DryDocCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const { id } = useParams();

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const dispatch = useDispatch();
  const [vesselDDL, getVesselDDL, vesselAssetLoader] = useAxiosGet();
  const [supplierDDL, getSupplierDDL, supplierLoader] = useAxiosGet();
  const [currencyDDL, getCurrencyDDL, currencyDDLloader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [modifiedData, setModifiedData] = useState({});
  const [, getScheduleById, loaderOnGetScheduleId] = useAxiosGet();

  const modifyDataFromApi = () => {
    getScheduleById(
      `/fino/Expense/GetDocScheduleBudgetList?DocScheduleId=${id}`,
      (data) => {
        const obj = {
          vessel: {
            value: data?._header?.intVesselId,
            label: data?._header?.strVesselName,
          },
          dockyardName: data?._header?.strDockYardName,
          fromDate: _dateFormatter(data?._header?.dteFromDate),
          toDate: _dateFormatter(data?._header?.dteToDate),
          remarks: data?._header?.reMarks,
        };
        setModifiedData(obj);
        setRowData(data?._rows);
      }
    );
  };

  useEffect(() => {
    if (id) {
      modifyDataFromApi();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = (values, cb) => {
    if (!rowData?.length) {
      return toast.warn("Please add activity");
    }
    const payload = {
      _header: {
        intDocScheduleId: id ? +id : 0,
        intBusinessUnitId: selectedBusinessUnit?.value,
        strBusinessUnitName: selectedBusinessUnit?.label,
        intVesselId: values?.vessel?.value,
        strVesselName: values?.vessel?.label,
        strDockYardName: values?.dockyardName,
        dteFromDate: values?.fromDate,
        dteToDate: values?.toDate,
        reMarks: values?.remarks,
        numRate: id
          ? rowData?.reduce((acc, cur) => acc + cur?.numBudgetAmount, 0)
          : 0,
      },
      _rows: rowData?.map((item) => ({
        ...item,
        isActive: true,
      })),
    };
    saveData(`/fino/Expense/CreateDocSchedule`, payload, cb, true);
  };

  useEffect(() => {
    getSupplierDDL(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=0`
    );
    getCurrencyDDL(`/domain/Purchase/GetBaseCurrencyList`);
    getVesselDDL(
      // `${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
      `/asset/Asset/GetAssetVesselDdl?IntBussinessUintId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteRowDto = (index) => {
    const filterArr = rowData?.filter((itm, idx) => idx !== index);
    setRowData(filterArr);
  };

  const rowDtoHandler = (values, setFieldValue) => {
    const isDuplicateActivity = rowData?.find(
      (item) => item?.strActivity === values?.activity
    );
    if (isDuplicateActivity) {
      return toast.warn("Activity already added");
    } else {
      const obj = {
        intRowId: 0,
        intDocScheduleId: id ? +id : 0,
        strActivity: values?.activity,
        intSupplierId: values?.supplier?.value || 0,
        strSupplierName: values?.supplier?.label || "",
        intCurrencyId: values?.currency?.value,
        strCurrencyName: values?.currency?.label,
        numBudgetAmount: +values?.budgetAmount,
        strAttachmentLink: values?.attachment || "",
        isActive: true,
      };
      setRowData([...rowData, obj]);
      setFieldValue("activity", "");
      setFieldValue("supplier", "");
      setFieldValue("currency", "");
      setFieldValue("budgetAmount", "");
      setFieldValue("attachment", "");
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifiedData : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setRowData([]);
          id && modifyDataFromApi();
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
          {(vesselAssetLoader ||
            supplierLoader ||
            currencyDDLloader ||
            saveDataLoader ||
            loaderOnGetScheduleId) && <Loading />}
          <IForm
            title={id ? "Edit Dry Dock Schedule" : "Create Dry Dock Schedule"}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={vesselDDL}
                    value={values?.vessel}
                    label="Vessel"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("vessel", valueOption);
                      } else {
                        setFieldValue("vessel", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.dockyardName}
                    label="Dockyard Name"
                    name="dockyardName"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("dockyardName", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="form-group  global-form row mt-2">
                <div className="col-lg-2">
                  <InputField
                    value={values?.activity}
                    label="Activity"
                    name="activity"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("activity", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="supplier"
                    options={supplierDDL}
                    value={values?.supplier}
                    label="Supplier"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("supplier", valueOption);
                      } else {
                        setFieldValue("supplier", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="currency"
                    options={currencyDDL}
                    value={values?.currency}
                    label="Currency"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("currency", valueOption);
                      } else {
                        setFieldValue("currency", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.budgetAmount}
                    label="Budget Amount"
                    name="budgetAmount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("budgetAmount", e.target.value);
                    }}
                  />
                </div>
                <div
                  className="col-lg-2"
                  style={{
                    marginTop: "17px",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    <i class="fas fa-file-upload"></i>
                    Upload File
                  </button>
                  <DropzoneDialogBase
                    filesLimit={10}
                    acceptedFiles={["image/*", "application/pdf"]}
                    fileObjects={fileObjects || []}
                    cancelButtonText={"cancel"}
                    submitButtonText={"submit"}
                    maxFileSize={1000000}
                    open={open}
                    onAdd={(newFileObjs) => {
                      setFileObjects([].concat(newFileObjs));
                    }}
                    onDelete={(deleteFileObj) => {
                      const newData = fileObjects?.filter(
                        (item) => item.file.name !== deleteFileObj.file.name
                      );
                      setFileObjects(newData);
                    }}
                    onClose={() => setOpen(false)}
                    onSave={() => {
                      setOpen(false);
                      attachmentUploadAction(fileObjects).then((data) => {
                        setFieldValue("attachment", data[0]?.id);
                        setFileObjects([]);
                      });
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    style={{ marginTop: "17px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      rowDtoHandler(values, setFieldValue);
                    }}
                    disabled={
                      !values?.activity ||
                      !values?.currency ||
                      !values?.budgetAmount
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="table-responsive mt-2">
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Activity</th>
                      <th>Supplier</th>
                      <th>Currency</th>
                      <th>Budget Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.length > 0 &&
                      rowData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.strActivity}</td>
                          <td>{item?.strSupplierName}</td>
                          <td>{item?.strCurrencyName}</td>
                          <td className="text-right">
                            {numberWithCommas(item?.numBudgetAmount)}
                          </td>
                          <td className="text-center">
                            {
                              <div className="d-flex justify-content-around text-center">
                                {item?.strAttachmentLink ? (
                                  <IView
                                    title="View Attachment"
                                    clickHandler={() => {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          item?.strAttachmentLink
                                        )
                                      );
                                    }}
                                  />
                                ) : null}

                                <IDelete
                                  title="Delete Activity"
                                  remover={() => deleteRowDto(index)}
                                />
                              </div>
                            }
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
