import { Form, Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import { BADCBCICForm } from "../../../common/components";

export default function _Form({
  type,
  title,
  history,
  initData,
  allSelect,
  allSelectTwo,
  selectedAll,
  selectedAllTwo,
  rowDto,
  saveHandler,
  rowDataHandler,
  rowDataHandlerExtra,
  rowDtoTwo,
  rowDataTwoHandler,
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
            saveHandler={() => {
              saveHandler(values, () => {});
            }}
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <BADCBCICForm
                  values={values}
                  setFieldValue={setFieldValue}
                  disabled={type}
                />
                <div className="col-lg-3">
                  <NewSelect
                    name="loadingPort"
                    value={values?.loadingPort}
                    label="Port"
                    placeholder="Port"
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    placeholder="Mother Vessel"
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Program No</label>
                  <InputField
                    value={values?.programNo}
                    name="programNo"
                    placeholder="Program No"
                    type="text"
                    disabled
                  />
                </div>

                {rowDto?.length > 0 && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        value={values?.item}
                        label="Item"
                        placeholder="Item"
                        isDisabled={type}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.lotNo}
                        name="lotNo"
                        label="Lot No"
                        placeholder="Lot No"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="cnf"
                        value={values?.cnf}
                        label="CNF"
                        onChange={(valueOption) => {
                          setFieldValue("cnf", valueOption);
                        }}
                        placeholder="CNF"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="steveDore"
                        value={values?.steveDore}
                        label="Steve Dore"
                        onChange={(valueOption) => {
                          setFieldValue("steveDore", valueOption);
                        }}
                        placeholder="Steve Dore"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.allotmentDate}
                        name="allotmentDate"
                        label="Allotment Date"
                        placeholder="Date"
                        type="date"
                        disabled={type}
                      />
                    </div>

                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="rowType"
                        value={values?.rowType}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("rowType", valueOption);
                          commonGetByIdFunc();
                        }}
                        placeholder="Type"
                        // options={[
                        //   {
                        //     value: 1,
                        //     label: "Revenue Rate",
                        //   },
                        //   {
                        //     value: 2,
                        //     label: "Carrier Rate",
                        //   },
                        // ]}
                      />
                    </div> */}

                    {/* {values?.rowType?.value === 1 && (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.conversionRate}
                          name="conversionRate"
                          label="Dollar to Taka Conversion Rate"
                          placeholder="Conversion Rate"
                          type="number"
                          disabled={type === "view"}
                        />
                      </div>
                    )} */}

                    <div className="col-12 mt-3 text-right">
                      <div className="d-flex">
                        {values?.rowType?.value === 1 && (
                          <>
                            {" "}
                            <h5 className="mr-3 pr-2">
                              Total Quantity:{" "}
                              {_fixedPoint(
                                rowDto?.reduce(
                                  (a, b) => (a += +b?.surveyQty || 0),
                                  0
                                ),
                                true,
                                0
                              )}
                            </h5>
                            <h5 className="mr-3 pr-2">
                              Total amount ($):{" "}
                              {_fixedPoint(
                                rowDto?.reduce(
                                  (a, b) =>
                                    (a += +b?.localTotalAmountDoller || 0),
                                  0
                                ),
                                true,
                                0
                              )}
                            </h5>
                            <h5 className="ml-3">
                              Total amount (tk):{" "}
                              {_fixedPoint(
                                rowDto?.reduce(
                                  (a, b) =>
                                    (a += Number(b?.localTotalAmountTaka || 0)),
                                  0
                                ),
                                true,
                                0
                              )}
                            </h5>
                          </>
                        )}
                        {values?.rowType?.value === 2 && (
                          <>
                            <h5 className="ml-3">
                              Total (tk):{" "}
                              {[
                                ...(values?.rowType?.value === 1
                                  ? rowDto
                                  : rowDtoTwo),
                              ]?.reduce(
                                (a, b) => (a += Number(b?.amount || 0)),
                                0
                              )}
                            </h5>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Form>
            <div className="col-lg-3 mt-5">
              <PaginationSearch
                placeholder="Lighter Vessel Name"
                paginationSearchHandler={(search) => commonGetByIdFunc(search)}
                values={values}
              />
            </div>
            {values?.rowType?.value === 1 && (
              <>
                {rowDto?.length > 0 && (
                  <div
                    style={{ maxHeight: "450px" }}
                    className="scroll-table _table"
                  >
                    <table className="global-table table table-font-size-sm">
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
                          <th>Lighter Vessel</th>
                          <th style={{ width: "130px" }}>Quantity</th>
                          <th style={{ width: "200px" }}>Unloading Port</th>
                          {/* <th>Local Rate ($)</th> */}
                          <th>Local Rate (tk)</th>
                          <th>Amount (tk)</th>
                          <th>Vat & Tax</th>
                          <th>LD</th>
                          <th>Damarage</th>
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
                            <td>{itm?.label}</td>
                            <td className="text-right">
                              {_fixedPoint(itm?.surveyQty, true)}
                            </td>
                            <td>{itm?.unloadingPort?.label}</td>
                            {/* 
                              <td>
                                {type === 'view' ? (
                                  itm?.localRateDoller
                                ) : (
                                  <InputField
                                    value={itm?.localRateDoller}
                                    name='localRateDoller'
                                    type='number'
                                    onChange={(e) => {
                                      rowDataHandler(
                                        'localRateDoller',
                                        index,
                                        e?.target?.value,
                                        values?.conversionRate
                                      );
                                    }}
                                  />
                                )}
                              </td> */}
                            <td className="text-right">
                              {type === "view" ? (
                                _fixedPoint(itm?.localRateTaka, true, 0)
                              ) : (
                                <InputField
                                  value={itm?.localRateTaka || 0}
                                  name="localRateTaka"
                                  type="number"
                                  min="0"
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "localRateTaka",
                                      index,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              )}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(itm?.localTotalAmountTaka, true, 0)}
                            </td>

                            <td>
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
                            </td>
                            <td>
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
                            </td>
                            <td>
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
                            </td>
                            <td>
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
                            </td>
                            <td>
                              {/* <InputField
                                  value={itm?.localTotalAmountTaka}
                                  name="billAmount"
                                  type="number"
                                  disabled
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "billAmount",
                                      index,
                                      e?.target?.value
                                    );
                                  }}
                                /> */}
                              <span>
                                {_fixedPoint(
                                  itm?.localTotalAmountTaka -
                                    itm?.vatTax -
                                    itm?.ld -
                                    itm?.damarage -
                                    itm?.others,
                                  true,
                                  0
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
                                  rowDto?.reduce((a, b) => a + b?.surveyQty, 0),
                                  true
                                )}
                              </strong>
                            </td>
                            <td colSpan={2}></td>
                            <td className="text-right">
                              <strong>
                                {_fixedPoint(
                                  rowDto?.reduce(
                                    (a, b) => a + b?.localTotalAmountTaka,
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
                )}
              </>
            )}
            {values?.rowType?.value === 2 && (
              <>
                {rowDtoTwo?.length > 0 && (
                  <div
                    style={{ maxHeight: "450px" }}
                    className="scroll-table _table"
                  >
                    <table className="global-table table table-font-size-sm">
                      <thead>
                        <tr>
                          {type !== "view" && (
                            <th
                              onClick={() => allSelectTwo(!selectedAllTwo())}
                              style={{ width: "40px" }}
                            >
                              <input
                                type="checkbox"
                                value={selectedAllTwo()}
                                checked={selectedAllTwo()}
                                onChange={() => {}}
                              />
                            </th>
                          )}
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Lighter Vessel</th>
                          <th>Carrier Name</th>
                          <th style={{ width: "130px" }}>Quantity</th>
                          <th style={{ width: "200px" }}>Unloading Port</th>
                          <th>Local Rate (tk) </th>
                          <th>Commission Rate (tk)</th>
                          <th>Amount (tk)</th>
                        </tr>
                      </thead>
                      <tbody style={{ overflow: "scroll" }}>
                        {rowDtoTwo?.map((itm, index) => (
                          <tr key={index}>
                            {type !== "view" && (
                              <td
                                onClick={() => {
                                  rowDataTwoHandler(
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
                            <td>{itm?.label}</td>
                            <td>{itm?.supplierName}</td>
                            <td className="text-right">
                              {_fixedPoint(itm?.surveyQty, true)}
                            </td>
                            <td>{itm?.lighterDestinationName}</td>
                            {/* <td>{itm?.unloadingPort?.label}</td> */}

                            <td className="text-right">
                              {type === "view" ? (
                                _fixedPoint(itm?.carrierRate, true, 0)
                              ) : (
                                <InputField
                                  value={itm?.carrierRate}
                                  name="carrierRate"
                                  type="number"
                                  onChange={(e) => {
                                    rowDataTwoHandler(
                                      "carrierRate",
                                      index,
                                      e?.target?.value,
                                      values?.conversionRate
                                    );
                                  }}
                                />
                              )}
                            </td>

                            <td className="text-right">
                              {type === "view" ? (
                                _fixedPoint(itm?.carrierCommissionRate, true, 0)
                              ) : (
                                <InputField
                                  value={itm?.carrierCommissionRate}
                                  name="carrierCommissionRate"
                                  type="number"
                                  onChange={(e) => {
                                    rowDataTwoHandler(
                                      "carrierCommissionRate",
                                      index,
                                      e?.target?.value,
                                      values?.conversionRate
                                    );
                                  }}
                                />
                              )}
                            </td>

                            <td className="text-right">
                              {_fixedPoint(itm?.amount, true, 0)}
                            </td>
                          </tr>
                        ))}
                        {type === "view" && (
                          <tr>
                            <td colSpan={type ? 2 : 3} className="text-right">
                              <b>Total</b>
                            </td>
                            <td className="text-right">
                              {_fixedPoint(
                                rowDto?.reduce((a, b) => a + b?.surveyQty, 0),
                                true
                              )}
                            </td>
                            <td colSpan={3}></td>
                            <td className="text-right">
                              <strong>
                                {_fixedPoint(
                                  rowDto?.reduce(
                                    (a, b) => a + b?.localTotalAmountTaka,
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
                )}
              </>
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
