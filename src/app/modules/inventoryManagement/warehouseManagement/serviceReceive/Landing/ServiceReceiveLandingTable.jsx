/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ICustomTable from "../../../../_helper/_customTable";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useSelector, useDispatch } from "react-redux";
import { setServiceTableLastAction } from '../../../../_helper/reduxForLocalStorage/Actions'
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../attachmentView/viewForm";
import { inventoryTransactionCancelAction } from "../helper/Actions";
import IConfirmModal from "../../../../_helper/_confirmModal";



const headers = [
  "SL",
  "Receive Code",
  "PO Number",
  "PO Qty",
  "PO Amount",
  "Receive Qty",
  "Receive Amount",
  "Supplier",
  "Action",
];

const TBody = ({ gridData, viewGridData, setLoading }) => {
  const history = useHistory();
  // get profile data from store
  // const profileData = useSelector((state) => {
  //   return state.authData.profileData;
  // }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  // const editPOData = (id,receiveAmount) => {
  //   history.push({
  //    pathname: `/inventory-management/warehouse-management/serviceReceive/edit/${id}`,
  //    state:{receiveAmount}
  //   });
  // };

  const dispatch = useDispatch()

  const serviceTable = useSelector((state) => {
    return state.localStorage.serviceTableIndex;
  })

  const viewPOData = (id, receiveAmount) => {
    history.push({
      pathname: `/inventory-management/warehouse-management/serviceReceive/viewReport/${id}`,
      state: { receiveAmount }
    });
  };

  const [isShowModal, setIsShowModal] = useState(false);
  const [poData, setPOData] = useState(false);

  // Get Landing Pasignation Data
  useEffect(() => {
    /*  fetchLandingData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setRowData
    ); */
  }, []);
  const { profileData, selectedBusinessUnit } = useSelector(state => state?.authData)
  const cancelPopUp = (td) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Code : ${td?.serviceCode}`,
      yesAlertFunc: () => {
        inventoryTransactionCancelAction(
          td?.serviceCode,
          selectedBusinessUnit?.value,
          profileData?.userId,
          viewGridData,
          setLoading
        );
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      {gridData &&
        gridData.length > 0 &&
        gridData.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{item?.sl}</td>
              <td >{item.serviceCode}</td>
              <td >{item.purchaseOrderNo}</td>
              <td style={{ textAlign: "center" }}>{item?.poQuantity}</td>
              <td style={{ textAlign: "center" }}>{item?.poAmount}</td>
              <td style={{ textAlign: "center" }}>{item?.receiveQuantity}</td>
              <td style={{ textAlign: "center" }}>{item?.receiveAmount.toFixed(4)}</td>
              <td style={{ textAlign: "center" }}>
                {item.businessPartnerName}
              </td>
              <td colSpan="" style={{ textAlign: "center" }}>
                {/* {
                  !item?.isInvoicePosted && (
                    <span
                      className="mr-3"
                      onClick={(e) => editPOData(item.serviceId,item?.receiveAmount)}
                    >
                      <IEdit title="Edit" />
                    </span>
                  )
                } */}
                <span onClick={(e) => {
                  viewPOData(item.serviceId, item?.receiveAmount)
                  dispatch(setServiceTableLastAction(item?.serviceId))
                }}>
                  {/* <IView  /> */}
                  <OverlayTrigger
                    overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}
                  >
                    <span style={{ cursor: "pointer" }}>
                      <i className={`fas fa-eye ${serviceTable === item?.serviceId ? "text-primary" : ""}`} aria-hidden="true"></i>
                    </span>
                  </OverlayTrigger>
                </span>
                <button
                  onClick={() => {
                    setIsShowModal(true);
                    setPOData(item);
                  }
                  }
                  style={{ border: "none", background: "none", cursor: "pointer" }}
                >
                  <OverlayTrigger overlay={<Tooltip id='cs-icon'>{"PO Receive Attachment"}</Tooltip>}>
                    <i class="far fa-file-image"></i>
                  </OverlayTrigger>
                </button>
                {
                  !item?.isBillPosted  &&
                  <span
                    onClick={() => cancelPopUp(item)}
                  >
                    <OverlayTrigger
                      overlay={<Tooltip id="cs-icon">{"Cancel"}</Tooltip>}
                    >
                      <span style={{ cursor: "pointer" }}>
                        <i
                          className="fa fa-times-circle closeBtn"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </OverlayTrigger>
                  </span>
                }

              </td>
            </tr>
          );
        })}

      <>
        <IViewModal
          title="Service Receive Attachment"
          show={isShowModal}
          onHide={() => setIsShowModal(false)}
        >
          <ViewForm
            poData={poData}
            setIsShowModal={setIsShowModal}
          />
        </IViewModal>
      </>
    </>
  );
};

export default function ServiceReceiveLandingTable({ gridData, setLoading, viewGridData }) {
  return (
    <ICustomTable ths={headers} className="table-font-size-sm" children={<TBody gridData={gridData} setLoading={setLoading} viewGridData={viewGridData} />} />
  );
}
