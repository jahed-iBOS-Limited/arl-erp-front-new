import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { compressfile } from "../../../_helper/compressfile";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import IViewModal from "../../../_helper/_viewModal";
import { uploadAttachment } from "../billregister/helper";
import RejectModel from "../billregister/rejectModel/form";
import ShippingInvoiceView from "./shippingInvoiceView";
const GridData = ({
  rowDto,
  values,
  profileData,
  selectedBusinessUnit,
  cb,
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
                    <td className="text-right">
                      {" "}
                      {tableData?.monTotalAmount}{" "}
                    </td>
                    <td> {tableData?.billStatus} </td>
                    <td className="text-center"> {tableData?.progress} </td>
                    <td> {tableData?.remarks} </td>
                    <td className="text-center">
                      {/* <span > */}
                      <div className="d-flex justify-content-around align-items-center">
                        {tableData?.billType !== 5 && (
                          <IView
                            //classes="text-muted"
                            clickHandler={() => {
                              setModalShow(true);
                              setGridItem({
                                ...tableData,
                                billStatus: "Approved",
                              });
                            }}
                          />
                        )}

                        {/* { tableData.billStatus !== "Approved"  &&  
                     <span
                        className="view"
                        onClick={() => {
                          setIsReject(true);
                          setGridItem(tableData);
                        }}
                      >
                        <IDelete title={"Bill Cancel"} />
                      </span> } */}

                        <button
                          onClick={() => {
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
            {gridItem?.billType === 15 && (
              <ShippingInvoiceView
                gridItem={gridItem}
                laingValues={values}
                // girdDataFunc={girdDataFunc}
                setModalShow={setModalShow}
              />
            )}
            {/* {gridItem?.billType === 2 && (
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
            )} */}
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
