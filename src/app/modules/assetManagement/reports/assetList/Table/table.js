/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";

import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { getAssetCategoryDDL, getAssetList } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
import "../style.css";
import { downloadFile } from "../../../../_helper/downloadFile";
import Loading from "../../../../_helper/_loading";
const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

const AssetListTable = () => {
  const [assetCategoryDDL, setAssetCategoryDDL] = useState("");

  // landing
  const [landing, setLanding] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getAssetCategoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setAssetCategoryDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //  const history = useHistory()

  const getAssetListLanding = (values) => {
    getAssetList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.assetCategory?.value,
      setLoading,
      setLanding
    );
  };
  const printRef = useRef();
  return (
    <ICustomCard title="Asset List">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{
            assetCategory: "",
          }}
          //validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <Form className="form">
                <div className="row global-form align-items-end">
                  <div className="col-lg-2">
                    <NewSelect
                      name="assetCategory"
                      options={[{ value: 0, label: "All" }, ...assetCategoryDDL] || []}
                      value={values?.assetCategory}
                      label="Asset Category"
                      onChange={(v) => {
                        setFieldValue("assetCategory", v);
                      }}
                      placeholder="Asset Category"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!values?.assetCategory}
                      onClick={() => {
                        getAssetListLanding(values);
                      }}
                    >
                      Show
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-3"
                      disabled={!values?.assetCategory}
                      onClick={() => {
                        downloadFile(
                          `/asset/Asset/AssetListXMLDownload?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&itemCategoryId=${values?.assetCategory?.value}`,
                          "Asset List",
                          "xlsx",
                          setLoading
                        );
                      }}
                    >
                      Export Excel
                    </button>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary ml-3"
                          disabled={!values?.assetCategory}
                        >
                          <i class="fa fa-print pointer" aria-hidden="true"></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                </div>
              </Form>
              <div className="row">
                <div className="col-lg-12">
                  <div className="scroll-table-auto asset_list">
                    <table
                      className="table table-striped table-bordered global-table table-font-size-sm"
                      componentRef={printRef}
                      ref={printRef}
                    >
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Id</th>
                          <th>Name</th>
                          <th>Code</th>
                          <th>Type Name</th>
                          <th>Description</th>
                          <th>Plant Name</th>
                          <th>Warehouse Name</th>
                          <th>Manufacturer Name</th>
                          <th>Manufacturer Serial No</th>
                          <th>Country Origin</th>
                          <th>Supplier Name</th>
                          <th>Po No</th>
                          <th>Acquisition Date</th>
                          <th>Acquisition Value</th>
                          <th>Total Depriciation Value</th>
                          <th>Depriciation Rate</th>
                          <th>Depriciation Run Date</th>
                          <th>Warrenty End Date</th>
                          <th>Location</th>
                          <th>Use Type Name</th>
                          <th>Use Status</th>
                          <th>Using Employee Name</th>
                          <th>Department Name</th>
                          <th>Responsible Employee Name</th>
                          <th>Life Time Year</th>
                          <th>Salvage Value</th>
                        </tr>
                      </thead>
                      {loading && <Loading />}
                      <tbody>
                        {landing?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.assetId}</td>
                            <td>{item?.assetName}</td>
                            <td>{item?.assetCode}</td>
                            <td>{item?.assetTypeName}</td>
                            <td>{item?.assetDescription}</td>
                            <td>{item?.plantName}</td>
                            <td>{item?.warehouseName}</td>
                            <td>{item?.nameManufacturer}</td>
                            <td>{item?.manufacturerSerialNo}</td>
                            <td>{item?.countryOrigin}</td>
                            <td>{item?.supplierName}</td>
                            <td>{item?.poNo}</td>
                            <td>{_dateFormatter(item?.dteAcquisitionDate)}</td>
                            <td>{item?.numAcquisitionValue}</td>
                            <td>{item?.numTotalDepValue}</td>
                            <td>{item?.numDepRate}</td>
                            <td>{_dateFormatter(item?.dteDepRunDate)}</td>
                            <td>{_dateFormatter(item?.dteWarrentyEndDate)}</td>
                            <td>{item?.location}</td>
                            <td>{item?.useTypeName}</td>
                            <td>{item?.useStatusId}</td>
                            <td>{item?.strUsingEmployeName}</td>
                            <td>{item?.departmentName}</td>
                            <td>{item?.responsibleEmpName}</td>
                            <td>{item?.lifeTimeYear}</td>
                            <td>{item?.salvageValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default AssetListTable;
