import { Formik } from "formik";
import React from "react";
import Loading from "../../../../../_helper/_loading";
import ICard from "../../../../../_helper/_card";
import InputField from "../../../../../_helper/_inputField";

const Details = ({ obj }) => {
  const { singleItem } = obj;
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleItem}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            {false && <Loading />}
            <ICard title={"Bill Details"}>
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        label="Unloaded Quantity"
                        placeholder="Unloaded Quantity"
                        value={values?.unLoadQuantity}
                        name="unLoadQuantity"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Damp Rate"
                        placeholder="Damp Rate"
                        value={values?.dumpDeliveryRate}
                        name="dumpDeliveryRate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Damp Qty"
                        placeholder="Damp Qty"
                        value={values?.dumpQnt}
                        name="dumpQnt"
                        type="number"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        label="Direct Rate"
                        placeholder="Direct Rate"
                        value={values?.directRate}
                        name="directRate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Direct Qty"
                        placeholder="Direct Qty"
                        value={values?.directQnt}
                        name="directQnt"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Bolgate to Dam Rate"
                        placeholder="Bolgate to Dam Rate"
                        value={values?.bolgateToDamRate}
                        name="bolgateToDamRate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Bolgate to Dam Qty"
                        placeholder="Bolgate to Dam Qty"
                        value={values?.bolgateToDumpQnt}
                        name="bolgateToDumpQnt"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Dam to Truck Rate"
                        placeholder="Dam to Truck Rate"
                        value={values?.dumpToTruckAmount}
                        name="dumpToTruckAmount"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Dam to Truck Qty"
                        placeholder="Dam to Truck Qty"
                        value={values?.dumpToTruckQnt}
                        name="dumpToTruckQnt"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Lighter to Bolgate Rate"
                        placeholder="Lighter to Bolgate Rate"
                        value={values?.lighterToBolgateRate}
                        name="lighterToBolgateRate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Lighter to Bolgate Qty"
                        placeholder="Lighter to Bolgate Qty"
                        value={values?.lighterToBolgateQnt}
                        name="lighterToBolgateQnt"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Truck to Dam Rate"
                        placeholder="Truck to Dam Rate"
                        value={values?.truckToDamRate}
                        name="truckToDamRate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Truck to Dam Qty"
                        placeholder="Truck to Dam Qty"
                        value={values?.truckToDamQnt}
                        name="truckToDamQnt"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.truckToDumpOutsideRate}
                        name="truckToDumpOutsideRate"
                        label="Truck To Dam Outside Rate"
                        placeholder="Truck To Dam Outside Rate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.truckToDumpOutsideQnt}
                        label="Truck To Dam Outside Qty"
                        placeholder="Truck To Dam Outside Qty"
                        name="truckToDumpOutsideQnt"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.biwtarate}
                        label="BIWTA Rate"
                        placeholder="BIWTA Rate"
                        name="biwtarate"
                        type="number"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.shipSweepingRate}
                        label="Ship Sweeping Amount"
                        placeholder="Ship Sweeping Amount"
                        name="shipSweepingRate"
                        type="number"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.scaleRate}
                        label="Scale Amount"
                        placeholder="Scale Amount"
                        name="scaleRate"
                        type="number"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.dailyLaboureRate}
                        label="Daily Labor Amount"
                        placeholder="Daily Labor Amount"
                        name="dailyLaboureRate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Others Cost Amount"
                        placeholder="Others Cost Amount"
                        value={values?.othersCostRate}
                        name="othersCostRate"
                        type="number"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default Details;
