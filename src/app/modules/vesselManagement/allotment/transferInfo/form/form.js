import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getItemTypeData } from "../../g2gItemInfo/helper";
import { getItemData } from "../helper";
// import { BADCBCICForm } from "../../../common/components";

export default function _Form({
  buId,
  accId,
  title,
  rowDto,
  addRow,
  history,
  initData,
  setRowDto,
  removeRow,
  allSelect,
  selectedAll,
  saveHandler,
  shipPointDDL,
  rowDataHandler,
  getTransferOutedItems,
}) {
  const [itemDDL, setItemDDL] = useState([]);
  const [itemTypeDDL, setItemTypeDDL] = useState([]);
  useEffect(() => {
    getItemTypeData(accId, buId, setItemTypeDDL);
  }, [accId, buId]);

  const rowLen = rowDto?.length;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => {
              resetForm();
            }}
            saveHandler={() => {
              saveHandler(values, () => {
                resetForm();
              });
            }}
            saveDisabled={
              !values?.transactionType ||
              !values?.shipPoint ||
              !values?.toShipPoint ||
              !rowLen
            }
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                {/* <BADCBCICForm
                  values={values}
                  setFieldValue={setFieldValue}
                  disabled={type}
                /> */}

                <div className="col-lg-3">
                  <InputField
                    value={values?.transactionDate}
                    name="transactionDate"
                    placeholder="Transaction Date"
                    label="Transaction Date"
                    type="date"
                    disabled={rowLen}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="transactionType"
                    options={[
                      { value: 5, label: "Transfer In" },
                      { value: 19, label: "Transfer Out" },
                    ]}
                    value={values?.transactionType}
                    label="Transaction Type"
                    onChange={(valueOption) => {
                      setFieldValue("transactionType", valueOption);
                      setRowDto([]);
                    }}
                    placeholder="Transaction Type"
                    isDisabled={values?.transactionType?.value === 19 && rowLen}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL || []}
                    value={values?.shipPoint}
                    label="From ShipPoint"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                      setRowDto([]);
                    }}
                    placeholder="From ShipPoint"
                    isDisabled={values?.transactionType?.value === 19 && rowLen}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="toShipPoint"
                    options={shipPointDDL || []}
                    value={values?.toShipPoint}
                    label="To ShipPoint"
                    onChange={(valueOption) => {
                      if (valueOption?.value === values?.shipPoint?.value) {
                        toast.warn(
                          `The same ShipPoint as "to ShopPoint" is not allowed! Please select another one.`
                        );
                      } else {
                        setFieldValue("toShipPoint", valueOption);
                        setRowDto([]);
                      }
                    }}
                    placeholder="To ShipPoint"
                    isDisabled={
                      (values?.transactionType?.value === 19 && rowLen) ||
                      !values?.shipPoint
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.comment}
                    name="comment"
                    placeholder="Comment"
                    label="Comment"
                    type="text"
                    disabled={values?.transactionType?.value === 19 && rowLen}
                  />
                </div>
                {values?.transactionType?.value === 5 && (
                  <IButton
                    colSize={"col-lg-9"}
                    onClick={() => {
                      getTransferOutedItems(values);
                    }}
                  />
                )}
                <div className="col-12"></div>

                {values?.transactionType?.value === 19 && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemType"
                        options={itemTypeDDL || []}
                        value={values?.itemType}
                        label="Item Type"
                        onChange={(valueOption) => {
                          setFieldValue("itemType", valueOption);
                          getItemData(
                            accId,
                            buId,
                            valueOption?.value,
                            setItemDDL
                          );
                          setFieldValue("item", "");
                        }}
                        placeholder="Item Type"
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemDDL || []}
                        value={values?.item}
                        label="Item Name"
                        disabled={!values?.itemType}
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        placeholder="Item"
                        isDisabled={!values?.itemType?.value}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.quantity}
                        name="quantity"
                        placeholder="Quantity"
                        label="Quantity"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        className="btn btn-primary mt-5"
                        type="button"
                        onClick={() => {
                          addRow(values, () => {
                            setFieldValue("item", "");
                            setFieldValue("quantity", "");
                            setFieldValue("itemType", "");
                          });
                        }}
                        disabled={
                          !values?.item?.value ||
                          !values?.quantity ||
                          !values?.transactionType?.value ||
                          !values?.shipPoint?.value ||
                          !values?.toShipPoint?.value
                        }
                      >
                        Add
                      </button>
                    </div>
                  </>
                )}
              </div>
              {rowDto?.length > 0 && (
                <div className="scroll-table _table">
                  <table className="global-table table table-font-size-sm">
                    <thead>
                      <tr>
                        {values?.transactionType?.value === 5 && (
                          <th
                            onClick={() => allSelect(!selectedAll())}
                            style={{ width: "30px" }}
                          >
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                        )}
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Transaction Type</th>
                        <th>From ShipPoint</th>
                        <th>To ShipPoint</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        {values?.transactionType?.value === 19 && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>
                    {values?.transactionType?.value === 19 && (
                      <tbody style={{ overflow: "scroll" }}>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.headerObject?.transactionTypeName}</td>
                            <td>{item?.headerObject?.fromshipPointName}</td>
                            <td>{item?.headerObject?.toShipPointName}</td>
                            <td>{item?.rowObject?.itemName}</td>
                            <td className="text-right">
                              {item?.rowObject?.transactionQuantity}
                            </td>
                            <td className="text-center">
                              <IDelete id={index} remover={removeRow} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                    {values?.transactionType?.value === 5 && (
                      <tbody style={{ overflow: "scroll" }}>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            {
                              <td
                                onClick={() => {
                                  rowDataHandler(
                                    "isSelected",
                                    index,
                                    !item.isSelected
                                  );
                                }}
                                className="text-center"
                                style={
                                  item?.isSelected
                                    ? {
                                        backgroundColor: "#aacae3",
                                        width: "30px",
                                      }
                                    : { width: "30px" }
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.isSelected}
                                  checked={item?.isSelected}
                                  onChange={() => {}}
                                />
                              </td>
                            }
                            <td>{index + 1}</td>
                            <td>Transfer In</td>
                            <td>{item?.fromShipPointName}</td>
                            <td>{item?.toShipPointName}</td>
                            <td>{item?.itemName}</td>
                            <td className="text-right">
                              {item?.transactionQuantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              )}
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
