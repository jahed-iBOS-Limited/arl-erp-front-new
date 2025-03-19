/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { useEffect } from "react";
import NewSelect from "../../../../_helper/_select";
import { useParams } from "react-router-dom";
import {
  getShopFloorReferenceCodeDDL,
  getShopFloorTransferDDL,
  getShopFloorItemDDL,
  getInventoryTransactionData,
  getShopFloorFGItemDDL,
} from "../helper";

// Validation schema for bank payment
const validationSchema = Yup.object().shape({});
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  remover,
  setter,
  profileData,
  selectedBusinessUnit,
  location,
  transactionTypeDDL,
  shopFloorRefCodeDDL,
  setShopFloorRefCodeDDL,
  transerDDL,
  setTransferDDL,
  itemDDL,
  setItemDDL,
}) {
  const { viewId } = useParams();

  console.log("itemDDL: ", itemDDL);

  useEffect(() => {
    if (location?.state?.selectedTransactionType?.value) {
      getShopFloorReferenceCodeDDL(
        location?.state?.selectedTransactionType?.value,
        location?.state?.selectedPlant?.value,
        location?.state?.selectedShopFloorDDL?.value,
        setShopFloorRefCodeDDL
      );
    }

    // Load All Item Initially By Landing Page Data
    if (location?.state?.selectedPlant?.value) {
      if (location?.state?.selectedTransactionType?.value === 4) {
        getShopFloorFGItemDDL(
          profileData.accountId,
          selectedBusinessUnit.value,
          location?.state?.selectedPlant?.value,
          location?.state?.selectedShopFloorDDL?.value,
          setItemDDL
        );
      } else {
        getShopFloorItemDDL(
          profileData.accountId,
          selectedBusinessUnit.value,
          location?.state?.selectedPlant?.value,
          location?.state?.selectedShopFloorDDL?.value,
          setItemDDL
        );
      }

      getShopFloorReferenceCodeDDL(
        location?.state?.selectedTransactionType?.value,
        location?.state?.selectedPlant?.value,
        location?.state?.selectedShopFloorDDL?.value,
        setShopFloorRefCodeDDL
      );
      getShopFloorTransferDDL(
        location?.state?.selectedTransactionType?.value,
        location?.state?.selectedPlant?.value,
        location?.state?.selectedShopFloorDDL?.value,
        setTransferDDL
      );
    }
  }, [location]);
  return (
    <>
      <Formik
        initialValues={{
          ...initData,
          referenceType: {
            value: location?.state?.selectedTransactionType?.value,
            label: location?.state?.selectedTransactionType?.label,
          },
          receiveFrom: rowDto[0]?.wareHouseName,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
            getShopFloorReferenceCodeDDL(
              values?.referenceType?.value,
              location?.state?.selectedPlant?.value,
              location?.state?.selectedShopFloorDDL?.value,
              setShopFloorRefCodeDDL
            );
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
          isValid,
        }) => (
          <>
            <Form>
              <div className="row mt-2">
                <div className="col-lg-12 p-0 m-0">
                  <div className="row global-form py-2 px-0 m-0">
                    <div className="col-lg-3 pb-2">
                      <label>Plant Name</label>
                      <IInput
                        value={location?.state?.selectedPlant?.label || ""}
                        name="plantName"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <label>Shop Floor</label>
                      <IInput
                        value={
                          location?.state?.selectedShopFloorDDL?.label || ""
                        }
                        name="transferFrpm"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-4"></div>
                    <div className="col-lg-3 pb-2">
                      <IInput
                        value={values?.transactionDate || ""}
                        label="Transaction Date"
                        name="transactionDate"
                        type="date"
                        disabled={viewId}
                        placeholder="Transaction Date"
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <NewSelect
                        name="referenceType"
                        options={transactionTypeDDL}
                        value={values?.referenceType || ""}
                        onChange={(valueOption) => {
                          setFieldValue("transferTo", "");
                          setFieldValue("referenceCode", "");
                          setFieldValue("receiveFrom", "");
                          setFieldValue("item", "");
                          setFieldValue("qty", "");
                          setFieldValue("checkbox", false);
                          setRowDto([]);
                          getShopFloorReferenceCodeDDL(
                            valueOption?.value,
                            location?.state?.selectedPlant?.value,
                            location?.state?.selectedShopFloorDDL?.value,
                            setShopFloorRefCodeDDL
                          );
                          getShopFloorTransferDDL(
                            valueOption?.value,
                            location?.state?.selectedPlant?.value,
                            location?.state?.selectedShopFloorDDL?.value,
                            setTransferDDL
                          );
                          if (valueOption?.value === 4) {
                            getShopFloorFGItemDDL(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              location?.state?.selectedPlant?.value,
                              location?.state?.selectedShopFloorDDL?.value,
                              setItemDDL
                            );
                          } else {
                            getShopFloorItemDDL(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              location?.state?.selectedPlant?.value,
                              location?.state?.selectedShopFloorDDL?.value,
                              setItemDDL
                            );
                          }
                          setFieldValue("referenceCode", "");
                          setFieldValue("referenceType", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Transaction Type"
                        placeholder="Transaction Type"
                        isDisabled={viewId}
                      />
                    </div>

                    <div className="col-lg-3 pb-2">
                      <NewSelect
                        name="referenceCode"
                        options={shopFloorRefCodeDDL}
                        value={values?.referenceCode || ""}
                        onChange={(valueOption) => {
                          setFieldValue("referenceCode", valueOption);
                          setFieldValue(
                            "receiveFrom",
                            valueOption?.description
                          );
                          getInventoryTransactionData(
                            values?.referenceType?.value,
                            valueOption?.label,
                            setRowDto
                          );
                        }}
                        errors={errors}
                        touched={touched}
                        label="Reference Code"
                        placeholder="Reference Code"
                        isDisabled={
                          values?.referenceType?.label ===
                            "Transfer to Warehouse" ||
                          values?.referenceType?.label ===
                            "Transfer to Shop Floor" ||
                          values?.referenceType?.label === "Adjustment" ||
                          viewId
                        }
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <IInput
                        value={values?.receiveFrom || ""}
                        label="Receive From"
                        name="receiveFrom"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pb-2">
                      <NewSelect
                        name="transferTo"
                        options={transerDDL}
                        value={values?.transferTo}
                        onChange={(valueOption) => {
                          setFieldValue("transferTo", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Transfer To"
                        placeholder="Transfer To"
                        isDisabled={
                          values?.referenceType?.value === 2 ||
                          values?.referenceType?.value === 3 ||
                          values?.referenceType?.value === 6 ||
                          values?.referenceType?.value === "Adjustment" ||
                          viewId
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 mt-2 p-0">
                  {/* Table Header input */}
                  {!viewId && (
                    <div className="row global-form px-0">
                      <div className="col-lg-3">
                        <NewSelect
                          name="item"
                          options={itemDDL}
                          value={values?.item}
                          onChange={(valueOption) => {
                            setFieldValue("item", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          label="Item"
                          placeholder="Item"
                          isDisabled={
                            values?.referenceType?.value === 2 ||
                            values?.referenceType?.value === 3 ||
                            viewId
                          }
                        />
                      </div>

                      {values?.referenceType?.value === 4 && (
                        <div className="col-lg-1 d-flex align-items-center">
                          <label className="pr-1">All Item</label>
                          <input
                            value={values?.checkbox}
                            name="checkbox"
                            checked={values?.checkbox}
                            type="checkbox"
                            onChange={(e) => {
                              setFieldValue("checkbox", e.target.checked);
                              setRowDto([]);
                              setFieldValue("qty", "");
                            }}
                            disabled={viewId}
                          />
                        </div>
                      )}

                      {!values?.checkbox && (
                        <div className="col-lg-3">
                          <IInput
                            value={values?.qty || ""}
                            label="Quantity"
                            name="qty"
                            min="0"
                            step="any"
                            type="number"
                            disabled={
                              values?.referenceType?.value === 2 ||
                              values?.referenceType?.value === 3 ||
                              viewId
                            }
                            onChange={(e) => {
                              if (e.target.value >= 0) {
                                setFieldValue("qty", e.target.value);
                              } else {
                                setFieldValue("qty", "");
                              }
                            }}
                          />
                        </div>
                      )}

                      <div className="col-lg-1">
                        <button
                          type="button"
                          disabled={
                            (!values?.checkbox && !values?.item) ||
                            (!values?.checkbox && !values?.qty) ||
                            viewId
                          }
                          className="btn btn-primary mt-5"
                          onClick={() => {
                            setFieldValue("transaction", "");
                            setFieldValue("amount", "");
                            setFieldValue("narration", "");
                            setter(values);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}{" "}
                  {/* Table Header input end */}
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  {values?.referenceType?.value !== 4 && (
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className={"table global-table mt-0"}>
                            <thead className={rowDto?.length < 1 && "d-none"}>
                              <tr>
                                <th style={{ width: "20px" }}>SL</th>
                                <th style={{ width: "100px" }}>Item code</th>
                                <th style={{ width: "100px" }}>Item Name</th>

                                <th style={{ width: "100px" }}>UoM</th>
                                <th style={{ width: "100px" }}>Quantity</th>
                                {!viewId && (
                                  <th style={{ width: "50px" }}>Actions</th>
                                )}
                              </tr>
                            </thead>
                            {rowDto?.length > 0 && (
                              <tbody>
                                {rowDto?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className="text-center">
                                        {item?.item?.code ||
                                          item?.strInventoryTransactionCode ||
                                          item?.itemCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.item?.label ||
                                          item?.strItemName ||
                                          item?.itemName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.item?.baseUomName ||
                                          item?.strUoMname ||
                                          item?.uoMname ||
                                          item?.description ||
                                          item?.item?.description}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-center">
                                        {item?.qty ||
                                          item?.numTransactionQuantity ||
                                          item?.transactionQuantity}
                                      </div>
                                    </td>
                                    {!viewId && (
                                      <td className="text-center">
                                        <IDelete remover={remover} id={index} />
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                  {values?.referenceType?.value === 4 && (
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className={"table global-table mt-0"}>
                            <thead className={rowDto?.length < 1 && "d-none"}>
                              <tr>
                                <th style={{ width: "20px" }}>SL</th>
                                <th style={{ width: "100px" }}>Item Name</th>
                                <th style={{ width: "100px" }}>Item code</th>
                                <th style={{ width: "100px" }}>UoM</th>
                                {!viewId && (
                                  <th style={{ width: "100px" }}>
                                    Current Stock
                                  </th>
                                )}
                                <th style={{ width: "100px" }}>Quantity</th>
                                {!viewId && (
                                  <th style={{ width: "50px" }}>Actions</th>
                                )}
                              </tr>
                            </thead>
                            {rowDto?.length > 0 && (
                              <tbody>
                                {rowDto?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.item?.label ||
                                          item?.strItemName ||
                                          item?.itemName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-center">
                                        {item?.item?.code ||
                                          item?.strInventoryTransactionCode ||
                                          item?.itemCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.item?.baseUomName ||
                                          item?.strUoMname ||
                                          item?.uoMname ||
                                          item?.description ||
                                          item?.item?.description}
                                      </div>
                                    </td>
                                    {!viewId && (
                                      <td>
                                        <div className="text-right pr-2">
                                          {item?.item?.currentStock}
                                        </div>
                                      </td>
                                    )}
                                    <td style={{ width: "70px" }}>
                                      <div className="text-center">
                                        {viewId ? (
                                          item.item.transactionQuantity
                                        ) : (
                                          <IInput
                                            value={item?.qty || ""}
                                            name="qty"
                                            type="number"
                                            step="any"
                                            onChange={(e) => {
                                              const copy = [...rowDto];
                                              if (e.target.value >= 0) {
                                                copy[index].qty =
                                                  e.target.value;
                                              } else {
                                                copy[index].qty = "";
                                              }
                                              setRowDto(copy);
                                            }}
                                          />
                                        )}
                                      </div>
                                    </td>
                                    {!viewId && (
                                      <td className="text-center">
                                        <IDelete remover={remover} id={index} />
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Row Dto Table End */}

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
