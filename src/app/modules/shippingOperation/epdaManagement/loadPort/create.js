import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../App';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import AttachmentUploaderNew from '../../../_helper/attachmentUploaderNew';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import EmailEditorForPublicRoutes from '../../utils/emailEditorForPublicRotes';
import { generateFileUrl } from '../../utils/helper';

const initData = {
  strName: '',
  strEmail: '',
  strEmailAddress: '',
  strAttachmentForPort: '',
  strAttachmentForPortDisbursment: '',
  strVesselNominationCode: '',
  numGrandTotalAmount: 0,
};
export default function EDPALoadPortCreate() {
  const {
    profileData: { userId, accountId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const { paramId, paramCode } = useParams();
  const [isShowModal, setIsShowModal] = useState(false);
  const [payloadInfo, setPayloadInfo] = useState(null);
  const [
    vesselNominationData,
    getVesselNominationData,
    loading,
  ] = useAxiosGet();

  const [, onSave, loader] = useAxiosPost();

  useEffect(() => {
    if (paramId) {
      getVesselNominationData(
        `${imarineBaseUrl}/domain/VesselNomination/GetByIdVesselNomination?VesselNominationId=${paramId}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const saveHandler = (values, cb) => {
    setPayloadInfo({
      // strName: values?.strName,
      // strEmail: values?.strEmail,
      strAttachmentForPort: generateFileUrl(values?.strAttachmentForPort),
      strAttachmentForPortDisbursment: generateFileUrl(
        values?.strAttachmentForPortDisbursment,
      ),
      // intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || '',
      numGrandTotalAmount: values?.numGrandTotalAmount,
    });

    const payload = {
      strName: values?.strName,
      strEmail: values?.strEmail,
      intEpdaAndPortInfoId: 0,
      intAccountId: accountId,
      intBusinessUnitId: 0,
      strBusinessUnitName: '',
      strEmailAddress: '',
      strAttachmentForPort: values?.strAttachmentForPort,
      strAttachmentForPortDisbursment: values?.strAttachmentForPortDisbursment,
      intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || '',
      numGrandTotalAmount: values?.numGrandTotalAmount,
      isActive: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateEpdaAndPortInfo`,
      payload,
      cb,
      true,
    );
  };

  const validationSchema = Yup.object().shape({
    strVesselNominationCode: Yup.string().required('Code is required'),
    strName: Yup.string().required('Name is required'),
    strEmail: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        strVesselNominationCode: paramCode || '',
        strNameOfVessel: vesselNominationData?.strNameOfVessel || '',
        intVoyageNo: vesselNominationData?.intVoyageNo || '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setIsShowModal(true);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loader || loading) && <Loading />}
          <IForm
            title={`Create EDPA Load Port Info `}
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    disabled={!payloadInfo}
                    className="btn btn-primary mr-3"
                    onClick={() => {
                      setIsShowModal(true);
                    }}
                  >
                    Send Mail
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-2">
                  <InputField
                    value={values.strName || ''}
                    label="Name"
                    name="strName"
                    type="text"
                    onChange={(e) => setFieldValue('strName', e.target.value)}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.strEmail || ''}
                    label="Email"
                    name="strEmail"
                    type="text"
                    onChange={(e) => setFieldValue('strEmail', e.target.value)}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.strNameOfVessel}
                    label="Name Of Vessel"
                    name="strNameOfVessel"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('strNameOfVessel', e.target.value)
                    }
                    errors={errors}
                    disabled
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intVoyageNo}
                    label="Voyage No"
                    name="intVoyageNo"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('intVoyageNo', e.target.value)
                    }
                    errors={errors}
                    disabled
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.strVesselNominationCode}
                    label="Please copy code from email subject"
                    name="strVesselNominationCode"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('strVesselNominationCode', e.target.value)
                    }
                    disabled
                  />
                </div>

                {/* Land Quantity (Decimal) */}
                <div className="col-lg-2">
                  <InputField
                    value={values.numGrandTotalAmount}
                    label="Grand Total"
                    name="numGrandTotalAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('numGrandTotalAmount', e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-2 ">
                  <label htmlFor="">Attachment For Port</label>
                  <div className="">
                    <AttachmentUploaderNew
                      isForPublicRoute={true}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'black',
                      }}
                      isExistAttachment={values?.strAttachmentForPort}
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          setFieldValue(
                            'strAttachmentForPort',
                            attachmentData?.[0]?.id,
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-2 " style={{ marginLeft: '-20px' }}>
                  <label htmlFor="">Attachment For Port Disbursment</label>
                  <div className="">
                    <AttachmentUploaderNew
                      isForPublicRoute={true}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'black',
                      }}
                      isExistAttachment={
                        values?.strAttachmentForPortDisbursment
                      }
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          setFieldValue(
                            'strAttachmentForPortDisbursment',
                            attachmentData?.[0]?.id,
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title={'Send Mail'}
                >
                  {/* <MailSender payloadInfo={payloadInfo} /> */}
                  <EmailEditorForPublicRoutes
                    payloadInfo={payloadInfo}
                    cb={() => {
                      setIsShowModal(false);
                    }}
                  />
                </IViewModal>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
