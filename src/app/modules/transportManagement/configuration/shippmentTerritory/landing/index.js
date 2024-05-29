import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  ShippingPointTerritoryLanding,
  getShipPointDDL,
  inActiveShippointTerritory,
} from "../helper";

const initData = {
  shipPoint: "",
};

export function ShippmentTerritory() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const [shipPointDDL, setShipPointDDL] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    getShipPointDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShipPointDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const selectedData = () => {
    let data = [];
    gridData.forEach((item) => {
      if (item?.isSelect) {
        data.push(item?.id);
      }
    });
    return data;
  };

  const deleteHandler = async (values) => {
    const data = await selectedData();
    if (data.length === 0) {
      return toast.warning("Please Select Checkbox");
    }
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to delete?`,
      yesAlertFunc: () => {
        inActiveShippointTerritory(data, setLoading, () => {
          ShippingPointTerritoryLanding(
            values?.shipPoint?.value,
            setGridData,
            setLoading
          );
        });
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);
  };

  const selectIndividualItem = (index, isSelect) => {
    const newGridData = gridData;
    newGridData[index].isSelect = isSelect;
    setGridData(newGridData);
  };

  return (
    <ICustomCard
      title="Shippoint & Territory Configuration"
      // title="Shippment Territory Configuration"
      renderProps={() => (
        <button
          className="btn btn-primary"
          onClick={() => {
            history.push({
              pathname:
                "/transport-management/configuration/shipmentTerritoryConfig/create",
            });
          }}
        >
          Create
        </button>
      )}
    >
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, shipPoint: shipPointDDL[0] }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // console.log("object");
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
        }) => (
          <>
            <Form className="global-form from-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL}
                    value={values?.shipPoint}
                    label="Select Shippoint"
                    onChange={(valueOption) => {
                      setGridData([]);
                      setFieldValue("shipPoint", valueOption);
                      ShippingPointTerritoryLanding(
                        valueOption?.value,
                        setGridData,
                        setLoading
                      );
                    }}
                    placeholder="Select Shippoint"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </Form>
            <div className="col-lg-12 pr-0 pl-0">
              {gridData.length > 0 && (
                <button
                  type="button"
                  className="btn btn-danger float-right"
                  onClick={() => deleteHandler(values)}
                >
                  Delete Selected Data
                </button>
              )}
              <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Select</th>
                    <th>Shippoint Name</th>
                    <th>Region</th>
                    <th>Area</th>
                    <th>Territory</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.length > 0 &&
                    gridData?.map((item, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td
                          style={{ width: "70px" }}
                          className="text-center pl-2"
                        >
                          <span>
                            <input
                              style={{ width: "15px", height: "15px" }}
                              name="isSelect"
                              checked={item?.isSelect}
                              className="form-control ml-8"
                              type="checkbox"
                              onChange={(e) => {
                                if (item?.isSelect) {
                                  selectIndividualItem(index, false);
                                } else {
                                  selectIndividualItem(index, true);
                                }
                              }}
                            />
                          </span>
                        </td>
                        <td>{item?.shippointName}</td>
                        <td>{item?.regionName}</td>
                        <td>{item?.areaName}</td>
                        <td>{item?.territoryName}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              </div>
            </div>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
