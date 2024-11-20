import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import NewSelect from "../../../../_helper/_select";
import {
  GetBillingData,
  GetDomesticPortDDL,
  GetLandingData,
  GetLighterVesselDDL,
  getMotherVesselDDL,
  GetShipPointDDL,
} from "../helper";
import InputField from "../../../../_helper/_inputField";

export default function VesselShipPointChange() {
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [lighterVessel, setLighterVessel] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);

  const [rowDto, setRowDto] = useState([]);
  const [billingInfo, setBillingInfo] = useState([]);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetDomesticPortDDL(setDomesticPortDDL);
    getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    GetShipPointDDL(accId, buId, setShipPointDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const setLandingData = (values) => {
    GetLandingData(values, setRowDto);
  };
  const setBillingData = (values) => {
    GetBillingData({ ...values, buId: buId }, setBillingInfo);
  };

  return (
    <>
      <Formik initialValues={{}} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <ICard title="Vessel Ship Point Change">
            <Form>
              <div className="row global-form global-form-custom">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={
                      [
                        {
                          value: 1,
                          label: "View",
                        },
                        {
                          value: 2,
                          label: "Update Ship Point",
                        },
                        {
                          value: 3,
                          label: "G2G Billing Info",
                        },
                      ] || []
                    }
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                      setFieldValue("shipPoint", "");
                    }}
                    placeholder="Type"
                  />
                </div>

                {values?.type?.value === 3 ? (
                  <>
                    <div className="col-lg-2 ">
                      <label>Challan Number</label>
                      <InputField
                        value={values?.challanNumber}
                        name="challanNumber"
                        placeholder="Challan Number"
                        onChange={(e) => {
                          setFieldValue("challanNumber", e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From date"
                          type="date"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To date"
                          type="date"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <button
                        className="btn btn-primary mt-5"
                        type="button"
                        onClick={() => {
                          setBillingData(values);
                          // console.log(values);
                        }}
                        disabled={
                          !values?.type?.value ||
                          !values?.challanNumber ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                      >
                        {"View"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="domesticPort"
                        options={domesticPortDDL || []}
                        value={values?.domesticPort}
                        label="Domestic Port"
                        onChange={(valueOption) => {
                          setFieldValue("domesticPort", valueOption);
                          getMotherVesselDDL(
                            accId,
                            buId,
                            valueOption?.value,
                            setMotherVesselDDL
                          );
                          setFieldValue("motherVessel", "");
                          setFieldValue("lighterVessel", "");
                        }}
                        placeholder="Domestic Port"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="motherVessel"
                        options={motherVesselDDL || []}
                        value={values?.motherVessel}
                        label="Mother Vessel"
                        onChange={(valueOption) => {
                          setFieldValue("motherVessel", valueOption);
                          valueOption &&
                            GetLighterVesselDDL(
                              valueOption?.value,
                              setLighterVessel
                            );
                          setFieldValue("lighterVessel", "");
                        }}
                        placeholder="Mother Vessel"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="lighterVessel"
                        options={lighterVessel || []}
                        label="Lighter Vessel"
                        value={values?.lighterVessel}
                        onChange={(valueOption) => {
                          setFieldValue("lighterVessel", valueOption);
                        }}
                        placeholder="Lighter Vessel"
                      />
                    </div>
                    {values?.type?.value === 2 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={shipPointDDL || []}
                          label="Ship Point"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                          placeholder="Ship Point"
                        />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <button
                        className="btn btn-primary mt-5"
                        type="button"
                        onClick={() => {
                          setLandingData(values);
                          // console.log(values);
                        }}
                        disabled={
                          !values?.type?.value ||
                          !values?.domesticPort?.value ||
                          !values?.motherVessel?.value ||
                          !values?.lighterVessel?.value ||
                          values?.type?.value === 2
                            ? !values?.shipPoint?.value
                            : false
                        }
                      >
                        {values?.type?.value === 2 ? "Update" : "View"}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {values?.type?.value === 3 ? (
                <div className="row">
                  <div className="col-12 common-scrollable-table">
                    <div
                      className="scroll-table _table overflow-auto"
                      // style={{ height: "700px" }}
                    >
                      {/* <div className="table-responsive"> */}
                      <table
                        id="table-to-xlsx"
                        style={{ fontSize: "12px" }}
                        className="table table-striped table-bordered "
                      >
                        <thead className="bg-secondary">
                          <tr>
                            <th style={{ width: "40px" }}>SL</th>
                            <th>Delivery Id</th>
                            <th>Delivery Code</th>
                            <th>SUB Name</th>
                            <th>ShipvTovPartnerId</th>
                            <th>ShipcTocPartner Name</th>
                            <th>Mother Vessel Name</th>
                            <th>Lighter Vessel Name</th>
                            <th>Sold To Partner Name</th>
                            <th>Delivery Date</th>
                            <th>Ship Point Name</th>
                            <th>Supplier Name</th>
                            <th>Godownv Labour Supplier</th>
                            <th>Godown Unload Labour Rate</th>
                            <th>GoDown Labour Amount</th>
                            <th>Transport Rate</th>
                            <th>Transport Amount</th>
                            <th>Quantity</th>
                            <th>header Active</th>
                            <th>Row Active</th>
                            <th>So Number</th>
                            <th>Vehicle No</th>
                            <th>Delivery Address</th>
                            <th>Supervisor Confirm</th>
                            <th>Accounting Journal Code</th>
                            <th>TrucksupplierBillRegisterCode</th>
                            <th>supervisorApproveDate</th>
                            <th>ledgerDate</th>
                            <th>billregisterApproveAmount</th>
                            <th>paymentRequestCode</th>
                            <th>paymentAmount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billingInfo?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item?.deliveryId}
                                </td>
                                <td className="text-center">
                                  {item?.deliveryCode}
                                </td>
                                <td className="text-center">{item?.sbuName}</td>
                                <td className="text-center">
                                  {item?.shipToPartnerId}
                                </td>
                                <td className="text-center">
                                  {item?.shipToPartnerName}
                                </td>
                                <td className="text-center">
                                  {item?.motherVesselName}
                                </td>
                                <td className="text-center">
                                  {item?.lighterVesselName}
                                </td>
                                <td className="text-center">
                                  {item?.soldToPartnerName}
                                </td>
                                <td className="text-center">
                                  {item?.deliveryDate}
                                </td>
                                <td className="text-center">
                                  {item?.shipPointName}
                                </td>
                                <td className="text-center">
                                  {item?.supplierName}
                                </td>
                                <td className="text-center">
                                  {item?.godownLabourSupplier}
                                </td>
                                <td className="text-center">
                                  {item?.godownUnloadLabourRate}
                                </td>
                                <td className="text-center">
                                  {item?.goDownLabourAmount}
                                </td>
                                <td className="text-center">
                                  {item?.transportRate}
                                </td>
                                <td className="text-center">
                                  {item?.transportAmount}
                                </td>
                                <td className="text-center">
                                  {item?.quantity}
                                </td>
                                <td className="text-center">
                                  {item?.headerActive}
                                </td>
                                <td className="text-center">
                                  {item?.rowActive}
                                </td>
                                <td className="text-center">
                                  {item?.soNumber}
                                </td>
                                <td className="text-center">
                                  {item?.vehicleNo}
                                </td>
                                <td className="text-center">
                                  {item?.deliveryAddress}
                                </td>
                                <td className="text-center">
                                  {item?.supervisorConfirm}
                                </td>
                                <td className="text-center">
                                  {item?.accountingJournalCode}
                                </td>
                                <td className="text-center">
                                  {item?.trucksupplierBillRegisterCode}
                                </td>
                                <td className="text-center">
                                  {item?.supervisorApproveDate}
                                </td>
                                <td className="text-center">
                                  {item?.ledgerDate}
                                </td>
                                <td className="text-center">
                                  {item?.billregisterApproveAmount}
                                </td>
                                <td className="text-center">
                                  {item?.paymentRequestCode}
                                </td>
                                <td className="text-center">
                                  {item?.paymentAmount}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row cash_journal">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>SL</th>
                          <th>Mother Vessel</th>
                          <th>Lighter Vessel</th>
                          <th>Ship Point</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td> {index + 1}</td>
                              <td>{item?.strMothervesselName}</td>
                              <td>{item?.strlightervesselname}</td>
                              <td>{item?.strShipPointName}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Form>
          </ICard>
        )}
      </Formik>
    </>
  );
}
