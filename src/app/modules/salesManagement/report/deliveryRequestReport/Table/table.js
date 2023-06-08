import React, { useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import { GetLandingData } from "../helper";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  date: _todayDate(),
  vehicleProvider: "",
  deliveryMode: "",
  assignedTo: "",
};

export default function DeliveryRequestReport() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  const vehicleProviderDDL = [
    { value: "All", label: "All" },
    { value: "Company", label: "Company" },
    { value: "Supplier", label: "Supplier" },
  ];

  const deliveryModeDDL = [
    { value: "All", label: "All" },
    { value: "Day", label: "Day" },
    { value: "Night", label: "Night" },
  ];

  const headers = [
    "SL",
    "Request No",
    "Request Date",
    "Party Name",
    "Delivery Id",
    "Request Vehicle No",
    "Vehicle Type",
    "Delivery Mode",
    "Car Type",
    "Bag Type",
    "Item Name",
    "Quantity",
  ];

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Delivery Request Report"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <Formik enableReinitialize={true} initialValues={initData}>
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-2">
                          <InputField
                            value={values?.date}
                            label="Date"
                            name="date"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="vehicleProvider"
                            options={vehicleProviderDDL || []}
                            value={values?.vehicleProvider}
                            label="Vehicle Provider"
                            placeholder="Vehicle Provider"
                            onChange={(valueOption) => {
                              setFieldValue("vehicleProvider", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="deliveryMode"
                            options={deliveryModeDDL || []}
                            value={values?.deliveryMode}
                            label="Delivery Mode"
                            placeholder="Delivery Mode"
                            onChange={(valueOption) => {
                              setFieldValue("deliveryMode", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {/* <div className="col-lg-2">
                          <NewSelect
                            name="assignedTo"
                            options={[
                              { value: 0, label: "UnAssigned" },
                              { value: 1, label: "Assigned" },
                            ]}
                            value={values?.assignedTo}
                            label="Assigned To"
                            placeholder="Assigned To"
                            onChange={(valueOption) => {
                              setFieldValue("assignedTo", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div> */}
                        <div className="mt-5">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              GetLandingData(
                                selectedBusinessUnit?.value,
                                // values?.assignedTo?.value,
                                values?.deliveryMode?.value,
                                values?.vehicleProvider?.value,
                                values?.date,
                                setRowDto,
                                setLoading
                              );
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}
                    <ICustomTable ths={headers}>
                      {rowDto?.map((itm, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{itm?.requestNo}</td>
                              <td>{_dateFormatter(itm?.requestDate)}</td>
                              <td>{itm?.partyName}</td>
                              <td>{itm?.deliveryId}</td>
                              <td>{itm?.requestVehicleNo}</td>
                              <td>{itm?.requestVehicleType}</td>
                              <td>{itm?.deliveryMode}</td>
                              <td>{itm?.carType}</td>
                              <td>{itm?.bagType}</td>
                              <td>{itm?.itemName}</td>
                              <td> {itm.quantity}</td>
                            </tr>
                          </>
                        );
                      })}
                    </ICustomTable>
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
