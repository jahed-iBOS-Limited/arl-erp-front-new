/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import IViewModal from "./../../../../../../_helper/_viewModal";
import { Formik } from "formik";
import InputField from "./../../../../../../_helper/_inputField";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { getSingleDataById } from "./helper";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";

export default function ViewModalEmpRemuSetup({
  show,
  onHide,
  employeeRemSetupId,
}) {
  // All State
  const { id } = useParams();
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  // Get Single Data by id
  useEffect(() => {
    if (employeeRemSetupId) {
      getSingleDataById(
        id,
        employeeRemSetupId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSingleData
      );
    }
  }, [employeeRemSetupId, profileData, selectedBusinessUnit]);

  console.log("T", singleData);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Employee Remuneration Setup"}
        btnText="Close"
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            remunerationValidForm: _dateFormatter(
              singleData?.[0]?.objHeader?.startDate
            ),
            remunerationValidTo: _dateFormatter(
              singleData?.[0]?.objHeader?.endDate
            ),
            netPayable: singleData?.[0]?.objHeader?.netPayable,
            grossAmount: singleData?.[0]?.objHeader?.grossAmount,
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            setValues,
          }) => (
            <>
              <div className="row global-form global-form-custom bj-left pb-2">
                <div className="col-lg-3">
                  <label>Remuneration Valid From</label>
                  <InputField
                    value={values?.remunerationValidForm}
                    name="remunerationValidForm"
                    placeholder="Remuneration Valid Form"
                    type="date"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Remuneration Valid To</label>
                  <InputField
                    value={values?.remunerationValidTo}
                    name="remunerationValidTo"
                    placeholder="Remuneration Valid To"
                    type="date"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Net Payable</label>
                  <InputField
                    value={values?.netPayable}
                    name="netPayable"
                    placeholder="Net Payable"
                    type="number"
                    disabled={true}
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Gross Amount</label>
                  <InputField
                    value={values?.grossAmount}
                    name="grossAmount"
                    placeholder="Gross Amount"
                    type="number"
                    min="0"
                    disabled={true}
                  />
                </div>
              </div>

              <h3>Standard Remuneration</h3>
              <table className="global-table w-100 table-bordered border-secondary">
                <thead>
                  <th className="text-center">SL</th>
                  <th>Component</th>
                  <th>Amount</th>
                  <th>Percent On Basic</th>
                </thead>
                <tbody>
                  {singleData?.[0]?.standardRemuneration?.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item?.remunerationComponentName}</td>
                      <td className="text-right">{item?.amount}</td>
                      <td className="text-right">
                        {item?.defaultPercentOnBasic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3>Benefits and Allownace</h3>
              <table className="global-table w-100 table-bordered border-secondary">
                <thead>
                  <th className="text-center">SL</th>
                  <th>Component</th>
                  <th>Amount</th>
                  <th>Percent On Basic</th>
                </thead>
                <tbody>
                  {singleData?.[0]?.benifitsAndAllowances?.map(
                    (item, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item?.remunerationComponentName}</td>
                        <td className="text-right">{item?.amount}</td>
                        <td className="text-right">
                          {item?.defaultPercentOnBasic}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </>
          )}
        </Formik>
      </IViewModal>
    </div>
  );
}
