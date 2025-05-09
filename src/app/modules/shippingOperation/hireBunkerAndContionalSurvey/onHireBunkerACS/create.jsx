import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
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
  strVesselNominationCode: '',
  numBunkerSurveyAmount: '',
  numBunkerAndConditionSurveyAmount: '',
  strAttachment: '',
  strRemarks: '',
};

export default function CreateonHireBunkerAndContionalSurvey() {
  const {
    profileData: { userId, accountId },
  } = useSelector((state) => state.authData, shallowEqual);
  const { paramId, paramCode } = useParams();

  const [attachment, setAttachment] = useState('');
  const [, onSave, loader] = useAxiosPost();
  const [isShowModal, setIsShowModal] = useState(false);
  const [payloadInfo, setPayloadInfo] = useState(null);
  const [vesselNominationData, getVesselNominationData, loading] =
    useAxiosGet();

  useEffect(() => {
    if (paramId) {
      getVesselNominationData(
        `${imarineBaseUrl}/domain/VesselNomination/GetByIdVesselNomination?VesselNominationId=${paramId}`
      );
    }
  }, [paramId]);

  const saveHandler = (values, cb) => {
    setPayloadInfo({
      strVesselNominationCode:
        paramCode || values.strVesselNominationCode || '',
      numBunkerSurveyAmount: values.numBunkerSurveyAmount,
      numBunkerAndConditionSurveyAmount:
        values.numBunkerAndConditionSurveyAmount,
      strAttachment: generateFileUrl(attachment),
    });

    const payload = {
      strName: values?.strName,
      strEmail: values?.strEmail,
      intRfqonHireBunkerQtyId: 0,
      intAccountId: accountId,
      intBusinessUnitId: 0,
      strBusinessUnitName: '',
      strEmailAddress: values.strEmailAddress,
      intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values.strVesselNominationCode || '',
      numBunkerSurveyAmount: values.numBunkerSurveyAmount,
      numBunkerAndConditionSurveyAmount:
        values.numBunkerAndConditionSurveyAmount,
      strAttachment: attachment || '',
      isActive: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateRfqonHireBunkerQty`,
      payload,
      cb,
      true
    );
  };

  const validationSchema = Yup.object().shape({
    strVesselNominationCode: Yup.string().required('Code is required'),
    numBunkerSurveyAmount: Yup.number().required(
      'Bunker Survey Amount is required'
    ),
    numBunkerAndConditionSurveyAmount: Yup.number().required(
      'Bunker + Condition Survey Amount is required'
    ),
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
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setIsShowModal(true);
        });
      }}
    >
      {({
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        resetForm,
      }) => (
        <>
          {(loader || loading) && <Loading />}
          <IForm
            title="Create On Hire Bunker and Condition Survey"
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
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values.strName || ''}
                    label="Name"
                    name="strName"
                    type="text"
                    onChange={(e) => setFieldValue('strName', e.target.value)}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values.strEmail || ''}
                    label="Email"
                    name="strEmail"
                    type="text"
                    onChange={(e) => setFieldValue('strEmail', e.target.value)}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
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
                <div className="col-lg-3">
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
                <div className="col-lg-3">
                  <InputField
                    value={values.strVesselNominationCode}
                    label="Please copy code from email subject"
                    name="strVesselNominationCode"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('strVesselNominationCode', e.target.value)
                    }
                    errors={errors}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values.numBunkerSurveyAmount}
                    label="Bunker Survey Amount"
                    name="numBunkerSurveyAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('numBunkerSurveyAmount', e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values.numBunkerAndConditionSurveyAmount}
                    label="Bunker + Condition Survey Amount"
                    name="numBunkerAndConditionSurveyAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue(
                        'numBunkerAndConditionSurveyAmount',
                        e.target.value
                      )
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values.strRemarks}
                    label="Remarks"
                    name="strRemarks"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('strRemarks', e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <AttachmentUploaderNew
                    isForPublicRoute={true}
                    isExistAttachment={values?.strAttachment}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData[0]?.id);
                        setFieldValue('strAttachment', attachmentData[0]?.id);
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title={'Send Mail'}
                >
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
