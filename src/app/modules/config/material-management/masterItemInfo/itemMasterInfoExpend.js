import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
const initData = {
  businessUnit: "",
  itemSubCategoryName: "",
  itemCategoryName: "",
  itemTypeName: "",
  itemMasterName: "",
  uomName: "",
};

export default function MasterItemExpend() {
  const { id } = useParams();
  const [rowData, getRowData, rowDataLoading, setRowData] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const {
    profileData: { accountId: userId },
    businessUnitList: businessUnitDDL,
  } = useSelector((state) => state?.authData, shallowEqual);
  const location = useLocation();

  const {
    accountId,
    itemMasterTypeId,
    itemMasterCategoryId,
    itemMasterCategoryCode,
    itemMasterCategoryName,
    itemMasterTypeName,
    itemMasterName,
    itemMasterSubCategoryName,
    uomDTO,
  } = location?.state || {};
  const saveHandler = (values, cb) => {
    if (id) {
      const buListforPayload = rowData?.businessUnit
        ?.filter((item) => item?.isNewBusinessUnitAdded === true) // Filter the list for isNewBusinessUnitAdded = true
        .map((item) => {
          return {
            businessUnitId: item?.businessUnitId,
            businessUnitName: item?.businessUnitName,
            isSerialMaintain: item?.isSerialMaintain,
          };
        });
      const payload = {
        accountId: accountId,
        actionBy: userId,
        itemMasterId: +id,
        rows: buListforPayload,
      };
      if (buListforPayload?.length > 0) {
        postData(
          `/item/ItemMaster/CreateItemExtendFromMaster`,
          payload,
          () => {
            cb(
              getRowData(
                `/item/ItemMaster/GetMasterItemById?ItemMasterId=${id}`,
                (data) => {
                  setRowData(data);
                }
              )
            );
          },
          true
        );
      } else {
        toast.warn("Please add minimum one new Business Unit");
      }
    }
  };

  const addRow = (values, callBack) => {
    // Check if the supplier already exists in the rowData
    if (
      rowData?.businessUnit?.find(
        (item) => item?.businessUnitId === values?.businessUnit?.value
      )
    ) {
      return toast.warn("Business Unit already added");
    }
    try {
      // Create the new row object
      const newRow = {
        businessUnitId: values?.businessUnit?.value,
        businessUnitName: values?.businessUnit?.label,
        createdBy: userId,
        isNewBusinessUnitAdded: true,
        isSerialMaintain: values?.isSerialMaintain,
      };

      // Update rowData while keeping other fields intact
      setRowData({
        sl: rowData?.sl,
        itemMasterCategoryId: itemMasterCategoryId,
        accountId: accountId,
        itemMasterCategoryCode: itemMasterCategoryCode,
        itemMasterCategoryName: itemMasterCategoryName,
        itemMasterTypeId: itemMasterTypeId,
        itemMasterTypeName: itemMasterTypeName,
        businessUnit: [newRow, ...(rowData?.businessUnit || [])],
      });
      // Execute the callback after successfully updating the state
      callBack();
    } catch (e) {
      console.log(e);
    }
  };
  console.log("ee", uomDTO);
  useEffect(() => {
    if (id) {
      const editedInitData = {
        itemSubCategoryName: itemMasterSubCategoryName,
        itemCategoryName: itemMasterCategoryName,
        itemTypeName: itemMasterTypeName,
        itemMasterName: itemMasterName,
        businessUnit: "",
        isSerialMaintain: false,
        uomName: uomDTO?.baseUomName,
      };
      setSingleData(editedInitData);
    }

    if (id) {
      getRowData(
        `/item/ItemMaster/GetMasterItemById?ItemMasterId=${id}`,
        (data) => {
          setRowData(data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={singleData}
      // validationSchema={}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (rowData?.businessUnit?.length > 0) {
          saveHandler(values, () => {
            resetForm(initData);
          });
        } else {
          toast.warn("Please add minimum one Business Unit");
        }
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
          {/* {console.log("error", errors)} */}
          {(rowDataLoading || isLoading) && <Loading />}
          <IForm customTitle={`Item Extend`} getProps={setObjprops}>
            <Form onSubmit={handleSubmit}>
              <div className={`form-group  global-form row `}>
                <div className="col-lg-3">
                  <InputField
                    name="itemMasterName"
                    value={values?.itemMasterName}
                    disabled={true}
                    label="Item Name"
                    type="text"
                    placeholder="Item Name"
                    onChange={(e) => {
                      setFieldValue("itemMasterName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="uomName"
                    value={values?.uomName}
                    disabled={true}
                    label="UOM"
                    type="text"
                    placeholder="UOM"
                    onChange={(e) => {
                      setFieldValue("uomName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="itemTypeName"
                    value={values?.itemTypeName}
                    disabled={true}
                    label="Item Type Name"
                    type="text"
                    placeholder="Item Type Name"
                    onChange={(e) => {
                      setFieldValue("itemTypeName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="itemCategoryName"
                    value={values?.itemCategoryName}
                    disabled={true}
                    label="Item Category Name"
                    type="text"
                    placeholder="Item Category Name"
                    onChange={(e) => {
                      setFieldValue("itemCategoryName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="itemSubCategoryName"
                    value={values?.itemSubCategoryName}
                    disabled={true}
                    label="Item Sub Category Name"
                    type="text"
                    placeholder="Item Sub Category Name"
                    onChange={(e) => {
                      setFieldValue("itemSubCategoryName", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                    // isDisabled={id}
                  />
                </div>

                {(values?.businessUnit?.value === 138 ||
                  values?.businessUnit?.value === 186) && (
                  <div className="col-lg-1 d-flex align-items-center">
                    <div className="mr-2">isSerialize</div>
                    <input
                      type="checkbox"
                      name="isSerialMaintain"
                      //   value={data?.IsSerialMaintain}
                      checked={values?.isSerialMaintain}
                      id="isSerialMaintain"
                      onChange={(e) => {
                        setFieldValue("isSerialMaintain", e.target.checked);
                      }}
                    />
                  </div>
                )}

                <div className="col-lg-3 mt-5">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      addRow(values, () => {
                        setFieldValue("businessUnit", "");
                        setFieldValue("isSerialMaintain", false);
                      });
                    }}
                    disabled={!values?.businessUnit}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {rowData?.businessUnit?.length > 0 && (
                <div className="table-responsive">
                  <table
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="">
                        <th>SL</th>
                        <th>Business Unit</th>
                        <th>Item</th>
                        <th>Item Type</th>
                        <th>Category Name</th>
                        <th>Sub Category Name</th>
                      </tr>
                    </thead>
                    {rowData?.businessUnit?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td className="text-left">{item?.businessUnitName}</td>
                        <td className="text-left">{itemMasterName}</td>
                        <td className="text-left">
                          {itemMasterTypeName || ""}
                        </td>
                        <td className="text-left">
                          {itemMasterCategoryName || ""}
                        </td>
                        <td className="text-left">
                          {itemMasterSubCategoryName || ""}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              )}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
