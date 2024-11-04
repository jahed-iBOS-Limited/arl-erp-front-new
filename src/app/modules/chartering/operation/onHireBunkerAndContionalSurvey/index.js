import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { imarineBaseUrl } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import PaginationTable from "../../../_helper/_tablePagination";
import { _previousDate, _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IButton from "../../../_helper/iButton";
import customStyles from "../../../selectCustomStyle";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";

const initData = {
  fromDate: "",
  toDate: "",
};

export default function OnHireBunkerAndContionalSurvey() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const dispatch = useDispatch();
  const history = useHistory();

  const [, onSave, loader] = useAxiosPost();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading2, setLoading] = useState(false);

  useEffect(() => {
    getLandingData({}, pageNo, pageSize);
  }, [])

  const getLandingData = (values, pageNo, pageSize) => {
    const shipTypeSTR = values?.shipType
      ? `&shipType=${values?.shipType?.label}`
      : "";
    const voyageTypeSTR = values?.voyageType
      ? `&voyageType=${values?.voyageType?.label}`
      : "";
    const vesselNameSTR = values?.vesselName
      ? `&vesselName=${values?.vesselName?.label}`
      : "";
    const voyageNoSTR = values?.voyageNo
      ? `&voyageNo=${values?.voyageNo?.label}`
      : "";
    getGridData(
      `${imarineBaseUrl}/domain/VesselNomination/GetRfqonHireBunkerQtyLanding?BusinessUnitId=${0}&FromDate=${values?.fromDate || _previousDate()
      }&ToDate=${values?.toDate || _todayDate()
      }&pageNumber=${pageNo}&pageSize=${pageSize}${shipTypeSTR}${voyageTypeSTR}${vesselNameSTR}${voyageNoSTR}`
    );
  };

  const setPositionHandler = (pageNo, pageSize) => {
    getLandingData(initData, pageNo, pageSize);
  };

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      shipType: 0,
      isComplete: 0,
      voyageTypeId: 0,
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getLandingData(values, pageNo, pageSize);
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loader && <Loading />}
          <IForm
            title="On Hire Bunker and Condition Survey"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className="form-group global-form row">
                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.shipType}
                    isSearchable={true}
                    options={[
                      { value: 1, label: "Own Ship" },
                      { value: 2, label: "Charterer Ship" },
                    ]}
                    styles={customStyles}
                    name="shipType"
                    placeholder="Ship Type"
                    label="Ship Type"
                    onChange={(valueOption) => {
                      setFieldValue("shipType", valueOption);
                      setFieldValue("vesselName", "");
                      setFieldValue("voyageNo", "");
                      setVesselDDL([]);
                      if (valueOption) {
                        getVesselDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          setVesselDDL,
                          valueOption?.value === 2 ? 2 : ""
                        );
                      } else {
                        getLandingData({}, pageNo, pageSize);
                      }
                    }}
                  />
                </div>

                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.voyageType}
                    isSearchable={true}
                    options={[
                      { value: 1, label: "Time Charter" },
                      { value: 2, label: "Voyage Charter" },
                    ]}
                    styles={customStyles}
                    name="voyageType"
                    placeholder="Voyage Type"
                    label="Voyage Type"
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", "");
                      setFieldValue("voyageNo", "");
                      setFieldValue("voyageType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.vesselName}
                    isSearchable={true}
                    options={vesselDDL || []}
                    styles={customStyles}
                    name="vesselName"
                    placeholder="Vessel Name"
                    label="Vessel Name"
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                      setFieldValue("voyageNo", "");
                      if (valueOption) {
                        getVoyageDDL({ ...values, vesselName: valueOption });
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.voyageNo || ""}
                    isSearchable={true}
                    options={voyageNoDDL || []}
                    styles={customStyles}
                    name="voyageNo"
                    placeholder="Voyage No"
                    label="Voyage No"
                    onChange={(valueOption) => {
                      setFieldValue("voyageNo", valueOption);
                    }}
                    isDisabled={!values?.vesselName}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <IButton
                    disabled={!values?.fromDate || !values?.toDate}
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Vessel Nomination Code</th>
                        <th>Bunker Survey Amount</th>
                        <th>Bunker + Condition Survey Amount</th>
                        <th>Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={item.intRfqonHireBunkerQtyId}>
                          <td className="text-center">{index + 1}</td>

                          <td className="text-center">
                            {item?.strVesselNominationCode}
                          </td>
                          <td className="text-center">
                            {item?.numBunkerSurveyAmount}
                          </td>
                          <td className="text-center">
                            {item?.numBunkerAndConditionSurveyAmount}
                          </td>
                          <td className="text-center">
                            {item?.strAttachment ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.strAttachment
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.length > 0 && (
                <PaginationTable
                  count={gridData?.length}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
              <div></div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
