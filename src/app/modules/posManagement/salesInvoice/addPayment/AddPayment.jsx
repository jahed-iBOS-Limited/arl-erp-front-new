import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InputField from "../../../_helper/_inputField";
import { Form as FormikForm } from "formik";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
// import IDelete from "../../../_helper/_helperIcons/_delete";
// import NewSelect from "../../../_helper/_select";
import CashIcon from "../../../_helper/_helperIcons/cash.svg";
import CreditIcon from "../../../_helper/_helperIcons/credit.svg";
import SalesInvoicePrint from "../invoice/salesInvoicePrint";
import NewSelect from "../../../_helper/_select";
import { toast } from "react-toastify";

const AddPayment = ({
  show,
  onHide,
  title,
  totalBill,
  netTotal,
  setPaidAmount,
  bankNameDDL,
  values,
  setFieldValue,
  saveHandler,
  rowDto,
  customer,
  errors,
  touched,
  header,
  profileData,
  isDisabled,
  cashReturnAmount,
  setCashReturnAmount,
  counter
}) => {

  const [cashMethodButtonClicked, setCashMethodButtonClicked] = useState(false);
  const [creditMethodButtonClicked, setCreditMethodButtonClicked] = useState(
    true
  );
  const [
    bankCardMethodButtonClicked,
    setBankCardMethodButtonClicked,
  ] = useState(false);
  const [mfsMethodButtonClicked, setMfsCardMethodButtonClicked] = useState(
    false
  );
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (header && rowDto && rowDto?.length > 0) {
      handlePrint()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header, rowDto])

  const addPayment = async () => {
    if (values?.creditAmount > customer?.remainingLimit) {
      return toast.warn("Can't exceed remaining credit limit");
    }
    await saveHandler(values, false, () => {
      onHide();
      setFieldValue("creditAmount", 0);
      setFieldValue("cardAmount", 0);
      setFieldValue("cashAmount", 0);
      setCashMethodButtonClicked(false);
      setCreditMethodButtonClicked(true);
      setBankCardMethodButtonClicked(false);
      setMfsCardMethodButtonClicked(false);
    });
  };

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size={"md"}
        aria-labelledby="example-modal-sizes-title-xl"
        dialogClassName="dialogClassName"
        backdrop={false}
      >
        {isLoading && <ModalProgressBar variant="query" />}
        <>
          {" "}
          <Modal.Header className="bg-custom d-flex justify-content-between">
            <Modal.Title className="text-left header-text">{title}</Modal.Title>
            <button
              type="button"
              onClick={() => {
                onHide();
                setFieldValue("creditAmount", 0);
                setFieldValue("cardAmount", 0);
                setFieldValue("cashAmount", 0);
                setCashReturnAmount(0)
                setCashMethodButtonClicked(false);
                setCreditMethodButtonClicked(true);
                setBankCardMethodButtonClicked(false);
                setMfsCardMethodButtonClicked(false);
              }}
              className="btn btn-light btn-elevate"
              style={{
                color: "red",
                background: "transparent",
                border: "1px solid red",
                padding: "5px 10px",
                margin: "0px 5px 5px 0px"
              }}
            >
              {"Close"}
            </button>
          </Modal.Header>
          <Modal.Body id="example-modal-sizes-title-xl">
            <>
              <FormikForm>
                <div
                  className="form form-label-right"
                  style={{ margin: "auto" }}
                >
                  <div>
                    <div className="row">
                      <div className="col-lg-6 d-flex">
                        <div
                          className={
                            creditMethodButtonClicked
                              ? "image-icon clicked-button"
                              : "image-icon"
                          }
                          onClick={() => {
                            setFieldValue("cashAmount", 0)
                            setFieldValue("creditAmount", netTotal)
                            setCashMethodButtonClicked(false);
                            setCreditMethodButtonClicked(true);
                            setBankCardMethodButtonClicked(false);
                            setMfsCardMethodButtonClicked(false);
                          }}
                        >
                          <img src={CreditIcon} alt="Cash" height="50px" />
                          <h6 style={{ color: "white", marginTop: "-8px" }}>
                            Credit
                          </h6>
                        </div>
                        <div
                          className={
                            cashMethodButtonClicked
                              ? "image-icon clicked-button"
                              : "image-icon"
                          }
                          onClick={() => {
                            setCashReturnAmount(0)
                            setFieldValue("cashAmount", netTotal)
                            setFieldValue("creditAmount", 0)
                            setCashMethodButtonClicked(true);
                            setCreditMethodButtonClicked(false);
                            setBankCardMethodButtonClicked(false);
                            setMfsCardMethodButtonClicked(false);
                            setPaidAmount(netTotal);
                          }}
                        >
                          <img src={CashIcon} alt="Cash" height="50px" />
                          <h6 style={{ color: "white", marginTop: "-8px" }}>
                            Cash
                          </h6>
                        </div>
                        {/* <div
                          className={
                            bankCardMethodButtonClicked
                              ? "image-icon clicked-button"
                              : "image-icon"
                          }
                          onClick={() => {
                            // setCashMethodButtonClicked(false);
                            // setCreditMethodButtonClicked(false);
                            // setBankCardMethodButtonClicked(true);
                            // setMfsCardMethodButtonClicked(false);
                          }}
                        >
                          <img src={BankCard} alt="Cash" height="50px" />
                          <h6 style={{ color: "white", marginTop: "-8px" }}>
                            Bank Card
                          </h6>
                        </div> */}
                        {/* <div
                          className={
                            mfsMethodButtonClicked
                              ? "image-icon clicked-button"
                              : "image-icon"
                          }
                          onClick={() => {
                            // setCashMethodButtonClicked(false);
                            // setCreditMethodButtonClicked(false);
                            // setBankCardMethodButtonClicked(false);
                            // setMfsCardMethodButtonClicked(true);
                          }}
                        >
                          <img src={MFS} alt="Cash" height="50px" />
                          <h6 style={{ color: "white", marginTop: "-5px" }}>
                            MFS
                          </h6>
                        </div> */}
                      </div>
                      {/* <div className="col-lg-1"></div> */}
                      <div className="col-lg-6 d-flex">
                        <div className="image-icon data-show">
                          <h6
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            Paid Amount
                          </h6>
                          <h6 style={{ color: "white" }}>
                            {parseFloat(values?.cashAmount || 0) +
                              parseFloat(values?.creditAmount || 0) +
                              parseFloat(values?.cardAmount || 0) +
                              parseFloat(values?.mfsAmount || 0)}
                          </h6>
                        </div>
                        {/* <div className="image-icon data-show">
                          <h6
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            Net Total
                          </h6>
                          <h6 style={{ color: "white" }}>{netTotal}</h6>
                        </div> */}
                        <div className="image-icon data-show">
                          <h6
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            Total Bill
                          </h6>
                          <h6 style={{ color: "white" }}>{totalBill}</h6>
                        </div>
                        {/* <div className="image-icon data-show">
                          <h6
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            Total VAT
                          </h6>
                          <h6 style={{ color: "white" }}>{totalVat}</h6>
                        </div>
                        <div className="image-icon data-show">
                          <h6
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            Total Discount
                          </h6>
                          <h6 style={{ color: "white" }}>
                            {totalDiscount || 0}
                          </h6>
                        </div> */}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 d-flex justify-content-between">
                        <h3 className="header-amount">
                          <span>{values?.creditAmount || 0}</span>
                        </h3>
                        <h3 className="header-amount">
                          <span>{values?.cashAmount || 0}</span>
                        </h3>
                      </div>
                      <div className="col-lg-6">
                        <h3 style={{ fontSize: "12px", marginLeft: "5px" }}>
                          Cash Return Amount:  {cashReturnAmount}
                        </h3>
                      </div>
                    </div>
                  </div>
                  {creditMethodButtonClicked && (
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-6">
                          <InputField
                            value={values?.creditAmount}
                            name="creditAmount"
                            placeholder="Credit Amount"
                            //defaultValue={netTotal}
                            label="Credit Amount"
                            type="number"
                            onChange={(e) => {
                              setFieldValue("creditAmount", e.target.value);
                              //setCreditAmount(parseInt(e.target.value));
                            }}
                            errors={errors}
                            touched={touched}
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {cashMethodButtonClicked && (
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-6">
                          <InputField
                            value={values?.cashAmount}
                            name="cashAmount"
                            placeholder="Cash Amount"
                            label="Cash Amount"
                            type="number"
                            onChange={(e) => {
                              if (e.target.value > -1) {
                                if (e.target.value <= netTotal) {
                                  setCashReturnAmount(0)
                                  setFieldValue("cashAmount", e.target.value);
                                  setFieldValue(
                                    "creditAmount",
                                    netTotal - e.target.value
                                  );
                                } else {
                                  setFieldValue("creditAmount", 0)
                                  setFieldValue("cashAmount", e.target.value);
                                  setCashReturnAmount(e.target.value - netTotal)
                                }
                              }
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {bankCardMethodButtonClicked && (
                    <div className="global-form">
                      <div className="row">
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="paymentMethod"
                              options={bankNameDDL}
                              value={values?.paymentMethod}
                              label="Payment Method"
                              onChange={(valueOption) => {
                                setFieldValue("paymentMethod", valueOption);
                              }}
                              placeholder="Payment Method"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.cardNo}
                              name="cardNo"
                              placeholder="Card No"
                              label="Card No"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("cardNo", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-2">
                            <InputField
                              value={values?.cardAmount}
                              name="cardAmount"
                              placeholder="Amount"
                              label="Amount"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("cardAmount", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </>
                      </div>
                    </div>
                  )}
                  {mfsMethodButtonClicked && (
                    <div className="global-form">
                      <div className="row">
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="paymentMethod"
                              options={[{ value: 1, label: "Bkash" }]}
                              value={values?.paymentMethod}
                              label="Payment Method"
                              onChange={(valueOption) => {
                                setFieldValue("paymentMethod", valueOption);
                              }}
                              placeholder="Payment Method"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.cardNo}
                              name="cardNo"
                              placeholder="Account No"
                              label="Account No"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("cardNo", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-2">
                            <InputField
                              value={values?.mfsAmount}
                              name="mfsAmount"
                              placeholder="Amount"
                              label="MFS Amount"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("mfsAmount", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </>
                      </div>
                    </div>
                  )}
                </div>
              </FormikForm>
            </>
          </Modal.Body>
          <Modal.Footer style={{ padding: "0.5rem" }}>
            <div style={{ margin: "0px auto" }}>
              <button
                disabled={isDisabled}
                className="btn btn-primary mb-1"
                style={{ padding: "10px 15px", }}
                onClick={() => addPayment()}
              >
                Save & Print
              </button>
              <> </>
            </div>
          </Modal.Footer>
          <SalesInvoicePrint
            printRef={printRef}
            rowDto={rowDto}
            header={header}
            profileData={profileData}
            counter={counter}
          />
        </>
        {/* )}
        </Formik> */}
      </Modal>
    </div>
  );
};

export default AddPayment;
