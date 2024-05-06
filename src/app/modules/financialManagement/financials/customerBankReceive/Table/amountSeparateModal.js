import React, { useEffect } from "react";
import InputField from "../../../../_helper/_inputField";
import { Formik, Form, Field } from "formik";
import { getInvoiceByPartnerApi } from "../helper";
import { shallowEqual, useSelector } from "react-redux";

function AmountSeparateModal({ selectedItem,separateModalCB }) {
  let { selectedBusinessUnit, profileData } = useSelector(
    (state) => {
      return state.authData;
    },
    { shallowEqual }
  );
  const [girdData, setGridData] = React.useState([]);

  const onChangeHandler = (_girdData, idx) => {
    const copyGridData = [..._girdData];
    const actualAmount = +copyGridData[idx].actualAmount || 0;
    const receviedAmount = +copyGridData[idx].receviedAmount || 0;
    const dueAmount = actualAmount - receviedAmount;
    copyGridData[idx].dueAmount = dueAmount;
    setGridData(copyGridData);
  };

  const autoAmountHandelar = (isAutoAmount) => {
    if (isAutoAmount) {
      const copyGridData = [...girdData];
      let totalAmount = +selectedItem?.creditAmount || 0;

      const modifyData = copyGridData.map((item, idx) => {
        if (totalAmount > 0) {
          if (totalAmount >= item.actualAmount) {
            totalAmount = totalAmount - item.actualAmount;
            return {
              ...item,
              receviedAmount: item.actualAmount,
              dueAmount: 0,
            };
          } else {
            const _totalAmount = totalAmount;
            const dueAmount = item.actualAmount - totalAmount;
            totalAmount = 0;
            return {
              ...item,
              receviedAmount: _totalAmount,
              dueAmount: dueAmount,
            };
          }
        } else {
          return {
            ...item,
            receviedAmount: 0,
            dueAmount: 0,
          };
        }
      });
      setGridData(modifyData);
    } else {
      const copyGridData = [...girdData];
      const modifyData = copyGridData.map((item) => {
        return {
          ...item,
          receviedAmount: 0,
          dueAmount: 0,
        };
      });
      setGridData(modifyData);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      getInvoiceByPartnerApi(
        selectedBusinessUnit?.value,
        setGridData,
        selectedItem
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

const saveHandler  = () => {
  separateModalCB()
}
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        isAutoAmount: false,
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          <Form className="form form-label-right">
            {/* <div className="form-group row global-form">
              <div
                style={{
                  marginTop: "18px",
                }}
                className="col-lg-3"
              >
                <Field
                  name="isMrp"
                  component={() => (
                    <input
                      style={{
                        position: "absolute",
                        top: "7px",
                      }}
                      id="isMrp"
                      type="checkbox"
                      value={values?.isMrp || false}
                      checked={values?.isMrp || false}
                      name="isMrp"
                      onChange={(e) => {
                        setFieldValue("isMrp", e.target.checked);
                      }}
                    />
                  )}
                />
                <label htmlFor="isMrp" className="ml-5">
                  Include in MRP Planning?
                </label>
              </div>
            </div> */}
            <div
              className="mt-5"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p className="m-1">
                  <b>Account No:</b> {selectedItem?.bankAccountNo}
                </p>
                <p className="m-1">
                  <b>Amount:</b> <span>{selectedItem?.creditAmount}</span>
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    saveHandler();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
            <div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Invoice No</th>
                      <th>Invoice Amount</th>
                      <th>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Field
                            name="isAutoAmount"
                            component={() => (
                              <input
                                style={{}}
                                id="isAutoAmount"
                                type="checkbox"
                                value={values?.isAutoAmount || false}
                                checked={values?.isAutoAmount || false}
                                name="isAutoAmount"
                                onChange={(e) => {
                                  setFieldValue(
                                    "isAutoAmount",
                                    e.target.checked
                                  );
                                  autoAmountHandelar(e.target.checked);
                                }}
                              />
                            )}
                          />
                          <span>Received Amount</span>
                        </div>
                      </th>
                      <th>Due Amount</th>
                      <th>Advance Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {girdData?.map((item, idx) => (
                      <tr key={idx + 1}>
                        <td>{idx + 1}</td>
                        <td>{item?.invoiceNumber}</td>
                        <td className="text-right">{item?.actualAmount}</td>
                        <td>
                          <InputField
                            value={item?.receviedAmount}
                            name="receviedAmount"
                            placeholder="Recevied Amount"
                            type="number"
                            onChange={(e) => {
                              const copyGridData = girdData?.map((itm) => ({
                                ...itm,
                              }));
                              copyGridData[idx].receviedAmount = e.target.value;
                              const maxAmount = item?.actualAmount;
                              const maxBalanceAmount =
                                +selectedItem?.creditAmount || 0;
                              const minBalanceAmount = copyGridData?.reduce(
                                (acc, cur) => acc + (+cur.receviedAmount || 0),
                                0
                              );
                              if (
                                e.target.value > maxAmount ||
                                minBalanceAmount > maxBalanceAmount
                              ) {
                                return;
                              }

                              onChangeHandler(copyGridData, idx);
                            }}
                            disabled={values?.isAutoAmount}
                          />
                        </td>
                        <td>
                          <InputField
                            value={item?.dueAmount}
                            name="dueAmount"
                            placeholder="Due Amount"
                            type="number"
                            onChange={(e) => {
                              const copyGridData = [...girdData];
                              copyGridData[idx].dueAmount = e.target.value;
                              onChangeHandler(copyGridData, idx);
                            }}
                            disabled
                          />
                        </td>
                        <td className="text-right">{item?.advanceAmount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2" className="text-right">
                        <b>Total</b>
                      </td>
                      <td className="text-right">
                        <b>
                          {girdData.reduce(
                            (acc, cur) => acc + (+cur.actualAmount || 0),
                            0
                          )}
                        </b>
                      </td>
                      <td className="text-right">
                        <b>
                          {girdData.reduce(
                            (acc, cur) => acc + (+cur.receviedAmount || 0),
                            0
                          )}
                        </b>
                      </td>
                      <td className="text-right">
                        <b>
                          {girdData.reduce(
                            (acc, cur) => acc + (+cur.dueAmount || 0),
                            0
                          )}
                        </b>
                      </td>
                      <td className="text-right">
                        <b>
                          {girdData.reduce(
                            (acc, cur) => acc + (+cur.advanceAmount || 0),
                            0
                          )}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}

export default AmountSeparateModal;
