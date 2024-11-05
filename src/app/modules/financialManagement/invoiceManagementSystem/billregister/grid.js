import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import { compressfile } from "../../../_helper/compressfile";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import AdvForInternalView from "../approvebillregister/advForInternal";
import ExpenseView from "../approvebillregister/expenseView";
import FairPriceShopInvoiceView from "../approvebillregister/fairPriceShopInvoiceView";
import SupplerInvoiceView from "../approvebillregister/supplerInvoiceView";
import SupplierAdvanceView from "../approvebillregister/supplierAdvanceView";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../_helper/_fixedPoint";
import IViewModal from "./../../../_helper/_viewModal";
import AttachmentListTable from "./attachmentListTable";
import ViewCNFBill from "./cnfBill/view/table";
import CustomerViewModal from "./customerRefund/customerViewModal";
import ViewDamDeliveryBill from "./damDelivery/view/table";
import ViewFuelBill from "./fuelBill/view/viewBillRegister";
import ViewG2GGodownUnloadBill from "./g2gGodownUnloadBill/view/viewBillRegister";
import ViewG2GLighterBill from "./g2gLighterBill/view/viewBillRegister";
import ViewG2GTruckBill from "./g2gTruckBill/view/viewBillRegister";
import ViewGhatLoadUnloadBill from "./ghatLoadUnloadBill/view/viewBillRegister";
import ViewHatchLaborBill from "./hatchLaborBill/view/table";
import { uploadAttachment } from "./helper";
import ViewInternalTransportBill from "./internalTransportBill/view/viewBillRegister";
import ViewLabourBill from "./labourBill/view/viewBillRegister";
import ViewMotherVesselBill from "./motherVesselBill/view/viewBillRegister";
import OthersBillView from "./othersBillNew/view/othersBillView";
import ViewPumpFoodingBill from "./pumpFoodingBill/view/viewPumpFoodingBill";
import PumpFoodingBillDetails from "./pumpFoodingBillDetails";
import RejectModel from "./rejectModel/form";
import ViewSalesCommission from "./salesCommission/view/viewSalesCommission";
import ViewStevedoreBill from "./stevedoreBill/view/table";
import ViewSurveyorBill from "./surveyorBill/view/table";
import ViewTransportBill from "./transportBill/view/viewBillRegister";
const GridData = ({
  rowDto,
  values,
  profileData,
  selectedBusinessUnit,
  cb,
  ViewOnChangeHandler,
}) => {
  // const billType = values?.billType?.value;
  const [mdalShow, setModalShow] = useState(false);
  const [gridItem, setGridItem] = useState("");
  const [isReject, setIsReject] = useState(false);
  // attachment states
  const [billId, setBillId] = useState(null);
  const [fileObjects, setFileObjects] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // Attachment Save actions
  const [, createBillAttachment, createBillAttachmentLoading] = useAxiosPost(
    []
  );

  const [attachmentListModal, setAttachmentListModal] = useState(false);
  const [attachmentItemList, setAttachmentItemList] = useState([]);

  const [pumpFoodingDetailsView, setPumpFoodingDetailsView] = useState(false);
  const [selectedItemForPumpFooding, setSelectedItemForPumpFooding] = useState(
    null
  );
  const dispatch = useDispatch();

  // attachment save actions
  const saveHandler = async () => {
    if (!fileObjects.length) return null;
    const compressedFile = await compressfile(fileObjects?.map((f) => f.file));
    uploadAttachment(compressedFile, setDisabled).then((res) => {
      const attachment = res?.[0] || "";
      const payload = [
        {
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intBillid: +billId,
          strTitle: attachment?.fileName || "",
          strAttatchment: attachment?.id || "",
        },
      ];
      if (attachment?.id) {
        createBillAttachment(
          `/fino/FinancialStatement/CreateBillAttatchment`,
          payload,
          () => {
            setFileObjects([]);
            ViewOnChangeHandler(values);
          },
          true
        );
      } else {
        toast.warning("Upload Failed");
      }
    });
  };
  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th style={{ width: "80px" }}>Register Code</th>
                  <th style={{ width: "80px" }}>Register Date</th>
                  <th style={{ width: "100px" }}>Partner</th>
                  <th style={{ width: "100px" }}>Type Name</th>
                  <th style={{ width: "80px" }}>Adj. Amount</th>
                  <th style={{ width: "80px" }}>Total Amount</th>
                  <th style={{ width: "80px" }}>Bill Status</th>
                  <th style={{ width: "80px" }}>Progress</th>
                  <th style={{ width: "150px" }}>Remarks</th>
                  <th style={{ width: "50px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(createBillAttachmentLoading || disabled) && <Loading />}
                {rowDto?.data?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {tableData?.sl} </td>
                    <td> {tableData?.billRegisterCode} </td>
                    <td className="text-center">
                      {" "}
                      {_dateFormatter(tableData?.billRegisterDate)}{" "}
                    </td>
                    <td> {tableData?.partnerName} </td>
                    <td> {tableData?.billTypeName} </td>
                    <td
                      className="text-right"
                      style={
                        tableData?.adjustmentAmount > 0 ? { color: "red" } : {}
                      }
                    >
                      {" "}
                      {_fixedPoint(tableData?.adjustmentAmount || 0)}{" "}
                    </td>
                    <td className="text-right"> {tableData?.monTotalAmount} </td>
                    <td> {tableData?.billStatus} </td>
                    <td className="text-center"> {tableData?.progress} </td>
                    <td> {tableData?.remarks} </td>
                    <td className="text-center">
                      {/* <span > */}
                      <div className="d-flex justify-content-around align-items-center">
                        {tableData?.billType === 18 ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="quick-user-tooltip">
                                {" "}
                                Details View
                              </Tooltip>
                            }
                          >
                            <span className="ml-2 cursor: pointer">
                              <i
                                class="fa fa-info-circle"
                                aria-hidden="true"
                                onClick={() => {
                                  setPumpFoodingDetailsView(true);
                                  setSelectedItemForPumpFooding(tableData);
                                }}
                              ></i>
                            </span>
                          </OverlayTrigger>
                        ) : null}

                        {tableData?.billType !== 5 && (
                          <IView
                            clickHandler={() => {
                              setModalShow(true);
                              setGridItem({
                                ...tableData,
                                billStatus: "Approved",
                              });
                            }}
                          />
                        )}
                        {tableData?.billType === 5 &&
                          tableData?.attatchment?.length ? (
                          <IView
                            title="View Attachment"
                            clickHandler={() => {
                              setAttachmentItemList(tableData?.attatchment);
                              setAttachmentListModal(true);
                            }}
                          />
                        ) : null}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setBillId(tableData?.billRegisterId);
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
                                {"Upload Attachment"}
                              </Tooltip>
                            }
                          >
                            <i class="far fa-file-image"></i>
                          </OverlayTrigger>
                        </button>
                      </div>
                      {/* </span> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <>
          <IViewModal show={mdalShow} onHide={() => setModalShow(false)}>
            {gridItem?.billType === 1 && (
              <SupplerInvoiceView
                gridItem={gridItem}
                laingValues={values}
                // girdDataFunc={girdDataFunc}
                setModalShow={setModalShow}
              />
            )}
            {gridItem?.billType === 2 && (
              <SupplierAdvanceView
                gridItem={gridItem}
                laingValues={values}
                bilRegister={true}
                // girdDataFunc={girdDataFunc}
                setModalShow={setModalShow}
              />
            )}
            {gridItem?.billType === 3 && (
              <AdvForInternalView
                gridItem={gridItem}
                laingValues={{
                  ...values,
                  status: {
                    value: gridItem?.billStatus === "Approved" ? 2 : 1,
                    label: "",
                  },
                }}
                //girdDataFunc={girdDataFunc}
                setModalShow={setModalShow}
              />
            )}
            {gridItem?.billType === 4 && (
              <ExpenseView
                gridItem={gridItem}
                laingValues={{
                  ...values,
                  status: {
                    value: gridItem?.billStatus === "Approved" ? 2 : 1,
                    label: "",
                  },
                }}
                //  girdDataFunc={girdDataFunc}
                setModalShow={setModalShow}
              />
            )}
            {gridItem?.billType === 7 && (
              <ViewSalesCommission billRegisterId={gridItem?.billRegisterId} />
            )}
            {gridItem?.billType === 6 && (
              <ViewTransportBill landingValues={values} gridItem={gridItem} />
            )}
            {gridItem?.billType === 8 && (
              <ViewFuelBill landingValues={values} gridItem={gridItem} />
            )}
            {(gridItem?.billType === 9 || gridItem?.billType === 10) && (
              <ViewLabourBill landingValues={values} gridItem={gridItem} />
            )}
            {gridItem?.billType === 11 && (
              <FairPriceShopInvoiceView
                gridItem={gridItem}
                laingValues={values}
                // girdDataFunc={girdDataFunc}
                setModalShow={setModalShow}
              />
            )}
            {gridItem?.billType === 12 && (
              <OthersBillView landingValues={values} gridItem={gridItem} />
            )}
            {gridItem?.billType === 13 && (
              <ViewInternalTransportBill
                landingValues={values}
                gridItem={gridItem}
              />
            )}
            {gridItem?.billType === 16 && (
              <ViewG2GTruckBill billRegisterId={gridItem?.billRegisterId} />
            )}
            {gridItem?.billType === 17 && (
              <ViewG2GLighterBill landingValues={values} gridItem={gridItem} />
            )}
            {gridItem?.billType === 18 && (
              <ViewPumpFoodingBill billRegisterId={gridItem?.billRegisterId} />
            )}
            {gridItem?.billType === 19 && (
              <ViewMotherVesselBill
                landingValues={values}
                gridItem={gridItem}
              />
            )}
            {gridItem?.billType === 21 && (
              <ViewG2GGodownUnloadBill
                billRegisterId={gridItem?.billRegisterId}
              />
            )}
            {gridItem?.billType === 22 && (
              <ViewGhatLoadUnloadBill
                billRegisterId={gridItem?.billRegisterId}
              />
            )}
            {gridItem?.billType === 25 && (
              <ViewCNFBill billRegisterId={gridItem?.billRegisterId} />
            )}
            {gridItem?.billType === 26 && (
              <ViewStevedoreBill billRegisterId={gridItem?.billRegisterId} />
            )}
            {gridItem?.billType === 27 && (
              <ViewSurveyorBill billRegisterId={gridItem?.billRegisterId} />
            )}
            {gridItem?.billType === 28 && (
              <ViewHatchLaborBill billRegisterId={gridItem?.billRegisterId} />
            )}

            {[31, 32].includes(gridItem?.billType) && (
              /* 31: G2G Dump Unload Bill
              32: G2G Dump Delivery(Load) Bill
            */
              <ViewDamDeliveryBill
                billRegisterId={gridItem?.billRegisterId}
                billTypeId={gridItem?.billType}
                values={values}
              />
            )}
            {gridItem?.billType === 33 && (
              <CustomerViewModal landingValues={values} gridItem={gridItem} />
            )}
          </IViewModal>

          <IViewModal
            show={isReject}
            onHide={() => {
              setIsReject(false);
              setGridItem("");
            }}
          >
            <RejectModel
              gridItem={gridItem}
              laingValues={values}
              setIsReject={setIsReject}
              profileData={profileData}
              selectedBusinessUnit={selectedBusinessUnit}
              cb={cb}
            />
          </IViewModal>
          <IViewModal
            show={attachmentListModal}
            onHide={() => {
              setAttachmentListModal(false);
              setAttachmentItemList([]);
            }}
            modelSize="sm"
          >
            <AttachmentListTable attachmentItemList={attachmentItemList} />
          </IViewModal>

          <IViewModal
            show={pumpFoodingDetailsView}
            onHide={() => {
              setPumpFoodingDetailsView(false);
              setSelectedItemForPumpFooding(null);
            }}
          >
            <PumpFoodingBillDetails
              selectedItemForPumpFooding={selectedItemForPumpFooding}
            />
          </IViewModal>

          <DropzoneDialogBase
            filesLimit={4}
            acceptedFiles={["image/*", "application/pdf"]}
            fileObjects={fileObjects}
            cancelButtonText={"cancel"}
            submitButtonText={"submit"}
            maxFileSize={1000000}
            open={billId}
            onAdd={(newFileObjs) => {
              setFileObjects([].concat(newFileObjs));
            }}
            onDelete={(deleteFileObj) => {
              const newData = fileObjects.filter(
                (item) => item.file.name !== deleteFileObj.file.name
              );
              setFileObjects(newData);
            }}
            onClose={() => {
              setBillId(null);
              setFileObjects([]);
            }}
            onSave={() => {
              setBillId(null);
              saveHandler();
            }}
            showPreviews={true}
            showFileNamesInPreview={true}
          />
        </>
      </div>
    </>
  );
};

export default GridData;
