import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
const initData = {
  businessUnit: "",
  itemSubCategoryName: "",
  itemCategoryName: "",
  itemTypeName: "",
};

export default function ItemSubCategoryExpend() {
  const { id } = useParams();
  const [rowData, getRowData, rowDataLoading, setRowData] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  // const [checkCategoryStatus, getCheckCategoryStatus] = useAxiosGet();
  const {
    profileData: { accountId: userId },
    businessUnitList: businessUnitDDL
  } = useSelector((state) => state?.authData, shallowEqual);
  const location = useLocation();

  const {
    accountId,
    itemMasterTypeId,
    itemMasterCategoryId,
    itemMasterCategoryCode,
    itemMasterCategoryName,
    itemMasterTypeName,
    itemMasterSubCategoryName
  } = location?.state || {};
  const saveHandler = (values, cb) => {
    if (id) {
      const buListforPayload = rowData?.businessUnit
        ?.filter((item) => item?.isNewBusinessUnitAdded === true) // Filter the list for isNewBusinessUnitAdded = true
        .map((item) => {
          return {
            businessUnitId: item?.businessUnitId,
          };
        });
      const payload = {
          itemMasterCategoryId: +itemMasterCategoryId,
          itemMasterSubCategoryId: +id,
          itemTypeId: +itemMasterTypeId,
          actionBy: userId,
          data: buListforPayload
        }
      if(buListforPayload?.length > 0) {
        postData(
          `/item/MasterCategory/CreateItemMasterSubCategoryExtend`,
          payload,
          () => {
            cb(
              getRowData(
                `/item/MasterCategory/GetItemMasterSubCategoryId?ItemMasterSubCategoryId=${id}`,
                (data) => {
                  setRowData(data);
                }
              )
            );
          },
          true
        );
      }else{
        toast.warn("Please add minimum one new Business Unit");
      }
    }
  };

const checkFunction = async(buId) => {
  // getCheckCategoryStatus(`/item/MasterCategory/CheckCategoryByBusinessUnitId?AccountId=${accountId}&BusinessUnitId=${buId}&ItemMasterCategoryId=${itemMasterCategoryId}`)
  try {
    const res = await axios.get(`/item/MasterCategory/CheckCategoryByBusinessUnitId?AccountId=${accountId}&BusinessUnitId=${buId}&ItemMasterCategoryId=${itemMasterCategoryId}`);
    if(res){
      return res?.data
    }
  } catch (error) {
    console.log(error);
   
  }
}

  const addRow = async (values, callBack) => {
    if (rowData?.businessUnit?.find((item) => item?.businessUnitId === values?.businessUnit?.value)) {
      return toast.warn("Business Unit already added");
    } 
   const checkCategoryStatus = await checkFunction(values?.businessUnit?.value)
    if (!checkCategoryStatus) {
      return toast.warn("Category not configured for this Business Unit");
    }

    try {
      // Create the new row object
      const newRow = {
        businessUnitId: values?.businessUnit?.value,
        businessUnitName: values?.businessUnit?.label,
        generalLedgerId: values?.generalLedger?.value,
        generalLedgerName: values?.generalLedger?.label,
        createdBy: userId,
        isNewBusinessUnitAdded: true,
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
          businessUnit: [newRow, ...(rowData?.businessUnit || [])]
      }); 
      // Execute the callback after successfully updating the state
      callBack();
    } catch (e) {
      console.log(e);
    }
  };
  
console.log("rowData", rowData)

  useEffect(() => {
    if (id) {
      const editedInitData = {
        itemSubCategoryName: itemMasterSubCategoryName,
        itemCategoryName: itemMasterCategoryName,
        itemTypeName: itemMasterTypeName,
        businessUnit: "",
      };
      setSingleData(editedInitData);
    }

    if (id) {
        getRowData(
            `/item/MasterCategory/GetItemMasterSubCategoryId?ItemMasterSubCategoryId=${id}`,
            (data) => {
              setRowData(data);
            }
        )
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
          <IForm
            customTitle={`Item Sub Category Extend`}
            getProps={setObjprops}
          >
            <Form onSubmit={handleSubmit}>
              <div className={`form-group  global-form row `}>
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
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={valueOption => {
                       setFieldValue('businessUnit', valueOption);
                    }}
                    // isDisabled={id}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      addRow(values, () => {
                        setFieldValue("businessUnit", "");
                      });
                    }}
                    disabled={!values?.businessUnit }
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
                        <th>Sub Category Name</th>
                        <th>Category Name</th>
                        <th>Item Type</th>
                        <th>Business Unit</th>
                      </tr>
                    </thead>
                    {rowData?.businessUnit?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td className="text-left">{itemMasterSubCategoryName || ''}</td>
                        <td className="text-left">{itemMasterCategoryName || ''}</td>
                        <td className="text-left">{itemMasterTypeName || ''}</td>
                        <td className="text-left">{item?.businessUnitName}</td>                      
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
