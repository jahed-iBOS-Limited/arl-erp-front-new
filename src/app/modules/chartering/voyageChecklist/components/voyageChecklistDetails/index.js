/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Loading from '../../../../_helper/_loading';
import VoyageChecklistView from '../view/index';
import { useHistory, useLocation } from 'react-router-dom';
import { ArrowBackOutlined } from '@material-ui/icons';
import { Formik } from 'formik';
import { Tooltip } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import IViewModal from '../../../_chartinghelper/_viewModal';
import AttachmentModal from '../attachmentModal/attachmentModal';
import FormikInput from '../../../_chartinghelper/common/formikInput';
import {
  createVoyageChecklist,
  empAttachment_action,
  getVoyageByIdShow,
} from '../../helper.js';
import { shallowEqual, useSelector } from 'react-redux';
import { _todayDate } from '../../../../_helper/_todayDate';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import '../../voyage.css';
import { toast } from 'react-toastify';

const initData = {
  activeStatus: null,
  date: '',
  comments: '',
};

export function VoyageChecklistDetails() {
  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [taskSelected, setTaskSelected] = useState({});
  const [fileModal, setFileModal] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [activeStatusId, setActiveStatusId] = useState(null);
  const [fileListModal, setFileListModal] = useState([]);
  const [open, setOpen] = React.useState(false);

  const history = useHistory();
  const location = useLocation();

  const data = rowDto?.objHeader;
  const data2 = rowDto?.objRow;

  const calculationTime = (time, convertType) => {
    //Date Calculation
    let countDownDate = new Date(time).getTime();
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = now - countDownDate;

    // Time calculations for days, hours, minutes and seconds
    if (convertType === 'days') {
      return Math.floor(distance / (1000 * 60 * 60 * 24));
    }

    if (convertType === 'hours') {
      return Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    }

    if (convertType === 'minutes') {
      return Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    }

    if (convertType === 'seconds') {
      return Math.floor((distance % (1000 * 60)) / 1000);
    }
  };

  useEffect(() => {
    if (location?.state?.voyageNo) {
      getVoyageByIdShow(
        location?.state?.voyageNo?.value,
        setRowDto,
        setLoading,
      );
    }
  }, [location]);

  const saveHandler = (values, cb) => {
    if (!values?.date) {
      return toast.warning('Please select a date');
    }
    if (!values?.comments) {
      return toast.warning('Please enter comments');
    }
    let files = [];
    if (uploadedFile.length > 0) {
      files = uploadedFile?.map((item) => item?.id);
    }

    const payload = {
      objHeader: {
        voyageCheckListHeaderId: data?.VoyageCheckListHeaderId || 0,
        vesselId: data?.VesselId,
        vesselName: data?.VesselName,
        voyageId: data?.VoyageId,
        voyageNo: data?.VoyageNo,
        voyageType: data?.VoyageType,
        voyageTypeId: data?.VoyageTypeId,
        voyageStartDate: data?.VoyageStartDate,
        voyageEndDate: data?.VoyageEndDate,
        startPortId: data?.StartPortId,
        startPortName: data?.StartPortName,
        endPortId: data?.EndPortId,
        endPortName: data?.EndPortName,
        chaterId: data?.ChaterId,
        chaterName: data?.ChaterName,
        cpDate: data?.CpDate,
        layCanDate: data?.LayCanDate,
        dteLaycanDate: data?.LayCanDate,
        dteCPDate: data?.CpDate,
        dteCreatedAt: _todayDate(),
        createdBy: profileData?.userId,
      },
      objRow: {
        voyageCheckListRowId: taskSelected?.VoyageChecklistRowId || 0,
        voyageCheckListHeaderId: taskSelected?.VoyageChecklistHeaderId || 0,
        voyageListTypeId: taskSelected?.VoyageListTypeId,
        voyageListType: taskSelected?.VoyageListType,
        strComment: values?.comments,
        strCreatedBy: profileData?.userId,
        dteDate: values?.date,
        dteCreatedAt: _todayDate(),
        DteUpdatedAt: _todayDate(),
        StrUpdatedBy: _todayDate(),
        fileUrlList: [...files] || [],
      },
    };
    createVoyageChecklist(payload, setLoading, cb);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setTaskSelected({});
            setUploadedFile('');
            getVoyageByIdShow(
              location?.state?.voyageNo?.value,
              setRowDto,
              setLoading,
            );
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleSubmit,
          resetForm,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{data?.VoyageType} follow up details</p>
                <div>
                  <button
                    type="button"
                    className={'btn btn-primary px-3 py-2'}
                    onClick={() => history.goBack()}
                  >
                    <ArrowBackOutlined style={{ fontSize: '16px' }} /> Back
                  </button>
                </div>
              </div>
              <VoyageChecklistView data={data} />
              <div className="row">
                <div className="col-lg-8">
                  <h6 style={{ marginLeft: '8px' }} className="mt-4">
                    Description
                  </h6>
                  <div
                    className="voyageChecklistCard"
                    style={{ maxHeight: '550px', overflowY: 'auto' }}
                  >
                    {data2?.length > 0 &&
                      data2?.map((item, index) => (
                        <div
                          className={
                            item?.VoyageListTypeId === activeStatusId
                              ? 'voyageCardItem mb-3 voyageCardItemActive'
                              : 'voyageCardItem mb-3'
                          }
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation(e);
                            setTaskSelected(item);
                            setActiveStatusId(item?.VoyageListTypeId);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <Tooltip
                            title={item?.LatestComment || 'N/A'}
                            arrow
                            placement="top"
                          >
                            <Info
                              style={{
                                color: '#666666',
                                fontSize: '16px',
                                marginTop: '3px',
                                marginRight: '30px',
                                marginLeft: '15px',
                                cursor: 'pointer',
                              }}
                            />
                          </Tooltip>
                          <div className="voyageContent">
                            <h6
                              style={{
                                marginBottom: '0',
                                paddingBottom: '5px',
                                fontSize: '12px',
                              }}
                            >
                              {item?.VoyageListType}
                            </h6>
                            <div className="text">
                              <p
                                style={{
                                  marginBottom: '0',
                                  marginRight: '10px',
                                  fontSize: '12px',
                                }}
                              >
                                {_dateFormatter(item?.LatestCheckDate) || 'N/A'}
                              </p>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item?.TotalFileQty > 0) {
                                    setFileModal(true);
                                    setTaskSelected(item);
                                    setFileListModal(item?.GetVoyageRowDTOList);
                                  }
                                }}
                                style={{ fontSize: '12px', color: '#08a5e5' }}
                              >
                                {item?.TotalFileQty === null ||
                                item?.TotalFileQty === 0
                                  ? 'N/A'
                                  : item?.TotalFileQty + ' files'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="col-lg-4">
                  {taskSelected?.VoyageListTypeId && (
                    <>
                      <div className="voyageSidebar">
                        <h6
                          style={{
                            marginBottom: '0',
                            paddingBottom: '15px',
                            fontSize: '14px',
                          }}
                        >
                          {taskSelected?.VoyageListType || 'N/A'}
                        </h6>
                        <label>Date: </label>
                        <FormikInput
                          value={values?.date}
                          name="date"
                          placeholder=""
                          type="date"
                          errors={errors}
                          touched={touched}
                          max={_todayDate()}
                        />
                        <br />
                        <br />
                        <label>Comments: </label>
                        <FormikInput
                          value={values?.comments || ''}
                          name="comments"
                          placeholder=""
                          onChange={(e) => {
                            setFieldValue('comments', e.target.value);
                          }}
                          type="text"
                          errors={errors}
                          touched={touched}
                        />
                        <br />
                        <br />
                        <div>
                          <button
                            className="btn btn-primary w-100"
                            type="button"
                            onClick={() => setOpen(true)}
                          >
                            <i class="fas fa-file-upload"></i>
                            Upload Files
                          </button>

                          <DropzoneDialogBase
                            filesLimit={10}
                            acceptedFiles={['image/*', 'application/pdf']}
                            fileObjects={fileObjects || []}
                            cancelButtonText={'cancel'}
                            submitButtonText={'submit'}
                            maxFileSize={1000000}
                            open={open}
                            onAdd={(newFileObjs) => {
                              setFileObjects([].concat(newFileObjs));
                            }}
                            onDelete={(deleteFileObj) => {
                              const newData = fileObjects?.filter(
                                (item) =>
                                  item.file.name !== deleteFileObj.file.name,
                              );
                              setFileObjects(newData);
                            }}
                            onClose={() => setOpen(false)}
                            onSave={() => {
                              setOpen(false);
                              empAttachment_action(fileObjects).then((data) => {
                                setUploadedFile(data);
                              });
                            }}
                            showPreviews={true}
                            showFileNamesInPreview={true}
                          />
                        </div>
                        <button
                          className="btn btn-primary w-100 mt-3"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Save
                        </button>
                        {taskSelected?.VoyageListTypeId && (
                          <>
                            <div>
                              <hr style={{ marginTop: '15px' }} />
                              <h6
                                style={{
                                  marginBottom: '0',
                                  paddingBottom: '15px',
                                  fontSize: '14px',
                                }}
                              >
                                History
                              </h6>
                              <div
                                style={{
                                  maxHeight: '250px',
                                  overflowY: 'auto',
                                }}
                              >
                                {taskSelected?.GetVoyageRowDTOList?.map(
                                  (item, index) => (
                                    <>
                                      <div
                                        key={index}
                                        style={{
                                          background: '#ffffff',
                                          paddingTop: '8px',
                                          paddingBottom: '1px',
                                          borderRadius: '5px',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        <ul>
                                          {item?.Comment && (
                                            <li>
                                              {item?.Comment +
                                                ' comment added on ' +
                                                _dateFormatter(item?.CheckDate)}
                                              <span
                                                style={{
                                                  color: '#3699FF',
                                                  display: 'block',
                                                }}
                                              >
                                                {calculationTime(
                                                  item?.CheckDate,
                                                  'days',
                                                ) + ' days ago'}
                                              </span>
                                            </li>
                                          )}
                                          {item?.FileQty > 0 && (
                                            <li>
                                              {item.FileQty +
                                                ' file attached on ' +
                                                _dateFormatter(item?.CheckDate)}
                                              <span
                                                style={{
                                                  color: '#3699FF',
                                                  display: 'block',
                                                }}
                                              >
                                                {calculationTime(
                                                  item?.CheckDate,
                                                  'days',
                                                ) + ' days ago'}
                                              </span>
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    </>
                                  ),
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
            <IViewModal
              show={fileModal}
              onHide={() => {
                setFileModal(false);
                setFileListModal([]);
              }}
              size="md"
            >
              <AttachmentModal
                taskSelected={taskSelected}
                fileListModal={fileListModal}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
