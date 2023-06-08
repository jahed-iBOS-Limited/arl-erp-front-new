/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import {
  getMaxItemDDL,
  editFileInfo,
  Attachment_action,
  getFileListDDL,
} from "../helper";
import { useSelector, shallowEqual } from "react-redux";
import { Field } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import IView from "../../../../_helper/_helperIcons/_view";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";

export const BasicInfo = ({
  values,
  setFieldValue,
  errors,
  touched,
  fileObjects,
  setFileObjects,
  outletId,
  collerCompanyDDL,
}) => {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.auth?.profileData;
  }, shallowEqual);
  const dispatch = useDispatch();
  const [maxSalesDLL, setMaxSalesDDL] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [imageDTO, setImageDTO] = useState([]);
  useEffect(() => {
    getMaxItemDDL(profileData?.accountId, setMaxSalesDDL);
    getFileListDDL(outletId, setImageDTO);
  }, [profileData?.accountId]);

  // billSubmitlHandler btn submit handler
  const fileDeleteSubmitlHandler = (outletFileId) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to delete attachment`,
      yesAlertFunc: () => {
        editFileInfo(outletFileId, imageDTO, setImageDTO);
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);
    //
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-3">
          <NewSelect
            label="Route Name"
            name="routeName"
            options={[]}
            value={values?.routeName}
            onChange={(valueOption) => {
              setFieldValue("routeName", valueOption);
              //   getBeatApiDDL(valueOption?.value,setBeatNameDDL )
            }}
            isDisabled={true}
            placeholder="Select Route Name"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            label="Market Name"
            name="beatName"
            options={[]}
            isDisabled={true}
            value={values?.beatName}
            onChange={(valueOption) => {
              setFieldValue("beatName", valueOption);
            }}
            placeholder="Select Market Name"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Outlet Name</label>
          <InputField
            value={values?.outletName}
            name="outletName"
            placeholder="Outlet Name"
            disabled={true}
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            label="Outlet Type"
            name="businessType"
            options={[]}
            isDisabled={true}
            value={values?.businessType}
            onChange={(valueOption) => {
              setFieldValue("businessType", valueOption);
            }}
            placeholder="Select Outlet Type"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Outlate Address</label>
          <InputField
            value={values?.outletAddress}
            name="outletAddress"
            placeholder="Outlate Address"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Owner Name</label>
          <InputField
            value={values?.ownerName}
            name="ownerName"
            placeholder="Owner Name"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Mobile Number</label>
          <InputField
            value={values?.mobileNumber}
            name="mobileNumber"
            placeholder="Mobile Number"
            type="number"
            errors={errors}
            disabled={true}
            touched={touched}
            min="0"
          />
        </div>
        <div className="col-lg-3">
          <label>Lattitude</label>
          <InputField
            value={values?.lattitude}
            name="lattitude"
            placeholder="Lattitude"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-3">
          <label>Longitude</label>
          <InputField
            value={values?.longitude}
            name="longitude"
            placeholder="Longitude"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Longitude</label>
          <InputField
            value={values?.longitude}
            name="longitude"
            placeholder="Longitude"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Trade License No.</label>
          <InputField
            value={values?.tradeLicense}
            name="tradeLicense"
            placeholder="Trade License No."
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            name="maxSales"
            options={maxSalesDLL}
            value={values?.maxSales || ""}
            label="Max Sales Item"
            onChange={(valueOption) => {
              setFieldValue("maxSales", valueOption);
            }}
            placeholder="Max Sales Item"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Average Sales Amount</label>
          <InputField
            value={values?.avgSalesAmount}
            name="avgSalesAmount"
            placeholder="Average Sales Amount"
            type="number"
            errors={errors}
            touched={touched}
            min="0"
          />
        </div>
        <div className="col-xl-1 col-lg-2 d-flex" style={{ marginTop: "20px" }}>
          <input
            style={{
              width: "15px",
              height: "15px",
              position: "relative",
              top: "3px",
            }}
            name="isColler"
            checked={values?.isColler}
            onChange={(e) => {
              setFieldValue("collerCompany", "");
              setFieldValue("isColler", e.target.checked);
            }}
            className=" mr-2"
            type="checkbox"
          />
          <label>Is Coller</label>
        </div>
        {values?.isColler === true && (
          <div className="col-lg-3">
            <NewSelect
              name="collerCompany"
              options={collerCompanyDDL || []}
              value={values?.collerCompany}
              label="Coller Company"
              onChange={(valueOption) => {
                setFieldValue("collerCompany", valueOption);
              }}
              placeholder="Coller Company"
              errors={errors}
              touched={touched}
            />
          </div>
        )}
        <div className="col-lg-2 pt-5">
          <label className="px-2">Is Profile Complete</label>
          <Field
            checked={values?.isComplete}
            name="isComplete"
            type="checkbox"
            errors={errors}
            touched={touched}
            // onChange={(e) => {
            //   if (e.target.checked) {
            //     setFieldValue("completeOrder", false);
            //   }
            //   setFieldValue("pendingOrder", e.target.checked);
            // }}
          />
        </div>
        <div className="col-lg-3">
          <button
            className="btn btn-primary mr-2 mt-5"
            type="button"
            onClick={() => setOpen(true)}
          >
            Attachment
          </button>
        </div>
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
          onClose={() => setOpen(false)}
          onSave={() => {
            Attachment_action(fileObjects, setImageDTO, outletId);
            setOpen(false);
          }}
          showPreviews={true}
          showFileNamesInPreview={true}
        />
      </div>
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Attachment Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {imageDTO?.map((item, index) => (
                <tr>
                  <td className="text-center"> {index + 1}</td>
                  <td>{item?.fileName}</td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <span
                        className="pointer"
                        onClick={() => {
                          dispatch(getDownlloadFileView_Action(item.fileId));
                        }}
                      >
                        <IView />
                      </span>
                      <span
                        className="edit"
                        onClick={() =>
                          fileDeleteSubmitlHandler(item.outletFileId)
                        }
                      >
                        <IDelete />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
