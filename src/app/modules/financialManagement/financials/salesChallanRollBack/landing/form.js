/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { getCustomerDDL } from "../../../../salesManagement/report/salesOrderHistory/helper";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import TextArea from "../../../../_helper/TextArea";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getAndInactiveAPI } from "../helper";
import Table from "./table";

const initData = {
  channel: "",
  customer: "",
  challanNo: "",
  narration: "",
};

const SalesChallanRollBack = () => {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerDDL, setCustomerDDL] = useState([]);

  const apiAction = (values, partId) => {
    getAndInactiveAPI({
      challan: values?.challanNo,
      buId,
      partId, // 3 == inactive , 1 == view
      narration: values?.narration || "on user request",
      inactiveBy: userId || 0,
      customerId: values?.customer?.value,
      setter: setRows,
      setLoading,
    });
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard title={`Sales Challan Roll Back`}>
              {loading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        region: false,
                        area: false,
                        territory: false,
                        onChange: (allValue) => {
                          getCustomerDDL(
                            accId,
                            buId,
                            allValue?.channel?.value,
                            setCustomerDDL
                          );
                        },
                      }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="customer"
                        options={customerDDL || []}
                        value={values?.customer}
                        label="Customer Name"
                        onChange={(e) => {
                          setFieldValue("customer", e);
                        }}
                        placeholder="Customer Name"
                      />
                    </div>
                    <div className="col-md-3">
                      <InputField
                        label="Challan No"
                        placeholder="Challan No"
                        value={values?.challanNo}
                        name="challanNo"
                        type="text"
                      />
                    </div>

                    <div className="col-md-3">
                      <label>Narration</label>
                      <TextArea
                        placeholder="Write your narration"
                        value={values?.narration}
                        name="narration"
                        type="text"
                      />
                    </div>

                    <IButton
                      colSize={"col-10"}
                      onClick={() => {
                        apiAction(values, 1);
                      }}
                      disabled={!values?.customer || !values?.challanNo}
                    />
                    <div className="col-lg-2 mt-3 text-right">
                      <ICon title={"Roll Back this challan"}>
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => {
                            apiAction(values, 3);
                          }}
                          disabled={rows?.length < 1 || !values?.narration}
                        >
                          Roll Back
                        </button>
                      </ICon>
                    </div>
                  </div>
                </div>
              </form>
              <Table rows={rows} />
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default SalesChallanRollBack;
