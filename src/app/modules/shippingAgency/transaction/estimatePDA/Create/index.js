import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { attachment_action, getSBUListDDLApi, getVesselDDL } from "../helper";
import { useHistory } from "react-router-dom";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import RowTable from "./rowTable";
import { useReactToPrint } from "react-to-print";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const EstimatePDACreate = () => {
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [rowDto, setRowDto] = useState([1]);
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getVesselDDL(accId, buId, setVesselDDL);
      getSBUListDDLApi(accId, buId, setSbuDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const history = useHistory();
  const dispatch = useDispatch();
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title='Estimate PDA Create'
              backHandler={() => {
                history.goBack();
              }}
              renderProps={() => {
                return (
                  <>
                    <button
                      className='btn btn-primary ml-2'
                      type='button'
                      onClick={handlePrint}
                    >
                      Print
                    </button>
                  </>
                );
              }}
              saveHandler={() => {

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
                    options={[]}
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
                    options={[]}
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
                  <NewSelect
                    value={values?.customerName || ""}
                    options={[]}
                    name='customerName'
                    placeholder='Customer Name'
                    label='Customer Name'
                    onChange={(valueOption) => {
                      setFieldValue("customerName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
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
                    options={[]}
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
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.exchangeRate || ""}
                    options={[]}
                    name='exchangeRate'
                    placeholder='Exchange Rate'
                    label='Exchange Rate'
                    onChange={(valueOption) => {
                      setFieldValue("exchangeRate", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
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
