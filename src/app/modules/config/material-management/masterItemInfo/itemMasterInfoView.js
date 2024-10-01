/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  businessUnit: "",
  itemSubCategoryName: "",
  itemCategoryName: "",
  itemTypeName: "",
  itemMasterName: "",
};

export default function MasterItemView() {
  const { id } = useParams();
  const [rowData, getRowData, rowDataLoading, setRowData] = useAxiosGet();

  const [objProps, setObjprops] = useState({});
  const [singleData, setSingleData] = useState({});
  const location = useLocation();

  const {
    itemMasterCategoryName,
    itemMasterTypeName,
    itemMasterName,
    itemMasterSubCategoryName,
    purchaseOrganizationName,
  } = location?.state || {};

  const saveHandler = (values, cb) => {};
  useEffect(() => {
    if (id) {
      const editedInitData = {
        itemSubCategoryName: itemMasterSubCategoryName,
        itemCategoryName: itemMasterCategoryName,
        itemTypeName: itemMasterTypeName,
        itemMasterName: itemMasterName,
        businessUnit: "",
        isSerialMaintain: false,
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
          {rowDataLoading && <Loading />}
          <IForm
            customTitle={`Item Extend`}
            isHiddenSave={true}
            isHiddenReset={true}
            getProps={setObjprops}
          >
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
                        <th>Purchase Organization</th>
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
                        <td className="text-left">
                          {purchaseOrganizationName || ""}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
