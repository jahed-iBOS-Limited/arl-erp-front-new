import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import IViewModal from "../../../../_helper/_viewModal";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { empAttachment_action } from "../helper";
import AttachmentListTable from "./attachmentListTable";

export default function PartialChallanTable({ obj }) {
  const { gridData, allSelect, selectedAll, setGridData } = obj;
  const [attachmentListModal, setAttachmentListModal] = useState(false);
  const [attachmentItemList, setAttachmentItemList] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [selectItemRow, setSelectItemRow] = useState({});

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  let totalDeliveryQty = 0;
  let totalAmount = 0;
  let totalDamage = 0;

  return (
    <>
      <div className="table-responsive">
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
                    <td rowSpan={item?.rowData?.length}>
                      {" "}
                      {item?.deliveryCode}
                    </td>
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
                            {_fixedPoint(
                              element?.quantity - element?.returnQty
                            )}
                          </td>
                        </>
                      );
                    })}
                    <td className="text-center">
                      <div className="">
                        {item?.attatchment && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                getDownlloadFileView_Action(item?.attatchment)
                              );
                            }}
                          >
                            <ICon title={`View Attachment`}>
                              <i class="far fa-file-image"></i>
                            </ICon>
                          </span>
                        )}
                        {item?.isSelected && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpen(true);
                              setSelectItemRow({
                                rowIndex: index,
                                setGridData,
                              });
                            }}
                            className="ml-2 cursor-pointer"
                          >
                            <ICon title={`Upload Attachment`}>
                              <i class="fa fa-paperclip" aria-hidden="true"></i>
                            </ICon>
                          </span>
                        )}
                      </div>
                    </td>
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
      </div>

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
          filesLimit={1}
          acceptedFiles={["image/*", "application/pdf"]}
          fileObjects={fileObjects}
          cancelButtonText={"cancel"}
          submitButtonText={"submit"}
          maxFileSize={1000000}
          open={open}
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
            setOpen(false);
            setFileObjects([]);
            setSelectItemRow({});
          }}
          onSave={() => {
            setOpen(false);
            empAttachment_action(fileObjects)
              .then((data) => {
                const copyGridData = [...gridData];
                copyGridData[selectItemRow?.rowIndex].attatchment = data[0]?.id;
                setGridData(copyGridData);
                setOpen(false);
                setFileObjects([]);
                setSelectItemRow({});
              })
              .catch((err) => {
                console.log(err);
              });
          }}
          showPreviews={true}
          showFileNamesInPreview={true}
        />
      </>
    </>
  );
}
