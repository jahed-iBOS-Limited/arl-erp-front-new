import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import IViewModal from "../../../../_helper/_viewModal";
import MaintananceServiceDetailsForm from "../maintananceserviceDetails/addEditForm";
import { IInput } from "../../../../_helper/_input";
import "./customButton.css";
import IAdd from "../../../../_helper/_helperIcons/_add";
import IUpdate from "../../../../_helper/_helperIcons/_update";
import {
  getMaintenanceTaskRowData,
  saveForItemReqData,
  saveForPurchaseRequestData,
} from "../helpers";
import FormikError from "../../../../_helper/_formikError";
import Axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import IConfirmModal from "../../../../_helper/_confirmModal";
import SearchAsyncSelectMulti from "../../../../_helper/SearchAsyncSelectMulti";

// Validation schema
const validationSchema = Yup.object().shape({
  workOrder: Yup.string().required("Work Order is required"),
  status: Yup.object().shape({
    label: Yup.string().required("Status is required"),
    value: Yup.string().required("Status is required"),
  }),
  costCenter: Yup.object().shape({
    label: Yup.string().required("Cost center is required"),
    value: Yup.string().required("Cost center is required"),
  }),
  assignTo: Yup.array().required("Assign to is required!")
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  costCenter,
  AssignTo,
  serviceDDL,
  onClickForServicesave,
  taskRowData,
  setTaskRowData,
  singleData,
  rowDtoHandler,
  onClickforMntTask,
  maintainId,
  setDisabled,
}) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentROwData] = useState([]);
  const [checkData, setCheckData] = useState([]);
  console.log("checkData", checkData);
  const history = useHistory();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const loadEmployeeInfo = (v) => {
    //  if (v?.length < 3) return []
    return Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
    ).then((res) => {
      return res?.data;
    });
  };

  //checkList data
  useEffect(() => {
    const newData = taskRowData?.filter((item) => item?.isCheck);
    setCheckData(newData);
  }, [taskRowData]);
  //change handler for checkbox
  const handleCheckBox = (name, value, sl, rowDto, setRowDto) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value;
    setRowDto(data);
  };
  //handle all check

  const handleAllChecked = (event) => {
    let newData = [...taskRowData];
    newData.forEach((item) => (item.isCheck = event.target.checked));
    if (event.target.checked) {
      setCheckData(newData);
    } else {
      setCheckData([]);
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            // console.log(values?.status)
            if (values?.status?.value === 3) {
              history.goBack();
            }
            // resetForm(initData);
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
          {console.log(values)}
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.workOrder}
                      label="Work Order"
                      placeholder="Work Order"
                      disabled={true}
                      name="workOrder"
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Status"
                      options={[
                        { label: "Open", value: 1 },
                        { label: "Pending", value: 2 },
                        { label: "Close", value: 3 },
                      ]}
                      value={values?.status}
                      name="status"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.reparingType}
                      label="Reparing Type"
                      placeholder="Reparing Type"
                      disabled={true}
                      name="reparingType"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.startDate}
                      label="Start Date"
                      placeholder="Start Date"
                      disabled={true}
                      type="date"
                      name="startDate"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.priority}
                      label="Priority"
                      placeholder="Priority"
                      disabled={true}
                      name="priority"
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Cost Center"
                      options={costCenter}
                      value={values?.costCenter}
                      name="costCenter"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.note}
                      label="Note"
                      placeholder="Note"
                      name="note"
                    />
                  </div>
                  <div className="col-lg-12">
                    <label>Assign To</label>
                    <SearchAsyncSelectMulti
                      selectedValue={values?.assignTo}
                      onChange={(valueOption) => {
                        if(valueOption) {
                          setFieldValue("assignTo", valueOption);
                        } else {
                          setFieldValue("assignTo", []);
                        }
                      }}
                      loadOptions={loadEmployeeInfo}
                    />
                    <FormikError
                      errors={errors}
                      name="assignTo"
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="form-group row mt-5">
                  <div className="col-lg-12">
                    <h5> Maintenance Task Service</h5>
                  </div>
                  <div className="col-lg-2">
                    <ISelect
                      label="Select Service"
                      options={serviceDDL}
                      value={values?.depService}
                      name="depService"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values?.amount}
                      label="Amount"
                      placeholder="Amount"
                      type="number"
                      name="amount"
                      min="0"
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values?.description}
                      label="Description"
                      placeholder="Description"
                      name="description"
                    />
                  </div>
                  <div className="col-lg-6 mt-7">
                    <button
                      type="button"
                      disabled={
                        values.depService === "" || values.amount === ""
                      }
                      onClick={() => {
                        onClickForServicesave(values);
                        setFieldValue("depService", "");
                        setFieldValue("amount", "");
                        setFieldValue("description", "");
                      }}
                      className="btn btn-primary mr-2"
                    >
                      Add
                    </button>
                    {/* item request is not functional yet */}
                    <button
                      type="button"
                      onClick={() => {
                        saveForItemReqData(
                          maintainId,
                          setDisabled,
                          profileData
                        );
                      }}
                      className="btn btn-primary mr-2"
                    >
                      Item Request
                    </button>

                    {/* purchase request ongoing */}
                    <button
                      type="button"
                      onClick={() => {
                        IConfirmModal({
                          title: `Purchase Request`,
                          message: `Are you sure to purchase request?`,
                          yesAlertFunc: () => {
                            saveForPurchaseRequestData(
                              checkData,
                              selectedBusinessUnit?.value,
                              () => {
                                getMaintenanceTaskRowData(
                                  maintainId,
                                  setTaskRowData
                                );
                              }
                            );
                          },
                          noAlertFunc: () => {},
                        });
                      }}
                      className="btn btn-primary "
                    >
                      Purchase Request
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th className="d-flex justify-content-center align-items-center">
                            <input
                              type="checkbox"
                              name="isCheck"
                              value="checkedall"
                              // checked={checkAll}
                              onChange={(e) => handleAllChecked(e)}
                            />
                            <label className="mb-1 pl-1">
                              <b>ALL</b>
                            </label>
                          </th>
                          <th>SL</th>
                          <th>Service Name</th>
                          <th>Service Cost</th>
                          <th>Description</th>
                          <th>Req Code</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taskRowData &&
                          taskRowData?.map((item, i) => (
                            <tr key={i + 1}>
                              <td style={{ width: "80px" }}>
                                <label className="">
                                  <input
                                    type="checkbox"
                                    name="isCheck"
                                    checked={
                                      item?.isCheck || item?.purchaseRequestId
                                    }
                                    disabled={item?.purchaseRequestId}
                                    onChange={(e) =>
                                      handleCheckBox(
                                        "isCheck",
                                        e.target.checked,
                                        i,
                                        taskRowData,
                                        setTaskRowData
                                      )
                                    }
                                  />
                                </label>
                              </td>
                              <td className="text-center">{i + 1}</td>
                              <td className="text-left">{item.serviceName}</td>
                              <td
                                className="text-right"
                                style={{ width: "130px" }}
                              >
                                <IInput
                                  value={taskRowData[i]?.numAmount}
                                  name="numAmount"
                                  type="number"
                                  placeholder="Amount"
                                  required
                                  onChange={(e) => {
                                    rowDtoHandler(
                                      "numAmount",
                                      e.target.value,
                                      i
                                    );
                                  }}
                                  min="0"
                                  max={item?.restQty}
                                />
                              </td>
                              <td
                                className="text-center"
                                // style={{ width: "200px" }}
                              >
                                <IInput
                                  value={taskRowData[i]?.description}
                                  name="description"
                                  placeholder="Description"
                                  onChange={(e) => {
                                    rowDtoHandler(
                                      "description",
                                      e.target.value,
                                      i
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                {item?.purchaseRequestCode ||
                                  item?.purchaseRequestId}
                              </td>
                              <td
                                className="text-center"
                                style={{ width: "130px" }}
                              >
                                <button
                                  type="button"
                                  onClick={() => onClickforMntTask(i)}
                                  className="btn button-w-blue-icon transparent-button mr-2"
                                >
                                  <IUpdate />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    setCurrentROwData(item);
                                    setIsShowModal(true);
                                  }}
                                  className="btn button-w-blue-icon transparent-button"
                                >
                                  <IAdd />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
              >
                <MaintananceServiceDetailsForm
                  currentRowData={currentRowData}
                  singleData={singleData}
                  setIsShowModal={setIsShowModal}
                />
              </IViewModal>
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
    </>
  );
}
