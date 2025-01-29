import React, { useRef, useState } from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { downloadFile } from "../../../../_helper/downloadFile";
import { partnerListExcelGenerator, readAndPrintExcelData } from "./helper";
import Styles from "./partnerBulkUpload.module.css";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";

export default function PartnerBulkUpload() {
  const [objProps, setObjprops] = useState({});
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const inputFileRef = useRef(null);
  const [isValidationError, setIsValidationError] = useState(false);
  const [, savePartnerList, savePartnerListLoading] = useAxiosPost();

  // redux store
  const { userId, accountId } = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  const { value: buId } = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  // file change handler
  const handleFileChange = (e) => {
    setIsValidationError(false);
    const file = e?.target?.files[0];
    readAndPrintExcelData({
      file,
      setLoading,
      setIsValidationError,
      setRowData,
      cb: () => {
        inputFileRef.current.value = "";
      },
    });
  };

  // excel format download handler
  const handleExportExcelFormat = () => {
    downloadFile(
      `/domain/Document/DownlloadFile?id=638300520980375759_PartnerBulkUpload.xlsx`,
      "Partner List Excel Format",
      "xlsx",
      setLoading
    );
  };

  // submit handler
  const saveHandler = () => {
    if (isValidationError) {
      return toast.warn("Invalid data set! please update and try again");
    }
    if (!rowData?.length > 0) {
      return toast.warn("No partner found!");
    }
    const newPartnerList = rowData?.map((item) => {
      const newPartner = {
        businessUnitId: buId,
        accountId: accountId,
        actionBy: userId,
        businessPartnerName: item?.businessPartnerName || "",
        businessPartnerAddress: item?.businessPartnerAddress || "",
        propitor: item?.propitor || "",
        contactNumber: item?.contactNumber || "",
        contactPerson: item?.contactPerson || "",
        contactPersonNumber: item?.contactPersonNumber || "",
        email: item?.email || "",
        bin: item?.bin || "",
        licenseNo: item?.licenseNo || "",
        divisionName: item?.divisionName || "",
        districtName: item?.districtName || "",
        upazilaName: item?.upazilaName || "",
      };
      return newPartner;
    });

    const callback = (updatedList) => {
      setRowData(updatedList || []);
      setIsValidationError(false);
    };
    savePartnerList(`/partner/BusinessPartnerBasicInfo/CreateBusinessCustomerBulk`, newPartnerList, callback, true);
  };

  return (
    <>
      {(loading || savePartnerListLoading) && <Loading />}
      <IForm
        title="Partner Bulk Upload"
        getProps={setObjprops}
        renderProps={() => {
          return (
            <div>
              {/* <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  history.push('route here');
                }}
              >
                Create
              </button> */}
            </div>
          );
        }}
      >
        <div className={`form-group row global-form ${Styles["partner-bulk-upload-wrapper"]}`}>
          <button type="button" className="btn btn-primary" onClick={handleExportExcelFormat}>
            Export Excel Format
          </button>
          <input
            id="excel-upload"
            className="pointer d-none"
            type="file"
            accept=".xlsx"
            ref={inputFileRef}
            onChange={handleFileChange}
          />
          <label
            htmlFor="excel-upload"
            className={`btn btn-primary ml-10 ${Styles["import-excel-btn"]}`}
          >
            Import Excel
          </label>
          <button
            type="button"
            className="btn btn-primary ml-10"
            onClick={() => {
              partnerListExcelGenerator(rowData);
            }}
          >
            Export Excel
          </button>
        </div>

        {rowData?.length > 0 ? (
          <div className="common-scrollable-table two-column-sticky">
            <div className="scroll-table _table">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Partner Code</th>
                    <th>Business Partner Name</th>
                    <th>Business Partner Address</th>
                    <th>Propitor</th>
                    <th>Contact Number</th>
                    <th>Contact Person</th>
                    <th>Contact Person Number</th>
                    <th>Email</th>
                    <th>Bin Number</th>
                    <th>License No</th>
                    <th>Division Name</th>
                    <th>District Name</th>
                    <th>Upazila Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.businessPartnerCode || ""}</td>
                      <td className={!item?.businessPartnerName ? Styles["red-bg"] : ""}>
                        {item?.businessPartnerName || ""}
                      </td>
                      <td className={!item?.businessPartnerAddress ? Styles["red-bg"] : ""}>
                        {item?.businessPartnerAddress || ""}
                      </td>
                      <td className={!item?.propitor ? Styles["red-bg"] : ""}>
                        {item?.propitor || ""}
                      </td>
                      <td className={!item?.contactNumber ? Styles["red-bg"] : ""}>
                        {item?.contactNumber || ""}
                      </td>
                      <td className={!item?.contactPerson ? Styles["red-bg"] : ""}>
                        {item?.contactPerson || ""}
                      </td>
                      <td className={!item?.contactPersonNumber ? Styles["red-bg"] : ""}>
                        {item?.contactPersonNumber || ""}
                      </td>
                      <td>{item?.email || ""}</td>
                      <td>{item?.bin || ""}</td>
                      <td className={!item?.licenseNo ? Styles["red-bg"] : ""}>
                        {item?.licenseNo || ""}
                      </td>
                      <td>{item?.divisionName || ""}</td>
                      <td>{item?.districtName || ""}</td>
                      <td>{item?.upazilaName || ""}</td>
                      <td>{item?.status || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* hidded buttons */}
        <button
          type="button"
          style={{ display: "none" }}
          ref={objProps?.btnRef}
          onClick={saveHandler}
        ></button>

        <button
          type="button"
          style={{ display: "none" }}
          ref={objProps?.resetBtnRef}
          onClick={() => {
            setRowData([]);
            setIsValidationError(false);
          }}
        ></button>
      </IForm>
    </>
  );
}
