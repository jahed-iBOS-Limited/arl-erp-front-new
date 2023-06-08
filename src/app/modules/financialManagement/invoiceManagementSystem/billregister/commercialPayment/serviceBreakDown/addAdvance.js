/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { toast } from "react-toastify";
import InputField from "../../../../../_helper/_inputField";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../../_metronic/_partials/controls";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import { empAttachment_action } from "../../../../../humanCapitalManagement/humanResource/employeeInformation/helper";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IView from "../../../../../_helper/_helperIcons/_view";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { createCommercialBreakdownForAdvance } from "../helper";
import Loading from "../../../../../_helper/_loading";

const initData = {
  advanceAmount: "",
  date: _todayDate(),
  description: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  advanceAmount: Yup.string().required("Advance amount is required"),
});

export default function AddAdvance({
  bill,
  advanceBill,
  setAdvanceBill,
  accountId,
  bussinessUnitId,
  data,
  supplierName,
  setSupplierName,
  setExpanded,
  state
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState({});
  const [uploadImage, setUploadImage] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isloading, setIsLoading] = useState(false);


  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const addHandler = (payload) => {
    setAdvanceBill([payload, ...advanceBill]);
  };

  useEffect(() => {
    let total = 0;
    for (let item of advanceBill) {
      total += item?.numAmount;
    }
    setTotalAmount(total);
  }, [advanceBill]);

  const saveHandler = (data) => {
    if (data.length > 0) {
      createCommercialBreakdownForAdvance(data, setIsLoading);
    } else {
      toast.warning("Please add at least one row");
    }
  };

  useEffect(() => {
    return () => {
      setAdvanceBill([]);
      setSupplierName("");
      setExpanded(false)
    };
  }, [setAdvanceBill, setSupplierName,setExpanded]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          <div className="bill">
            <Card>
            {isloading && <Loading />}
              {true && <ModalProgressBar />}
              <CardHeader style={{padding: '5px'}}>
                <div className="card-title">
                  <h3 style={{fontSize:"12px", color: "#000000"}}><span style={{fontWeight: "bold"}}>{supplierName}</span> &nbsp; &nbsp;<span style={{fontWeight: "bold"}}>Total Advance: {totalAmount}</span> </h3> 
                </div>
                <CardHeaderToolbar>
                  <>
                    <button
                      onClick={() => {
                        saveHandler(advanceBill, () => {
                          setAdvanceBill({});
                        });
                      }}
                      className="btn btn-primary ml-2"
                      type="submit"
                      disabled={bill?.billAndAdvanceId}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody style={{ padding: "3px 7px 3px 7px" }}>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3">
                      <label>Advance Amount</label>
                      <InputField
                        value={values?.advanceAmount}
                        name="advanceAmount"
                        placeholder="Advance Amount"
                        type="number"
                        disabled={bill?.billAndAdvanceId}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Date</label>
                      <InputField
                        value={values?.date}
                        name="date"
                        placeholder="Date"
                        type="date"
                        disabled={bill?.billAndAdvanceId}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Description</label>
                      <InputField
                        value={values?.description}
                        name="description"
                        placeholder="Description"
                        type="text"
                        disabled={bill?.billAndAdvanceId}
                      />
                    </div>
                    <div className="col-auto">
                      <button
                        className="btn btn-primary mr-2"
                        style={{ marginTop: "18px" }}
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                      {uploadImage[0]?.id && (
                        <button
                          className="btn btn-primary"
                          type="button"
                          style={{ marginTop: "18px" }}
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(uploadImage[0]?.id)
                            );
                          }}
                        >
                          Attachment View
                        </button>
                      )}
                    </div>
                    <DropzoneDialogBase
                      filesLimit={5}
                      acceptedFiles={["image/*"]}
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
                        setOpen(false);
                        empAttachment_action(fileObjects).then((data) => {
                          setUploadImage(data);
                        });
                      }}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                    <div className="col-lg-1" style={{ marginTop: "20px" }}>
                      <button
                        type="button"
                        disabled={!values?.advanceAmount}
                        onClick={() => {
                          if (!data?.supplierId) {
                            return toast.warn("Plaese Select Supplier");
                          }
                          addHandler({
                            billAndAdvanceId: 0,
                            accountId: accountId,
                            businessUnitId: bussinessUnitId,
                            poId: data?.poId,
                            lcId: data?.lcId,
                            sbuId: state?.sbu?.value,
                            plantId: state?.plant?.value,
                            warehouseId: 0,
                            warehouseName: "",
                            shipmentId: data?.shipmentId,
                            commercialReferenceId: data?.referenceId,
                            supplierId: data?.supplierId,
                            supplierName: data?.supplierName,
                            dteTransactionDate: values?.date,
                            typeId: 1,
                            typeName: "Advance",
                            numAmount: values?.advanceAmount,
                            vatAmount: 0,
                            billNo: 0,
                            description: values?.description,
                            attachment: uploadImage[0]?.id || "",
                            actionBy: profileData?.userId,
                          });
                          setFieldValue("advanceAmount", "");
                          setFieldValue("date", _todayDate());
                          setFieldValue("description", "");
                          setUploadImage([]);
                        }}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="react-bootstrap-table table-responsive mb-4">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Supplier</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Advance Amount</th>
                          <th style={{ width: "70px" }}>Attachment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {advanceBill?.length > 0 &&
                          advanceBill?.map((item, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td
                                    style={{ width: "30px" }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>
                                    <span className="pl-2">
                                      {item?.supplierName}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="pl-2">
                                      {item?.description}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    <span className="pl-2">
                                      {_dateFormatter(item?.dteTransactionDate)}
                                    </span>
                                  </td>
                                  <td className="text-right">
                                    <span className="pl-2">
                                      {item?.numAmount}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    {item?.attachment ? (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              item?.attachment
                                            )
                                          );
                                        }}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                </tr>

                              </>
                            );
                          })}
                          <tr>
                            <td className="text-center font-weight-bold" colSpan="4">
                              Total
                            </td>
                            <td className="text-right font-weight-bold">{totalAmount}</td>
                            <td colSpan="2"></td>
                          </tr>
                      </tbody>
                    </table>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
