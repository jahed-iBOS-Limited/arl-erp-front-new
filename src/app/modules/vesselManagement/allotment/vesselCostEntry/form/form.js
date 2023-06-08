import { Form, Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function _Form({
  type,
  title,
  history,
  initData,
  allSelect,
  selectedAll,
  rowDto,
  setRowDto,
  saveHandler,
  rowDataHandler,
  rowDataHandlerExtra,
  commonGetByIdFunc,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            // saveHandler={() => {
            //   saveHandler(values, () => {});
            // }}
            saveHandler={
              type === "view"
                ? false
                : () => {
                    saveHandler(values, () => {});
                  }
            }
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    placeholder="Mother Vessel"
                    isDisabled={type}
                  />
                </div>
                {/* {type === "update" && (
                  <div className="col-lg-3">
                    <InputField
                      name="dollarRate"
                      value={values?.dollarRate}
                      label="Dollar Rate"
                      placeholder="Dollar Rate"
                      type="number"
                    />
                  </div>
                )} */}
                {type === "view" && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={
                        [
                          {
                            value: 0,
                            label: "All",
                          },
                          {
                            value: 1,
                            label: "Pending",
                          },
                          {
                            value: 2,
                            label: "Completed",
                          },
                        ] || []
                      }
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        commonGetByIdFunc(valueOption?.value);
                      }}
                      placeholder="All"
                    />
                  </div>
                )}

                {rowDto?.length > 0 && (
                  <>
                    <div className="col-12 mt-3 text-right">
                      <div className="d-flex">
                        <>
                          {" "}
                          <h5 className="mr-3 pr-2">
                            Total Quantity (Bags):{" "}
                            {_fixedPoint(
                              rowDto?.reduce(
                                (a, b) => (a += +b?.quantityBag || 0),
                                0
                              ),
                              true,
                              0
                            )}
                          </h5>
                          <h5 className="ml-3">
                            Total Revenue Amount (tk):{" "}
                            {rowDto?.reduce(
                              (a, b) =>
                                (a += b?.quantityBag * +b?.localRateTaka || 0),
                              0
                            )}
                          </h5>
                          <h5 className="ml-6">
                            Total Net Amount (tk):{" "}
                            {rowDto
                              ?.reduce(
                                (a, b) =>
                                  (a +=
                                    b?.quantityBag * b?.localRateTaka -
                                      b?.vatTax -
                                      b?.ld -
                                      b?.damarage -
                                      b?.others || 0),
                                0
                              )
                              .toFixed(2)}
                          </h5>
                        </>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <>
                {rowDto?.length > 0 && (
                  <div className="scroll-table _table">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table mt-0">
                        <thead>
                          <tr>
                            {type !== "view" && (
                              <th
                                onClick={() => allSelect(!selectedAll())}
                                style={{ width: "40px" }}
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
                            <th>GoDown Name</th>
                            <th style={{ width: "130px" }}>Quantity (Bag)</th>
                            <th>Local Rate (tk)</th>
                            <th>International Rate ($)</th>
                            <th>Amount (tk)</th>
                            <th>Amount ($)</th>
                            <th>Vat & Tax (Local)</th>
                            <th>Vat & Tax (International)</th>
                            <th>LD</th>
                            <th>Demurrage</th>
                            <th>Others</th>
                            <th>Bill Amount</th>
                          </tr>
                        </thead>
                        <tbody style={{ overflow: "scroll" }}>
                          {rowDto?.map((itm, index) => (
                            <tr key={index}>
                              {type !== "view" && (
                                <td
                                  onClick={() => {
                                    rowDataHandler(
                                      "isSelected",
                                      index,
                                      !itm.isSelected
                                    );
                                  }}
                                  className="text-center"
                                  style={
                                    itm?.isSelected
                                      ? {
                                          backgroundColor: "#aacae3",
                                          width: "40px",
                                        }
                                      : { width: "40px" }
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    value={itm?.isSelected}
                                    checked={itm?.isSelected}
                                    onChange={() => {}}
                                  />
                                </td>
                              )}
                              <td>{index + 1}</td>
                              <td>{itm?.goDownName}</td>
                              <td className="text-right">
                                {_fixedPoint(itm?.quantityBag, true)}
                              </td>
                              <td className="text-right">
                                {type === "view" ? (
                                  _fixedPoint(itm?.localRateTaka, true, 0)
                                ) : (
                                  <InputField
                                    value={itm?.localRateTaka}
                                    name="localRateTaka"
                                    type="number"
                                    min="0"
                                    onChange={(e) => {
                                      rowDataHandler(
                                        "localRateTaka",
                                        index,
                                        e?.target?.value
                                      );

                                      let _data = [...rowDto];
                                      _data[index]["vatTax"] =
                                        itm?.quantityBag *
                                        itm?.localRateTaka *
                                        0.175;
                                      setRowDto(_data);
                                    }}
                                  />
                                )}
                              </td>
                              <td className="text-right">
                                {type === "view" ? (
                                  _fixedPoint(itm?.revenueRateDollar, true, 0)
                                ) : (
                                  <InputField
                                    value={itm?.revenueRateDollar}
                                    name="revenueRateDollar"
                                    type="number"
                                    min="0"
                                    onChange={(e) => {
                                      rowDataHandler(
                                        "revenueRateDollar",
                                        index,
                                        e?.target?.value
                                      );

                                      let _data = [...rowDto];
                                      _data[index]["vatNtaxDollar"] =
                                        itm?.quantityBag *
                                        itm?.revenueRateDollar *
                                        0.075;
                                      setRowDto(_data);
                                    }}
                                  />
                                )}
                                {/* {_fixedPoint(
                                  itm?.localRateTaka / values?.dollarRate,
                                  true
                                )} */}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(
                                  itm?.quantityBag * itm?.localRateTaka,
                                  true,
                                  0
                                )}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(
                                  itm?.quantityBag * itm?.revenueRateDollar,
                                  true,
                                  0
                                )}
                              </td>

                              <td className="text-right">
                                {type === "view" ? (
                                  _fixedPoint(itm?.vatTax, true, 0)
                                ) : (
                                  <InputField
                                    value={itm?.vatTax}
                                    name="vatTax"
                                    type="number"
                                    min="0"
                                    onChange={(e) => {
                                      rowDataHandlerExtra(
                                        "vatTax",
                                        index,
                                        e?.target?.value
                                      );
                                    }}
                                  />
                                )}
                              </td>
                              <td className="text-right">
                                {type === "view" ? (
                                  _fixedPoint(itm?.vatNtaxDollar, true, 0)
                                ) : (
                                  <InputField
                                    value={itm?.vatNtaxDollar}
                                    name="vatNtaxDollar"
                                    type="number"
                                    min="0"
                                    onChange={(e) => {
                                      rowDataHandlerExtra(
                                        "vatNtaxDollar",
                                        index,
                                        e?.target?.value
                                      );
                                    }}
                                  />
                                )}
                              </td>
                              <td className="text-right">
                                {type === "view" ? (
                                  _fixedPoint(itm?.ld, true, 0)
                                ) : (
                                  <InputField
                                    value={itm?.ld}
                                    name="ld"
                                    type="number"
                                    min="0"
                                    onChange={(e) => {
                                      rowDataHandlerExtra(
                                        "ld",
                                        index,
                                        e?.target?.value
                                      );
                                    }}
                                  />
                                )}
                              </td>
                              <td className="text-right">
                                {type === "view" ? (
                                  _fixedPoint(itm?.damarage, true, 0)
                                ) : (
                                  <InputField
                                    value={itm?.damarage}
                                    name="damarage"
                                    type="number"
                                    min="0"
                                    onChange={(e) => {
                                      rowDataHandlerExtra(
                                        "damarage",
                                        index,
                                        e?.target?.value
                                      );
                                    }}
                                  />
                                )}
                              </td>
                              <td className="text-right">
                                {type === "view" ? (
                                  _fixedPoint(itm?.others, true, 0)
                                ) : (
                                  <InputField
                                    value={itm?.others}
                                    name="others"
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      rowDataHandlerExtra(
                                        "others",
                                        index,
                                        e?.target?.value
                                      );
                                    }}
                                  />
                                )}
                              </td>
                              <td className="text-right">
                                <span>
                                  {_fixedPoint(
                                    itm?.quantityBag * +itm?.localRateTaka -
                                      itm?.vatTax -
                                      itm?.ld -
                                      itm?.damarage -
                                      itm?.others || 0
                                  )}
                                </span>
                              </td>
                            </tr>
                          ))}

                          {type === "view" && (
                            <tr>
                              <td colSpan={type ? 2 : 3} className="text-right">
                                <b>Total</b>
                              </td>
                              <td className="text-right">
                                <strong>
                                  {_fixedPoint(
                                    rowDto?.reduce(
                                      (a, b) => a + b?.quantityBag,
                                      0
                                    ),
                                    true
                                  )}
                                </strong>
                              </td>
                              <td></td>
                              <td></td>
                              <td className="text-right">
                                <strong>
                                  {_fixedPoint(
                                    rowDto?.reduce(
                                      (a, b) =>
                                        a + b?.quantityBag * b?.localRateTaka,
                                      0
                                    ),
                                    true
                                  )}
                                </strong>
                              </td>
                              <td colSpan={6}></td>
                              <td className="text-right">
                                <strong>
                                  {_fixedPoint(
                                    rowDto?.reduce(
                                      (a, b) =>
                                        (a +=
                                          b?.quantityBag * b?.localRateTaka -
                                            b?.vatTax -
                                            b?.ld -
                                            b?.damarage -
                                            b?.others || 0),
                                      0
                                    ),
                                    true
                                  )}
                                </strong>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
