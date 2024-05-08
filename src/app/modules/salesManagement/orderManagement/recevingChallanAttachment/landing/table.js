/* eslint-disable react-hooks/exhaustive-deps */
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { empAttachment_action } from "../helper";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const DamageEntryLandingTable = ({ obj }) => {
  const {
    values,
    // getRows,
    gridData,
    allSelect,
    selectedAll,
    setGridData,
    // cancelHandler,
    dataChangeHandler,
    // salesReturnApprove,
  } = obj;

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const dispatch = useDispatch();
  const [selectItemRow, setSelectItemRow] = useState({});
  const [fileObjects, setFileObjects] = useState([]);
  const [, onUpdateAttachment] = useAxiosPost();

  const [open, setOpen] = useState(false);

  return (
    <>
      {gridData?.data?.some((item) => item?.isSelected) && (
        <div className="text-right">
          <button
            className="btn btn-primary"
            onClick={() => {
              const selectedData = gridData?.data?.filter(
                (item) => item?.isSelected
              );
              const payload = selectedData?.map((item) => ({
                businessUnitId: selectedBusinessUnit?.value,
                salesreturnId: item?.salesReturnId,
                attachmentId: item?.attatchment || "",
                actionBy: profileData?.userId,
              }));

              onUpdateAttachment(
                `/oms/SalesReturnAndCancelProcess/UpdateReceivedChallanAttachment`,
                payload,
                ()=>{
                  setGridData(null)
                }
              );
            }}
            type="button"
          >
            Update Attachment
          </button>
        </div>
      )}
      {gridData?.data?.length > 0 && (
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
              <th>Customer Name</th>
              <th>Customer Code</th>
              <th style={{ width: "120px" }}>Quantity</th>
              <th style={{ width: "120px" }}>Amount</th>
              <th>Entry Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => (
              <tr key={index}>
                <td
                  onClick={() => {
                    let _data = [...gridData?.data];
                    _data[index]["isSelected"] = !item.isSelected;
                    setGridData({ ...gridData, data: _data });
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
                <td className="text-center"> {index + 1}</td>
                <td> {item?.deliveryChallan}</td>
                <td className="text-center">
                  {" "}
                  {_dateFormatter(item?.deliveryDate)}
                </td>
                <td> {item?.businessPartnerName}</td>
                <td> {item?.businessPartnerCode}</td>

                <td className="text-right">
                  {false
                    ? values?.viewAs?.value === 1 && (
                        <InputField
                          value={item?.totalReturnQty}
                          name="totalReturnQty"
                          placeholder="Quantity"
                          type="number"
                          min={0.2}
                          onChange={(e) => {
                            dataChangeHandler(
                              index,
                              "totalReturnQty",
                              +e?.target?.value
                            );
                          }}
                          onBlur={(e) => {
                            if (+e?.target?.value > item?.numDeliveryQnt) {
                              toast.warn(
                                "Damage qty can not be greater than delivery qty"
                              );
                            }

                            if (+e?.target?.value < 0.2) {
                              toast.warn("Return qty can not be less than 0.2");
                            }
                          }}
                        />
                      )
                    : _fixedPoint(item?.totalReturnQty, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(
                    item?.returnAmount || item?.totalReturnAmount,
                    true
                  )}
                </td>
                <td> {_dateFormatter(item?.returnDateTime)}</td>
                <td>
                  {item?.isApprovedBySupervisor && item?.isApprovedByAccount
                    ? "Approved by Supervisor and Account"
                    : item?.isApprovedBySupervisor
                    ? "Approved by Supervisor"
                    : !item?.isActive
                    ? "Canceled"
                    : "Pending"}
                </td>
                <td>
                  {/* <div className="d-flex justify-content-around">
                    {(!item?.isApprovedByAccount ||
                      !item?.isApprovedBySupervisor) &&
                      item?.isActive && (
                        <>
                          {!item?.isApprovedBySupervisor && (
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                cancelHandler(item, values);
                              }}
                            >
                              <IClose title="Cancel Sales Return" />
                            </span>
                          )}
                          {[2, 0].includes(values?.status?.value) &&
                            [2].includes(values?.viewAs?.value) && (
                              <span
                                onClick={() => {
                                  salesReturnApprove(values, item);
                                }}
                              >
                                <IApproval title="Approve the Sales Return" />
                              </span>
                            )}
                        </>
                      )}
                    <span>
                      <ICon
                        title={
                          item?.attatchment
                            ? "Show attached file"
                            : "File not attached"
                        }
                        onClick={() => {
                          if (item?.attatchment) {
                            dispatch(
                              getDownlloadFileView_Action(item?.attatchment)
                            );
                          }
                        }}
                      >
                        <i class="far fa-image"></i>{" "}
                      </ICon>
                    </span>
                  </div> */}

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
            ))}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td colSpan={5} className="text-right">
                <b>Total</b>
              </td>
              <td>
                {_fixedPoint(
                  gridData?.data?.reduce((a, b) => a + +b?.totalReturnQty, 0),
                  true
                )}
              </td>
              <td>
                {_fixedPoint(
                  gridData?.data?.reduce((a, b) => a + b?.totalReturnAmount, 0),
                  true
                )}
              </td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      )}
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
                const copyGridData = [...gridData?.data];
                copyGridData[selectItemRow?.rowIndex].attatchment = data[0]?.id;
                setGridData({ data: copyGridData });
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
};

export default DamageEntryLandingTable;
