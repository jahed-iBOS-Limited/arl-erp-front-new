import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { useHistory } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import FormikInput from "../../_chartinghelper/common/formikInput";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import ICustomTable from "../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";
import { getAuditTypeDDL, getCategoryDDL, getVesselDDL } from "../helper";
import Loading from "../../_chartinghelper/loading/_loading";
import IDelete from "../../../_helper/_helperIcons/_delete";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../_helper/_viewModal";
import CategoryCreateModal from "./categoryCreateModal";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  rowDto,
  setRowDto,
  id,
}) {
  const history = useHistory();
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  // const [rowDto, setRowDto] = useState([]);
  const [vesselDDl, setVesselDDl] = useState([]);
  const [typeDDl, setTypeDDl] = useState([]);
  const [categoryDDl, setCategoryDDl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [createModal, setCreateModal] = useState(false);

  const validationSchema = Yup.object().shape({
    vesselType: Yup.object().required("Vessel Type is required"),
    type: Yup.object()
      .required("Type is required")
      .typeError("Type is required"),
    vessel: Yup.object()
      .required("Vessel is required")
      .typeError("Vessel is required"),
    category: Yup.object()
      .required("Category is required")
      .typeError("Category is required"),
    date: Yup.date().required("Date is required"),
    // vesselPosition: Yup.string().required("Position Of Vessel is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    nc: Yup.boolean(),
    dueDate: Yup.date().when("nc", {
      is: true,
      then: Yup.date().required("Due Date is required when NC is checked"),
      otherwise: Yup.date().notRequired(),
    }),
    status: Yup.object()
      .required("Status is required")
      .typeError("Status is required"),
  });
  const headers = [
    { name: "SL" },
    { name: "Description", style: { minWidth: "65px" } },
    { name: "NC?" },
    { name: "Due Date" },
    { name: "Status" },
    { name: "Action", style: { minWidth: "40px" } },
  ];
  useEffect(() => {
    getAuditTypeDDL(setTypeDDl, setLoading);
    getCategoryDDL(setCategoryDDl, setLoading);
  }, []);
  const deleteHandler = (index) => {
    const filterArr = rowDto?.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };
  console.log({ rowDto });
  const createPayload = (values, rowDto) => {
    const payload = {
      header: {
        intAuditInspectionId: id ? +id : 0,
        strVesselType: values?.vesselType?.value,
        intVesselId: values?.vessel?.value,
        dteInspectionDate: values?.date,
        strVesselPosition: values?.vesselPosition,
        strTitle: values?.title,
        intTypeId: values?.type?.value,
        intCategoryId: values?.category?.value,
        isActive: true,
        intCreatedBy: userId,
        intBusinessUnitId: buId,
      },
      rowList: rowDto.map((item, index) => ({
        intRowId: id ? item?.intRowId || 0 : 0,
        intAuditInspectionId: id ? +id : 0,
        strDescription: item?.description,
        isNcChecked: item?.nc,
        dteDueDateTime: item?.dueDate,
        strStatus: item?.status.value,
        isActive: true,
        intCreatedBy: userId,
      })),
    };
    return payload;
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          if (editIndex !== null) {
            const updatedRows = [...rowDto];
            updatedRows[editIndex] = { ...rowDto?.[editIndex], ...values };
            setRowDto(updatedRows);
            setEditIndex(null);
          } else {
            setRowDto([...rowDto, values]);
          }
          setFieldValue("description", "");
          setFieldValue("nc", false);
          setFieldValue("dueDate", "");
          setFieldValue("status", "");
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {
                    <button
                      type="button"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={() => {
                        const payload = createPayload(values, rowDto);
                        saveHandler(payload);
                      }}
                      //disabled={!rowData?.length}
                    >
                      {viewType !== "view" ? "Save" : "Edit"}
                    </button>
                  }
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselType || ""}
                      isSearchable={true}
                      options={[
                        { value: "MotherVessel", label: "Mother Vessel" },
                        { value: "LighterVessel", label: "Lighter Vessel" },
                      ]}
                      isDisabled={viewType === "view"}
                      styles={customStyles}
                      name="vesselType"
                      placeholder="Mother, Lighter"
                      label="Vessel Type"
                      onChange={(valueOption) => {
                        setFieldValue("vesselType", valueOption);
                        getVesselDDL(
                          valueOption?.value,
                          buId,
                          setVesselDDl,
                          setLoading
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vessel || ""}
                      isSearchable={true}
                      options={vesselDDl || []}
                      styles={customStyles}
                      name="vessel"
                      isDisabled={viewType === "view"}
                      placeholder={
                        values?.vesselType?.value === "MotherVessel"
                          ? "Mother Vessel"
                          : "Vessel/Ligher"
                      }
                      label={
                        values?.vesselType?.value === "MotherVessel"
                          ? "Mother Vessel"
                          : "Vessel/Ligher"
                      }
                      onChange={(valueOption) => {
                        setFieldValue("vessel", valueOption);
                        // gridData({ ...values, certificateName: valueOption });
                      }}
                      // isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label> Date</label>
                    <FormikInput
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label> Position Of Vessel</label>
                    <FormikInput
                      value={values?.vesselPosition}
                      name="vesselPosition"
                      placeholder="Vessel Position"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label> Title</label>
                    <FormikInput
                      value={values?.title}
                      name="title"
                      placeholder="title"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.type || ""}
                      isSearchable={true}
                      options={typeDDl || []}
                      styles={customStyles}
                      name="type"
                      placeholder="PSC, Audit, ..."
                      label="Type"
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);

                        // gridData({ ...values, vesselName: valueOption });
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label>Category</label>
                      <div
                        style={{
                          paddingTop: "2px",
                          paddingLeft: "3px",
                        }}
                      >
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">{"Add Category"}</Tooltip>
                          }
                        >
                          <span>
                            <i
                              style={{ color: "#3699ff" }}
                              className={`fas fa-plus-square`}
                              onClick={() => setCreateModal(true)}
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </div>
                    </div>
                    <FormikSelect
                      value={values?.category || ""}
                      isSearchable={true}
                      options={categoryDDl || []}
                      styles={customStyles}
                      name="category"
                      placeholder="UAE PSC"
                      // label="Category"
                      onChange={(valueOption) => {
                        setFieldValue("category", valueOption);
                        // gridData({ ...values, certificateName: valueOption });
                      }}
                      // isDisabled={!values?.vesselName}
                      errors={errors}
                      isDisabled={viewType === "view"}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-12">
                    <hr />
                  </div>
                  <div className="col-lg-3">
                    <label> Description</label>
                    <FormikInput
                      value={values?.description}
                      name="description"
                      placeholder="Description"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-1 d-flex pr-0 pl-0 justify-content-around">
                    <div className="d-flex flex-column mr-1 align-items-center">
                      <label className="ml-1 mb-2">NC</label>
                      <input
                        style={{ width: "20px", height: "20px" }}
                        checked={values?.nc}
                        value={values?.nc}
                        type="checkbox"
                        name="nc"
                        onChange={(e) => {
                          setFieldValue("nc", e.target.checked);
                        }}
                        className="ml-2"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <label>Due Date</label>
                    <FormikInput
                      value={values?.dueDate}
                      name="dueDate"
                      type="date"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.status || ""}
                      isSearchable={true}
                      options={[
                        { value: "open", label: "Open" },
                        { value: "pending", label: "Pending" },
                        { value: "close", label: "Close" },
                      ]}
                      styles={customStyles}
                      name="status"
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        // gridData({ ...values, certificateName: valueOption });
                      }}
                      // isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mt-5">
                    <button
                      type="button"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={viewType === "view" && editIndex === null}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              {/* {loading && <Loading />} */}
              {rowDto?.length > 0 ? (
                <ICustomTable ths={headers}>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.description}</td>
                      <td className="text-center">{item?.nc ? "Yes" : "No"}</td>
                      <td className="text-center">
                        {item?.dueDate ? _dateFormatter(item?.dueDate) : ""}
                      </td>
                      <td className="text-center">{item?.status?.label}</td>
                      <td className="text-center">
                        {viewType !== "view" ? (
                          <div
                            className={viewType === "view" ? "d-none" : ""}
                            onClick={() => {
                              deleteHandler(index);
                            }}
                          >
                            <IDelete />
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            checked={editIndex === index}
                            onChange={() => {
                              if (editIndex === index) {
                                setEditIndex(null);
                              } else {
                                setEditIndex(index);
                                setFieldValue("description", item?.description);
                                setFieldValue("nc", item?.nc);
                                setFieldValue(
                                  "dueDate",
                                  item?.dueDate
                                    ? _dateFormatter(item?.dueDate)
                                    : ""
                                );
                                setFieldValue("status", item?.status);
                              }
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </ICustomTable>
              ) : null}

              <IViewModal
                show={createModal}
                onHide={() => {
                  setCreateModal(false);
                  getCategoryDDL(setCategoryDDl, setLoading);
                }}
              >
                <CategoryCreateModal
                  title={"Create New Category"}
                  setter={setCategoryDDl}
                  onHide={() => setCreateModal(false)}
                />
              </IViewModal>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
