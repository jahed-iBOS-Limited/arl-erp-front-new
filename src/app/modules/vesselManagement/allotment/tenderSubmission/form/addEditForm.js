import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import {
  businessPartnerDDL,
  convertToText,
  ErrorMessage,
  fetchTenderDetails,
  getDischargePortDDL,
  getGodownDDLList,
  GetLoadPortDDL,
  initData,
  updateState,
  validationSchema,
} from "../helper";

export default function TenderSubmissionCreateEditForm() {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit: { label: buUnName, value: buUnId },
  } = useSelector((state) => state?.authData, shallowEqual);
  // For edit
  const { id: tenderId } = useParams();
  const { state: landingPageState } = useLocation();
  // Default
  const [objProps, setObjprops] = useState({});
  // DDL
  const [dischargeDDL, setDischargeDDL] = useState([]);
  const [loadPortDDL, setLoadPortDDL] = useState([]);

  // Data fetch axios get
  const [
    godownDDL,
    getGodownDDL,
    getGodownDDLLoading,
    updateGodownDDL,
  ] = useAxiosGet();
  const [tenderDetails, getTenderDetails] = useAxiosGet();

  // Data post/save axios post
  const [, submitTender, submitTenderLoading] = useAxiosPost();

  useEffect(() => {
    // Get load & discharge port ddl
    getDischargePortDDL(setDischargeDDL);
    GetLoadPortDDL(setLoadPortDDL);
    // Id tenderId  than this is edit mode
    if (tenderId && landingPageState) {
      // Fetch when edit mode active
      fetchTenderDetails(tenderId, accountId, buUnId, getTenderDetails);
      getGodownDDLList(
        { value: landingPageState?.businessPartnerId },
        accountId,
        buUnId,
        getGodownDDL,
        updateGodownDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const payload = {
      header: {
        accountId: accountId,
        businessUnitId: buUnId,
        businessUnitName: buUnName,
        tenderId: tenderId ? tenderId : 0,
        businessPartnerId: values?.businessPartner?.value,
        businessPartnerName: values?.businessPartner?.label,
        enquiryNo: values?.enquiry,
        submissionDate: values?.submissionDate,
        foreignQty: values?.foreignQnt,
        totalQty: values?.foreignQnt,
        uomname: values?.uomname,
        itemName: values?.productName,
        loadPortId: values?.loadPort?.value,
        loadPortName: values?.loadPort?.label,
        dischargePortId: values?.dischargePort?.value,
        dischargePortName: values?.dischargePort?.label,
        foreignPriceUsd: values?.foreignPriceUSD,
        commercialNo: values?.commercialNo,
        commercialDate: values?.commercialDate,
        referenceNo: values?.referenceNo,
        referenceDate: values?.referenceDate,
        actionBy: userId,
        isActive: true,
        isAccept: values?.approveStatus,
        attachment: values?.attachment,
      },
      rows: values?.localTransportations?.map((item) => ({
        godownId: item?.godownName?.value,
        godownName: item?.godownName?.label,
        quantity: item?.quantity,
        perQtyTonPriceBd: item?.price,
        perQtyPriceWords: convertToText(item?.price),
        tenderHeaderId: tenderId ? tenderId : 0,
        tenderRowId: tenderId ? item?.tenderRowId : 0,
        isActive: true,
      })),
    };
    submitTender(
      `/tms/TenderSubmission/CreateOrUpdateTenderSubission`,
      payload,
      cb,
      true
    );
  };

  const commonFormField = (values, setFieldValue, errors, touched) => (
    <>
      <div className="col-lg-3">
        <InputField
          value={values?.enquiry}
          label="Enquiry No"
          name="enquiry"
          type="text"
          onChange={(e) => {
            setFieldValue("enquiry", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.submissionDate}
          label="Submission Date"
          name="submissionDate"
          type="date"
          onChange={(e) => {
            setFieldValue("submissionDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.foreignQnt}
          label="Foreign Quantity"
          name="foreignQnt"
          type="text"
          onChange={(e) => {
            setFieldValue("foreignQnt", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.uomname}
          label="Unit"
          name="uomname"
          type="text"
          onChange={(e) => {
            setFieldValue("uomname", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.productName}
          label="Product Name"
          name="productName"
          type="text"
          onChange={(e) => {
            setFieldValue("productName", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="loadPort"
          options={loadPortDDL}
          value={values?.loadPort}
          label="Load Port"
          onChange={(valueOption) => {
            setFieldValue("loadPort", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="dischargePort"
          options={dischargeDDL}
          value={values?.dischargePort}
          label="Discharge Port"
          onChange={(valueOption) => {
            setFieldValue("dischargePort", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.foreignPriceUSD}
          label="Foreign Price (USD)"
          name="foreignPriceUSD"
          type="number"
          onChange={(e) => {
            setFieldValue("foreignPriceUSD", e.target.value);
          }}
        />
      </div>
    </>
  );

  const bcicFormFieldForeignPart = (values, setFieldValue) => (
    <React.Fragment>
      <div className="col-lg-3">
        <InputField
          value={values?.commercialNo}
          label="Commercial No"
          name="commercialNo"
          type="text"
          onChange={(e) => {
            setFieldValue("commercialNo", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.commercialDate}
          label="Commercial Date"
          name="commercialDate"
          type="date"
          onChange={(e) => {
            setFieldValue("commercialDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.referenceNo}
          label="Reference No"
          name="referenceNo"
          type="text"
          onChange={(e) => {
            setFieldValue("referenceNo", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.referenceDate}
          label="Reference Date"
          name="referenceDate"
          type="date"
          onChange={(e) => {
            setFieldValue("referenceDate", e.target.value);
          }}
        />
      </div>
    </React.Fragment>
  );

  const bcicFormFieldLocalPart = (values, setFieldValue, errors, touched) => (
    <FieldArray
      name="localTransportations"
      render={(arrayHelpers) => (
        <>
          {values?.localTransportations?.map((localTransport, index) => {
            return (
              <React.Fragment key={index}>
                <div className="col-lg-3">
                  <NewSelect
                    name={`localTransportations[${index}].godownName`}
                    options={godownDDL || []}
                    value={values?.localTransportations[index].godownName}
                    label="Godowns"
                    onChange={(valueOption) => {
                      setFieldValue(
                        `localTransportations[${index}].godownName`,
                        valueOption
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                  <p className="text-danger">
                    <ErrorMessage
                      name={`localTransportations[${index}].godownName`}
                    />
                  </p>
                  {errors.localTransportations &&
                    typeof errors.localTransportations === "string" && (
                      <p className="text-danger">
                        {errors.localTransportations}
                      </p>
                    )}
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.localTransportations[index].quantity}
                    label="Quantity (Ton)"
                    name={`localTransportations[${index}].quantity`}
                    a
                    type="number"
                    onChange={(e) => {
                      setFieldValue(
                        `localTransportations[${index}].quantity`,
                        e.target.value
                      );
                    }}
                  />
                  <p className="text-danger">
                    <ErrorMessage
                      name={`localTransportations[${index}].quantity`}
                    />
                  </p>
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.localTransportations[index].price}
                    label="Price"
                    name={`localTransportations[${index}].price`}
                    type="number"
                    onChange={(e) => {
                      setFieldValue(
                        `localTransportations[${index}].price`,
                        e.target.value
                      );
                    }}
                  />
                  <p className="text-danger">
                    <ErrorMessage
                      name={`localTransportations[${index}].price`}
                    />
                  </p>
                </div>

                {values?.localTransportations.length > 1 ? (
                  <span
                    type="button"
                    className="px-2 py-1 ml-2 align-self-end rounded font-xl"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    <i
                      class="fa fa-trash text-danger"
                      style={{ fontSize: "16px" }}
                      aria-hidden="true"
                    ></i>
                  </span>
                ) : (
                  <></>
                )}
              </React.Fragment>
            );
          })}
          <span
            type="button"
            className="px-2 py-1 text-success ml-2 align-self-end rounded font-xl"
            onClick={() =>
              arrayHelpers.push({
                godownName: "",
                quantity: "",
                price: "",
                tenderHeaderId: 0,
                tenderRowId: 0,
              })
            }
          >
            <i
              class="fa fa-plus text-success"
              style={{ fontSize: "16px" }}
              aria-hidden="true"
            ></i>
          </span>
        </>
      )}
    ></FieldArray>
  );

  const editFormField = (values, setFieldValue) => (
    <React.Fragment>
      {tenderDetails?.header?.isAccept !== true && (
        <div className="col-lg-3 mt-5 d-flex align-items-center">
          <input
            type="checkbox"
            id="approveStatus"
            name="approveStatus"
            value={values?.approveStatus}
            checked={values?.approveStatus}
            onChange={(e) => {
              setFieldValue("approveStatus", e.target.checked);
            }}
          />
          <label htmlFor="approveStatus" className="pl-1">
            Approve
          </label>
        </div>
      )}
      <div className="col-lg-3 mt-3 d-flex align-items-center">
        <AttachmentUploaderNew
          CBAttachmentRes={(image) => {
            if (image.length > 0) {
              console.log(image);
              // onAttachmentUpload('/oms/OManagementReport/UpdateSalesInvoiceAttachment', )
              setFieldValue("attachment", image[0].id);
            }
          }}
          // showIcon
          // attachmentIcon='fa fa-paperclip'
          customStyle={{
            background: "transparent",
            padding: "4px 0",
          }}
          fileUploadLimits={1}
        />
      </div>
    </React.Fragment>
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={tenderId ? updateState(tenderDetails) : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          !tenderId && resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        errors,
        touched,
      }) => (
        <>
          {(getGodownDDLLoading || submitTenderLoading) && <Loading />}
          <IForm title="Tender Submission Create" getProps={setObjprops}>
            <Form>
              <pre>{JSON.stringify(values, null, 2)}</pre>
              <div className="form-group  global-form row">
                <div className="col-lg-12">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessPartner"
                      options={businessPartnerDDL}
                      value={values?.businessPartner}
                      label="Business Partner"
                      onChange={(valueOption) => {
                        setFieldValue("businessPartner", valueOption);
                        // {"value": 89497, "label": "BCIC"}
                        // fetch when initial bcic select in create page
                        getGodownDDLList(
                          valueOption,
                          accountId,
                          buUnId,
                          getGodownDDL,
                          updateGodownDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                <h4 className="mt-2">Foreign Part</h4>
                <div className="col-lg-12">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.enquiry}
                      label="Enquiry No"
                      name="enquiry"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("enquiry", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.submissionDate}
                      label="Submission Date"
                      name="submissionDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("submissionDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.foreignQnt}
                      label="Foreign Quantity"
                      name="foreignQnt"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("foreignQnt", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.uomname}
                      label="Unit"
                      name="uomname"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("uomname", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.productName}
                      label="Product Name"
                      name="productName"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("productName", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="loadPort"
                      options={loadPortDDL}
                      value={values?.loadPort}
                      label="Load Port"
                      onChange={(valueOption) => {
                        setFieldValue("loadPort", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="dischargePort"
                      options={dischargeDDL}
                      value={values?.dischargePort}
                      label="Discharge Port"
                      onChange={(valueOption) => {
                        setFieldValue("dischargePort", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.foreignPriceUSD}
                      label="Foreign Price (USD)"
                      name="foreignPriceUSD"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("foreignPriceUSD", e.target.value);
                      }}
                    />
                  </div>
                  {bcicFormFieldForeignPart(values, setFieldValue)}
                  {tenderId && editFormField(values, setFieldValue)}
                </div>

                {values?.businessPartner?.label === "BCIC" && (
                  <div className="col-lg-12 mt-2">
                    <h4>Local Transport</h4>
                    {bcicFormFieldLocalPart(values, setFieldValue)}
                  </div>
                )}
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
