import React from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../_helper/_customCard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import FormikError from "../../../_helper/_formikError";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../_helper/_tablePagination";
import Loading from "../../../_helper/_loading";

const validationSchema = Yup.object().shape({
  statusAndStage: Yup.object().shape({
    value: Yup.number().required("Status & Stage is required"),
    label: Yup.string().required("Status & Stage is required"),
  }),
  division: Yup.object().shape({
    value: Yup.number().required("Division is required"),
    label: Yup.string().required("Division is required"),
  }),
  district: Yup.object().shape({
    value: Yup.number().required("District is required"),
    label: Yup.string().required("District is required"),
  }),
  thana: Yup.object().shape({
    value: Yup.number().required("Thana is required"),
    label: Yup.string().required("Thana is required"),
  }),
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
});
const STAGE_STATUS = [
  { value: 1, label: "Suspect" },
  { value: 2, label: "Prospect" },
  { value: 3, label: "Lead" },
  { value: 4, label: "Client" },
  { value: 5, label: "Customer" },
];

export default function CustomerLeadGeneration() {
  let history = useHistory();
  const {
    profileData: { userId },
    selectedBusinessUnit,
  } = useSelector((state) => state?.authData || {}, shallowEqual);
  const [divisionDDL, getDivisionDDL] = useAxiosGet();
  const [districtDDL, getDistrictDDL] = useAxiosGet();
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [landingData, getLandingData, isLoading] = useAxiosGet();

  const formikRef = React.useRef(null);
  const saveHandler = (values) => {
    commonLandingApi();
  };
  const commonLandingApi = (PageNo = pageNo, PageSize = pageSize) => {
    const values = formikRef.current.values;
    let querystring = "";
    if (values?.statusAndStage?.value) {
      querystring += `&stageStatus=${values?.statusAndStage?.label}`;
    }
    if (values?.division?.value) {
      querystring += `&divisionId=${values?.division?.value}`;
    }
    if (values?.district?.value) {
      querystring += `&districtId=${values?.district?.value}`;
    }
    if (values?.thana?.value) {
      querystring += `&transportzoneId=${values?.thana?.value}`;
    }
    if (values?.fromDate) {
      querystring += `&fromDate=${values?.fromDate}`;
    }
    if (values?.toDate) {
      querystring += `&toDate=${values?.toDate}`;
    }
    getLandingData(
      `/oms/SalesQuotation/GetCustomerAcquisitionPagination?userId=${userId}&businessUnitId=${selectedBusinessUnit?.value}&pageNo=${pageNo}&pageSize=${pageSize}${querystring}`,
      (data) => {
        console.log(data, "data");
      }
    );
  };
  const getDistrict = (divisionId) => {
    getDistrictDDL(
      `/oms/TerritoryInfo/GetDistrictDDL?countryId=18&divisionId=${divisionId}`
    );
  };
  const loadThana = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/oms/SalesQuotation/GetUserWiseShipToPartnerAndZoneDDL?partName=TransportZoneDDL&userId=${userId}&businessUnitId=${selectedBusinessUnit?.value}&districtId=${formikRef.current.values?.district?.value}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  React.useEffect(() => {
    getDivisionDDL("/oms/TerritoryInfo/GetDivisionDDL?countryId=18");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ICustomCard
      title="Customer Lead Generation"
      createHandler={() => {
        history.push(
          "/call-center-management/customer-inquiry/customerleadgeneration/create"
        );
      }}
      backHandler={() => {
        history.goBack();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      {isLoading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          statusAndStage: "",
          division: "",
          district: "",
          thana: "",
          fromDate: "",
          toDate: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {/* <h1>
                            {JSON.stringify(errors)}
                        </h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* Status & Stage */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Status & Stage"}
                      options={STAGE_STATUS || []}
                      value={values?.statusAndStage}
                      name="statusAndStage"
                      onChange={(valueOption) => {
                        setFieldValue("statusAndStage", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {/* division */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Division"}
                      options={divisionDDL || []}
                      value={values?.division}
                      name="division"
                      onChange={(valueOption) => {
                        setFieldValue("division", valueOption || "");
                        setFieldValue("district", "");
                        setFieldValue("thana", "");
                        valueOption?.value && getDistrict(valueOption?.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* district */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"District"}
                      options={districtDDL || []}
                      value={values?.district}
                      name="district"
                      onChange={(valueOption) => {
                        setFieldValue("district", valueOption || "");
                        setFieldValue("thana", "");
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.division?.value ? false : true}
                    />
                  </div>
                  {/* thana */}
                  <div className="col-lg-3">
                    <label>Thana</label>
                    <SearchAsyncSelect
                      selectedValue={values?.thana}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("thana", valueOption);
                      }}
                      loadOptions={loadThana}
                      isDisabled={
                        values?.division?.value && values?.district?.value
                          ? false
                          : true
                      }
                    />
                    <FormikError
                      errors={errors}
                      name={"thana"}
                      touched={touched}
                    />
                  </div>
                  {/* from date */}
                  <div className="col-lg-3">
                    <InputField
                      label="From Date"
                      type="date"
                      name="fromDate"
                      value={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* to date */}
                  <div className="col-lg-3">
                    <InputField
                      label="To Date"
                      type="date"
                      name="toDate"
                      value={values?.toDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button type="submit" className="btn btn-primary  mt-6">
                      Show
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>IHB Name</th>
              <th>IHB Contact</th>
              <th>IHB Email </th>
              <th>No. of Storeys</th>
              <th>Project Status</th>
              <th>Inquiry Quantity</th>
              <th>District Name</th>
              <th>Transport Zone</th>
              <th>Area</th>
              <th>Territory</th>
              <th>Stage</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      {landingData?.data?.length > 0 && (
        <PaginationTable
          count={landingData?.totalCount}
          setPositionHandler={(pageNo, pageSize) => {
            commonLandingApi(pageNo, pageSize);
          }}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
        />
      )}
    </ICustomCard>
  );
}
