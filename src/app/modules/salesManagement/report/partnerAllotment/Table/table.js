import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import {
  GetPartnerAllotmentLanding,
  GetSecondaryDeliveryLanding_api,
} from "../helper";
import CompleteTable from "./../../../orderManagement/partnerAllotmentChallan/Table/completeTable";

const headers = [
  "SL",
  "Dealer Name",
  "Upozila Name",
  "Item Name",
  "UoM Name",
  "Total Order Qty",
  "Total Pending Qty",
  "Alloted Qnt",
  "Item Rate",
  "Total Amount",
  "Remarks",
];
const initData = {
  date: _todayDate(),
  reportType: { value: 0, label: "All" },
};

export default function PartnerAllotmentReport() {
  const [deliveryId, setDeliveryId] = useState("");
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [challanPrintModalShow, setChallanPrintModalShow] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetPartnerAllotmentLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData?.date,
        initData?.reportType?.value,
        setLoading,
        setRowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getGridDataChallenInfo = (values, pageNo, pageSize) => {
    GetSecondaryDeliveryLanding_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.date,
      pageNo,
      pageSize,
      setLoading,
      setRowDto
    );
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridDataChallenInfo(values, pageNo, pageSize);
  };

  const getGridData = (values) => {
    if (values?.reportType?.value === 3) {
      getGridDataChallenInfo(values, pageNo, pageSize);
    } else {
      GetPartnerAllotmentLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.date,
        values?.reportType?.value,
        setLoading,
        setRowDto
      );
    }
  };

  const gridData = [...(rowDto?.data || rowDto)];
  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Partner Allotment Report"
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
                        <div className="col-lg-3">
                          <NewSelect
                            name="reportType"
                            options={[
                              { value: 0, label: "All" },
                              { value: 1, label: "Payment Complete" },
                              { value: 2, label: "Pending" },
                              { value: 3, label: "Challan Info" },
                            ]}
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
                            value={values?.date}
                            label="Date"
                            name="date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("date", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="mt-5">
                          <button
                            className="btn btn-primary"
                            disabled={!values?.reportType}
                            onClick={() => {
                              setDeliveryId("")
                              setRowDto([]);
                              getGridData(values);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}
                    {values?.reportType?.value === 3 ? (
                      <>
                        {" "}
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
                        />
                      </>
                    ) : (
                      <>
                        {" "}
                        {rowDto?.length > 0 && (
                          <ICustomTable ths={headers}>
                            {rowDto?.map((item, index) => {
                              return (
                                <>
                                  <tr key={index}>
                                    <td
                                      style={{ width: "30px" }}
                                      className="text-center"
                                    >
                                      {index + 1}
                                    </td>
                                    <td>{item?.ownerName}</td>
                                    <td>{item?.upzilaName}</td>
                                    <td>{item?.itemName}</td>
                                    <td>{item?.uomName}</td>
                                    <td className="text-right">
                                      {item?.totalOrderQty}
                                    </td>
                                    <td className="text-right">
                                      {item?.totalPendingQty}
                                    </td>
                                    <td className="text-right">
                                      {item?.allotedQty}
                                    </td>
                                    <td className="text-right">
                                      {item?.itemRate}
                                    </td>
                                    <td className="text-right">
                                      {item?.totalAmount}
                                    </td>
                                    <td>{item?.remarks}</td>
                                  </tr>
                                </>
                              );
                            })}
                          </ICustomTable>
                        )}
                      </>
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
