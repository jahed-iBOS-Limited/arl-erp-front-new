import axios from 'axios';
import { Formik } from 'formik';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import TextArea from '../../../../_helper/TextArea';
import ICustomCard from '../../../../_helper/_customCard';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import FormikError from '../../../../_helper/_formikError';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import { _todayDate } from '../../../../_helper/_todayDate';
import {
  allowDelegationMenuPermission,
  attachment_action,
  attachment_actionTwo,
  checkDelegationMenuPermission,
  delegateComplainApi,
  getComplainByIdWidthOutModify,
} from '../helper';
export const validationSchema = Yup.object().shape({
  delegateDate: Yup.date().required('Delegate Date is required'),
  delegateTo: Yup.string().required('Delegate To is required'),
});
const initialValues = {
  delegateDate: _todayDate(),
  delegateTo: '',
  remarks: '',
  delegateTime: moment().format('HH:mm'),
  investigationPerson: '',
  investigationDueDate: '',
  attachmentRow: '',
};
function DelegateForm({ clickRowData, landingCB }) {
  const [open, setOpen] = useState(false);
  const [singleData, setSingleData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [fileObjectsRow, setFileObjectsRow] = useState([]);
  const [openRow, setOpenRow] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [isPermitted, setIsPermitted] = useState(true);
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const dispatch = useDispatch();
  console.log({ isPermitted });
  const loadEmpList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${accId}&BusinessUnitId=0&searchTearm=${v}`,
      )
      .then((res) => {
        return res?.data?.map((itm) => ({
          value: itm?.value,
          label: `${itm?.level} [${itm?.employeeCode}]`,
        }));
      })
      .catch((err) => []);
  };

  const saveHandler = (values, cb) => {
    let delegateDateTime = moment(
      `${values?.delegateDate} ${values?.delegateTime}`,
    ).format('YYYY-MM-DDTHH:mm:ss');

    const payload = {
      complainId: singleData?.complainId || 0,
      statusRemarks: values?.remarks || '',
      delegateToId: values?.delegateTo?.value || 0,
      statusId: rowDto?.length === 0 ? 1 : 2,
      status: rowDto?.length === 0 ? 'Delegate' : 'Investigate',
      delegateDateTime: delegateDateTime,
      actionById: userId,
      investigationList: rowDto || [],
    };
    delegateComplainApi(payload, setLoading, () => {
      cb();
      landingCB();
    });
  };
  const formikRef = React.useRef(null);
  useEffect(() => {
    if (clickRowData?.complainId) {
      const id = clickRowData?.complainId;
      getComplainByIdWidthOutModify(id, accId, buId, setLoading, (resData) => {
        setSingleData(resData);
        if (formikRef.current) {
          formikRef.current.setFieldValue(
            'remarks',
            resData?.statusRemarks || '',
          );
          formikRef.current.setFieldValue(
            'delegateTo',
            resData?.delegateToId
              ? {
                  value: resData?.delegateToId,
                  label: resData?.delegateToName,
                }
              : '',
          );
          formikRef.current.setFieldValue(
            'delegateDate',
            resData?.delegateDateTime
              ? moment(resData?.delegateDateTime).format('YYYY-MM-DD')
              : _todayDate(),
          );
          formikRef.current.setFieldValue(
            'delegateTime',
            resData?.delegateDateTime
              ? moment(resData?.delegateDateTime).format('HH:mm')
              : moment().format('HH:mm'),
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowData]);
  return (
    <>
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
        }) => (
          <ICustomCard
            title={' Delegate '}
            saveHandler={() => {
              handleSubmit();
            }}
            resetHandler={() => {
              resetForm();
            }}
          >
            {loading && <Loading />}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p>
                  <b>Issue Id:</b> {singleData?.complainNo}
                </p>
                <p>
                  <b>Issue Type:</b> {singleData?.complainCategoryName}
                </p>
                <p>
                  <b>Sub Issue Type:</b> {singleData?.complainSubCategoryName}
                </p>
                <p>
                  <b>Occurrence Date Time: </b>{' '}
                  {singleData?.requestDateTime &&
                    moment(singleData?.requestDateTime).format(
                      'YYYY-MM-DD',
                    )}{' '}
                  {singleData?.occurrenceTime &&
                    moment(singleData?.occurrenceTime, 'HH:mm:ss').format(
                      'hh:mm A',
                    )}
                </p>

                <p>
                  <b>Issue Details:</b> {singleData?.description}
                </p>
                <p>
                  <b>Respondent Type:</b> {singleData?.respondentTypeName}
                </p>
                <p>
                  <b>Respondent Name:</b> {singleData?.respondentType}
                </p>
                <p>
                  <b>Respondent Contact:</b> {singleData?.contactNo}
                </p>
                <p>
                  <b>Business Unit:</b>{' '}
                  {singleData?.respondentBusinessUnitIdName}
                </p>
                <p>
                  <b>Create By: </b> {singleData?.actionByName}
                </p>
                <p>
                  <b>Customer Name : </b> {singleData?.sourceCustomerType}
                </p>
              </div>
              <div>
                <p>
                  <b>Create Date: </b>{' '}
                  {singleData?.lastActionDateTime &&
                    moment(singleData?.lastActionDateTime).format(
                      'YYYY-MM-DD hh:mm A',
                    )}
                </p>
                <p>
                  <b>Distribution Channel:</b>{' '}
                  {singleData?.distributionChannelName}
                </p>
                <p>
                  <b>Product Category:</b> {singleData?.itemCategoryName}
                </p>
                {singleData?.respondentTypeName === 'Employee' && (
                  <p>
                    <b> Work Place:</b> {singleData?.workPlace}
                  </p>
                )}
                {singleData?.respondentTypeName === 'End User' && (
                  <>
                    <p>
                      <b>Territory Name:</b> {singleData?.territoryName}
                    </p>
                    <p>
                      <b>Area Name:</b> {singleData?.areaName}
                    </p>
                    <p>
                      <b>Region Name:</b> {singleData?.regionName}
                    </p>
                  </>
                )}
              </div>
            </div>
            {!isPermitted && (
              <div className="d-flex justify-content-center">
                <p className="text-center text-danger mr-2">
                  Delegated User Permission Restricted! {`  `}
                </p>
                <span
                  className="text-primary"
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => {
                    allowDelegationMenuPermission(
                      values,
                      setLoading,
                      setIsPermitted,
                    );
                  }}
                >
                  <b> Allow User?</b>
                </span>
              </div>
            )}
            <form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <div
                    style={{
                      display: 'flex',
                      gap: '0px 5px',
                      alignItems: 'end',
                    }}
                  >
                    <div>
                      <label>
                        <b style={{ color: 'red' }}>* </b> Delegate Date
                      </label>
                      <InputField
                        value={values?.delegateDate}
                        placeholder="Delegate Date"
                        name="delegateDate"
                        type="date"
                        disabled
                      />
                    </div>
                    <InputField
                      value={values?.delegateTime}
                      type="time"
                      name="delegateTime"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <label>
                    <b
                      style={{
                        color: 'red',
                      }}
                    >
                      *{' '}
                    </b>
                    Delegate To
                  </label>
                  <SearchAsyncSelect
                    selectedValue={values?.delegateTo}
                    handleChange={(valueOption) => {
                      if (valueOption?.value) {
                        setIsPermitted(true);

                        checkDelegationMenuPermission(
                          valueOption?.value,
                          setLoading,
                          setIsPermitted,
                        );
                        setFieldValue('delegateTo', valueOption || '');
                      } else {
                        setIsPermitted(true);
                      }
                    }}
                    loadOptions={loadEmpList}
                    placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                  />
                  <FormikError
                    name="delegateTo"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Remarks</label>
                  <TextArea
                    name="remarks"
                    value={values?.remarks || ''}
                    placeholder="Remarks"
                    touched={touched}
                    rows="2"
                    onChange={(e) => {
                      setFieldValue('remarks', e.target.value);
                    }}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3 d-flex align-items-center">
                  <div className="">
                    <button
                      className="btn btn-primary mr-2 mt-2"
                      type="button"
                      onClick={() => setOpen(true)}
                      style={{ padding: '4px 5px' }}
                    >
                      Attachment
                    </button>
                  </div>

                  <div>
                    {values?.attachment && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.attachment),
                          );
                        }}
                      >
                        Attachment View
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <hr />
                </div>

                <div className="col-lg-3">
                  <label>Investigation Person</label>
                  <SearchAsyncSelect
                    selectedValue={values?.investigationPerson}
                    handleChange={(valueOption) => {
                      setFieldValue('investigationPerson', valueOption || '');
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 2) return [];
                      return axios
                        .get(
                          `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${accId}&BusinessUnitId=0&searchTearm=${v}`,
                        )
                        .then((res) => {
                          return res?.data?.map((itm) => ({
                            value: itm?.value,
                            label: `${itm?.level} [${itm?.employeeCode}]`,
                          }));
                        })
                        .catch((err) => []);
                    }}
                    placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                  />
                  <FormikError
                    name="investigationPerson"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.investigationDueDate}
                    label="Investigation Due Date"
                    placeholder="Investigation Due Date"
                    name="investigationDueDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3 d-flex align-items-center">
                  <div className="">
                    <button
                      className="btn btn-primary mr-2 mt-3"
                      type="button"
                      onClick={() => setOpenRow(true)}
                      style={{ padding: '4px 5px' }}
                    >
                      Attachment
                    </button>
                  </div>

                  <div>
                    {values?.attachmentRow && (
                      <button
                        className="btn btn-primary mt-3"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.attachmentRow),
                          );
                        }}
                      >
                        Attachment View
                      </button>
                    )}
                  </div>
                </div>

                <div className="col d-flex align-items-center justify-content-end">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      const obj = {
                        autoId: 0,
                        investigatorId: values?.investigationPerson?.value || 0,
                        investigatorName:
                          values?.investigationPerson?.label || '',
                        investigationDueDate: moment(
                          values?.investigationDueDate || undefined,
                        ).format('YYYY-MM-DD'),
                        investigationDateTime: '',
                        rootCause: '',
                        correctiveAction: '',
                        attachment: values?.attachmentRow || '',
                        isActive: true,
                      };
                      // duplicate check
                      const duplicateCheck = rowDto?.some(
                        (itm) => itm?.investigatorId === obj?.investigatorId,
                      );
                      if (duplicateCheck) {
                        return toast.warn('Investigation Person Already Added');
                      }
                      setRowDto([...rowDto, obj]);
                      setFieldValue('investigationPerson', '');
                      setFieldValue('investigationDueDate', '');
                      setFieldValue('attachmentRow', '');
                      setFieldValue('delegateTo', '');
                      setIsPermitted(true);
                    }}
                    disabled={
                      !values?.investigationPerson ||
                      !values?.investigationDueDate
                    }
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Investigation Person</th>
                      <th>Investigation Due Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center"> {index + 1}</td>
                        <td>{item?.investigatorName}</td>
                        <td>{_dateFormatter(item?.investigationDueDate)}</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center">
                            {item?.attachment && (
                              <span
                                onClick={() => {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      item?.attachment,
                                    ),
                                  );
                                }}
                              >
                                <i
                                  class="fa fa-paperclip pointer"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            )}
                            <span
                              onClick={() => {
                                const newData = rowDto.filter(
                                  (itm, idx) => idx !== index,
                                );
                                setRowDto(newData);
                              }}
                            >
                              <i
                                class="fa fa-trash pointer"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>

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
                  (item) => item.file.name !== deleteFileObj.file.name,
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

            <DropzoneDialogBase
              filesLimit={1}
              acceptedFiles={['image/*', 'application/pdf']}
              fileObjects={fileObjectsRow}
              cancelButtonText={'cancel'}
              submitButtonText={'submit'}
              maxFileSize={1000000}
              open={openRow}
              onAdd={(newFileObjs) => {
                setFileObjectsRow([].concat(newFileObjs));
              }}
              onDelete={(deleteFileObj) => {
                const newData = fileObjectsRow.filter(
                  (item) => item.file.name !== deleteFileObj.file.name,
                );
                setFileObjectsRow(newData);
              }}
              onClose={() => setOpenRow(false)}
              onSave={() => {
                setOpenRow(false);
                attachment_actionTwo(fileObjectsRow, setFieldValue, setLoading);
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default DelegateForm;
