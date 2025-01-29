import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ICustomTable from "../../../../_helper/_customTable";
import { useSelector, useDispatch } from "react-redux";
import { setAssetTableLastAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../attachmentView/viewForm";
import IConfirmModal from "../../../../_helper/_confirmModal";
// import IClose from "../../../../_helper/_helperIcons/_close";
import { inventoryTransactionCancelAction } from "../helper/Actions";
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

  const [isShowModal, setIsShowModal] = useState(false);
  const [poData, setPOData] = useState(false);
  const dispatch = useDispatch();

  const viewPOData = (id, receiveAmount) => {
    history.push({
      pathname: `/inventory-management/warehouse-management/assetReceive/reportview/${id}`,
      state: { receiveAmount },
    });
  };

  const assetTable = useSelector((state) => {
    return state?.localStorage.assetTableIndex;
  });
  const { profileData, selectedBusinessUnit } = useSelector(state => state?.authData)
  const cancelPopUp = (td) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Code : ${td?.assetCode}`,
      yesAlertFunc: () => {
        inventoryTransactionCancelAction(
          td?.assetCode,
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
        gridData?.length > 0 &&
        gridData?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{item?.sl}</td>
              <td>{item?.assetCode}</td>
              <td>{item?.purchaseOrderNo}</td>
              <td style={{ textAlign: "center" }}>{item?.poQuantity}</td>
              <td style={{ textAlign: "center" }}>{item?.poAmount}</td>
              <td style={{ textAlign: "center" }}>{item?.receiveQuantity}</td>
              <td style={{ textAlign: "center" }}>
                {item?.receiveAmount?.toFixed(4)}
              </td>
              <td style={{ textAlign: "center" }}>
                {item?.businessPartnerName}
              </td>
              <td colSpan="" style={{ textAlign: "center" }}>
                {/* {!item?.isInvoicePosted && (
                  <span
                    className="mr-3"
                    onClick={(e) =>
                      editPOData(item.assetId, item?.receiveAmount)
                    }
                  >
                    <IEdit title="Edit" />
                  </span>
                )} */}
                <span
                  onClick={(e) => {
                    viewPOData(item?.assetId, item?.receiveAmount);
                    dispatch(setAssetTableLastAction(item?.assetId));
                  }}
                >
                  <OverlayTrigger
                    overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}
                  >
                    <span style={{ cursor: "pointer" }}>
                      <i
                        className={`fas fa-eye ${assetTable === item?.assetId ? "text-primary" : ""
                          }`}
                        aria-hidden="true"
                      ></i>
                    </span>
                  </OverlayTrigger>
                </span>
                <button
                  onClick={() => {
                    setIsShowModal(true);
                    setPOData(item);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="cs-icon">{"PO Receive Attachment"}</Tooltip>
                    }
                  >
                    <i class="far fa-file-image"></i>
                  </OverlayTrigger>
                </button>
                {
                  !item?.isBillPosted  && <span
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
          <ViewForm poData={poData} setIsShowModal={setIsShowModal} />
        </IViewModal>
      </>
    </>
  );
};

export default function AssetReceiveLandingTable({ gridData, setLoading, viewGridData }) {
  return (
    <ICustomTable ths={headers} className="table-font-size-sm" children={<TBody gridData={gridData} setLoading={setLoading} viewGridData={viewGridData} />} />
  );
}
