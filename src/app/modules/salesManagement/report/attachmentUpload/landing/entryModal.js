/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { empAttachment_action } from "../../../../inventoryManagement/warehouseManagement/invTransaction/helper";
import { shallowEqual, useSelector } from "react-redux";
import { attachmentUploadEntry, getItemList, getSalesOrgList } from "../helper";
import { toast } from "react-toastify";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { getDistributionChannelDDL } from "../../customerCreditLimit/helper";
import axios from "axios";
import { _todayDate } from "../../../../_helper/_todayDate";
import AttachmentListTable from "../attachmentListsTable";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  date: _todayDate(),
  type: "",
  channel: "",
  customer: "",
  partyName: "",
  castingDate: "",
  testReportDate: "",
  salesOrg: "",
  item: "",
  deliveryQty: "",
  reason: ""
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  type: Yup.object().shape({
    value: Yup.string().required("Type is required"),
    label: Yup.string().required("Type is required"),
  }),
});

export default function AttachmentUploadForm({
  value,
  setShow,
  getLandingData,
  reportType
}) {
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [channelList, setChannelList] = useState([]);
  const [channelId, setChannelId] = useState(0);
  const [salesOrgList, setSalesOrgList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [attachmentLists, setAttachmentLists] = useState([])
  // const [selectedRow, setSelectedRow] = useState([])
  const [, onSelectedRowPost, seletedRowPostLoading] = useAxiosPost()


  useEffect(() => {
    getDistributionChannelDDL(accId, buId, setChannelList);
    getSalesOrgList(accId, buId, setSalesOrgList, setLoading);
  }, []);

  const saveHandler = (values) => {
    if (uploadedFiles?.length < 1) {
      return toast.warn("Please upload a file");
    }
    const payload = {
      head: {
        dteAttatchmentDate: values?.date,
        intMonthId: new Date(values?.date).getMonth() + 1,
        intYearId: new Date(values?.date).getFullYear(),
        intTypeId: values?.type?.value,
        strTypeName: values?.type?.label,
        intAccountId: accId,
        intBusinessUnitId: buId,
        isActive: true,
        intAttachmentTypeId:
          uploadedFiles[0]?.fileName?.slice(-4) === ".pdf" ? 1 : 2,
        strAttachmentTypeName:
          uploadedFiles[0]?.fileName?.slice(-4) === ".pdf" ? "pdf" : "img",
        intBusinessPartnerId: values?.partyName?.value,
        strBusinessPartnerName: values?.partyName?.label,
        dteCastingDate: values?.castingDate,
        dteTestReportDate: values?.testReportDate,
        intItemId: values?.item?.value,
        strItemName: values?.item?.label,
        numDeliveryQty: values?.deliveryQty,
        intActionBy: userId,
      },
      row: {
        strAttatchment: uploadedFiles[0]?.id,
      },
    };

    attachmentUploadEntry(payload, setLoading, () => {
      getLandingData(value);
      setShow(false);
    });
  };

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`
      )
      .then((res) => res?.data);
  };

  const handleSetAttachment = (values, setFieldValue,) => {
    const newAttachmentPayload = {
      "id": 0,
      "accountId": accId,
      "businessUnitId": buId,
      "channelId": values?.channel?.value,
      "channelName": values?.channel?.label,
      "businessPartnerId": values?.customer?.value,
      "businessPartnerName": values?.customer?.label,
      "attachmentTypeId": values?.type?.value,
      "actionBy": userId,
      "reason": values?.reason,
      "attachment": "",
      "monthId": new Date(values?.date).getMonth() + 1,
      "yearId": new Date(values?.date).getFullYear(),
      "attachmentType": values?.type?.label,
      "isSelected": false
    }

    if (attachmentLists.length === 0) {
      setAttachmentLists((prevAttachementLists) => {
        return [...prevAttachementLists, newAttachmentPayload]
      })
    } else {
      const m = attachmentLists.filter(i => i?.businessPartnerId === +values?.customer?.value)
      if (m?.length < 1) {
        setAttachmentLists((prevAttachementLists) => {
          return [...prevAttachementLists, newAttachmentPayload]
        })
      }
    }
    setFieldValue('channel', '')
    setFieldValue('customer', '')
    setFieldValue('reason', '')
  }


  return (
    <>
      {(loading || seletedRowPostLoading) && <Loading />}
      <Formik
        validationSchema={validationSchema}
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <div className="d-flex justify-content-between mt-2">
              <h3>Attachment</h3>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  if (attachmentLists?.filter(item => item.isSelected === true && item.attachment.length > 0)) {
                    onSelectedRowPost(`/partner/BusinessPartnerBasicInfo/CreateBusinessPartnerPolicy`, attachmentLists, () => { }, true)
                  }
                }}
                disabled={loading}
              >
                Done
              </button>
            </div>
            <form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    value={values?.type}
                    name="type"
                    options={reportType}
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                    }}
                    placeholder="Select One"
                    errors={errors}
                    touched={touched}
                    label="Type"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    name="date"
                    type="date"
                    touched={touched}
                    label="Date"
                  />
                </div>
                <div>

                </div>
                {
                  values?.type?.value === 3 && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="channel"
                          options={channelList}
                          value={values?.channel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channel", valueOption);
                            setChannelId(valueOption?.value);
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Customer</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customer}
                          handleChange={(valueOption) => {
                            setFieldValue("customer", valueOption);
                          }}
                          isDisabled={!values?.channel}
                          placeholder="Search Customer"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3 || !searchValue) return [];
                            return axios
                              .get(
                                `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.reason}
                          label="Reason"
                          name="reason"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("reason", e.target.value);
                          }}
                        />
                      </div>
                    </>
                  )
                }
                {values?.type?.value === 1 && buId === 175 && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="channel"
                        options={channelList}
                        value={values?.channel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("channel", valueOption);
                          setChannelId(valueOption?.value);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Party Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.partyName}
                        handleChange={(valueOption) => {
                          setFieldValue("partyName", valueOption);
                        }}
                        placeholder="Search by Party Name"
                        loadOptions={loadCustomerList}
                        disabled={!values?.channel}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.castingDate}
                        name="castingDate"
                        type="date"
                        touched={touched}
                        label="Casting Date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.testReportDate}
                        name="testReportDate"
                        type="date"
                        touched={touched}
                        label="Test Report Date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesOrg"
                        options={salesOrgList || []}
                        value={values?.salesOrg}
                        label="Sales Organization"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrg", valueOption);
                          getItemList(
                            accId,
                            buId,
                            values?.channel?.value,
                            valueOption?.value,
                            setItemList,
                            setLoading
                          );
                        }}
                        placeholder="Sales Organization"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.channel}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemList || []}
                        value={values?.item}
                        label="PSI"
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        placeholder="PSI"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.salesOrg}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.deliveryQty}
                        name="deliveryQty"
                        type="number"
                        touched={touched}
                        label="Delivery Qty"
                        placeholder="Delivery Qty"
                      />
                    </div>
                  </>
                )}
                {
                  (values?.type?.value === 1 || values?.type?.value === 2) && (
                    <div className="col-lg-3 mt-5">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                    </div>
                  )
                }
                {values?.channel && values?.customer && values?.type?.value === 3 &&
                  <div className="col-lg-3 mt-5">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSetAttachment(values, setFieldValue)}
                    >
                      Add
                    </button>
                  </div>
                }
                {loading && <Loading />}
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
                    setLoading(true);
                    empAttachment_action(fileObjects, setUploadedFiles).then(
                      (data) => {
                        if (data?.length) {
                          setOpen(false);
                          toast.success("Uploaded Successfully!");
                          setLoading(false);
                        }
                      }
                    );
                  }}
                  showPreviews={true}
                  showFileNamesInPreview={true}
                />
              </div>
            </form>

            {values?.type?.value === 3 && (<AttachmentListTable
              attachmentLists={attachmentLists}
              setAttachmentLists={setAttachmentLists}
            // selectedRow={selectedRow}
            // setSelectedRow={setSelectedRow}
            />)}
          </>
        )}
      </Formik>
    </>
  );
}
