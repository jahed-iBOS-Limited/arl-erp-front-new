/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import essentialLogo from "./assets/essentialLogo.png";
import { ToWords } from "to-words";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import {
  getSalesContactById,
  setSalesContactSingleEmpty,
} from "../_redux/Actions";

export default function SalesContractView({ contactId }) {
  const printRef = useRef();
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {};

  const singleData = useSelector((state) => {
    return state.salesContact?.singleData;
  }, shallowEqual);

  console.log("singleData111", singleData);

  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (contactId) {
      dispatch(
        getSalesContactById(
          profileData?.accountId,
          selectedBusinessUnit.value,
          contactId
        )
      );
    } else {
      dispatch(setSalesContactSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          <IForm
            title=""
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important;margin-top: 2cm ! important; font-size: 50px ! important;}}"
                    }
                    trigger={() => (
                      <button type="button" className="btn btn-primary ml-3">
                        <i class="fa fa-print pointer" aria-hidden="true"></i>
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              );
            }}
          >
            <Form>
              {singleData?.objHeaderDTO ? (
                <div componentRef={printRef} ref={printRef}>
                  <img
                    style={{ width: "130px", height: "60px" }}
                    src={essentialLogo}
                    alt="logo"
                  />
                  <div className="table-responsive">
                    <table
                      id="sales-contract-print"
                      className="table table-striped table-bordered global-table"
                    >
                      <tr className="text-center">
                        <td className="font-weight-bold" colSpan={6}>
                          <h1>SALES CONTRACT</h1>
                        </td>
                      </tr>

                      <tr>
                        <td className="font-weight-bold" colSpan={3}>
                          <strong>
                            Sales Contract No:{" "}
                            {singleData?.objHeaderDTO?.salesContactCode}
                          </strong>
                          <br />
                          <strong>
                            Logistic By:{" "}
                            {singleData?.objHeaderDTO?.vehicleBy?.label}
                          </strong>
                          <br />
                          <strong>
                            Partner Name:{" "}
                            {singleData?.objHeaderDTO?.soldToPartnerName}
                          </strong>
                          <br />
                          <strong>
                            Payment Terms Name:{" "}
                            {singleData?.objHeaderDTO?.paymentTermsName}
                          </strong>
                          <br />
                          <strong>
                            Partial Shipment:{" "}
                            {singleData?.objHeaderDTO?.partialShipment}
                          </strong>
                        </td>
                        <td className="font-weight-bold" colSpan={3}>
                          <strong>
                            Start Date:{" "}
                            {_dateFormatter(
                              singleData?.objHeaderDTO?.startDate
                            )}
                          </strong>
                          <br />
                          <strong>
                            End Date:{" "}
                            {_dateFormatter(singleData?.objHeaderDTO?.endDate)}
                          </strong>
                          <br />
                          <strong>
                            Pricing Date:{" "}
                            {_dateFormatter(
                              singleData?.objHeaderDTO?.pricingDate
                            )}
                          </strong>
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <th width="30px" className="text-center">
                          Sl NO.{" "}
                        </th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                      {singleData?.objListRowDTO?.map((item, index) => (
                        <tr>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.itemName?.toUpperCase()}
                          </td>
                          <td className="text-center">
                            {item?.contactQuantity}
                          </td>
                          <td className="text-right">{item?.itemPrice}</td>
                          <td className="text-right">
                            {_formatMoney(
                              item?.contactQuantity * item?.itemPrice
                            )}
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td
                          className="font-weight-bold text-center"
                          colSpan={3}
                        >
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <strong>DELIVER BY</strong> <br />
                          {singleData?.objHeaderDTO?.businessUnitName?.toUpperCase()}
                          <br />
                          {singleData?.objHeaderDTO?.businessUnitAddress?.toUpperCase()}
                        </td>
                        <td
                          className="font-weight-bold text-center"
                          colSpan={3}
                        >
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <strong>ACCEPTED BY</strong>
                          <br />
                          {singleData?.objHeaderDTO?.soldToPartnerName?.toUpperCase()}
                          <br />
                          {singleData?.objHeaderDTO?.soldToPartnerAddress?.toUpperCase()}
                          <br />
                        </td>
                      </tr>

                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <tr className="border-none">
                        <td
                          className="font-weight-bold"
                          style={{ border: "none" }}
                          colSpan={2}
                        >
                          <h3>{singleData?.objHeaderDTO?.businessUnitName}</h3>
                          Corporate Headquaters: <br />
                          {singleData?.objHeaderDTO?.businessUnitAddress}
                        </td>
                        <td
                          className="font-weight-bold"
                          style={{ border: "none", textAlign: "center" }}
                          colSpan={2}
                        >
                          T: 88-02-887-8888 <br />
                          F: 88-02-887-8888 <br />
                          E: 048528528542
                        </td>
                        <td
                          className="font-weight-bold"
                          style={{ border: "none" }}
                          colSpan={2}
                        >
                          findYourDailyEssentials.com <br />
                          findYourDailyEssentials.com
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              ) : null}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
