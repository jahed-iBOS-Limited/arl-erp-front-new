import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { getUOMList } from "../helper";
import Axios from "axios";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
// import { getCostElement } from "../helper"
// Validation schema
const validationSchema = Yup.object().shape({
  requestDate: Yup.string().required("Request Date is required"),
  validTill: Yup.string().required("Valid Till Date is required"),
  dueDate: Yup.string().required("Due Date is required"),
  // quantity: Yup.number().required('Quantity is required').min(1),
  actionType: Yup.object()
  .shape({
    value: Yup.number().required('Action For is required'),
    label: Yup.string().required('Action For is required'),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  //disableHandler,
  itemDDL,
  remover,
  addItemtoTheGrid,
  rowlebelData,
  id,
  location,
  onChangeForItemGroup,
  accountId,
  selectedBusinessUnit,
  plantId,
  whId,
  profileData,
}) {
  const [uomList, setUOMList] = useState([]);
  const [itemType, setItemType] = useState("");

  const [, getStockQty, stockQtyLoader] = useAxiosGet();

  const loadUserList = (v) => {
    return Axios.get(
      itemType === 1
        ? `/wms/ItemRequestDDL/GetItemForAssetTypeDDL?AccountId=${accountId}&BusinessUnitId=${
            selectedBusinessUnit?.value
          }&PlantId=${plantId || initData?.intPlantId}&WarehouseId=${whId ||
            initData?.intWarehouseId}&searchTerm=${v}`
        : itemType === 2
        ? `/wms/ItemRequestDDL/GetItemForServiceTypeDDL?AccountId=${accountId}&BusinessUnitId=${
            selectedBusinessUnit?.value
          }&PlantId=${plantId || initData?.intPlantId}&WarehouseId=${whId ||
            initData?.intWarehouseId}&searchTerm=${v}`
        : itemType === 3
        ? `/wms/ItemRequestDDL/GetItemForOthersTypeDDL?AccountId=${accountId}&BusinessUnitId=${
            selectedBusinessUnit?.value
          }&PlantId=${plantId || initData?.intPlantId}&WarehouseId=${whId ||
            initData?.intWarehouseId}&searchTerm=${v}`
        : ""
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        label: item?.labelAndCode,
      }));
      return updateList;
    });
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            {stockQtyLoader && <Loading />}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <div className="row global-form">
                    <div className="col-12">
                       <NewSelect
                        label="Action For"
                        options={[
                          { label: "Project", value: 1 },
                          { label: "Operation", value: 2 },
                        ]}
                        value={values?.actionType}
                        name="actionType"
                        onChange={(valueOption) => {
                          setFieldValue("actionType", valueOption || "");
                          setFieldValue("project", "");
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={id}
                      />
                    </div>
                    <div className="col-lg-12">
                      <NewSelect
                        label="Select Item Group"
                        options={[
                          { label: "Assets Item", value: 1 },
                          { label: "Others Item", value: 3 },
                        ]}
                        value={values?.itemGroup}
                        placeholder="Select Item Group"
                        name="itemGroup"
                        onChange={(valueOption) => {
                          setFieldValue("itemGroup", valueOption);
                          setFieldValue("item", "");
                          setItemType(valueOption?.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-12">
                      <InputField
                        value={values?.requestDate}
                        label="Request Date"
                        disabled={true}
                        type="date"
                        name="requestDate"
                      />
                    </div>
                    <div className="col-lg-12">
                      <InputField
                        value={values?.referenceId}
                        label="Reference No."
                        placeholder="Reference No."
                        name="referenceId"
                      />
                    </div>
                    {values?.actionType?.value === 1 && (
                      <div className="col-lg-12">
                        <label>Select Project</label>
                        <SearchAsyncSelect
                          isDisabled={id}
                          isSearchIcon
                          label="Select Project"
                          selectedValue={values?.project}
                          placeholder="Select Project"
                          name="project"
                          handleChange={(valueOption) => {
                            setFieldValue("project", valueOption);
                          }}
                          loadOptions={(value) => {
                            return Axios.get(
                              `/fino/ProjectAccounting/ProjectNameDDL?accountId=${accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${value}`
                            ).then((res) => {
                              return res.data;
                            });
                          }}
                        />
                      </div>
                    )}

                    <div className="col-lg-12">
                      <InputField
                        value={profileData?.departmentName}
                        label="Department"
                        placeholder="Department"
                        name="department"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Item Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.item}
                        handleChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                          getStockQty(
                            `/wms/InventoryTransaction/sprRuningQty?businessUnitId=${
                              selectedBusinessUnit?.value
                            }&whId=${whId || initData?.intWarehouseId}&itemId=${
                              valueOption?.value
                            }`,
                            (res) => {
                              setFieldValue("availableStockQty", res);
                            }
                          );
                          setFieldValue("itemUom", {
                            value: valueOption?.baseUoMId,
                            label: valueOption?.baseUoMName,
                          });

                          getUOMList(
                            valueOption?.value,
                            selectedBusinessUnit.value,
                            accountId,
                            setUOMList,
                            setFieldValue
                          );
                        }}
                        loadOptions={loadUserList}
                        isDisabled={!values?.itemGroup}
                        disabled={true}
                      />
                      <FormikError
                        errors={errors}
                        name="item"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <ISelect
                        label="Select UoM"
                        options={uomList}
                        value={values?.itemUom}
                        name="itemUom"
                        isDisabled={true}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        value={values?.availableStockQty}
                        type="number"
                        label="Available Stock Qty"
                        placeholder="Available Stock Qty"
                        name="availableStockQty"
                        min="0"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.quantity}
                        type="number"
                        label="Quantity"
                        placeholder="Quantity"
                        name="quantity"
                        min="0"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Purpose"
                        placeholder="Purpose"
                        name="remarks"
                      />
                    </div>
                    <div className="col-lg-1 mt-9">
                      <button
                        style={{ marginTop: "-7px" }}
                        className="btn btn-primary"
                        onClick={(e) => {
                          addItemtoTheGrid(values);
                          setFieldValue("item", "");
                          setFieldValue("itemUom", "");
                          setFieldValue("availableStockQty", "");
                          setFieldValue("quantity", "");
                          setFieldValue("remarks", "");
                        }}
                        type="button"
                        disabled={
                          !values?.remarks || !values?.item || !values?.quantity
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table
                      // style={{ marginTop: "20px" }}
                      className="global-table table"
                    >
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>Uom</th>
                          <th>Ref. No.</th>
                          <th>Request Qty.</th>
                          <th>Purpose</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowlebelData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center align-middle">
                              {index + 1}
                            </td>
                            <td className="">{item.itemName}</td>
                            <td className="">{item.uoMname}</td>
                            <td className="text-center align-middle table-input">
                              {item.referenceId ? item.referenceId : ""}
                            </td>
                            <td className="text-center align-middle table-input">
                              {item.requestQuantity}
                            </td>
                            <td className="">{item.remarks}</td>
                            <td className="text-center align-middle table-input">
                              <span onClick={() => remover(item.itemId)}>
                                <IDelete />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
