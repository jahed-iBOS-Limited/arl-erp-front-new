import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ICard from "../../../../_helper/_card";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import {
  GetPartnerAllotmentLanding,
  GetSecondaryDeliveryLanding_api,
} from "../helper";
import { useHistory } from "react-router";
import { setPartnerAllotmentChallanLadingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
import CompleteTable from "./completeTable";
import PendingTable, { PendingTableForModify } from "./pendingTable";
import PaginationSearch from "../../../../_helper/_search";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: { value: 1, label: "Pending Delivery" },
};

export default function PartnerAllotmentChallan() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [challanPrintModalShow, setChallanPrintModalShow] = useState(false);
  const [deliveryId, setDeliveryId] = useState("");
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const partnerAllotmentChallanLading = useSelector((state) => {
    return state.localStorage.partnerAllotmentChallanLading;
  }, shallowEqual);

  const getGridData = (values, pageNo, pageSize, searchTerm = "") => {
    if (values?.reportType?.value === 1) {
      GetPartnerAllotmentLanding(
        accId,
        buId,
        values?.fromDate,
        2,
        setLoading,
        setRowDto
      );
    } else {
      GetSecondaryDeliveryLanding_api(
        accId,
        buId,
        values?.reportType?.value,
        values?.fromDate,
        values?.toDate,
        pageNo,
        pageSize,
        searchTerm,
        setLoading,
        setRowDto
      );
    }
  };

  useEffect(() => {
    if (accId && buId && partnerAllotmentChallanLading?.reportType?.value) {
      getGridData(partnerAllotmentChallanLading, pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (searchTerm, values) => {
    getGridData(values, pageNo, pageSize, searchTerm);
  };
  const history = useHistory();
  const dispatch = useDispatch();

  const gridData = [...(rowDto?.data || rowDto)];

  const reportTypes = [
    { value: 1, label: "Pending Delivery" },
    { value: 2, label: "Pending Commission" },
    { value: 3, label: "Complete Commission" },
    { value: 4, label: "Pending Commission (Modify)" },
  ];

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Partner Commissioning Challan"
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  ...initData,
                  ...partnerAllotmentChallanLading,
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-3">
                          <NewSelect
                            name="reportType"
                            options={reportTypes}
                            value={values?.reportType}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("reportType", valueOption);
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.fromDate}
                            label="From Date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                            }}
                          />
                        </div>
                        {values?.reportType?.value !== 1 && (
                          <div className="col-lg-3">
                            <InputField
                              value={values?.toDate}
                              label="To Date"
                              name="toDate"
                              type="date"
                              onChange={(e) => {
                                setFieldValue("toDate", e?.target?.value);
                              }}
                            />
                          </div>
                        )}

                        <div className="mt-5">
                          <button
                            className="btn btn-primary"
                            disabled={!values?.reportType}
                            onClick={() => {
                              setDeliveryId("");
                              setRowDto([]);
                              getGridData(values, pageNo, pageSize);
                              dispatch(
                                setPartnerAllotmentChallanLadingAction(values)
                              );
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}

                    {values?.reportType?.value !== 1 && (
                      <div className="col-lg-3 mt-5">
                        <PaginationSearch
                          placeholder="Search"
                          paginationSearchHandler={paginationSearchHandler}
                          values={values}
                        />
                      </div>
                    )}

                    {[2, 3].includes(values?.reportType?.value) ? (
                      <CompleteTable
                        setChallanPrintModalShow={setChallanPrintModalShow}
                        rowDto={rowDto}
                        gridData={gridData}
                        values={values}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                        challanPrintModalShow={challanPrintModalShow}
                        setDeliveryId={setDeliveryId}
                        deliveryId={deliveryId}
                        accId={accId}
                        buId={buId}
                      />
                    ) : values?.reportType?.value === 4 ? (
                      <PendingTableForModify
                        rowDto={rowDto}
                        accId={accId}
                        buId={buId}
                      />
                    ) : (
                      <PendingTable rowDto={gridData} history={history} />
                    )}
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
