import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "./../../../../_helper/_inputField";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { DropzoneDialogBase } from "material-ui-dropzone";
import {
  getWarehouseDDL,
  getPurchaseOrgDDL,
  GetAdvanceForSupplierById,
  CreateAdvanceForSupplier,
  billregisterAttachment_action,
} from "../helper";
import FormikError from "./../../../../_helper/_formikError";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import { useHistory } from "react-router";
import { GetSupplierAmountInfo } from "./../helper";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import IWarningModal from "../../../../_helper/_warningModal";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(1, "Minimum 1 symbol")
    .required("Amouont is required")
    .typeError("Maximum 100 symbols"),
  purchaseOrder: Yup.object().shape({
    label: Yup.string().required("Purchase Order is required"),
    value: Yup.string().required("Purchase Order is required"),
  }).nullable(),
});

const initData = {
  id: undefined,
  amount: "",
  narration: "",
  purchaseOrder: "",
  purchaseOrg: "",
  warehouse: "",
  billNo: "",
};

export default function SupplierAdvance({ purchaseInvoiceValues }) {
  const [warehouse, setWarehouse] = useState([]);
  const [purchaseOrg, setpurchaseOrg] = useState([]);
  const [advanceForSupplierById, setAdvanceForSupplierById] = React.useState(
    []
  );
  const [supplierAmountInfo, setSupplierAmountInfo] = React.useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const history = useHistory();
  const { state: headerData } = useLocation();
  const [isBusinessUnit, setIsBusinessUnit] = useState(true);
  const [saveBtnDisable, setSaveBtnDisable] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    const amount =
      (+values?.purchaseOrder?.totalPOAmount || 0) +
        +(+values?.purchaseOrder?.othersCharge || 0) || 0;
    const total =
      Number(amount.toFixed(2)) -
      Number(supplierAmountInfo?.poAdvanceAmount.toFixed(2));
    if (total < values?.amount) {
      console.log(total, values?.amount);
      return toast.warn(
        "Difference Between Po Amount and Advance Amount can not be lower than Amount"
      );
    }
    const payload = {
      partnerId: values?.purchaseOrder?.supplierId,
      partnerName: values?.purchaseOrder?.supplierName,
      poCode: values?.purchaseOrder?.label,
      poid: values?.purchaseOrder?.value,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      sbuUnitId: headerData?.sbu?.value,
      plantId: headerData?.plant?.value,
      amount: +values?.amount || 0,
      remarks: values?.narration || "",
      billRefNo: values?.billNo || "",
      actionBy: profileData?.userId,
    };

    if (fileObjects?.length > 0) {
      // if image upload
      billregisterAttachment_action(fileObjects, setDisabled)
        .then((data) => {
          const newPayload = {
            ...payload,
            imageId: data[0].id,
            // images:
            //   data?.map((itm) => {
            //     return {
            //       imageId: itm?.id,
            //     };
            //   }) || [],
          };
          CreateAdvanceForSupplier(
            newPayload,
            cb,
            setDisabled,
            setAdvanceForSupplierById,
            setFileObjects,
            IWarningModal
          );
        })
        .catch((err) => console.log(err?.message));
    } else {
      // not image upload
      CreateAdvanceForSupplier(
        payload,
        cb,
        setDisabled,
        setAdvanceForSupplierById,
        setFileObjects,
        IWarningModal
      );
    }
  };

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit.value &&
      headerData?.plant?.value
    ) {
      getWarehouseDDL(
        profileData.userId,
        profileData.accountId,
        selectedBusinessUnit.value,
        headerData?.plant?.value,
        setWarehouse
      );
      getPurchaseOrgDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        headerData?.sbu?.value,
        setpurchaseOrg
      );
    }
  }, [profileData, selectedBusinessUnit, headerData]);
  const backHandler = () => {
    history.goBack();
  };

  // const fileObjectsPathNme = fileObjects?.map((itm) => itm?.file?.path);
  // const uploadImageListPathName = uploadImageList?.map(itm => itm?.fileName);
  // const duplicateCheck= fileObjectsPathNme.filter(d => !uploadImageListPathName.includes(d))

  // console.log(duplicateCheck);

  return (
    <div className="Supplier Advance">
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          warehouse: !isBusinessUnit && {
            value: warehouse[0]?.value,
            label: warehouse[0]?.label
          }
        }}
        validationSchema={validationSchema}
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
          <div className={""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Supplier Advance"}>
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={backHandler}
                    className={"btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    onClick={()=>{
                      setSaveBtnDisable(true);
                      setTimeout(()=>{
                        setSaveBtnDisable(false);
                      },5000)
                      handleSubmit();
                    }}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled = {saveBtnDisable}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isDisabled && <Loading />}
                <Form className="form form-label-right">
                <>
                  <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="isBusinessUnit"
                        checked={isBusinessUnit}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(valueOption) => {
                          setIsBusinessUnit(true);
                          setFieldValue("purchaseOrder","")
                          setFieldValue("warehouse", "");
                          setFieldValue("purchaseOrg", "");
                          setFieldValue("totalGRNAmount", "");
                          setFieldValue("amount", "");
                          setFieldValue("narration", "");
                          setFieldValue("billNo", "");
                          setSupplierAmountInfo({});
                          setAdvanceForSupplierById([])
                        }}
                      />
                      Business Unit
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="isBusinessUnit"
                        checked={!isBusinessUnit}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setIsBusinessUnit(false);
                          setFieldValue("purchaseOrder","")
                          setFieldValue("warehouse", "");
                          setFieldValue("purchaseOrg", "");
                          setFieldValue("totalGRNAmount", "");
                          setFieldValue("amount", "");
                          setFieldValue("narration", "");
                          setFieldValue("billNo", "");
                          setSupplierAmountInfo({});
                          setAdvanceForSupplierById([])
                        }}
                      />
                      Transfer Business Unit
                    </label>
                  </div>
                </>
                  <div className="row global-form global-form-custom pb-2">
                    {isBusinessUnit && 
                      <>
                        <div className="col-lg-3">
                          <label>Select PO Number</label>
                            <SearchAsyncSelect
                              selectedValue={values?.purchaseOrder}
                              handleChange={(valueOption) => {
                                if(+valueOption?.billId > 0){
                                  return toast.warn("Advance Entry is not Possible After MRR")
                                }
                                setFieldValue("purchaseOrder", valueOption);
                                GetAdvanceForSupplierById(
                                  valueOption?.value,
                                  setAdvanceForSupplierById
                                );
                                GetSupplierAmountInfo(
                                  valueOption?.value,
                                  setSupplierAmountInfo
                                );
                                setFieldValue("warehouse", {
                                  value: valueOption?.warehouseId,
                                  label: valueOption?.warehouseName,
                                });
                                setFieldValue("purchaseOrg", {
                                  value: valueOption?.purchaseOrganizationId,
                                  label: valueOption?.purchaseOrganizationName,
                                });
                                setFieldValue(
                                  "totalGRNAmount",
                                  valueOption?.totalGRNAmount
                                );
                                if (!valueOption) {
                                  setSupplierAmountInfo({});
                                  setAdvanceForSupplierById([])
                                }
                              }}
                              loadOptions={(v) => {
                                if (v?.length < 3) return [];
                                return Axios.get(
                                  `/procurement/PurchaseOrder/GetPurchaseOrderPIDDL2?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&SBUId=${headerData?.sbu?.value}&PlantId=${headerData?.plant?.value}&searchTerm=${v}`
                                ).then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                    value: item.intPurchaseOrderId,
                                    label: item.intPurchaseOrderNumber,
                                  }));
                                  return updateList;
                                });
                              }}
                            />
                            <FormikError
                              errors={errors}
                              name="purchaseOrder"
                              touched={touched}
                            />
                        </div>
                      </>
                    }
                    {!isBusinessUnit && 
                      <>
                        <div className="col-lg-3">
                          <label>Select PO Number</label>
                            <SearchAsyncSelect
                              selectedValue={values?.purchaseOrder}
                              handleChange={(valueOption) => {
                                setFieldValue("purchaseOrder", valueOption);
                                GetAdvanceForSupplierById(
                                  valueOption?.value,
                                  setAdvanceForSupplierById
                                );
                                GetSupplierAmountInfo(
                                  valueOption?.value,
                                  setSupplierAmountInfo
                                );
                                setFieldValue("warehouse", {
                                  value: warehouse[0]?.value,
                                  label: warehouse[0]?.label,
                                });
                                setFieldValue("purchaseOrg", {
                                  value: valueOption?.purchaseOrganizationId,
                                  label: valueOption?.purchaseOrganizationName,
                                });
                                setFieldValue(
                                  "totalGRNAmount",
                                  valueOption?.totalGRNAmount
                                );
                                if (!valueOption) {
                                  setSupplierAmountInfo({});
                                  setAdvanceForSupplierById([])
                                }
                              }}
                              loadOptions={(v) => {
                                if (v?.length < 3) return [];
                                return Axios.get(
                                  `/procurement/PurchaseOrder/GetPurchaseOrderPIDDL2Shipping?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&SBUId=${headerData?.sbu?.value}&PlantId=${headerData?.plant?.value}&searchTerm=${v}`
                                ).then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                    value: item.intPurchaseOrderId,
                                    label: item.intPurchaseOrderNumber,
                                  }));
                                  return updateList;
                                });
                              }}
                            />
                          <FormikError
                            errors={errors}
                            name="purchaseOrder"
                            touched={touched}
                          />
                        </div>
                      </>
                    }
                    <div className="col-lg-3">
                      <NewSelect
                        name="purchaseOrg"
                        options={purchaseOrg || []}
                        value={values?.purchaseOrg}
                        label="Select Purchase Organization"
                        onChange={(valueOption) => {
                          setFieldValue("purchaseOrg", valueOption);
                        }}
                        placeholder="Select Purchase Organization"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={warehouse || []}
                        value={values?.warehouse}
                        label="Select Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                        }}
                        placeholder="Select Warehouse"
                        errors={errors}
                        touched={touched}
                        isDisabled={isBusinessUnit ? true : false}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Amount</label>
                      <InputField
                        value={values?.amount}
                        name="amount"
                        placeholder="Amount"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Narration</label>
                      <InputField
                        value={values?.narration}
                        name="narration"
                        placeholder="Narration"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Bill No</label>
                      <InputField
                        value={values?.billNo}
                        name="billNo"
                        placeholder="Bill No"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mr-2 mt-5"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                    </div>
                    <div className="col-lg-4 d-flex justify-content-between mt-3 px-0">
                      <div>
                        <div>
                          <b>Total PO Amount: </b>
                          {(+values?.purchaseOrder?.totalPOAmount || 0) +
                            (+values?.purchaseOrder?.othersCharge || 0) || "0"}
                        </div>
                        <div>
                          <b>Total GRN Amount: </b>
                          {values?.totalGRNAmount || "0"}
                        </div>
                        <div>
                          <b>Supplier: </b>
                          {values?.purchaseOrder?.supplierName}
                        </div>
                      </div>
                      {/* {
                          console.log(supplierAmountInfo)
                        } */}
                      <div>
                        <div>
                          <b>Advance Amount: </b>
                          {supplierAmountInfo?.poAdvanceAmount?.toFixed(2)}
                        </div>
                        <div>
                          <b>Adjusted Amount: </b>
                          {supplierAmountInfo?.poAdjustedAmount?.toFixed(2)}
                        </div>
                        <div>
                          <b>Pending Adjustment Amount: </b>
                          <span
                          // style={
                          //   +supplierAmountInfo?.poAdvanceAmount -
                          //     +supplierAmountInfo?.totalAdjustedBalance >
                          //   0
                          //     ? { color: "red" }
                          //     : {}
                          // }
                          >
                            {/* {+supplierAmountInfo?.poAdvanceAmount -
                              +supplierAmountInfo?.totalAdjustedBalance || "0"} */}
                            {supplierAmountInfo?.poPendingAdjustment?.toFixed(
                              2
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-bordered mt-3 global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "25px" }}>Sl</th>
                        <th style={{ width: "25px" }}>Date</th>
                        <th style={{ width: "25px" }}>Amount</th>
                        <th style={{ width: "25px" }}>Narration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advanceForSupplierById?.advances?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{_dateFormatter(item?.advanceDate)}</td>
                          <td>{item?.amount}</td>
                          <td>{item?.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <DropzoneDialogBase
                    filesLimit={1}
                    acceptedFiles={["image/*","application/pdf"]}
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
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </div>
  );
}
