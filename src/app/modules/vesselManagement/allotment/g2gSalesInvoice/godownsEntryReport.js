import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useState } from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import InputField from "../../../_helper/_inputField";
import { empAttachment_action } from "./helper";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
const GodownsEntryReport = ({
  printRef,
  gridData,
  buUnName,
  values,
  setFieldValue,
  userPrintBtnClick,
  letterhead,
  updateInvoiceAttachentHandler,
}) => {
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState({});
  const motherVessel = values?.motherVessel?.label || "";
  const motherVesselName = motherVessel?.split("(")?.[0].trim();
  const dispatch = useDispatch();
  return (
    <>
      <div className="row global-form">
        <div className="col d-flex align-items-center justify-content-end">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {values?.godownsEntryAttachment && (
                <>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        getDownlloadFileView_Action(
                          values?.godownsEntryAttachment
                        )
                      );
                    }}
                    className="ml-2"
                    style={{
                      paddingTop: "5px",
                    }}
                  >
                    <i
                      style={{ fontSize: "16px" }}
                      className={`fa pointer fa-eye`}
                      aria-hidden="true"
                    ></i>
                  </span>
                </>
              )}

              <button
                type="button"
                className="btn btn-primary mt-2 mr-2"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <i class="fas fa-paperclip">Attachment</i>
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={() => {
                updateInvoiceAttachentHandler(values);
              }}
              disabled={!values?.godownsEntryAttachment}
            >
              Save
            </button>
          </span>
        </div>
      </div>
      <div ref={printRef} id="godownsEntryReport">
        <div
          className="invoice-header"
          style={{
            backgroundImage: `url(${letterhead})`,
            backgroundRepeat: "no-repeat",
            height: "150px",
            backgroundPosition: "left 10px",
            backgroundSize: "cover",
            position: "fixed",
            width: "100%",
            top: "-40px",
          }}
        ></div>
        <div
          className="invoice-footer"
          style={{
            backgroundImage: `url(${letterhead})`,
            backgroundRepeat: "no-repeat",
            height: "100px",
            backgroundPosition: "left bottom",
            backgroundSize: "cover",
            bottom: "-0px",
            position: "fixed",
            width: "100%",
          }}
        ></div>
        <table>
          <thead>
            <tr>
              <td
                style={{
                  border: "none",
                }}
              >
                {/* place holder for the fixed-position header */}
                <div
                  style={{
                    height: "110px",
                  }}
                ></div>
              </td>
            </tr>
          </thead>
          {/* CONTENT GOES HERE */}
          <tbody>
            <div style={{ margin: "-13px 50px 51px 50px" }}>
              <div>
                <div className="row">
                  <div className="col-lg-12">
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        marginBottom: "15px",
                      }}
                    >
                      তারিখ:{" "}
                      {userPrintBtnClick ? (
                        values?.godownsEntryTopDate
                      ) : (
                        <InputField
                          className="printFormat"
                          value={values?.godownsEntryTopDate}
                          name="fromDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue(
                              "godownsEntryTopDate",
                              e.target.value
                            );
                          }}
                        />
                      )}
                    </p>
                    <p>বরাবর</p>
                    <p>যুগ্ন পরিচালক ( সার )</p>
                    <p>বাংলাদেশ কৃষি উন্নায়ন কর্পোরেশন,</p>
                    <p>১/বি, আগ্রাবাদ বা/এ, চট্টগ্রাম।</p>
                    <p
                      style={{
                        margin: "15px 0",
                      }}
                    >
                      বিষয়: বি এ ডি সি কর্তৃক প্রেরিত কর্মসূচী মোতাবেক চট্টগ্রাম
                      হইতে বিভিন্ন গন্তব্য স্থলে পরিবহনকৃত সারের চুড়ান্ত
                      প্রতিবেদন ও ইনভয়েজ ইস্যু করণ প্রসঙ্গে ।
                    </p>
                    <p>জহাজের নাম: {motherVesselName}</p>
                    <p>সারের নাম: {values?.item?.label}</p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      কর্মসূচী নং: {values?.programNo}, তারিখ:{" "}
                      {userPrintBtnClick ? (
                        values?.godownsEntryBottomDate
                      ) : (
                        <InputField
                          value={values?.godownsEntryBottomDate}
                          className="printFormat"
                          name="fromDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue(
                              "godownsEntryBottomDate",
                              e.target.value
                            );
                          }}
                        />
                      )}{" "}
                      ইং ।
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th rowSpan={2}>SL</th>
                          <th rowSpan={2}>Godowns Name</th>
                          <th rowSpan={2}>Total Delivery(MT)</th>
                          <th rowSpan={2}>Bag</th>
                          <th rowSpan={2}>Empty Bag</th>
                          <th colSpan={2}>Sending</th>
                          <th rowSpan={2}>Remarks</th>
                        </tr>
                        <tr>
                          <th>Form</th>
                          <th>To</th>
                        </tr>
                      </thead>

                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.shipToPartnerName}</td>
                            <td className="text-right">
                              {item?.totalDeliveryQuantityTon}
                            </td>
                            <td className="text-right">
                              {item?.totalDeliveryQuantityBag}
                            </td>
                            <td className="text-right">{item?.emptyBag}</td>
                            <td>{_dateFormatter(item?.fromDate)}</td>
                            <td>{_dateFormatter(item?.toDate)}</td>
                            <td>{item?.remarks}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2}>
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_fixedPoint(
                                gridData?.reduce((acc, cur) => {
                                  return (acc +=
                                    +cur?.totalDeliveryQuantityTon || 0);
                                }, 0)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_fixedPoint(
                                gridData?.reduce((acc, cur) => {
                                  return (acc +=
                                    +cur?.totalDeliveryQuantityBag || 0);
                                }, 0)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_fixedPoint(
                                gridData?.reduce((acc, cur) => {
                                  return (acc += +cur?.emptyBag || 0);
                                }, 0)
                              )}
                            </b>
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginBottom: "95px",
                }}
              >
                <p>Thanking You</p>
                <p>{buUnName}</p>
              </div>
              <div>
                <span
                  style={{
                    borderTop: "1px solid #000",
                  }}
                >
                  Authorized Signatory
                </span>
              </div>
            </div>
          </tbody>

          <tfoot>
            <tr>
              <td
                style={{
                  border: "none",
                }}
              >
                {/* place holder for the fixed-position footer */}
                <div
                  style={{
                    height: "150px",
                  }}
                ></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <DropzoneDialogBase
        filesLimit={5}
        acceptedFiles={["image/*"]}
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
        onClose={() => setOpen(false)}
        onSave={() => {
          setOpen(false);
          empAttachment_action(fileObjects).then((data) => {
            setFieldValue("godownsEntryAttachment", data[0]?.id);
          });
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </>
  );
};
export default GodownsEntryReport;
