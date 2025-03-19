import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import IViewModal from "./../../../../_helper/_viewModal";
import NewSelect from "./../../../../_helper/_select";
import { useSelector, shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import {
  getSBUDDL_Api,
  getWarehouseDDL_api,
  getById,
  createItemRequest,
} from "../helper";
import InputField from "./../../../../_helper/_inputField";
import { _todayDate } from "./../../../../_helper/_todayDate";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";

const initData = {
  id: undefined,
  sbu: "",
  warehouse: "",
  plant: "",
  referenceNo: "",
  validity: _todayDate(),
  requestDate: _todayDate(),
  dueDate: _todayDate(),
};

// Validation schema
const validationSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  warehouse: Yup.object().shape({
    label: Yup.string().required("Warehouse is required"),
    value: Yup.string().required("Warehouse is required"),
  }),
  plant: Yup.object().shape({
    label: Yup.string().required("Plant is required"),
    value: Yup.string().required("Plant is required"),
  }),
  referenceNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Reference No  is required"),
  requestDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Request Date  is required"),
  validity: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Validity  is required"),
  dueDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Due Date  is required"),
});

export default function ProductionOrderViewFormModel({
  show,
  onHide,
  plantNameDDL,
  landingTableRow,
}) {
  const [SBUDDL, setSBUDDL] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Api Data
  useEffect(() => {
    getSBUDDL_Api(profileData.accountId, selectedBusinessUnit.value, setSBUDDL);
  }, [profileData, selectedBusinessUnit]);

  // Remove Row Data
  const remover = (inx) => {
    const filterArr = rowDto.filter((itm, index) => index !== inx);
    setRowDto(filterArr);
  };

  // Get By Id
  useEffect(() => {
    if (landingTableRow?.productionOrderId) {
      getById(landingTableRow?.productionOrderId, setRowDto, setLoading);
    }
  }, [landingTableRow]);

  // Pop Up For Item Request Code
  const popUpForCode = (code) => {
    return confirmAlert({
      title: code,
      buttons: [
        {
          label: "Ok",
          onClick: () => "",
        },
      ],
    });
  };

  // Load All DDL
  useEffect(() => {
    if (landingTableRow?.plantId) {
      getWarehouseDDL_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit.value,
        landingTableRow?.plantId,
        setWarehouse
      );
      getSBUDDL_Api(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSBUDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingTableRow]);

  // Quantity Handler
  const quantityHandler = (index, value) => {
    const newRow = [...rowDto];
    newRow[index].qty = +value;
    newRow[index].numItemRequestQty = +value;
    setRowDto(newRow);
  };

  // Show Error Message For Suggestion Qty & Request Qty
  useEffect(() => {
    const foundValueNot = rowDto?.filter((item) => item?.isError);
    if (foundValueNot?.length > 0) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
  }, [rowDto]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowDto?.length) {
        // Negetive Check
        const foundNegetiveCheck = rowDto?.filter((item) => item?.qty < 0);
        if (foundNegetiveCheck.length > 0) {
          toast.warn("Negetive Value Not Allowed");
        } else {
          // Check If requested qty is greater then suggestion qty
          const foundValueNot = rowDto?.filter((item) => item?.isError);
          if (foundValueNot?.length > 0) {
            toast.warning(
              "Request Quantity Must Be Lesser Than Suggested Quantity",
              { toastId: "rqmlt" }
            );
          } else {
            const payload = {
              objHeader: {
                accountId: profileData?.accountId,
                businessUnitId: selectedBusinessUnit?.value,
                requestDate: values?.requestDate,
                validTill: values?.validity,
                dueDate: values?.dueDate,
                itemRequestTypeId: 0,
                referenceTypeId: 1,
                sbuid: values?.sbu?.value || 0,
                sbuname: values?.sbu?.label || "",
                plantId: values?.plant?.value || 0,
                plantName: values?.plant?.label || "",
                warehouseId: values?.warehouse?.value || 0,
                actionBy: profileData?.userId,
              },
              datalist: rowDto?.map((item) => {
                return {
                  ...item,
                  numItemRequestQty: item?.qty || item?.suggestionQty,
                };
              }),
            };
            // Last Change Assign By Sohag (Backend)
            createItemRequest(payload, cb, setLoading, (code) => {
              onHide();
              code && popUpForCode(code);
            });
          }
        }
      } else {
        toast.warning("You must have to add atleast one item");
      }
    }
  };

  return (
    <div>
      <IViewModal show={show} onHide={onHide} title={""} btnText="Close">
        {loading && <Loading />}
        <>
          <Formik
            enableReinitialize={true}
            initialValues={{
              ...initData,
              plant: {
                value: landingTableRow?.plantId,
                label: landingTableRow?.plantName,
              },
              referenceNo: landingTableRow?.productionOrderCode,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              saveHandler(values, () => {
                resetForm(initData);
                getById(
                  landingTableRow?.productionOrderId,
                  setRowDto,
                  setLoading
                );
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
              setValues,
            }) => (
              <div className="">
                <Card>
                  {true && <ModalProgressBar />}
                  <CardHeader title={"Create Item Request"}>
                    <CardHeaderToolbar>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                      >
                        Save
                      </button>
                    </CardHeaderToolbar>
                  </CardHeader>
                  <CardBody>
                    <Form className="form form-label-right">
                      <div className="form-group row  global-form">
                        <div className="col-lg-3">
                          <NewSelect
                            name="sbu"
                            options={SBUDDL || []}
                            value={values?.sbu}
                            label="Select SBU"
                            onChange={(valueOption) => {
                              setFieldValue("sbu", valueOption);
                            }}
                            placeholder="Select SBU"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="plant"
                            options={plantNameDDL || []}
                            value={values?.plant}
                            label="Select Plant"
                            onChange={(valueOption) => {
                              setFieldValue("plant", valueOption);
                            }}
                            placeholder="Select Plant"
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
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Request Date</label>
                          <InputField
                            value={values?.requestDate}
                            name="requestDate"
                            placeholder="Request Date"
                            type="date"
                          />
                        </div>

                        <div className="col-lg-3">
                          <label>Validity</label>
                          <InputField
                            value={values?.validity}
                            name="validity"
                            placeholder="Validity"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Due Date</label>
                          <InputField
                            value={values?.dueDate}
                            name="dueDate"
                            placeholder="Due Date"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Reference No.</label>
                          <InputField
                            value={values?.referenceNo}
                            name="referenceNo"
                            placeholder="Reference No."
                            type="text"
                            disabled={true}
                          />
                        </div>
                      </div>
                      {/* Start Table Part */}
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Item Code</th>
                              <th>Item Name</th>
                              <th>Reference No</th>
                              <th>Request Qty.</th>
                              {/* <th>Purpose</th> */}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody className="production-order-css">
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center align-middle">
                                  {index + 1}
                                </td>
                                <td className="text-center align-middle">
                                  <div className="pl-2">{item?.itemCode}</div>
                                </td>
                                <td>
                                  <div className="pl-2">{item?.itemName}</div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {item?.productionOrderCode}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    width: "200px",
                                  }}
                                  className="text-center align-middle table-input"
                                >
                                  <span className="input-div">
                                    <input
                                      value={item?.qty || ""}
                                      className={`${
                                        item?.isError ? "input-qty" : ""
                                      }  form-control`}
                                      onChange={(e) => {
                                        // Set Error False
                                        quantityHandler(index, e.target.value);
                                        const newArr = [...rowDto];
                                        newArr[index].isError = false;
                                        setRowDto(newArr);
                                        // if (
                                        //   e.target.value <= item?.suggestionQty
                                        // ) {
                                        //   // Set Error False
                                        //   quantityHandler(index, e.target.value);
                                        //   const newArr = [...rowDto];
                                        //   newArr[index].isError = false;
                                        //   setRowDto(newArr);
                                        // } else {
                                        //   // Set Error True
                                        //   quantityHandler(index, e.target.value);
                                        //   const newArr = [...rowDto];
                                        //   newArr[index].isError = true;
                                        //   setRowDto(newArr);
                                        // }
                                      }}
                                      placeholder={item?.suggestionQty}
                                      type="number"
                                    />
                                  </span>
                                </td>

                                {/* Assign By Miraj Bhai (BA) */}
                                {/* <td className="text-center align-middle table-input">
                                <input
                                  value={item?.referenceNo}
                                  name="referenceNo"
                                  className="form-control w-100"
                                  onChange={(e) => {
                                    const newRow = [...rowDto];
                                    newRow[index].referenceNo = e.target.value;
                                    setRowDto(newRow);
                                  }}
                                  placeholder="Purpose"
                                  type="text"
                                />
                              </td> */}

                                <td className="text-center align-middle table-input">
                                  <span onClick={() => remover(index)}>
                                    <IDelete />
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {errorMsg && (
                        <small style={{ color: "red" }}>
                          * Request Quantity Must Be Lesser Than Suggested
                          Quantity
                        </small>
                      )}
                      {/* End Table Part */}
                    </Form>
                  </CardBody>
                </Card>
              </div>
            )}
          </Formik>
        </>
      </IViewModal>
    </div>
  );
}
