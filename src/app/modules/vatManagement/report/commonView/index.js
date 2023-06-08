import React from "react";
import IViewModal from "../../../_helper/_viewModal";
import PurchaseView from "../../purchase/parchase-6.4/view/addEditForm";
import ProductionForm from "../../inventory/production/Form/addEditForm";
import TransferOutViewForm from "../../inventory/transferOut/viewModal";
import ItemTransferInViewForm from "../../inventory/transferIn/view/addForm";
import ItemDestroyViewForm from "../../inventory/itemDestroy/View/addEditForm";
import TurnoverModel from "../../trunOverTax/viewModal";
import SalesInvoiceModel from "./../../operation/sales/salesInvoice/viewModal";
import CreditNoteView from "../../operation/sales/creditNote/Table/grid";
import DebitNoteView from "../../operation/purchase/debitNote/Table/grid";

function CommonView({ modelShow, setModelShow, viewClick }) {
  const commonSalesId =
    viewClick?.SalesId || viewClick?.taxSalesId || viewClick?.salesId || 0;
  const commonPurchaseId =
    viewClick?.PurchaseId ||
    viewClick?.taxPurchaseId ||
    viewClick?.purchaseId ||
    0;
  const commonRemarks = viewClick?.Remarks || viewClick?.remarks;

  return (
    <>
      {/* Remarks Purchase */}
      {commonRemarks === "Purchase" && (
        <IViewModal
          show={modelShow}
          onHide={() => {
            setModelShow(false);
          }}
          title={"View Purchase"}
          btnText="Close"
        >
          <PurchaseView
            viewClick={{
              ...viewClick,
              taxPurchaseId: commonPurchaseId,
              isView: true,
            }}
          />
        </IViewModal>
      )}

      {/*  Remarks Production */}
      {commonRemarks === "Production" && (
        <IViewModal
          show={modelShow}
          onHide={() => {
            setModelShow(false);
          }}
          title={commonRemarks || ""}
          btnText="Close"
        >
          <ProductionForm
            viewClick={{
              ...viewClick,
              taxPurchaseId: commonSalesId || commonPurchaseId,
              isView: true,
            }}
          />
        </IViewModal>
      )}

      {/* Remarks Transfer out */}
      {commonRemarks === "Transfer out" && (
        <IViewModal
          show={modelShow}
          onHide={() => {
            setModelShow(false);
          }}
          title={commonRemarks || ""}
          btnText="Close"
        >
          <TransferOutViewForm
            viewClick={{
              ...viewClick,
              PurchaseId: commonPurchaseId,
              SalesId: commonSalesId,
            }}
          />
        </IViewModal>
      )}

      {/* Remarks Transfer in */}
      {commonRemarks === "Transfer in" && (
        <IViewModal
          show={modelShow}
          onHide={() => {
            setModelShow(false);
          }}
          title={commonRemarks || ""}
          btnText="Close"
        >
          <ItemTransferInViewForm
            id={commonSalesId || commonPurchaseId}
            gridRow={{ ...viewClick }}
            typeId={viewClick?.PurchaseId !== 0 ? 1 : 3}
          />
        </IViewModal>
      )}

      {/* Remarks Item Destory */}
      {commonRemarks === "Item Destory" && (
        <IViewModal
          show={modelShow}
          onHide={() => {
            setModelShow(false);
          }}
          title={commonRemarks || ""}
          btnText="Close"
        >
          <ItemDestroyViewForm
            id={commonSalesId || commonPurchaseId}
            typeId={
              viewClick?.PurchaseId ||
              viewClick?.taxPurchaseId ||
              viewClick?.purchaseId
                ? 1
                : 3
            }
          />
        </IViewModal>
      )}

      {/*  Remarks Sales */}
      {commonRemarks === "Sales" && (
        <>
          {viewClick?.taxBracketId === 4 ? (
            <>
              {/* Turnover Tax table */}
              <TurnoverModel
                show={modelShow}
                onHide={() => {
                  setModelShow(false);
                }}
                viewClick={{ ...viewClick, taxSalesId: commonSalesId }}
              />
            </>
          ) : (
            <SalesInvoiceModel
              show={modelShow}
              onHide={() => {
                setModelShow(false);
              }}
              viewClick={{ ...viewClick, taxSalesId: commonSalesId }}
            />
          )}
        </>
      )}

      {/* Remarks Credit Note*/}
      {commonRemarks === "Credit Note" && (
        <IViewModal
          show={modelShow}
          onHide={() => setModelShow(false)}
          title="Credit Note View"
        >
          <CreditNoteView
            viewClick={{ ...viewClick, id: viewClick?.Chalan }}
            title={"CREDIT NOTE"}
          />
        </IViewModal>
      )}

      {/* Remarks Debit Note*/}
      {commonRemarks === "Debit Note" && (
        <IViewModal
          show={modelShow}
          onHide={() => setModelShow(false)}
          title="Debit Note Report View"
        >
          <DebitNoteView
            viewClick={{ ...viewClick, taxPurchaseCode: viewClick?.Chalan }}
            title={"DEBIT NOTE"}
          />
        </IViewModal>
      )}
    </>
  );
}
export default CommonView;
