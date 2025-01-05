import { Form, Formik } from 'formik';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { attachmentUpload } from '../helper';
import './style.css';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
const validationSchema = Yup.object().shape({
  documentsNumber: Yup.string().required('BL No is required'),
});

function BLModal({ rowClickData, CB }) {
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    ,
    UploadParticularDocuments,
    UploadParticularDocumentsLoading,
    ,
  ] = useAxiosPost();
  const [, getDocumentsByMasterBL, documentsByMasterBLLoaidng] = useAxiosGet();
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);
  const formikRef = React.useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modeOfTransportId = [1, 3].includes(rowClickData?.modeOfTransportId)
      ? 1
      : 2;
    formikRef.current.setFieldValue('billingType', modeOfTransportId);
    commonGetDocumentsByMasterBL(modeOfTransportId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowClickData]);

  const commonGetDocumentsByMasterBL = (modeOfTransportId) => {
    let masterBlId = 0;
    if (modeOfTransportId === 1) {
      masterBlId = rowClickData?.airmasterBlId;
    }
    if (modeOfTransportId === 2) {
      masterBlId = rowClickData?.seamasterBlId;
    }
    getDocumentsByMasterBL(
      `${imarineBaseUrl}/domain/ShippingService/GetDocumentsByMasterBL?MasterBlId=${masterBlId}`,
      (resData) => {
        if (resData) {
          const document = resData || {};
          formikRef.current.setFieldValue(
            'documentsNumber',
            document?.documentsNumber || '',
          );
          formikRef.current.setFieldValue(
            'documentFileId',
            document?.documentFileId || '',
          );
          formikRef.current.setFieldValue('documentId', document?.documentId);
        }
      },
    );
  };

  const saveHandler = (values, cb) => {
    let masterBlId = 0;
    if (values?.billingType === 1) {
      masterBlId = rowClickData?.airmasterBlId;
    }
    if (values?.billingType === 2) {
      masterBlId = rowClickData?.seamasterBlId;
    }

    // documentFileId empty check
    if (!values?.documentFileId)
      return toast.warning('Please upload a document');
    const paylaod = {
      bookingRequestId: bookingRequestId || 0,
      documentsNumber: values?.documentsNumber || '',
      documentId: values?.documentId || 0,
      documentTypeId: 6,
      documentType: 'Bill of Lading (BL)',
      documentFileId: values?.documentFileId || '',
      isActive: true,
      createdAt: new Date(),
      createdBy: profileData?.userId,
      masterBlId: masterBlId || 0,
      modeOfTransportId: values?.billingType || 0,
    };

    if (paylaod) {
      UploadParticularDocuments(
        `${imarineBaseUrl}/domain/ShippingService/UploadParticularDocuments`,
        paylaod,
        CB,
      );
    }
  };
  const dispatch = useDispatch();

  return (
    <div className="blModal">
      {(UploadParticularDocumentsLoading || documentsByMasterBLLoaidng) && (
        <Loading />
      )}
      <Formik
        enableReinitialize={true}
        initialValues={{
          documentsNumber: '',
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
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end my-1">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form mt-0">
                {rowClickData?.modeOfTransportId === 3 && (
                  <div className="col-lg-2">
                    {' '}
                    <div className="d-flex align-items-center mt-3">
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="billingType"
                          checked={values?.billingType === 1}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(e) => {
                            setFieldValue('billingType', 1);
                            commonGetDocumentsByMasterBL(1);
                          }}
                        />
                        Air
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="billingType"
                          checked={values?.billingType === 2}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(e) => {
                            setFieldValue('billingType', 2);
                            commonGetDocumentsByMasterBL(2);
                          }}
                        />
                        Sea
                      </label>
                    </div>
                  </div>
                )}
                <div className="col-lg-3">
                  <InputField
                    value={values?.documentsNumber}
                    label="Documents Number"
                    name="documentsNumber"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('documentsNumber', e.target.value)
                    }
                  />
                </div>
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
                          getDownlloadFileView_Action(values?.documentFileId),
                        );
                      }}
                    >
                      Attachment View
                    </button>
                  )}
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
                  (item) => item.file.name !== deleteFileObj.file.name,
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
    </div>
  );
}

export default BLModal;
