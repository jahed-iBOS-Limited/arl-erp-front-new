import axios from "axios";
import { Form, Formik } from "formik";
import React, { useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import TextArea from "../../../_helper/TextArea";
import ICustomTable from "../../../_helper/_customTable";
import FormikError from "../../../_helper/_formikError";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import NewSelect from "../../../_helper/_select";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import placeholderImg from "../../../_helper/images/placeholderImg.png";
import { attachment_action, nameCutter } from "../helper";
import "./form.css";

const validationSchema = Yup.object().shape({
  unit: Yup.object().shape({
    label: Yup.string().required("Unit is required"),
    value: Yup.string().required("Unit is required"),
  }),
  workplaceGroup: Yup.object().shape({
    label: Yup.string().required("Workplace group is required"),
    value: Yup.string().required("Workplace group is required"),
  }),
  workplace: Yup.object().shape({
    label: Yup.string().required("Workplace is required"),
    value: Yup.string().required("Workplace is required"),
  }),
  documentName: Yup.object().shape({
    label: Yup.string().required("Document name is required"),
    value: Yup.string().required("Document name is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  unitDDL,
  remover,
  setAttachmentFile,
  attachmentFile,
  businessUnit,
  setBusinessUnit,
  attachmentFileArray,
  setAttachmentFileArray,
  attachmentFileName,
  setAttachmentFileName,
  regId,
  getDataById,
  setDisabled,
  setDeletedRow,
  deletedRow,
}) {
  const dispatch = useDispatch();

  // attachment file
  const inputAttachFile = useRef(null);
  const [wpGroup, getWpGroup] = useAxiosGet();
  const [wp, getWp] = useAxiosGet();
  const [legalDocument, getLegalDocument] = useAxiosGet();

  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const loadEmpList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${accId}&BusinessUnitId=${buId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            regId && getDataById();
            !regId && setAttachmentFileArray([]);
            setAttachmentFile("");
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
            <Form className="form form-label-right legalDocument-entry">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <NewSelect
                    name="unit"
                    options={unitDDL || []}
                    value={values?.unit}
                    label="Unit"
                    onChange={(valueOption) => {
                      setFieldValue("unit", "");
                      setFieldValue("unit", valueOption);
                      setBusinessUnit(
                        valueOption?.value
                          ? valueOption?.value
                          : values?.unit?.value
                      );
                      getWpGroup(
                        `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=WorkplaceGroupIdByBusinessUnitId&intBusinessUnitId=${valueOption?.value}`
                      );
                      setFieldValue("workplaceGroup", "");
                      setFieldValue("workplace", "");
                      setFieldValue("documentName", "");
                    }}
                    placeholder="Unit"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="workplaceGroup"
                    options={wpGroup || []}
                    value={values?.workplaceGroup}
                    label="Workplace Group"
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                      getWp(
                        `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=WorkplaceByWorkplaceGroupId&intBusinessUnitId=${values?.unit?.value}&intWorkplaceGroupId=${valueOption?.value}`
                      );
                      setFieldValue("workplace", "");
                      setFieldValue("documentName", "");
                    }}
                    isDisabled={!values?.unit}
                    placeholder="Workplace Group"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="workplace"
                    options={wp || []}
                    value={values?.workplace}
                    label="Workplace"
                    onChange={(valueOption) => {
                      setFieldValue("workplace", valueOption);
                      getLegalDocument(
                        `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentNameDDL&intBusinessUnitId=${values?.unit?.value}&intWorkplaceGroupId=${values?.workplaceGroup?.value}&intWorkplaceId=${valueOption?.value}`
                      );
                      setFieldValue("documentName", "");
                    }}
                    isDisabled={!values?.workplaceGroup}
                    placeholder="Workplace"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="documentName"
                    options={legalDocument || []}
                    value={values?.documentName}
                    label="Documents Name"
                    onChange={(valueOption) => {
                      setFieldValue("documentName", valueOption);
                    }}
                    placeholder="Document Name"
                    isDisabled={!values?.workplace}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="renewalType"
                    options={[
                      {
                        value: "One Year",
                        label: "One Year",
                      },
                      {
                        value: "Two Year",
                        label: "Two Year",
                      },
                      {
                        value: "Three Year",
                        label: "Three Year",
                      },
                      {
                        value: "Four Year",
                        label: "Four Year",
                      },
                      {
                        value: "Five Year",
                        label: "Five Year",
                      },
                      {
                        value: "Life Time",
                        label: "Life Time",
                      },
                    ]}
                    value={values?.renewalType}
                    label="Renewal Type"
                    onChange={(valueOption) => {
                      setFieldValue("renewalType", valueOption);
                    }}
                    placeholder="Renewal Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.documentNo}
                    placeholder="Documents No"
                    label="Documents No"
                    name="documentNo"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.authority}
                    placeholder="Concern Authority"
                    label="Concern Authority"
                    name="authority"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.address}
                    placeholder="Address/City"
                    label="Address/City"
                    name="address"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Cont. Person</label>
                  <SearchAsyncSelect
                    selectedValue={values?.contPerson}
                    handleChange={(valueOption) => {
                      setFieldValue("contPerson", valueOption);
                    }}
                    loadOptions={loadEmpList}
                    placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                  />
                  <FormikError
                    name="custodian"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    type="date"
                    value={values?.renewalDate}
                    placeholder="Renewal Date"
                    label="Renewal Date"
                    name="renewalDate"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    type="date"
                    value={values?.expiryDate}
                    placeholder="Expiry Date"
                    label="Expiry Date"
                    name="expiryDate"
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="documentStatus"
                    options={[
                      {
                        value: "Updated",
                        label: "Updated",
                      },
                      {
                        value: "Pending",
                        label: "Pending",
                      },
                      {
                        value: "Under Process",
                        label: "Under Process",
                      },
                    ]}
                    value={values?.documentStatus}
                    label="Document Status"
                    onChange={(valueOption) => {
                      setFieldValue("documentStatus", valueOption);
                    }}
                    placeholder="Document Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    type="date"
                    value={values?.lastUpdatedDate}
                    placeholder="Last Updated Date"
                    label="Last Updated Date"
                    name="lastUpdatedDate"
                  />
                </div>
                {/* <div className="col-lg-6 d-flex align-items-center justify-concern-center mt-5">
                  <input
                    style={{ width: "15px", height: "15px" }}
                    name="checkBox"
                    checked={values?.checkBox}
                    className="form-control mr-3"
                    type="checkbox"
                    onChange={(e) => {
                      setFieldValue("checkBox", e.target.checked);
                    }}
                  />
                  <label>Applied</label>
                </div> */}
                <div className="col-lg-12 mt-2">
                  <div>
                    <div>Remarks</div>
                  </div>
                  <div className="w-100">
                    <TextArea
                      name="remarks"
                      value={values?.remarks}
                      label="Remarks"
                      placeholder="Remarks"
                      touched={touched}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="col-lg-2">
                  <div className="d-flex flex-column">
                    Attachment
                    {attachmentFile && (
                      <span
                        className="pointer"
                        onClick={() => {
                          dispatch(getDownlloadFileView_Action(attachmentFile));
                        }}
                      >
                        <i
                          className="fa fa-eye"
                          aria-hidden="true"
                          style={{ marginRight: "10px", color: "#0072E5" }}
                        ></i>
                      </span>
                    )}
                  </div>
                  <div
                    className={
                      attachmentFile
                        ? "image-upload-box with-img"
                        : "image-upload-box"
                    }
                    onClick={onButtonAttachmentClick}
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      height: "35px",
                    }}
                  >
                    <input
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          attachment_action(e.target.files, setDisabled)
                            .then((data) => {
                              setAttachmentFile(data?.[0]?.id);
                              setAttachmentFileName(data[0]);
                            })
                            .catch((error) => {
                              toast.warn("Failed, try again");
                            });
                        }
                      }}
                      type="file"
                      ref={inputAttachFile}
                      id="file"
                      style={{ display: "none" }}
                    />

                    <div>
                      {!attachmentFile && (
                        <img
                          style={{ maxWidth: "65px" }}
                          src={placeholderImg}
                          className="img-fluid"
                          alt="Upload or drag documents"
                        />
                      )}
                    </div>

                    {attachmentFile && (
                      <div className="d-flex align-items-center">
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#0072E5",
                            cursor: "pointer",
                            margin: "0px",
                          }}
                        >
                          {nameCutter(0, 10, attachmentFile)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-lg-1" style={{ marginTop: "20px" }}>
                  <ButtonStyleOne
                    type="button"
                    label="Add"
                    onClick={() => {
                      if (!attachmentFile)
                        return toast.warn("File not found!", {
                          toastId: 457,
                        });

                      const isFound =
                        attachmentFileArray.filter(
                          (itm) =>
                            itm?.fileName === attachmentFileName?.fileName
                        ).length > 0;

                      if (isFound)
                        return toast.warn(
                          "Not allowed to duplicate item!",
                          {
                            toastId: 456,
                          },
                          setAttachmentFile("")
                        );

                      let prevData = [...attachmentFileArray];
                      prevData.push({
                        ...attachmentFileName,
                        isCreate: true,
                        isDelete: false,
                      });
                      setAttachmentFileArray(prevData);
                      setAttachmentFile("");
                    }}
                  />
                </div>
              </div>

              <ICustomTable ths={["SL", "Document File Name", "Action"]}>
                {attachmentFileArray?.length !== 0 &&
                  attachmentFileArray?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.fileName}</td>
                      <td className="text-center">
                        <span
                          onClick={(e) => {
                            if (
                              regId &&
                              item?.id &&
                              window?.location?.pathname?.includes("edit")
                            ) {
                              const data = [...deletedRow];
                              data.push({
                                ...item,
                                isCreate: false,
                                isDelete: true,
                              });
                              setDeletedRow(data);
                            }
                            remover(index);
                          }}
                        >
                          <IDelete remover={() => ""} id={index} />
                        </span>
                      </td>
                    </tr>
                  ))}
              </ICustomTable>

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
