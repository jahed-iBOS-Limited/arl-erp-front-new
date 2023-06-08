import React, { useEffect, useState } from "react";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import IViewModal from "../../../../_chartinghelper/_viewModal";
import { getOilRateApi } from "../../helper";
import { calculateTotalExpense } from "../../utils";
import { UpdateOilRateModal } from "./updateOilRateModal";

const RateEditIcon = ({ onClick }) => {
  return (
    <span
      onClick={() => onClick()}
      style={{ position: "absolute", top: 0, right: "12px", cursor: "pointer" }}
    >
      <i style={{ color: "#08a5e5" }} className="fa fa-edit"></i>
    </span>
  );
};

export function ExpenseSection(props) {
  const [loading, setLoading] = useState(false);
  const { values, errors, touched, setFieldValue, viewType } = props;
  const [rateUpdateModal, setRateUpdateModal] = useState(false);

  useEffect(() => {
    if (viewType !== "view" || viewType !== "edit") {
      getOilRateApi({ values, setFieldValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="marine-form-card my-4">
      <div className="marine-form-card-heading">
        <p>Expense</p>
      </div>

      <div className="marine-form-card-content row mx-0 px-0">
        <div className="col-lg-8">
          <div className="row mt-4">
            <div className="col-lg-4">
              <label>Diesel Supply Qty</label>
              <FormikInput
                value={values?.numDieselSupply}
                name="numDieselSupply"
                placeholder="Amount"
                onChange={(e) => {
                  setFieldValue(
                    "numDieselCost",
                    (+e.target.value * +values?.numDieselRate)?.toFixed(2) || 0
                  );
                  setFieldValue("numDieselSupply", e.target.value);
                }}
                type="number"
                errors={errors}
                touched={touched}
                disabled={viewType === "view"}
              />
            </div>
            <div className="col-lg-4 relative">
              <label>Diesel Rate</label>
              <FormikInput
                value={values?.numDieselRate}
                name="numDieselRate"
                placeholder="Rate"
                onChange={(e) => {
                  setFieldValue(
                    "numDieselCost",
                    (+e.target.value * +values?.numDieselSupply)?.toFixed(2) ||
                      0
                  );
                  setFieldValue("numDieselRate", e.target.value);
                }}
                type="number"
                errors={errors}
                touched={touched}
                disabled={true}
              />

              {!viewType ? (
                <RateEditIcon onClick={() => setRateUpdateModal(true)} />
              ) : null}
            </div>
            <div className="col-lg-4">
              <label>Diesel Cost</label>
              <FormikInput
                value={values?.numDieselCost}
                name="numDieselCost"
                placeholder="Cost"
                type="number"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>

            <div className="col-lg-4">
              <label>Lub Oil Supply Qty</label>
              <FormikInput
                value={values?.numLubSupply}
                name="numLubSupply"
                placeholder="Amount"
                type="number"
                onChange={(e) => {
                  setFieldValue(
                    "numLubCost",
                    (+e.target.value * +values?.numLubRate)?.toFixed(2) || 0
                  );
                  setFieldValue("numLubSupply", e.target.value);
                }}
                errors={errors}
                touched={touched}
                disabled={viewType === "view"}
              />
            </div>
            <div className="col-lg-4">
              <label>Lub Oil Rate</label>
              <FormikInput
                value={values?.numLubRate}
                name="numLubRate"
                placeholder="Rate"
                type="number"
                onChange={(e) => {
                  setFieldValue(
                    "numLubCost",
                    (+e.target.value * +values?.numLubSupply)?.toFixed(2) || 0
                  );
                  setFieldValue("numLubRate", e.target.value);
                }}
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>
            <div className="col-lg-4">
              <label>Lub Oil Cost</label>
              <FormikInput
                value={values?.numLubCost}
                name="numLubCost"
                placeholder="Cost"
                type="number"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>

            <div className="col-lg-4">
              <label>Hydrolic Oil Supply Qty</label>
              <FormikInput
                value={values?.numHydrolicSupply}
                name="numHydrolicSupply"
                placeholder="Amount"
                type="number"
                onChange={(e) => {
                  setFieldValue(
                    "numHydrolicCost",
                    (+e.target.value * +values?.numHydrolicRate)?.toFixed(2) ||
                      0
                  );
                  setFieldValue("numHydrolicSupply", e.target.value);
                }}
                errors={errors}
                touched={touched}
                disabled={viewType === "view"}
              />
            </div>
            <div className="col-lg-4">
              <label>Hydrolic Oil Rate</label>
              <FormikInput
                value={values?.numHydrolicRate}
                name="numHydrolicRate"
                placeholder="Rate"
                onChange={(e) => {
                  setFieldValue(
                    "numHydrolicCost",
                    (+e.target.value * +values?.numHydrolicSupply)?.toFixed(
                      2
                    ) || 0
                  );
                  setFieldValue("numHydrolicRate", e.target.value);
                }}
                type="number"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>
            <div className="col-lg-4">
              <label>Hydrolic Oil Cost</label>
              <FormikInput
                value={values?.numHydrolicCost}
                name="numHydrolicCost"
                placeholder="Cost"
                type="number"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="marine-form-card row mx-0 px-0">
            <div className="col-lg-6">Diesel Cost</div>
            <div className="col-lg-6">
              <FormikInput
                value={values?.numDieselCost}
                name="numDieselCost"
                placeholder="Diesel Cost"
                type="text"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>
            <div className="col-lg-6">Lub Oil</div>
            <div className="col-lg-6">
              <FormikInput
                value={values?.numLubCost}
                name="numLubCost"
                placeholder="Lub Oil"
                type="text"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>
            <div className="col-lg-6">Hydrolic Oil</div>
            <div className="col-lg-6">
              <FormikInput
                value={values?.numHydrolicCost}
                name="numHydrolicCost"
                placeholder="Hydrolic Oil"
                type="text"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>

            <div className="col-lg-6">Trip Cost</div>
            <div className="col-lg-6">
              <FormikInput
                value={values?.numTripCost}
                name="numTripCost"
                placeholder="Trip Cost"
                type="text"
                errors={errors}
                touched={touched}
                disabled={viewType === "view"}
              />
            </div>

            <div className="col-lg-6">Pilot Coupon</div>
            <div className="col-lg-6">
              <FormikInput
                value={values?.numPilotCoupon}
                name="numPilotCoupon"
                placeholder="Pilot Coupon"
                type="text"
                errors={errors}
                touched={touched}
                disabled={viewType === "view"}
              />
            </div>

            {/* <div className="col-lg-6">Store Expense</div>
            <div className="col-lg-6">
              <FormikInput
                value={values?.numStoreExpense}
                name="numStoreExpense"
                placeholder="Store Expesne"
                type="number"
                errors={errors}
                touched={touched}
                disabled={viewType === "view"}
              />
            </div> */}

            <div className="col-lg-6 mt-2">Total Expense</div>
            <div className="col-lg-6 mt-2 text-right">
              <strong>
                {_formatMoney(calculateTotalExpense(values)?.result) || 0}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Update Modal */}
      <IViewModal
        show={rateUpdateModal}
        onHide={() => setRateUpdateModal(false)}
        size="md"
      >
        <UpdateOilRateModal
          loading={loading}
          setLoading={setLoading}
          values={values}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
          setRateUpdateModal={setRateUpdateModal}
        />
      </IViewModal>
    </div>
  );
}
