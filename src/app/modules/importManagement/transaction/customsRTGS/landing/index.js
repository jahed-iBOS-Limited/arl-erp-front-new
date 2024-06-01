/* eslint-disable react-hooks/exhaustive-deps */
import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomTable from "../../../../_helper/_customTable";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getLandingData, getShipmentDDL } from "../helper";
// import IWarningModal from "../../../../_helper/_warningModal";
// import numberWithCommas from "../../../../_helper/_numberWithCommas";

const header = ["SL", "Action"];

const CustomDutyLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState([]);
  const [shipmentDDL, setShipmentDDL] = useState(false);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(75);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, shipmentId, PoNo) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      shipmentId,
      PoNo,
      pageSize,
      pageNo,
      setGridData,
      setLoading
    );
  };
  useEffect(() => {
    getGrid();
  }, [profileData, selectedBusinessUnit]);

  const getGrid = (poNo, shipment) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      shipment,
      poNo,
      pageSize,
      pageNo,
      setGridData,
      setLoading
    );
  };

  // Get PO List DDL
  const polcList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    ).then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ poLc: "", shipment: "" }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <CardHeader title="Customs RTGS">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push(
                        "/managementImport/transaction/customs-rtgs/create"
                      );
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-md-3 col-lg-3">
                      <label>PO/LC</label>
                      <SearchAsyncSelect
                        selectedValue={values?.poLc}
                        isSearchIcon={true}
                        paddingRight={10}
                        name="poLc"
                        handleChange={(valueOption) => {
                          setFieldValue("poLc", valueOption);
                          getShipmentDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.label,
                            setShipmentDDL
                          );
                          setFieldValue("shipment", "");
                          getGrid(
                            valueOption?.label,
                            valueOption ? values?.shipment?.value : ""
                          );
                        }}
                        loadOptions={polcList || []}
                        placeholder="Search by PO/LC Id"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipment"
                        options={shipmentDDL || []}
                        label="Shipment No"
                        value={values?.shipment}
                        onChange={(valueOption) => {
                          setFieldValue("shipment", valueOption);
                          getGrid(values?.poLc?.label, valueOption?.value);
                        }}
                        placeholder="Shipment"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  <ICustomTable ths={header}>
                    {gridData?.data?.length > 0 &&
                      gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                  </ICustomTable>

                  {/* Pagination Code */}
                  {gridData?.data?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                    />
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default CustomDutyLanding;
