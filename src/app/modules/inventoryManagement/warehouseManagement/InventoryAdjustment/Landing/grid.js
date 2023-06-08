import React, { useState } from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { withRouter } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../attachmentView/viewForm";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IClose from "../../../../_helper/_helperIcons/_close";
import { inventoryTransactionCancelAction } from "../helper";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { InventoryTransactionReportViewTableRow } from "../report/tableRow";

const GridData = ({ history, values, viewGridData, setLoading }) => {
  let ths = [
    "SL",
    "Transaction Code",
    "Reference Type",
    "Reference No.",
    "Transaction Type",
    "Action",
  ];

  // gridData ddl
  const { gridData } = useSelector((state) => {
    return state.invTransa;
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const tableInvIndex = useSelector((state) => {
    return state.localStorage.tableInventoryIndex;
  });

  const [isShowModal, setIsShowModal] = useState(false);
  const [poData, setPOData] = useState(false);

  const [isShowModalTwo, setIsShowModalTwo] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");

  const cancelPopUp = (td) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Code : ${td?.inventoryTransactionCode}`,
      yesAlertFunc: () => {
        inventoryTransactionCancelAction(
          td?.inventoryTransactionCode,
          selectedBusinessUnit?.value,
          profileData?.userId,
          viewGridData,
          values,
          setLoading
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <ICustomTable ths={ths} className="table-font-size-sm">
        {gridData?.data?.map((td, index) => {
          return (
            <tr key={td.sl}>
              <td> {td.sl} </td>
              <td> {td.inventoryTransactionCode} </td>
              <td> {td.referenceTypeName} </td>
              <td> {td.referenceCode} </td>
              <td> {td.transactionTypeName} </td>
              <td style={{ width: "100px" }}>
                <div className="d-flex justify-content-around">
                  <button
                    onClick={() => {
                      setCurrentRowData(td);
                      setIsShowModalTwo(true);
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <i
                      class={`fas fa-eye ${
                        tableInvIndex === td?.inventoryTransactionId
                          ? "text-primary"
                          : ""
                      }`}
                    ></i>
                  </button>
                  {td?.referenceTypeId === 1 && (
                    <button
                      onClick={() => {
                        setIsShowModal(true);
                        setPOData(td);
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">
                            {"PO Receive Attachment"}
                          </Tooltip>
                        }
                      >
                        <i class="far fa-file-image"></i>
                      </OverlayTrigger>
                    </button>
                  )}
                  {!td?.isBillPosted && (
                    <div
                      onClick={() => cancelPopUp(td)}
                      className="pointer"
                      style={{ marginTop: "4px" }}
                    >
                      <IClose
                        closer={(id) => ""}
                        id={td?.inventoryTransactionId}
                        title="Cancel"
                      />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </ICustomTable>

      <IViewModal show={isShowModalTwo} onHide={() => setIsShowModalTwo(false)}>
        <InventoryTransactionReportViewTableRow
          Invid={currentRowData?.inventoryTransactionId}
          grId={currentRowData?.inventoryTransectionGroupId}
          currentRowData={currentRowData}
        />
      </IViewModal>

      <IViewModal
        title="Receive Inventory(PO) Attachment"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <ViewForm poData={poData} setIsShowModal={setIsShowModal} />
      </IViewModal>
    </>
  );
};

export default withRouter(GridData);
