import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IViewModal from "../../../_helper/_viewModal";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import IView from "../../../_helper/_helperIcons/_view";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import axios from "axios";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../App";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function TdsVdsChallan() {
  const [viewModal, setViewModal] = React.useState(false);
  const [clickRowData, setClickRowData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [isDisabled, setDisabled] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);
  const [, postData, isLoading] = useAxiosPost();
  const [, tdsvdschallanPost, tdsvdschallanIsLoading] = useAxiosPost();
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const commonGetGridData = (values) => {
    getTableData(
      `/fino/SupplierInvoiceInfo/TreasuryChallanAttachmentLanding?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
    );
  };
  useEffect(() => {
    commonGetGridData(initData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(tableData, "tableData");

  const dispatch = useDispatch();
  const treasuryChallanAttHandelar = (item) => {
    const payload = {
      headerId: item?.intId || 0,
      attachment: item?.strChallanAttached || "",
      challanNo: item?.strChallanNo || "",
    };

    postData(
      `/fino/SupplierInvoiceInfo/TreasuryChallanAttachment`,
      payload,
      () => {
        const tdsvdschallanDetailsList = item?.tdsvdschallanDetails?.map(
          (row) => {
            return {
              intRowId: row?.intRowId || 0,
              intTdsVdsHeaderId: 1,
              intSupplierId: row?.intSupplierId || 0,
              strSupplierName: row?.strSupplierName || "",
              strSupplierCode: row?.strSupplierCode || "",
              strTinBinNo: row?.strTinBinNo || "",
              numAmount: row?.numAmount || 0,
              email: row?.strSupplierEmail || "",
              strChallanAttached: `${APIUrl}/domain/Document/DownlloadFile?id=${item?.strChallanAttached}`,
            };
          }
        );
        tdsvdschallanPost(
          `https://automation.ibos.io/emailservice/tdsvdschallan`,
          tdsvdschallanDetailsList,
          () => {
            commonGetGridData(initData);
          },
        );
      },
      true
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // saveHandler(values, () => {
        //   resetForm(initData);
        // });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(tableDataLoader ||
            isLoading ||
            isDisabled ||
            tdsvdschallanIsLoading) && <Loading />}
          <IForm
            title="TDS VDS Challan"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                        setTableData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                        setTableData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      style={{
                        marginTop: "18px",
                      }}
                      className="btn btn-primary"
                      type="button"
                      disabled={!values?.fromDate || !values?.toDate}
                      onClick={() => {
                        commonGetGridData(values);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>TDS/VDS Type</th>
                          <th>Amount</th>
                          <th>Is Send</th>
                          <th>Challan No</th>
                          <th>Challan Attached</th>
                          <th style={{
                            width: "150px"
                          }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.length > 0 &&
                          tableData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>

                              <td>{item?.strTdsvdstype}</td>
                              <td>{_formatMoney(item?.numAmount)}</td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      checked={item?.isSend}
                                      disabled
                                    />
                                  </div>
                                </div>
                              </td>

                              <td>
                                {/* strChallanNo input */}
                                {item?.isSend ? (
                                  <>{item?.strChallanNo}</>
                                ) : (
                                  <>
                                    {" "}
                                    <InputField
                                      value={item?.strChallanNo}
                                      name="strChallanNo"
                                      placeholder="Challan No"
                                      type="text"
                                      onChange={(e) => {
                                        const copyData = [...tableData];
                                        copyData[index].strChallanNo =
                                          e.target.value;
                                        setTableData(copyData);
                                      }}
                                    />
                                  </>
                                )}
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {item?.strChallanAttached ? (
                                    <span
                                      className="cursor-pointer"
                                      onClick={() => {
                                        dispatch(
                                          getDownlloadFileView_Action(
                                            item?.strChallanAttached
                                          )
                                        );
                                      }}
                                    >
                                      <i className="fa fa-paperclip"></i>
                                    </span>
                                  ) : (
                                    "N/A"
                                  )}
                                </div>
                              </td>

                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* view icon */}
                                  <sapn
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setViewModal(true);
                                      setClickRowData(item);
                                    }}
                                  >
                                    <IView />
                                  </sapn>
                                  {/* {!item?.isSend && ( */}
                                  <>
                                    {" "}
                                    <sapn>
                                      {/* attachment icon */}
                                      <button
                                        className="btn btn-primary cursor-pointer"
                                        onClick={() => {
                                          setOpen(true);
                                          setClickRowData(item);
                                        }}
                                      >
                                        <i className="fa fa-paperclip"></i>
                                      </button>
                                    </sapn>
                                    <sapn>
                                      {/* save button */}
                                      <button
                                        className="btn btn-primary"
                                        disabled={
                                          !item?.strChallanNo ||
                                          !item?.strChallanAttached
                                        }
                                        onClick={() => {
                                          treasuryChallanAttHandelar(item);
                                        }}
                                        type="button"
                                      >
                                        <i className="fa fa-save"></i>
                                      </button>
                                    </sapn>
                                  </>
                                  {/* )} */}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
          {viewModal && (
            <>
              <IViewModal
                show={viewModal}
                onHide={() => {
                  setViewModal(false);
                  setClickRowData({});
                }}
              >
                {/* table tdsvdschallanDetails */}
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Supplier Name</th>
                        <th>Tin Bin No</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clickRowData?.tdsvdschallanDetails?.length > 0 &&
                        clickRowData?.tdsvdschallanDetails?.map(
                          (item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strSupplierName}</td>
                              <td>{item?.strTinBinNo}</td>
                              <td>{_formatMoney(item?.numAmount)}</td>
                            </tr>
                          )
                        )}
                      <tr>
                        <td colSpan="3" className="text-right">
                          <strong>Total</strong>
                        </td>
                        <td>
                          <strong>
                            {_formatMoney(
                              clickRowData?.tdsvdschallanDetails?.reduce(
                                (acc, cur) => acc + (+cur?.numAmount || 0),
                                0
                              )
                            )}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </IViewModal>
            </>
          )}
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
              setClickRowData({});
            }}
            onSave={() => {
              setOpen(false);

              attachmentUpload(fileObjects, setDisabled, (data) => {
                const copyData = [...tableData];
                const index = copyData.findIndex(
                  (item) => item?.intId === clickRowData?.intId
                );

                if (index > -1) {
                  copyData[index].strChallanAttached = data[0]?.id || "";
                  setTableData(copyData);
                }
                setClickRowData({});
              });
            }}
            showPreviews={true}
            showFileNamesInPreview={true}
          />
        </>
      )}
    </Formik>
  );
}

export const attachmentUpload = async (attachment, setDisabled, CB) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    setDisabled && setDisabled(true);
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setDisabled && setDisabled(false);
    CB(data);
    toast.success("File Attachment successfully");
    return data;
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error("Document not upload");
    throw new Error("Document not upload");
  }
};
