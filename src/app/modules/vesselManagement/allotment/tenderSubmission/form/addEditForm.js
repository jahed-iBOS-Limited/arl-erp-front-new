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
  ErrorMessage,
  fetchMotherVesselLists,
  fetchTenderDetailsCallbackForPrintAndCreateEditPage,
  getDischargePortDDL,
  fetchGodownDDLList,
  GetLoadPortDDL,
  initData,
  selectPayload,
  selectUrl,
  updateState,
  createPageValidationSchema,
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
  // const [ghatDDL,setGhatDDL]=useState([])

  // Data fetch axios get
  const [
    godownDDL,
    getGodownDDL,
    getGodownDDLLoading,
    updateGodownDDL,
  ] = useAxiosGet();
  const [tenderDetails, getTenderDetails] = useAxiosGet();
  // ! remove ghat for requirement change
  // const [ghatDDL, getGhatDDL, getGhatDDLLoading] = useAxiosGet();
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet()

  // Data post/save axios post
  const [, submitTender, submitTenderLoading] = useAxiosPost();

  useEffect(() => {
    // Get load & discharge port ddl
    getDischargePortDDL(setDischargeDDL);
    GetLoadPortDDL(setLoadPortDDL);
    // Id tenderId  than this is edit mode
    if (tenderId && landingPageState) {
      // Fetch when edit mode active
      fetchTenderDetailsCallbackForPrintAndCreateEditPage(
        accountId,
        buUnId,
        { businessPartner: { label: landingPageState?.businessPartnerName } },
        tenderId,
        getTenderDetails
      );

      // fetch godown list for bcic
      fetchGodownDDLList(
        { value: landingPageState?.businessPartnerId },
        accountId,
        buUnId,
        getGodownDDL,
        updateGodownDDL
      );

      // ! remove ghat for requirement change
      // fetch ghat ddl for badc
      // fetchGhatDDL(accountId, buUnId, getGhatDDL);

      // fetch mother vessel for bcic
      if (landingPageState?.businessPartnerName === 'BCIC') {
        fetchMotherVesselLists(accountId, buUnId, landingPageState?.dischargePortId, getMotherVesselDDL)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    submitTender(
      selectUrl(values?.businessPartner?.label),
      selectPayload(values, { accountId, buUnId, buUnName, tenderId, userId }),
      cb,
      true
    );
  };

  const commonFormField = (values, setFieldValue, errors, touched) => (
    <>
      {values?.businessPartner?.label === "BCIC" && (
        <div className="col-lg-12 mt-2">
          <h4>Foreign Part</h4>
        </div>
      )}
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
      {/*<div className="col-lg-3">
        <InputField
          value={values?.uomname}
          label="Unit"
          name="uomname"
          type="text"
          onChange={(e) => {
            setFieldValue("uomname", e.target.value);
          }}
        />
      </div>*/}
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
    </>
  );

  const bcicFormFieldForeignPart = (values, setFieldValue, errors, touched) => (
    <>
      <div className="col-lg-3">
        <NewSelect
          name="dischargePort"
          options={dischargeDDL}
          value={values?.dischargePort}
          label="Discharge Port"
          onChange={(valueOption) => {
            setFieldValue("dischargePort", valueOption);
            fetchMotherVesselLists(accountId, buUnId, valueOption?.value, getMotherVesselDDL)
          }}
          errors={errors}
          touched={touched}
        />
      </div>
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
      {/*<div className="col-lg-3">
        <InputField
          value={values?.referenceDate}
          label="Reference Date"
          name="referenceDate"
          type="date"
          onChange={(e) => {
            setFieldValue("referenceDate", e.target.value);
          }}
        />
      </div> */}
    </>
  );

  const bcicFormFieldLocalPart = (values, setFieldValue, errors, touched) => (
    <div className="form-group  global-form row mt-2">
      <div className="col-lg-12">
        <h4>Local Transport</h4>
      </div>
      {values?.businessPartner?.label === "BCIC" && (
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
      )}
    </div>
  );

  const bcicEditFormField = (values, setFieldValue) => (
    <>
      <div className="col-lg-3">
        <NewSelect
          name="motherVessel"
          options={motherVesselDDL}
          value={values?.motherVessel}
          label="Mother Vessel"
          onChange={(valueOption) => {
            setFieldValue("motherVessel", valueOption);
          }}
          placeholder="Mother Vessel"
        />
      </div>
    </>
  )

  const commonEditFormField = (values, setFieldValue) => (
    <>
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

      <div className="col-lg-3 mt-3 d-flex align-items-center">
        <AttachmentUploaderNew
          CBAttachmentRes={(image) => {
            if (image.length > 0) {
              // console.log(image);

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
      {(tenderDetails?.header?.isAccept !== true || tenderDetails?.isAccept !== true) && (
        <div className="col-lg-1 mt-5 d-flex align-items-center">
          <input
            type="checkbox"
            id="isAccept"
            name="isAccept"
            value={values?.isAccept}
            checked={values?.isAccept}
            onChange={(e) => {
              setFieldValue("isAccept", e.target.checked);
            }}
            disabled={values?.isReject}
          />
          <label htmlFor="approveStatus" className="pl-1">
            Approve
          </label>
        </div>
      )}
      <div className="col-lg-1 mt-5 d-flex align-items-center">
        <input
          type="checkbox"
          id="isReject"
          name="isReject"
          value={values?.isReject}
          checked={values?.isReject}
          onChange={(e) => {
            setFieldValue("isReject", e.target.checked);
          }}
          disabled={values?.isAccept}
        />
        <label htmlFor="isReject" className="pl-1">
          Reject
        </label>
      </div>
    </>
  );

  const badcFormField = (values, setFieldValue, errors, touched) => (
    <>
      {/* <div className="col-lg-3">
        <NewSelect
          name="ghat1"
          options={ghatDDL}
          value={values?.ghat1}
          label="Discharge ghat (Chittagong)"
          onChange={(valueOption) => {
            setFieldValue("ghat1", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="ghat2"
          options={ghatDDL}
          value={values?.ghat2}
          label="Discharge ghat (Mongla)"
          onChange={(valueOption) => {
            setFieldValue("ghat2", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div> */}
      <div className="col-lg-3">
        <InputField
          value={values?.dueDate}
          label="Due Date"
          name="dueDate"
          type="date"
          onChange={(e) => {
            setFieldValue("dueDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.dueTime}
          label="Due Time"
          name="dueTime"
          type="time"
          onChange={(e) => {
            setFieldValue("dueTime", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.lotQty}
          label="Lot Qty"
          name="lotQty"
          type="text"
          onChange={(e) => {
            setFieldValue("lotQty", e.target.value);
          }}
        />
      </div>
      {/* <div className="col-lg-3">
        <InputField
          value={values?.dischargeRatio}
          label="Discharge Ratio"
          name="dischargeRatio"
          type="text"
          onChange={(e) => {
            setFieldValue("dischargeRatio", e.target.value);
          }}
        />
      </div> */}
      <div className="col-lg-3">
        <InputField
          value={values?.contractDate}
          label="Contract Date"
          name="contractDate"
          type="date"
          onChange={(e) => {
            setFieldValue("contractDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.layCan}
          label="Laycan"
          name="layCan"
          type="text"
          onChange={(e) => {
            setFieldValue("layCan", e.target.value);
          }}
        />
      </div>
      {/* <div className="col-lg-3">
        <InputField
          value={values?.pricePerQty}
          label="Price Per Qty"
          name="pricePerQty"
          type="number"
          onChange={(e) => {
            setFieldValue("pricePerQty", e.target.value);
          }}
        />
      </div> */}
    </>
  );

  const badcEditFormField = (values, setFieldValue) => (
    <div className="col-lg-3">
      <InputField
        value={values?.pricePerBag}
        label="Price Per Bag"
        name="pricePerBag"
        type="number"
        onChange={(e) => {
          setFieldValue("pricePerBag", e.target.value);
        }}
      />
    </div>
  )

  return (
    <Formik
      enableReinitialize={true}
      initialValues={tenderId ? updateState(tenderDetails) : initData}
      validationSchema={createPageValidationSchema}
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
          {(getGodownDDLLoading ||
            submitTenderLoading) && <Loading />}
          <IForm title="Tender Submission Create" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
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
                      fetchGodownDDLList(
                        valueOption,
                        accountId,
                        buUnId,
                        getGodownDDL,
                        updateGodownDDL
                      );
                      // ! remove ghat for requirement change
                      // fetch ghat ddl when badc select
                      // if (valueOption?.label === "BADC") {
                      //   fetchGhatDDL(accountId, buUnId, getGhatDDL);
                      // }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="form-group  global-form row">
                {commonFormField(values, setFieldValue, errors, touched)}

                {values?.businessPartner?.label === "BCIC" &&
                  bcicFormFieldForeignPart(
                    values,
                    setFieldValue,
                    errors,
                    touched
                  )}

                {values?.businessPartner?.label === "BADC" &&
                  badcFormField(values, setFieldValue, errors, touched)}

                {tenderId && values?.businessPartner?.label === 'BCIC' && bcicEditFormField(values, setFieldValue)}

                {tenderId && values?.businessPartner?.label === 'BADC' && badcEditFormField(values, setFieldValue)}

                {tenderId && commonEditFormField(values, setFieldValue)}

              </div>

              {values?.businessPartner?.label === "BCIC" &&
                bcicFormFieldLocalPart(values, setFieldValue, errors, touched)}

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
