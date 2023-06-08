import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import NewSelect from "../../../../_helper/_select";
import {
  GetDomesticPortDDL,
  GetLandingData,
  GetLighterVesselDDL,
  getMotherVesselDDL,
  GetShipPointDDL,
} from "../helper";

export default function VesselShipPointChange() {
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [lighterVessel, setLighterVessel] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);

  const [rowDto, setRowDto] = useState([]);

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
              </div>
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
            </Form>
          </ICard>
        )}
      </Formik>
    </>
  );
}
