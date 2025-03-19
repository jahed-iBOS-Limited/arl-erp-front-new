import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  GetBusinessPartnerProfilePagination,
  getCategoryDDL_api,
} from "../helper";

const initData = {
  channel: { value: 0, label: "All" },
  region: { value: 0, label: "All" },
  area: { value: 0, label: "All" },
  territory: { value: 0, label: "All" },
  visitType: "",
};

export function TableRow() {
  const history = useHistory();
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [visitTypes, setVisitTypes] = useState([]);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const gridDataFunc = (values) => {
    GetBusinessPartnerProfilePagination(
      accId,
      buId,
      values?.channel?.value || 0,
      values?.region?.value || 0,
      values?.area?.value || 0,
      values?.territory?.value || 0,
      values?.visitType?.value || 0,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    if (buId && accId) {
      gridDataFunc();
    }
    getCategoryDDL_api(accId, buId, setVisitTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const getDifferenceDate = (date1, date2) => {
    const diff = Math.abs(new Date(date2) - new Date(date1));
    return (diff / (1000 * 60 * 60 * 24)).toFixed(0);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ setFieldValue, values }) => (
          <Form className="p-0 m-0">
            <div className="row global-form">
              <RATForm
                obj={{ values, setFieldValue, columnSize: "col-lg-2" }}
              />

              <div className="col-lg-2">
                <NewSelect
                  name="visitType"
                  options={visitTypes || []}
                  value={values?.visitType}
                  label="Customer Visit Type"
                  onChange={(valueOption) => {
                    setFieldValue("visitType", valueOption);
                  }}
                  placeholder="Customer Visit Type"
                />
              </div>

              <IButton
                onClick={() => {
                  gridDataFunc(values);
                }}
                disabled={false}
              />
            </div>

            <div className="row">
              {loading && <Loading />}
              <div className="col-lg-12 ">
                {gridData?.length >= 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table ">
                      <thead>
                        <tr>
                          <th style={{ width: "25px" }}>SL</th>
                          <th style={{ width: "90px" }}>Date</th>
                          <th>Potential Customer Name</th>
                          <th>Address</th>
                          <th>Contact Person Name & Designation</th>
                          <th>Contact Person No.</th>
                          <th>Conversion Deadline</th>
                          <th>Conversion Status</th>
                          <th>Conversion Date</th>
                          <th>Conversion Days</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((td, index) => (
                          <tr key={index}>
                            <td> {index + 1} </td>

                            <td className="text-center">
                              {_dateFormatter(td?.serverDatetime)}
                            </td>

                            <td>
                              <div className="pl-2">{td?.customerName}</div>
                            </td>

                            <td>
                              <div className="pl-2">{td?.customerAddress}</div>
                            </td>

                            <td>
                              <div className="pl-2">
                                {td?.contractPersonName}{" "}
                                {td?.contractPersonDesignation
                                  ? `[${td?.contractPersonDesignation}]`
                                  : ""}
                              </div>
                            </td>

                            <td>
                              <div className="pl-2">
                                {td?.contractPersonPhone}
                              </div>
                            </td>

                            <td className="text-center">
                              {_dateFormatter(td?.conversionDeadline)}
                            </td>

                            <td className="text-center">
                              {td?.isConversionStatus
                                ? "On Boarding"
                                : "Pending"}{" "}
                            </td>

                            <td className="text-center">
                              {_dateFormatter(td?.conversionDate)}
                            </td>

                            <td className="text-center">
                              {getDifferenceDate(
                                _dateFormatter(td?.conversionDate),
                                _dateFormatter(td?.conversionDeadline)
                              )}{" "}
                              days
                            </td>

                            <td>
                              <div className="d-flex justify-content-around">
                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/sales-management/ordermanagement/customerVisit/edit/${td?.customerVisitId}`
                                    );
                                  }}
                                >
                                  <IEdit />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
