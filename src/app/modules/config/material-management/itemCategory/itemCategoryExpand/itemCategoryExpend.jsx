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
  generalLedger: "",
};

export default function ItemCategoryExpend() {
  const { id } = useParams();
  const [rowData, getRowData, rowDataLoading, setRowData] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const {
    profileData: { userId },
    businessUnitList: businessUnitDDL,
  } = useSelector((state) => state?.authData, shallowEqual);
  const location = useLocation();
  const [generalLedgerDDL, setGeneralLedgerDDL] = useState([]);

  const {
    accountId,
    itemMasterTypeId,
    itemMasterCategoryId,
    itemMasterCategoryCode,
    itemMasterCategoryName,
    itemMasterTypeName,
  } = location?.state || {};
  const saveHandler = (values, cb) => {
    if (id) {
      const buListforPayload = rowData?.businessUnit
        ?.filter((item) => item?.isNewBusinessUnitAdded === true) // Filter the list for isNewBusinessUnitAdded = true
        .map((item) => {
          return {
            businessUnitId: item?.businessUnitId,
            businessUnitName: item?.businessUnitName,
            generalLedgerId: item?.generalLedgerId,
            generalLedgerName: item?.generalLedgerName,
          };
        });
      const payload = {
        itemMasterCategoryId: +id,
        actionBy: userId,
        extend: buListforPayload,
      };
      if (buListforPayload?.length > 0) {
        postData(
          `/item/MasterCategory/CreateItemMasterCategoryExtend`,
          payload,
          () => {
            cb(
              getRowData(
                `/item/MasterCategory/GetItemCategoryId?ItemMasterCategoryId=${id}`,
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

  // const addRow = (values, callBack) => {
  //   if (rowData?.businessUnit?.find((item) => item?.supplierId === values?.supplier?.value)) {
  //     return toast.warn("Supplier already added");
  //   }
  //   try {
  //       const newRow = {
  //         businessUnitId: values?.businessUnit?.value,
  //         businessUnitName: values?.businessUnit?.label,
  //         generalLedgerId: values?.generalLedger?.value,
  //         generalLedgerName: values?.generalLedger?.label,
  //         createdBy: userId,
  //       };
  //       setRowData({
  //         sl: rowData?.sl,
  //         itemMasterCategoryId: rowData?.itemMasterCategoryId,
  //         accountId: rowData?.accountId,
  //         itemMasterCategoryCode: rowData?.itemMasterCategoryCode,
  //         itemMasterCategoryName: rowData?.itemMasterCategoryName,
  //         itemMasterTypeId: rowData?.itemMasterTypeId,
  //         itemMasterTypeName: rowData?.itemMasterTypeName,
  //         businessUnit: [...rowData?.businessUnit, newRow]
  //       });
  //         callBack();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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
        businessUnit: [newRow, ...(rowData?.businessUnit || [])],
      });
      // Execute the callback after successfully updating the state
      callBack();
    } catch (e) {
      console.log(e);
    }
  };

  console.log("rowData", rowData);

  useEffect(() => {
    if (id) {
      const { itemMasterCategoryName } = location?.state || {};
      const editedInitData = {
        itemCategoryName: itemMasterCategoryName,
        businessUnit: "",
        generalLedger: "",
      };
      setSingleData(editedInitData);
    }

    if (id) {
      getRowData(
        `/item/MasterCategory/GetItemCategoryId?ItemMasterCategoryId=${id}`,
        (data) => {
          setRowData(data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getGeneralLedgerDDL_api = async (groupId, buId) => {
    const id = groupId === 10 ? 1 : groupId === 9 ? 12 : 16;
    try {
      const res = await axios.get(
        `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerForItemCategoryDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=${id}`
      );
      if (res.status === 200 && res?.data) {
        const newData = res?.data?.map((itm) => ({
          value: itm?.generalLedgerId,
          label: itm?.generalLedgerName,
        }));
        setGeneralLedgerDDL(newData);
      }
    } catch (error) {}
  };
  const getGeneralLedgerDDL_api_forAsset = async (groupId, buId) => {
    try {
      const res = await axios.get(
        `/domain/BusinessUnitGeneralLedger/GetAssetDepreciationGLDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
      );
      if (res.status === 200 && res?.data) {
        const newData = res?.data?.map((itm) => ({
          value: itm?.generalLedgerId,
          label: itm?.generalLedgerName,
        }));
        setGeneralLedgerDDL(newData);
      }
    } catch (error) {}
  };

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
          <IForm customTitle={`Item Category Extend`} getProps={setObjprops}>
            <Form onSubmit={handleSubmit}>
              <div className={`form-group  global-form row `}>
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
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      itemMasterTypeId === 10
                        ? getGeneralLedgerDDL_api_forAsset(
                            itemMasterTypeId,
                            valueOption?.value
                          )
                        : getGeneralLedgerDDL_api(
                            itemMasterTypeId,
                            valueOption?.value
                          );
                      setFieldValue("generalLedger", "");
                    }}
                    // isDisabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="generalLedger"
                    options={generalLedgerDDL}
                    value={values?.generalLedger}
                    label="General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("generalLedger", valueOption);
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
                        setFieldValue("generalLedger", "");
                      });
                    }}
                    disabled={!values?.businessUnit || !values?.generalLedger}
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
                        <th>Category Name</th>
                        <th>Business Unit</th>
                        <th>General Ledger</th>
                      </tr>
                    </thead>
                    {rowData?.businessUnit?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td className="text-left">
                          {itemMasterCategoryName || ""}
                        </td>
                        <td className="text-left">{item?.businessUnitName}</td>
                        <td className="text-left">{item?.generalLedgerName}</td>
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
