import axios from 'axios';
import { Form, Formik } from 'formik';
import React from 'react';
import { DropzoneDialogBase } from 'react-mui-dropzone';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import ICustomCard from '../../../../_helper/_customCard';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import NewSelect from '../../../../_helper/_select';
import { attachmentUpload } from '../../../../_helper/attachmentUpload';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelectMulti from '../../../../_helper/SearchAsyncSelectMulti';
const validationSchema = Yup.object().shape({
  startDateTime: Yup.string().required('Start Date is required'),
  endDateTime: Yup.string().required('End Date is required'),
  address: Yup.string().required('Location is required'),
  meetingType: Yup.object().shape({
    value: Yup.string().required('Meeting Type is required'),
    label: Yup.string().required('Meeting Type is required'),
  }),
  meetingWithName: Yup.string().required('Meeting With is required'),
  description: Yup.string().required('Description is required'),
  outcome: Yup.string().required('Outcome is required'),
  scheduleTypeName: Yup.object().shape({
    value: Yup.number().required('Schedule Type is required'),
    label: Yup.string().required('Schedule Type is required'),
  }),
  followUpDate: Yup.string().required('Follow Up Date is required'),
});
export default function MeetingTab({ data }) {
  const formikRef = React.useRef(null);
  const dispatch = useDispatch();

  const {
    profileData: { userId },
    selectedBusinessUnit,
  } = useSelector((state) => state?.authData || {}, shallowEqual);

  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);
  const [scheduleTypeDDL, getScheduleTypeDDL] = useAxiosGet();
  const [, SaveCustomerFollowUpActivity, isLoading] = useAxiosPost();

  const saveHandler = (values, cb) => {
    const payload = {
      followUpActivityId: 0,
      businessUnitId: selectedBusinessUnit?.value,
      customerAcquisitionId: data?.customerAcquisitionId || 0,
      stageName: data?.currentStage || '',

      activityTypeId: 3,
      activityTypeName: 'Meeting',

      //   activityDateTime: values?.activityDateTime || new Date(),

      meetingType: values?.meetingType?.label || '',

      meetingWithId: 0,
      meetingWithName: values?.meetingWithName || '',

      invitedAttendees:
        values?.invitedAttendees?.length > 0
          ? values?.invitedAttendees?.map((item) => item?.label).join()
          : '',
      invitedAttendeesId:
        values?.invitedAttendees?.length > 0
          ? values?.invitedAttendees?.map((item) => item?.value).join()
          : '',
      address: values?.address || '',

      startDateTime: values?.startDateTime || new Date(),
      endDateTime: values?.endDateTime || new Date(),

      description: values?.description || '',
      outcome: values?.outcome || '',

      attachment: values?.documentFileId || '',
      actionBy: userId || 0,

      scheduleTypeId: values?.scheduleTypeName?.value || 0,
      scheduleTypeName: values?.scheduleTypeName?.label || '',

      followUpDate: values?.followUpDate || new Date(),

      followUpMeetingType: values?.meetingType?.label || '',
      followUpAddress: values?.followUpAddress || '',
    };
    SaveCustomerFollowUpActivity(
      '/oms/SalesQuotation/CreateCustomerFollowUpActivity',
      payload,
      () => {
        if (cb) {
          cb();
        }
      },
      'save'
    );
  };
  const invitedAttendeesDDL = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=1&BusinessUnitId=${selectedBusinessUnit?.value}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };
  // get all ddl
  React.useEffect(() => {
    getScheduleTypeDDL(`/oms/SalesQuotation/GetFollowUpActivityTypeDDL`);
  }, []);
  return (
    <ICustomCard
      title={'Meeting'}
      saveHandler={(values) => {
        formikRef.current.submitForm();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      {isLoading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          startDateTime: '',
          endDateTime: '',
          address: '',
          meetingType: '',
          meetingWithName: '',
          description: '',
          outcome: '',
          scheduleTypeName: '',
          followUpDate: '',
          followUpAddress: '',
          invitedAttendees: '',
          attachment: '',
          documentFileId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {/* <h1>{JSON.stringify(errors)}</h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '10px',
                }}
              >
                <div className="form-group row global-form">
                  {/*  Start Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Start Date & Time"
                      type="datetime-local"
                      name="startDateTime"
                      value={values?.startDateTime}
                      onChange={(e) => {
                        setFieldValue('startDateTime', e.target.value);
                      }}
                      placeholder="Start Date"
                    />
                  </div>
                  {/* End Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="End Date & Time"
                      type="datetime-local"
                      name="endDateTime"
                      value={values?.endDateTime}
                      placeholder="End Date"
                      onChange={(e) => {
                        setFieldValue('endDateTime', e.target.value);
                      }}
                    />
                  </div>
                  {/* Location */}
                  <div className="col-lg-3">
                    <InputField
                      label="Location"
                      name="address"
                      value={values?.address}
                      placeholder="Location"
                      onChange={(e) => {
                        setFieldValue('address', e.target.value);
                      }}
                    />
                  </div>

                  {/* Meeting Type */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={'Meeting Type'}
                      options={[
                        {
                          value: '1',
                          label: 'Online',
                        },
                        {
                          value: '2',
                          label: 'Physical',
                        },
                      ]}
                      value={values?.meetingType}
                      name="meetingType"
                      onChange={(valueOption) => {
                        setFieldValue('meetingType', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Meeting With */}
                  <div className="col-lg-3">
                    <InputField
                      label="Meeting With"
                      name="meetingWithName"
                      value={values?.meetingWithName}
                      placeholder="Meeting With"
                      onChange={(e) => {
                        setFieldValue('meetingWithName', e.target.value);
                      }}
                    />
                  </div>
                  {/* Invited Attendees */}
                  <div className="col-lg-3">
                    <label>Invited Attendees</label>
                    <SearchAsyncSelectMulti
                      selectedValue={values?.invitedAttendees}
                      isSearchIcon={true}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('invitedAttendees', valueOption);
                        } else {
                          setFieldValue('invitedAttendees', []);
                        }
                      }}
                      loadOptions={invitedAttendeesDDL}
                      placeholder="Search (min 2 letter)"
                    />
                  </div>
                  {/* Description */}
                  <div className="col-lg-3">
                    <InputField
                      label="Description"
                      name="description"
                      value={values?.description}
                      placeholder="Description"
                      onChange={(e) => {
                        setFieldValue('description', e.target.value);
                      }}
                    />
                  </div>
                  {/* Outcome */}
                  <div className="col-lg-3">
                    <InputField
                      label="Outcome"
                      name="outcome"
                      value={values?.outcome}
                      placeholder="Outcome"
                      onChange={(e) => {
                        setFieldValue('outcome', e.target.value);
                      }}
                    />
                  </div>
                  {/* scheduleType */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={'Schedule Type'}
                      options={scheduleTypeDDL || []}
                      value={values?.scheduleTypeName}
                      name="scheduleTypeName"
                      onChange={(valueOption) => {
                        setFieldValue('scheduleTypeName', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Follow Up Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Follow Up Date & Time"
                      type="datetime-local"
                      name="followUpDate"
                      value={values?.followUpDate}
                      onChange={(e) => {
                        setFieldValue('followUpDate', e.target.value);
                      }}
                    />
                  </div>
                  {/*  Address */}
                  <div className="col-lg-3">
                    <InputField
                      label="Address"
                      name="followUpAddress"
                      value={values?.followUpAddress}
                      placeholder="Address"
                      onChange={(e) => {
                        setFieldValue('followUpAddress', e.target.value);
                      }}
                    />
                  </div>

                  {/* Attachment */}
                  <div className="col-lg-6 mt-5">
                    <button
                      className="btn btn-primary mr-2 "
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Attachment
                    </button>
                    {values?.documentFileId && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.documentFileId)
                          );
                        }}
                      >
                        Attachment View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Form>
            <DropzoneDialogBase
              filesLimit={1}
              acceptedFiles={['image/*', 'application/pdf']}
              fileObjects={fileObjects}
              cancelButtonText={'cancel'}
              submitButtonText={'submit'}
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
                attachmentUpload(fileObjects).then((data) => {
                  const documentFileId = data?.[0]?.id;
                  setFieldValue('documentFileId', documentFileId || '');
                });
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
