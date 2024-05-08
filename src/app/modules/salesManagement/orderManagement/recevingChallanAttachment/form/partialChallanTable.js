import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import { toast } from "react-toastify";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import IViewModal from "../../../../_helper/_viewModal";
import AttachmentListTable from "./attachmentListTable";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { compressfile } from "../../../../_helper/compressfile";
import { uploadAttachment } from "../helper";


export default function PartialChallanTable({ obj }) {
  const { gridData, allSelect, selectedAll, setGridData } = obj;
  const {profileData, selectedBusinessUnit} = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [attachmentListModal, setAttachmentListModal] = useState(false);
  const [attachmentItemList, setAttachmentItemList] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [billId, setBillId] = useState(null);
  const [disabled, setDisabled] = useState(false);




  const dispatch = useDispatch();

  const dataChangeHandler = (headerIndex, rowIndex, key, value) => {
    let _data = [...gridData];

    _data[headerIndex]["rowData"][rowIndex][key] = value;
    setGridData(_data);
  };

  let totalDeliveryQty = 0;
  let totalAmount = 0;
  let totalDamage = 0;


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
          // createBillAttachment(
          //   `/fino/FinancialStatement/CreateBillAttatchment`,
          //   payload,
          //   () => {
          //     setFileObjects([]);
          //     ViewOnChangeHandler(values);
          //   },
          //   true
          // );
        } else {
          toast.warning("Upload Failed");
        }
      });
    };
  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th
              onClick={() => allSelect(!selectedAll())}
              className="text-center cursor-pointer"
              style={{ width: "40px" }}
            >
              <input
                type="checkbox"
                value={selectedAll()}
                checked={selectedAll()}
                onChange={() => {}}
              />
            </th>
            <th>SL</th>
            <th>Challan No</th>
            <th>Delivery Date</th>
            <th>Item Name</th>
            <th>Item Price</th>
            <th>Delivery Quantity</th>
            <th>Amount</th>
            {/* <th style={{ width: "120px" }}>Return Qty</th> */}
            <th style={{ width: "120px" }}>Tolarance Qty</th>
            <th>Remaining Qty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.map((item, index) => {
            return (
              <>
                <tr key={index}>
                  <td
                    onClick={() => {
                      let _data = [...gridData];
                      _data[index]["isSelected"] = !item.isSelected;
                      setGridData(_data);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td rowSpan={item?.rowData?.length}> {index + 1}</td>
                  <td rowSpan={item?.rowData?.length}> {item?.deliveryCode}</td>
                  <td rowSpan={item?.rowData?.length}>
                    {" "}
                    {_dateFormatter(item?.deliveryDate)}
                  </td>
                  {item?.rowData?.map((element, rowIndex) => {
                    totalDeliveryQty += element?.quantity;
                    totalAmount += element?.amount;
                    totalDamage += element?.returnQty;
                    return (
                      <>
                        <td>{element?.itemName}</td>
                        <td className="text-right">
                          {_fixedPoint(element?.itemPrice, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(element?.quantity, true)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(element?.amount, true)}
                        </td>
                        {/* <td className="text-right">
                          {item?.isSelected ? (
                            <InputField
                              value={item?.returnQty}
                              name="returnQty"
                              placeholder="Return qty"
                              type="number"
                              min={"0.2"}
                              onChange={(e) => {
                                dataChangeHandler(
                                  index,
                                  rowIndex,
                                  "returnQty",
                                  +e?.target?.value
                                );
                              }}
                              onBlur={(e) => {
                                if (+e?.target?.value > element?.quantity) {
                                  toast.warn(
                                    "Return qty can not be greater than delivery qty"
                                  );
                                }

                                if (+e?.target?.value < 0.2) {
                                  toast.warn(
                                    "Return qty can not be less than 0.2"
                                  );
                                }
                              }}
                            />
                          ) : (
                            item?.returnQty
                          )}
                        </td> */}
                        <td className="text-right">
                          {_fixedPoint(element?.quantity * (2 / 100), true)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(element?.quantity - element?.returnQty)}
                        </td>
                        <td className="text-center">
                          <ICon
                            title={`${
                              item?.attatchment?.length
                                ? "View Attachment"
                                : "Upload Attachment"
                            }`}
                            onClick={(e) => {
                              if (item?.attatchment?.length > 0) {
                                if (item?.attatchment?.length > 1) {
                                  setAttachmentItemList(item?.attatchment);
                                  setAttachmentListModal(true);
                                } else {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      item?.attatchment[0]
                                    )
                                  );
                                }
                              } else {
                                // e.preventDefault();
                                setBillId(1);
                              }
                            }}
                          >
                            <i class="far fa-file-image"></i>
                          </ICon>
                        </td>
                      </>
                    );
                  })}
                </tr>
              </>
            );
          })}
          <tr style={{ textAlign: "right", fontWeight: "bold" }}>
            <td colSpan={6} className="text-right">
              <b>Total</b>
            </td>
            <td>{_fixedPoint(totalDeliveryQty, true)}</td>
            <td>{_fixedPoint(totalAmount, true)}</td>
            <td>{_fixedPoint(totalDamage, true, 0)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <>
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
      </>
      <>
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
    </>
  );
}
