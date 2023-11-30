import axios from "axios";
import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import {
  attachment_action,
  createUpdateEstimatePDA,
  getBankAc,
  getBuUnitDDL,
  getEstimatePDAById,
  getExpenseParticularsList,
  getSBUListDDLApi,
  getVesselDDL,
  getVoyageNoDDLApi,
} from "../helper";
import ViewInvoice from "../landing/viewInvoice";
import RowTable from "./rowTable";
const initData = {
  sbu: "",
  vesselName: "",
  voyageNo: "",
  workingPort: "",
  customerName: "",
  activity: "",
  currency: "",
  exchangeRate: "",
  attachment: "",
  accountNo: "",
  beneficiaryName: "",
  swiftCode: "",
};

const validationSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel Name is required"),
    value: Yup.string().required("Vessel Name is required"),
  }),
  workingPort: Yup.object().shape({
    label: Yup.string().required("Working Port is required"),
    value: Yup.string().required("Working Port is required"),
  }),
  // activity: Yup.string().required("Activity is required"),
  currency: Yup.object().shape({
    label: Yup.string().required("Currency is required"),
    value: Yup.string().required("Currency is required"),
  }),
  accountNo: Yup.object().shape({
    label: Yup.string().required("Account No is required"),
    value: Yup.string().required("Account No is required"),
  }),
  beneficiaryName: Yup.object().shape({
    label: Yup.string().required("Beneficiary Name is required"),
    value: Yup.string().required("Beneficiary Name is required"),
  }),
  swiftCode: Yup.string().required("Swift Code is required"),
});
const EstimatePDACreate = () => {
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [unitDDL, setUnitDDL] = useState([]);
  const [bankAcc, setBankAcc] = useState([]);
  const { editId } = useParams();
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [isViewModal, setViewModal] = React.useState(false);
  const [viewClickRowItem, setViewClickRowItem] = React.useState("");
  useEffect(() => {
    if (accId && buId) {
      getVesselDDL(accId, 0, setVesselDDL);
      getSBUListDDLApi(accId, buId, setSbuDDL);
      getVoyageNoDDLApi(accId, buId, setVoyageNoDDL);
      getBuUnitDDL(userId, accId, setUnitDDL);
      getBankAc(accId, buId, setBankAcc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const history = useHistory();
  const dispatch = useDispatch();

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${0}`
      )
      .then((res) => res?.data);
  };
  const saveHandler = (values, cb) => {
    const estimatedAmount = rowDto.reduce((acc, cur) => {
      return acc + (+cur?.estimatedAmount || 0);
    }, 0);

    const finalAmount = rowDto.reduce((acc, cur) => {
      return acc + (+cur?.customerFinalAmount || 0);
    }, 0);

    const actualAmount = rowDto?.reduce((acc, cur) => {
      return acc + (+cur?.actualAmount || 0);
    }, 0);

    const payload = {
      estimatePdaid: +editId || 0,
      sbuid: values?.sbu?.value || 0,
      sbuname: values?.sbu?.label || "",
      vesselid: values?.vesselName?.value || 0,
      vesselName: values?.vesselName?.label || "",
      voyageNo: values?.voyageNo?.label || "",
      workingPortId: values?.workingPort?.value || 0,
      workingPortName: values?.workingPort?.label || "",
      customerId: values?.customerName?.value || 0,
      customerName: values?.customerName?.label || "",
      activity: values?.activity || "",
      currency: values?.currency?.value || "",
      exchangeRate: +values?.exchangeRate || 0,
      attachmentsId: values?.attachment || "",
      estimatedAmount: estimatedAmount,
      finalAmount: finalAmount,
      actualAmount: actualAmount,
      isActive: true,
      actionBy: userId,
      accountId: accId,
      businessUnitId: buId,
      lastActionDateTime: new Date(),
      beneficiaryId: values?.beneficiaryName?.value || 0,
      beneficiaryName: values?.beneficiaryName?.label || "",
      bankAccountId: values?.accountNo?.value || 0,
      bankAccountNo: values?.accountNo?.label || "",
      swiftCode: values?.swiftCode || "",
      bankName: singleData?.bankName || "",
      accountName: singleData?.accountName || "",
      bankAddress: singleData?.bankAddress || "",
      bankAccNo: singleData?.bankAccNo || "",
      beneficiaryAddress: singleData?.beneficiaryAddress || "",
      arrivedDateTime: singleData?.arrivedDateTime || "",
      sailedDateTime: singleData?.sailedDateTime || "",

      shippingAgencyEstimatePdarowDtos: rowDto?.map((item) => {
        return {
          estimatePdarowId: item?.estimatePdarowId || 0,
          estimatePdaid: +editId || 0,
          expenseParticularsId: item?.expenseParticularsId || 0,
          category: item?.category || "",
          particularName: item?.particularName || "",
          estimatedAmount: +item?.estimatedAmount || 0,
          customerFinalAmount: +item?.customerFinalAmount || 0,
          actualAmount: +item?.actualAmount || 0,
          actionBy: userId,
          lastActionDateTime: new Date(),
          isPo: item?.isPo || false,
          podetails: {
            actualAmount: +item?.actualAmount || 0,
            poId: item?.poId || 0,
            poCode: item?.poCode || "",
            poType: item?.poType || "",
            isPo: item?.isPo || false,
            poTypeId: item?.poTypeId || 0,
          },
          estimatePDABillCreateDtos: item?.estimatePDABillCreateDtos?.map(
            (i) => {
              return {
                billId: i?.billId || 0,
                estimatePdarowId: item?.estimatePdarowId || 0,
                expenseParticularId: item?.expenseParticularsId || 0,
                billDate: i?.billDate || "",
                billType: i?.billType || "",
                amount: +i?.amount || 0,
                poPdFw: i?.poPdFw || "",
                poVat: i?.poVat || "",
                total: +i?.total || 0,
                status: i?.status || "",
                attachmentsId: i?.attachmentsId || "",
                isActive: true,
                actionBy: userId,
                lastActionDateTime: new Date(),
                vat: i?.vat || 0,
              };
            }
          ),
        };
      }),
    };
    setViewClickRowItem("");
    createUpdateEstimatePDA(payload, setLoading, (resData) => {
      cb();
      if (editId) {
        commonGetById();
      }
      setViewClickRowItem({
        estimatePdaid: resData?.estimatePdaId,
      });

      if (!editId) {
        history.push(
          `/ShippingAgency/Transaction/EstimatePDA/edit/${resData?.estimatePdaId}`
        );
      }
    });
  };

  useEffect(() => {
    if (editId) {
      commonGetById();
    } else {
      getExpenseParticularsList(setRowDto, setLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const formikRef = React.useRef(null);

  const commonGetById = async () => {
    setViewClickRowItem({
      estimatePdaid: editId,
    });
    getEstimatePDAById(editId, setLoading, (resData) => {
      if (formikRef.current) {
        setSingleData(resData);
        formikRef.current.setValues({
          sbu: resData?.sbuid
            ? { value: resData?.sbuid, label: resData?.sbuname }
            : "",
          vesselName: resData?.vesselid
            ? { value: resData?.vesselid, label: resData?.vesselName }
            : "",
          voyageNo: resData?.voyageNo
            ? { value: resData?.voyageNo, label: resData?.voyageNo }
            : "",
          workingPort: resData?.workingPortId
            ? { value: resData?.workingPortId, label: resData?.workingPortName }
            : "",
          customerName: resData?.customerId
            ? { value: resData?.customerId, label: resData?.customerName }
            : "",
          activity: resData?.activity || "",
          currency: resData?.currency
            ? { value: resData?.currency, label: resData?.currency }
            : "",
          exchangeRate: resData?.exchangeRate || "",
          attachment: resData?.attachmentsId || "",
          accountNo: resData?.bankAccountId
            ? { value: resData?.bankAccountId, label: resData?.bankAccountNo }
            : "",
          beneficiaryName: resData?.beneficiaryId
            ? { value: resData?.beneficiaryId, label: resData?.beneficiaryName }
            : "",
          swiftCode: resData?.swiftCode || "",
        });
        setRowDto(
          resData?.shippingAgencyEstimatePdarowDtos?.map((item) => {
            const poId = item?.poId || +item?.podetails?.poId || 0;
            const actualAmount =
              +item?.actualAmount || +item?.podetails?.actualAmount || 0;
            const poCode = item?.poCode || item?.podetails?.poCode || "";
            const poType = item?.poType || item?.podetails?.poType || "";
            const poTypeId = item?.poTypeId || item?.podetails?.poTypeId || 0;
            return {
              ...item,
              actualAmount,
              poId,
              poCode,
              poType,
              poTypeId,
              isPo: poId ? true : false,
            };
          }) || []
        );
      }
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        innerRef={formikRef}
        validationSchema={validationSchema}
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          values,
          setFieldValue,
          touched,
          errors,
          resetForm,
          handleSubmit,
          setValues,
        }) => (
          <>
            <ICustomCard
              title={`Estimate PDA ${editId ? "Edit" : "Create"}`}
              backHandler={() => {
                history.push("/ShippingAgency/Transaction/EstimatePDA");
              }}
              saveHandler={() => {
                handleSubmit();
              }}
              resetHandler={() => {
                resetForm(initData);
              }}
              renderProps={() => {
                return (
                  <>
                    {viewClickRowItem && (
                      <button
                        type='button'
                        className='btn btn-primary px-3 py-2 ml-2'
                        onClick={() => {
                          setViewModal(true);
                        }}
                      >
                        <i
                          className='mr-1 fa fa-print pointer'
                          aria-hidden='true'
                        ></i>
                        Print
                      </button>
                    )}

                    {editId && (
                      <button
                        type='button'
                        className='btn btn-primary px-3 py-2 ml-2'
                        onClick={() => {
                          setValues(initData);
                          setRowDto([]);
                          history.push(
                            `/ShippingAgency/Transaction/EstimatePDA/Create`
                          );
                        }}
                      >
                        Create
                      </button>
                    )}
                  </>
                );
              }}
            >
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    options={sbuDDL || []}
                    name='sbu'
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                    }}
                    placeholder='SBU'
                    value={values?.sbu}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.vesselName || ""}
                    options={vesselDDL || []}
                    name='vesselName'
                    placeholder='Vessel Name'
                    label='Vessel Name'
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.voyageNo || ""}
                    options={voyageNoDDL || []}
                    name='vesselName'
                    placeholder='Voyage No'
                    label='Voyage No'
                    onChange={(valueOption) => {
                      setFieldValue("voyageNo", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <div>
                    <label>Working Port</label>
                    <SearchAsyncSelect
                      selectedValue={values?.workingPort}
                      handleChange={(valueOption) => {
                        setFieldValue("workingPort", valueOption);
                      }}
                      placeholder='Search minimum 3 characters...'
                      loadOptions={(v) => {
                        if (v?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/Stakeholder/GetPortDDL?search=${v}`
                          )
                          .then((res) => res?.data);
                      }}
                    />
                    <FormikError
                      errors={errors}
                      name='workingPort'
                      touched={touched}
                    />
                  </div>
                </div>
                <div className='col-lg-3'>
                  <div>
                    <label>Customer Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.customerName}
                      handleChange={(valueOption) => {
                        setFieldValue("customerName", valueOption);
                      }}
                      placeholder='Search By Code Number'
                      loadOptions={loadCustomerList}
                    />
                  </div>
                </div>
                {/* <div className='col-lg-3'>
                  <InputField
                    value={values?.activity}
                    label='Activity'
                    name='activity'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("activity", e.target.value);
                    }}
                  />
                </div> */}
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.currency || ""}
                    options={[
                      { value: "BDT", label: "BDT" },
                      { value: "USD", label: "USD" },
                    ]}
                    name='currency'
                    placeholder='Currency'
                    label='Currency'
                    onChange={(valueOption) => {
                      setFieldValue("currency", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.currency?.value === "USD" && (
                  <>
                    <div className='col-lg-3'>
                      <label>Exchange Rate</label>
                      <InputField
                        value={values?.exchangeRate || ""}
                        name='exchangeRate'
                        placeholder='Exchange Rate'
                        onChange={(e) => {
                          setFieldValue("exchangeRate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        type='number'
                      />
                    </div>
                  </>
                )}
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.beneficiaryName || ""}
                    options={unitDDL || []}
                    name='beneficiaryName'
                    placeholder='Beneficiary Name'
                    label='Beneficiary Name'
                    onChange={(valueOption) => {
                      setFieldValue("beneficiaryName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>{" "}
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.accountNo || ""}
                    options={bankAcc || []}
                    name='accountNo'
                    placeholder='Account No'
                    label='Account No'
                    onChange={(valueOption) => {
                      setFieldValue("accountNo", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.swiftCode}
                    label='Swift Code'
                    placeholder='Swift Code'
                    name='swiftCode'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("swiftCode", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3 d-flex align-items-center'>
                  <div className=''>
                    <button
                      className='btn btn-primary mr-2 mt-3'
                      type='button'
                      onClick={() => setOpen(true)}
                      style={{ padding: "4px 5px" }}
                    >
                      Attachment
                    </button>
                  </div>

                  <div>
                    {values?.attachment && (
                      <button
                        className='btn btn-primary'
                        type='button'
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.attachment)
                          );
                        }}
                      >
                        Attachment View
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <RowTable rowDto={rowDto} setRowDto={setRowDto} editId={editId} />

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
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
                  attachment_action(fileObjects, setFieldValue, setLoading);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </ICustomCard>
          </>
        )}
      </Formik>

      {isViewModal && (
        <>
          <IViewModal
            show={isViewModal}
            onHide={() => {
              setViewModal(false);
            }}
          >
            <ViewInvoice estimatePdaid={viewClickRowItem?.estimatePdaid} />
          </IViewModal>
        </>
      )}
    </>
  );
};

export default EstimatePDACreate;
