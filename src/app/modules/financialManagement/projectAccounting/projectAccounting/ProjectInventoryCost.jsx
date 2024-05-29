import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import InputField from "../../../_helper/_inputField";
import { CardHeader, Card } from "@material-ui/core";
import { Form, Formik } from "formik";
import moment from "moment";
import {
  CardBody,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import axios from "axios";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import FormikError from "../../../_helper/_formikError";
import { DeleteOutlined } from "@ant-design/icons";
import { onAddItemRequestForProject } from "./projectApi";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import { toast } from "react-toastify";

const initialValues = {
  item: "",
  quantity: "",
  price: "",
  labor: "",
};
const ProjectInventoryCost = ({
  project,
  setProject,
  isEdit,
  inventoryItemList,
}) => {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const [itemList, setItemList] = useState([]);
  const [
    responseOfCreateItemRequest,
    createItemRequestForProject,
    loadingOnCreateItemRequestForProject,
  ] = useAxiosPost();

  useEffect(() => {
    if (isEdit && inventoryItemList?.length > 0) {
      const modifiedList = inventoryItemList.map((item) => ({
        ...item,
        itemCode: item?.intItemId,
        itemName: item?.strItem,
        strUom: item?.strUom,
        dteUpdatedAt: moment().format("YYYY-MM-DDThh:mm:ss"),
        intUpdatedBy: profileData?.userId,
      }));
      setItemList(modifiedList);
    }
    // eslint-disable-next-line
  }, [isEdit, inventoryItemList, profileData]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(values, { setFieldError, setValues }) => {
        onAddItemRequestForProject(
          project,
          profileData,
          selectedBusinessUnit,
          values,
          setFieldError,
          itemList,
          setItemList,
          setValues
        );
      }}
    >
      {({
        errors,
        touched,
        setFieldValue,

        values,
        handleSubmit,
      }) => (
        <>
          {loadingOnCreateItemRequestForProject && <Loading />}
          <Card>
            {true && <ModalProgressBar />}
            <div className="d-flex justify-content-between align-items-center">
              <CardHeader title={"Project Inventory"}></CardHeader>
              <ButtonStyleOne
                label="Save"
                type="button"
                disabled={
                  isEdit
                    ? itemList?.length <= 0
                    : (itemList.length === 0 && !project.id) ||
                      responseOfCreateItemRequest?.message ||
                      responseOfCreateItemRequest?.statusCode
                }
                style={{ marginRight: "15px", padding: "5px 15px" }}
                onClick={() => {
                  if (isEdit) {
                    if (!project?.intProjectId)
                      return toast.warn("Please create a project first");
                  } else {
                    if (!project?.id)
                      return toast.warn("Please create a project first");
                  }
                  createItemRequestForProject(
                    `/fino/ProjectAccounting/SaveProjectCostingInventory`,
                    itemList,
                    null,
                    true
                  );
                }}
              />
            </div>
            <CardBody className="pt-0 px-4">
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-md-3">
                    <label>Item</label>
                    <SearchAsyncSelect
                      selectedValue={values?.item}
                      handleChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                        setFieldValue("price", Math.ceil(valueOption?.price));
                      }}
                      loadOptions={(value) => {
                        if (value?.length < 2) return [];
                        return axios
                          .get(
                            `/fino/ProjectAccounting/ProjectCostingInventoryItemDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${value}`
                          )
                          .then((response) => {
                            return response.data;
                          });
                      }}
                      placeholder="Search by Item Name (min 3 letter)"
                    />
                    <FormikError
                      name="item"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-md-3">
                    <InputField
                      type="number"
                      value={values?.quantity}
                      label="Item Quantity"
                      onChange={(e) => {
                        setFieldValue("quantity", e.target.value);
                      }}
                    />
                    <FormikError
                      name="quantity"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <InputField
                      type="number"
                      value={values?.price}
                      label="Item Price"
                      onChange={(e) => {
                        setFieldValue("price", e.target.value);
                      }}
                    />
                    <FormikError
                      name="price"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <InputField
                      type="number"
                      value={values?.labor}
                      label="Labor Value"
                      onChange={(e) => {
                        setFieldValue("labor", e.target.value);
                      }}
                    />
                    {/* <FormikError
                      name="labor"
                      errors={errors}
                      touched={touched}
                    /> */}
                  </div>

                  <div className="col-md-3">
                    <div className="d-flex align-items-center flex align-items-end justify-content-between">
                      <ButtonStyleOne
                        label="Add"
                        type="button"
                        onClick={handleSubmit}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                  </div>
                </div>
              </Form>
              {/* <SubScheduleRDLCReport values={values} selectedBusinessUnit={selectedBusinessUnit} /> : null} */}
              {itemList?.length > 0 &&
                itemList?.some((item) => item?.isActive) && (
                  <div className="row" id="pdf-section">
                    <div className="col-lg-12">
                      <div className="print_wrapper">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>SL</th>
                                <th
                                  style={{
                                    width: "150px",
                                    textAlign: "center",
                                  }}
                                >
                                  Item Code
                                </th>
                                <th style={{ width: "200px" }}>
                                  <div className="text-left">Item Name</div>
                                </th>
                                <th style={{ width: "100px" }}>UOM</th>
                                <th
                                  style={{
                                    width: "150px",
                                    textAlign: "center",
                                  }}
                                >
                                  Quantity
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div>Price</div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div>Labor</div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div>Total</div>
                                </th>
                                <th style={{ width: "150px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemList?.map((item, index) =>
                                item?.isActive ? (
                                  <tr key={index + 1}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">
                                      {item?.itemCode}
                                    </td>
                                    <td>
                                      <div className="text-left">
                                        {item?.itemName}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      {item?.strUom}
                                    </td>
                                    <td className="text-center">
                                      {item?.numQty}
                                    </td>
                                    <td className="text-right">
                                      {item?.numPrice}
                                    </td>
                                    <td className="text-right">
                                      {item?.numLaborValue || ""}
                                    </td>
                                    <td className="text-right">
                                      {item?.numTotal}
                                    </td>
                                    <td className="text-center">
                                      <div className="text-center">
                                        <span onClick={() => {}}>
                                          <DeleteOutlined
                                            onClick={() => {
                                              let modifiedItemList = [];

                                              if (item?.intProjectInvId === 0) {
                                                modifiedItemList = itemList.filter(
                                                  (nestedItem) =>
                                                    nestedItem?.strItemCode !==
                                                    item?.strItemCode
                                                );
                                                setItemList(modifiedItemList);
                                              } else {
                                                modifiedItemList = itemList.map(
                                                  (nestedItem) =>
                                                    nestedItem?.strItemCode ===
                                                    item?.strItemCode
                                                      ? {
                                                          ...nestedItem,
                                                          isActive: false,
                                                        }
                                                      : nestedItem
                                                );
                                                setItemList(modifiedItemList);
                                              }
                                            }}
                                          />
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ) : null
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div></div>
                      </div>
                    </div>
                  </div>
                )}
            </CardBody>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default ProjectInventoryCost;
