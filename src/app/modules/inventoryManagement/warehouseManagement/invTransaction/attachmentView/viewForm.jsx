/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { DropzoneDialogBase } from 'react-mui-dropzone';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ICustomTable from '../../../../_helper/_customTable';
import IClose from '../../../../_helper/_helperIcons/_close';
import IView from '../../../../_helper/_helperIcons/_view';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import { _todayDate } from '../../../../_helper/_todayDate';
import {
  getAttachmentLandingData,
  saveAttchmentForPo,
} from '../helper';
import { uploadAttachment } from '../../../../_helper/attachmentUpload';

const ths = ['SL', 'Attachment', 'Action'];

// Note : this modal view form is used in two places,
// Landing and report page
export default function ViewForm({ poData, setIsShowModal }) {
  const [attachmentData, setAttchmentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const dispatch = useDispatch();

  // get priceStructure data from table row, and set it to state, later fill up this data from user, and save it to table row
  useEffect(() => {
    cb();
  }, [poData]);

  let cb = () => {
    getAttachmentLandingData(poData?.inventoryTransactionId, setAttchmentData);
  };

  // save modal data to rowDto and calculate netValue
  const saveHandler = () => {
    uploadAttachment(fileObjects).then((res) => {
      console.log(res);
      const payload = {
        referenceId: poData?.inventoryTransactionId,
        referenceCode: poData?.inventoryTransactionCode,
        documentId: res?.data[0]?.id || '',
        isActive: true,
        lastActionDatetime: _todayDate(),
        transectionType: 'Inventory Transaction',
      };
      if (payload.documentId) {
        setFileObjects([]);
        saveAttchmentForPo(payload, cb);
      } else {
        toast.warning('Upload Failed');
      }
    });
  };

  // approveSubmitlHandler btn submit handler
  // const approveSubmitlHandler = (docId,invId) => {
  //   let confirmObject = {
  //     title: "Are you sure?",
  //     message: `Do you want to Inactive this PO`,
  //     yesAlertFunc: () => {
  //       CancelDocumentAction(docId,invId, cb)

  //     },
  //     noAlertFunc: () => { },
  //   };
  //   IConfirmModal(confirmObject);
  // };

  return (
    <div>
      <div className="text-right">
        <button
          className="btn btn-primary mr-2 mt-2"
          type="button"
          onClick={() => setOpen(true)}
        >
          Attachment
        </button>
        <div className="row mb-2 text-left"></div>
        {/* {attachmentData?.length > 0 && ( */}
        <ICustomTable ths={ths}>
          {attachmentData?.map((item, index) => (
            <tr key={index}>
              <td> {index + 1} </td>
              <td className="text-center">
                <IView
                  title={'Attachment'}
                  classes={'text-primary'}
                  clickHandler={() => {
                    dispatch(getDownlloadFileView_Action(item?.documentId));
                  }}
                />
              </td>
              <td className="text-center">
                {' '}
                <span className="mt-1" style={{ cursor: 'pointer' }}>
                  <IClose
                    title="InActive"
                    closer={
                      () => {
                        // CancelDocumentAction(item?.docId,item?.referenceId, cb)
                        // Do nothing
                        '';
                      }
                      //approveSubmitlHandler(item?.documentId,item?.referenceId)
                    }
                  />
                </span>{' '}
              </td>
            </tr>
          ))}
        </ICustomTable>
        {/* )} */}
      </div>

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
          saveHandler();
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
}
