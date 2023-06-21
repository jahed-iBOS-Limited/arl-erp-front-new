/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const Form = ({ obj }) => {
  const {
    loader,
    loading,
    rowData,
    getData,
    initData,
    allSelect,
    selectedAll,
    saveHandler,
    rowDataHandler,
  } = obj;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <ICustomCard
              title={"Rate Enrolment"}
              saveHandler={() => {
                saveHandler(values);
              }}
              saveDisabled={loading || loader || rowData?.length < 1}
            >
              {(loading || loader) && <Loading />}

              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessPartner"
                        options={[
                          { value: 73244, label: "G2G BADC" },
                          { value: 73245, label: "G2G BCIC" },
                        ]}
                        value={values?.businessPartner}
                        label="Business Partner"
                        onChange={(e) => {
                          setFieldValue("businessPartner", e);
                          if (e) {
                            getData({ ...values, businessPartner: e });
                          }
                        }}
                        placeholder="Business Partner"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </form>

              {rowData?.data?.length > 0 && (
                <div className="loan-scrollable-table inventory-statement-report">
                  <div
                    style={{ maxHeight: "500px" }}
                    className="scroll-table _table"
                  >
                    <table
                      className={
                        "table table-striped table-bordered bj-table bj-table-landing "
                      }
                    >
                      <thead>
                        <tr>
                          <th
                            rowSpan={2}
                            onClick={() => allSelect(!selectedAll(), values)}
                            style={{ minWidth: "30px" }}
                          >
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                          <th style={{ minWidth: "30px" }} rowSpan={2}>
                            SL
                          </th>
                          <th style={{ minWidth: "200px" }} rowSpan={2}>
                            Description of Route
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Distance (km)
                          </th>
                          <th style={{ minWidth: "500px" }} colSpan={5}>
                            Rate per Kilo
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Total Rate <br />
                            17.30
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Tax & Vat <br />
                            17.50%
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Invoice <br />
                            10 tk
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Labour Bill
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Transport Cost
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Additional Cost (ReBag + short)
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Total Cost
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Total Received
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Quantity
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Bill Amount
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Cost Amount
                          </th>
                          <th style={{ minWidth: "100px" }} rowSpan={2}>
                            Profit Amount
                          </th>
                        </tr>
                        <tr>
                          <th style={{ minWidth: "100px" }}>
                            0-100 <br /> (10.00)
                          </th>
                          <th style={{ minWidth: "100px" }}>
                            101-200 <br />
                            (3.00)
                          </th>
                          <th style={{ minWidth: "100px" }}>
                            201-300 <br />
                            (1.50)
                          </th>
                          <th style={{ minWidth: "100px" }}>
                            301-400 <br /> (1.50)
                          </th>
                          <th style={{ minWidth: "100px" }}>
                            401-500 <br />
                            (1.30)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.map((item, i) => {
                          const totalRate =
                            item?.from0To100 +
                            item?.from101To200 +
                            item?.from201To300 +
                            item?.from301To400 +
                            item?.from401To500;
                          const taxAndVat = totalRate * 0.175;
                          const totalCost =
                            taxAndVat +
                            +item?.invoice +
                            +item?.labourBill +
                            +item?.transportCost;
                          // +item?.additionalCost;

                          const billAmount = totalRate * +item?.quantity;
                          const totalReceived = totalRate - totalCost;
                          const costAmount = totalCost * +item?.quantity;
                          const profitAmount = billAmount - costAmount;

                          return (
                            <tr key={i + item?.portName}>
                              <td
                                onClick={() => {
                                  rowDataHandler(
                                    "isSelected",
                                    i,
                                    !item.isSelected
                                  );
                                }}
                                className="text-center"
                              >
                                <input
                                  type="checkbox"
                                  value={item?.isSelected}
                                  checked={item?.isSelected}
                                  onChange={() => {}}
                                />
                              </td>
                              <td className="text-center">{i + 1}</td>
                              <td>{item?.descriptionOfRoute}</td>
                              <td>
                                <InputField
                                  name="distance"
                                  placeholder="Distance (km)"
                                  type="number"
                                  value={item?.distance}
                                  disabled={false}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "distance",
                                      i,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                              <td className="text-right">{item?.from0To100}</td>
                              <td className="text-right">
                                {item?.from101To200}
                              </td>
                              <td className="text-right">
                                {item?.from201To300}
                              </td>
                              <td className="text-right">
                                {item?.from301To400}
                              </td>
                              <td className="text-right">
                                {item?.from401To500}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalRate, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(taxAndVat, false, 2)}
                              </td>
                              <td>
                                <InputField
                                  name="invoice"
                                  placeholder="Invoice"
                                  type="number"
                                  value={item?.invoice || ""}
                                  disabled={false}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "invoice",
                                      i,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <InputField
                                  name="labourBill"
                                  placeholder="Labour Bill"
                                  type="number"
                                  value={item?.labourBill}
                                  disabled={false}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "labourBill",
                                      i,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <InputField
                                  name="transportCost"
                                  placeholder="Transport Cost"
                                  type="number"
                                  value={item?.transportCost}
                                  disabled={false}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "transportCost",
                                      i,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <InputField
                                  name="additionalCost"
                                  placeholder="Additional Cost"
                                  type="number"
                                  value={item?.additionalCost}
                                  disabled={false}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "additionalCost",
                                      i,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalCost, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalReceived, true)}
                              </td>
                              <td>
                                <InputField
                                  name="quantity"
                                  placeholder="Quantity"
                                  type="number"
                                  value={item?.quantity}
                                  disabled={false}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "quantity",
                                      i,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              </td>
                              <td className="text-right">
                                {_fixedPoint(billAmount, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(costAmount, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(profitAmount, true)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default Form;
