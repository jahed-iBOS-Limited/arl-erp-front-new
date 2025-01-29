import React from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const headers = [
  "SL",
  "Item Name",
  "Product Qty (Bag)",
  "Item Price",
  "Action",
];

export default function RowSection({ obj }) {
  const {
    itemList,
    values,
    errors,
    touched,
    onChangeHandler,
    setFieldValue,
    disableHandler,
    id,
    rowData,
    addRow,
    state,
    setRowData,
    deleteRow,
  } = obj;
  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <div className="col-lg-2">
              <NewSelect
                name="item"
                options={itemList || []}
                value={values?.item}
                label="Item Name"
                placeholder="Item Name"
                errors={errors}
                touched={touched}
                isDisabled={true}
                onChange={(e) => {
                  onChangeHandler("item", values, e, setFieldValue);
                }}
              />
            </div>

            <div className="col-lg-2">
              <InputField
                label="Product Quantity (Bag)"
                placeholder="Product Quantity (Bag)"
                value={values?.quantity || 0}
                name="quantity"
                onChange={(e) => {
                  // setFieldValue("quantity", e?.target?.value);
                  onChangeHandler("quantity", values, e, setFieldValue);
                }}
                type="text"
                disabled={disableHandler() || id}
              />
            </div>

            <div className="col-lg-2">
              <InputField
                label="Item Price"
                placeholder="Item Price"
                value={values?.itemPrice || 0}
                name="itemPrice"
                onChange={(e) => {}}
                type="number"
                disabled
              />
            </div>
            <div className="col-lg-2">
              <InputField
                label="LRR"
                placeholder=""
                value={values?.localRevenueRate || 0}
                name="localRevenueRate"
                onChange={(e) => {}}
                type="number"
                disabled
              />
            </div>
            <div className="col-lg-2">
              <InputField
                label="IRR"
                placeholder=""
                value={values?.internationalRevenueRate || 0}
                name="internationalRevenueRate"
                onChange={(e) => {}}
                type="number"
                disabled
              />
            </div>
            <div className="col-lg-2">
              <InputField
                label="MFR"
                placeholder=""
                value={values?.mothervasselFreightRate || 0}
                name="mothervasselFreightRate"
                onChange={(e) => {}}
                type="number"
                disabled
              />
            </div>

            <div className="col-lg-2">
              <InputField
                label="Empty Bag"
                placeholder="Empty Bag"
                value={values?.emptyBag || 0}
                name="emptyBag"
                type="text"
                disabled={disableHandler()}
                onChange={(e) => {
                  onChangeHandler("emptyBag", values, e, setFieldValue);
                }}
              />
            </div>
            <div className="col-lg-2 mt-5">
              <h5>
                Total Bag: {rowData?.reduce((a, b) => (a += +b?.quantity), 0)}
              </h5>
            </div>

            <div className="col-md-2 mt-5"></div>
            <div className="col-md-2 mt-5  text-right">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  addRow(values, (rows) => {
                    // setFieldValue("item", "");
                    setFieldValue("quantity", "");
                    setFieldValue(
                      "emptyBag",
                      rows?.reduce((a, b) => (a += b?.emptyBag), 0)
                    );
                  });
                }}
                disabled={
                  !values?.item ||
                  !values?.quantity ||
                  id ||
                  (state?.type === "badc"
                    ? !values?.motherVessel || !values?.port
                    : !values?.godown)
                }
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="row">
        <div className="col-md-6">
          {rowData?.length > 0 && (
            <div className="table-responsive">
              <table
                id="table-to-xlsx"
                className={
                  "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                }
              >
                <thead>
                  <tr className="cursor-pointer">
                    {headers?.map((th, index) => {
                      return <th key={index}> {th} </th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "40px" }} className="text-center">
                          {index + 1}
                        </td>
                        <td>{item?.itemName}</td>
                        <td className="text-right" width="130px">
                          {id ? (
                            <InputField
                              placeholder="Product QTY (Bag)"
                              value={item?.quantity}
                              name="quantity"
                              onChange={(e) => {
                                const value = e?.target?.value;
                                const data = [...rowData];
                                data[index].quantity = value;
                                setRowData(data);
                              }}
                              type="number"
                              style={{ textAlign: "right" }}
                            />
                          ) : (
                            item?.quantity
                          )}
                        </td>
                        <td className="text-right">{item?.itemPrice}</td>
                        {!id && (
                          <td style={{ width: "80px" }} className="text-center">
                            {
                              <div className="d-flex justify-content-around">
                                <span
                                  onClick={() => {
                                    deleteRow(index, (rows) => {
                                      setFieldValue(
                                        "emptyBag",
                                        rows?.reduce(
                                          (a, b) => (a += b?.emptyBag),
                                          0
                                        )
                                      );
                                    });
                                  }}
                                >
                                  <IDelete />
                                </span>
                              </div>
                            }
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
