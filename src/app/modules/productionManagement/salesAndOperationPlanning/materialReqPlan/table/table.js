import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { YearDDL } from "../../../../_helper/_yearDDL";
import moment from "moment";
import { GetBOMPllaningYearly } from "../helper";
import IViewModal from "../../../../_helper/_viewModal";
import SaveBillOfMaterialPlanningModal from "./saveBillOfMaterialPlanningModal";
const initData = {
  year: "",
};

const Materialannualplan = () => {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [clickRowDto, setClickRowDto] = useState({});

  const {  selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  const viewHeandelar = (values) => {
    const year = values?.year?.label;
    const firstDateOfYear = moment(year)
      .startOf("year")
      .format("YYYY-MM-DD");

    const lastDateOfYear = moment(year)
      .endOf("year")
      .format("YYYY-MM-DD");

    GetBOMPllaningYearly(
      firstDateOfYear,
      lastDateOfYear,
      selectedBusinessUnit.value,
      setGridData,
      setLoading
    );
  };

  return (
    <ICustomCard title='Material Annual Planning'>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            {loading && <Loading />}

            {/* Create Row */}
            <div className='global-form row'>
              <div className='col-lg-3'>
                <NewSelect
                  name='year'
                  options={YearDDL()}
                  value={values?.year}
                  isSearchable={true}
                  label='Year'
                  placeholder='Year'
                  onChange={(valueOption) => {
                    setFieldValue("year", valueOption);
                    setGridData([]);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className='col-lg-3'>
                <button
                  onClick={() => {
                    viewHeandelar({
                      ...values,
                      year: values?.year,
                    });
                  }}
                  style={{ marginTop: "18px" }}
                  className='btn btn-primary'
                  disabled={!values?.year}
                >
                  View
                </button>
              </div>
            </div>

            <div className='table-responsive'>
              <table className='table table-striped table-bordered global-table'>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th
                      style={{
                        width: "100px",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.map((item, i) => (
                    <tr key={i + 1}>
                      <td>{i + 1}</td>
                      <td className=''>{item?.stritemcode}</td>
                      <td className=''>{item?.stritemname}</td>
                      <td className='text-right'>{item?.qnt}</td>
                      <td className='text-right'>{item?.rate}</td>
                      <td className='text-center'>
                        <button
                          className='btn btn-primary'
                          onClick={() => {
                            setViewModal(true);
                            setClickRowDto({
                              ...item,
                              ...values,
                            });
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <IViewModal
              show={viewModal}
              onHide={() => {
                setViewModal(false);
                setClickRowDto({});
              }}
            >
              <SaveBillOfMaterialPlanningModal
                clickRowDto={clickRowDto}
                landingCB={() => {
                  setViewModal(false);
                  setClickRowDto({});
                  viewHeandelar(values)
                }}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default Materialannualplan;
