import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import {
  GetDomesticPortDDL,
  attachment_action,
  createUpdateEstimatePDA,
  getEstimatePDAById,
  getExpenseParticularsList,
  getSBUListDDLApi,
  getVesselDDL,
  getVoyageNoDDLApi,
} from "../helper";
import RowTable from "./rowTable";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { useParams } from "react-router";
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
  // voyageNo: Yup.object().shape({
  //   label: Yup.string().required("Voyage No is required"),
  //   value: Yup.string().required("Voyage No is required"),
  // }),
  workingPort: Yup.object().shape({
    label: Yup.string().required("Working Port is required"),
    value: Yup.string().required("Working Port is required"),
  }),
  customerName: Yup.object().shape({
    label: Yup.string().required("Customer Name is required"),
    value: Yup.string().required("Customer Name is required"),
  }),
  activity: Yup.string().required("Activity is required"),
  currency: Yup.object().shape({
    label: Yup.string().required("Currency is required"),
    value: Yup.string().required("Currency is required"),
  }),
});
const EstimatePDACreate = () => {
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const { editId } = useParams();
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getVesselDDL(accId, buId, setVesselDDL);
      getSBUListDDLApi(accId, buId, setSbuDDL);
      getVoyageNoDDLApi(accId, buId, setVoyageNoDDL);
      GetDomesticPortDDL(setDomesticPortDDL);
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
      customerId: 1,
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
                vat: i?.vat || "",
              };
            }
          ),
        };
      }),
    };

    createUpdateEstimatePDA(payload, setLoading, () => {
      cb();
      if (editId) {
        commonGetById();
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
    getEstimatePDAById(editId, setLoading, (resData) => {
      if (formikRef.current) {
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
        });
        setRowDto(resData?.shippingAgencyEstimatePdarowDtos || []);
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
        }) => (
          <>
            <ICustomCard
              title='Estimate PDA Create'
              backHandler={() => {
                history.goBack();
              }}
              saveHandler={() => {
                handleSubmit();
              }}
              resetHandler={() => {
                resetForm(initData);
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
                  <NewSelect
                    value={values?.workingPort || ""}
                    options={domesticPortDDL || []}
                    name='workingPort'
                    placeholder='Working Port'
                    label='Working Port'
                    onChange={(valueOption) => {
                      setFieldValue("workingPort", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
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
                <div className='col-lg-3'>
                  <InputField
                    value={values?.activity}
                    label='Activity'
                    name='activity'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("activity", e.target.value);
                    }}
                  />
                </div>
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

              <RowTable rowDto={rowDto} setRowDto={setRowDto} />

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
    </>
  );
};

export default EstimatePDACreate;
