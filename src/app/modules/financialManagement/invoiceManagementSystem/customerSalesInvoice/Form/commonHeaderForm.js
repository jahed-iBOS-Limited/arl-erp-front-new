import React, { useEffect } from "react";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getSupplierDDLAction,
  getCurrencyDDLAction,
} from "../../../../_helper/_redux/Actions";
import {
  getIncoTermsListDDLAction,
  getPaymentTermsListDDLAction,
} from "../_redux/Actions";

const initData = {
  id: undefined,
  supplierName: "",
  deliveryAddress: "",
  orderDate: "",
  lastShipmentDate: "",
  currency: "",
  paymentTerms: "",
  cash_advance: "",
  payDays: "",
  incoterms: "",
  supplierReference: "",
  referenceDate: "",
  validity: "",
  otherTerms: "",
  referenceNo: "",
  item: "",
  bom: "",
};

export default function CommonHeaderForm({
  values,
  errors,
  touched,
  setFieldValue,
}) {
  const supplierDDL = useSelector((state) => state.commonDDL.supplierDDL);
  const currencyDDL = useSelector((state) => state.commonDDL.currencyDDL);
  const paymentTermsDDL = useSelector(
    (state) => state.purchaseOrder.paymentTermsDDL
  );
  const incoTermsDDL = useSelector((state) => state.purchaseOrder.incoTermsDDL);

  // get user profile data from store
  const profileData = useSelector(
    (state) => state.authData.profileData,
    shallowEqual
  );

  // get selected business unit from store
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      dispatch(
        getSupplierDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(getIncoTermsListDDLAction());
      dispatch(getPaymentTermsListDDLAction());
      dispatch(getCurrencyDDLAction());
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  return (
    <div className="form-group row">
      <div className="col-lg-3">
        <ISelect
          label="Select Supplier Name"
          options={supplierDDL}
          defaultValue={values.supplierName}
          name="supplierName"
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="col-lg-3">
        <IInput
          value={values.deliveryAddress}
          label="Delivery Address"
          name="deliveryAddress"
          // disabled={isEdit}
        />
      </div>
      <div className="col-lg-3">
        <IInput
          value={values.orderDate}
          label="Order Date"
          type="date"
          name="orderDate"
          // disabled={isEdit}
        />
      </div>
      <div className="col-lg-3">
        <IInput
          value={values.lastShipmentDate}
          label="Last Shipment Date"
          name="lastShipmentDate"
          type="date"
          // disabled={isEdit}
        />
      </div>

      <div className="col-lg-3">
        <ISelect
          label="Select Currency"
          options={currencyDDL}
          defaultValue={values.currency}
          name="currency"
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <ISelect
          label="Select Payment terms"
          options={paymentTermsDDL}
          defaultValue={values.paymentTerms}
          name="paymentTerms"
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="col-lg-3">
        <IInput
          value={values.cash_advance}
          label="Cash/Advance"
          name="cash_advance"
          // disabled={isEdit}
        />
      </div>
      <div className="col-lg-3">
        <IInput
          value={values.payDays}
          label="Pay Days (After Invoice)"
          name="payDays"
          // disabled={isEdit}
        />
      </div>

      <div className="col-lg-3">
        <ISelect
          label="Select Incoterms"
          options={incoTermsDDL}
          defaultValue={values.incoterms}
          name="incoterms"
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="col-lg-3">
        <IInput
          value={values.supplierReference}
          label="Supplier Reference"
          name="supplierReference"
          // disabled={isEdit}
        />
      </div>

      <div className="col-lg-3">
        <IInput
          value={values.referenceDate}
          label="Reference Date"
          name="referenceDate"
          type="date"
          // disabled={isEdit}
        />
      </div>

      <div className="col-lg-3">
        <IInput
          value={values.validity}
          label="Validity"
          name="validity"
          type="date"
        />
      </div>

      <div className="col-lg-3">
        <IInput
          value={values.otherTerms}
          label="Order Terms"
          name="otherTerms"
          // disabled={isEdit}
        />
      </div>
    </div>
  );
}
