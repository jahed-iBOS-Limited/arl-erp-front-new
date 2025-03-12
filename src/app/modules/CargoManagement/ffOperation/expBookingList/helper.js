import { toast } from 'react-toastify';
import { imarineBaseUrl } from '../../../../App';
import IConfirmModal from '../../../_helper/_confirmModal';
import axios from 'axios';

export const cancelHandler = ({ item, deleteBookingRequestById, CB }) => {
  const obj = {
    title: 'Cancel Booking',
    message: 'Are you sure you want to cancel this?',
    noAlertFunc: () => {},
    yesAlertFunc: () => {
      deleteBookingRequestById(
        `${imarineBaseUrl}/domain/ShippingService/deleteBookingRequestById?bookingId=${item?.bookingRequestId}&userId=${item?.userId}`,
        null,
        () => {
          CB();
        },
      );
    },
  };
  IConfirmModal(obj);
};

export const commonBookingRequestStatusUpdate = (item) => {
  return {
    bookingRequestId: item?.bookingRequestId || 0,
    isPending: item?.isPending || false,
    isHandOver: item?.isHandOver || false,
    handOverDate: item?.handOverDate || new Date(),
    isReceived: item?.isReceived || false,
    receivedDate: item?.receivedDate || new Date(),
    isPlaning: item?.isPlaning || false,
    planingDate: item?.planingDate || new Date(),
    isConfirm: item?.isConfirm || false,
    confirmDate: item?.confirmDate || new Date(),
    isCancel: item?.isCancel || false,
    cancelDate: item?.cancelDate || new Date(),
    isInTransit: item?.isInTransit || false,
    inTransit: item?.inTransit || new Date(),
    isDestPortReceive: item?.isDestPortReceive || false,
    destPortReceive: item?.destPortReceive || new Date(),
    isBuyerReceive: item?.isBuyerReceive || false,
    buyerReceive: item?.buyerReceive || new Date(),
    isActive: item?.isActive || false,
    updatedAt: item?.updatedAt || new Date(),

    // new modify
    deliveredDate: item?.deliveredDate || new Date(),
    isCustomsClear: item?.isCustomsClear || false,
    customsClearDt: item?.customsClearDt || new Date(),
    isDispatch: item?.isDispatch || false,
    dispatchDate: item?.dispatchDate || new Date(),
    isDocumentChecklist: item?.isDocumentChecklist || false,
    documentChecklistDate: item?.documentChecklistDate || new Date(),
    isCharges: item?.isCharges || false,
    chargesDate: item?.chargesDate || new Date(),
    isBl: item?.isBl || false,
    bldate: item?.bldate || new Date(),
    isStuffing: item?.isStuffing || false,
    stuffingDate: item?.stuffingDate || new Date(),
    transportDate: item?.transportDate || new Date(),
  };
};

export const statusReturn = (itemObj) => {
  if (itemObj?.isBuyerReceive) {
    return 'Delivered';
  } else if (itemObj?.isDestPortReceive) {
    return 'Dest Port Receive';
  } else if (itemObj?.isInTransit) {
    return 'In Transit';
  } else if (itemObj?.isCustomsClear) {
    return 'Customs Clearance';
  } else if (itemObj?.isDispatch) {
    return 'Dispatch';
  } else if (itemObj?.isDocumentChecklist) {
    return 'Document Checklist';
  } else if (itemObj?.isCharges) {
    return 'Charges';
  } else if (itemObj?.isHbl) {
    return 'HBL';
  } else if (itemObj?.isBl) {
    return 'BL';
  } else if (itemObj?.isPlaning) {
    return 'Transport';
  } else if (itemObj?.isReceived) {
    return 'Received';
  } else if (itemObj?.isStuffing) {
    return 'Stuffing';
  } else if (itemObj?.isConfirm) {
    return 'Confirm';
  } else if (itemObj?.isCancel) {
    return 'Cancel';
  } else if (itemObj?.isPending) {
    return 'Pending';
  } else {
    return '';
  }
};

export const attachmentUpload = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append('files', file?.file);
  });
  try {
    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success('Upload  successfully');
    return data;
  } catch (error) {
    toast.error('Document not upload');
  }
};
