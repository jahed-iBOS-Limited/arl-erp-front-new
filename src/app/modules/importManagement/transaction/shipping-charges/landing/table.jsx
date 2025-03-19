import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import { Formik } from "formik";
import IView from "../../../../_helper/_helperIcons/_view";
import FormikError from "../../../../_helper/_formikError";
import axios from "axios";
import { GetLandingData } from "../helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
// import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";

// Table headers
const header = ["SL", "PO No", "LC No", "Shipping Charge", "Action"];

const initData = {
  shipment: "",
};

const ShippingChargesLanding = () => {
  const history = useHistory();
  const [gridData, setGridData] = useState();
  const [isloading,] = useState(false);
   // Get LC DDL
  useEffect(() => {
    // GetLetterOfCreditDDL(setLetterOfCreditDDL);
  }, []);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Searchable Dropdown for PO No/CN No
  const shipmentOptions = (v) => {
    if (v?.length < 1) return [];
    return axios
      .get(
        `imp/ImportCommonDDL/GetShipmentListByShipmentId?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) =>
        res?.data?.map((item) => ({
          label: item?.label,
          value: item?.value,
        }))
      );
  };

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    GetLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      searchValue,
      //   setIsLoading,
      setGridData
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <Formik initialValues={initData}>
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <Card>
            <CardHeader title="Shipping Charges">
              <CardHeaderToolbar>
                <button
                  onClick={() =>
                    history.push({
                      pathname: `/managementImport/transaction/shipping-charges/create`,
                    })
                  }
                  className="btn btn-primary"
                >
                  Create
                </button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <div className="row p-3">
                <div className="col-lg-3 col-md-3">
                  <label>Shipment ID</label>
                  <SearchAsyncSelect
                    selectedValue={values?.shipment}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("shipment", valueOption);
                      paginationSearchHandler(valueOption?.label);
                    }}
                    loadOptions={shipmentOptions}
                  />
                  <FormikError
                    errors={errors}
                    name="shipment"
                    touched={touched}
                  />
                </div>
              </div>
              {isloading && <Loading />}
              <ICustomTable ths={header}>
                {gridData?.data?.length > 0 &&
                  gridData?.data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {index + 1}
                        </td>
                        <td className="text-center">
                          <span className="pl-2">{`${item?.poNumber}`}</span>
                        </td>
                        <td className="text-center">
                          <span className="pl-2">{`${item?.lcNumber}`}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{`${item?.totalAmount}`}</span>
                        </td>

                        <td style={{ width: "150px" }} className="text-center">
                          <span
                            className="edit p-1"
                            onClick={(e) =>
                              history.push({
                                pathname: `/managementImport/transaction/shipping-charges/edit/${item?.shippingChargeId}`,
                              })
                            }
                          >
                            <IEdit />
                          </span>
                          <span
                            className="p-1"
                            onClick={(e) =>
                              history.push({
                                pathname: `/managementImport/transaction/shipping-charges/view/${item?.shippingChargeId}`,
                              })
                            }
                          >
                            <IView />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </ICustomTable>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
};

export default ShippingChargesLanding;
