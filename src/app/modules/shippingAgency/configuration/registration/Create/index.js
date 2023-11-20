import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _currentTime } from "../../../../_helper/_currentTime";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetDomesticPortDDL, getVesselDDL, vesselTypeDDL } from "../helper";
const initData = {
  vesselName: "",
  vesselType: "",
  voyageNo: "",
  voyageOwnerName: "",
  regNo: "",
  loadPort: "",
  arrivedTime: _currentTime(),
  sailedTime: _currentTime(),
  cargoName: "",
  quantity: "",
  stevedore: "",
  cargoOwner: "",
  remarks: "",
  completionDate: _todayDate(),
  dischargePort: "",
};

const EstimatePDACreate = () => {
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [portDDL, setPortDDL] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getVesselDDL(accId, buId, setVesselDDL);
      GetDomesticPortDDL(setPortDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const history = useHistory();

  const saveHandler = (values, cb) => {};
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          values,
          setFieldValue,
          touched,
          errors,
          resetForm,
          handleSubmit,
        }) => (
          <>
            <ICustomCard
              title='Registration Create'
              backHandler={() => {
                history.goBack();
              }}
              saveHandler={() => {
                handleSubmit();
              }}
              resetHandler={() => {
                resetForm(initData);
              }}
            >
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    options={vesselTypeDDL || []}
                    name='vesselType'
                    onChange={(valueOption) => {
                      setFieldValue("vesselType", valueOption);
                    }}
                    placeholder='Vessel Type'
                    label='Vessel Type'
                    value={values?.vesselType}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.vesselName || ""}
                    options={vesselDDL || []}
                    name='vesselName'
                    placeholder='Vessel Name'
                    label='Vessel Name'
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Voyage No</label>
                  <InputField
                    value={values?.voyageNo}
                    label='Voyage No'
                    name='voyageNo'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("voyageNo", e.target.value);
                    }}
                  />
                </div>{" "}
                <div className='col-lg-3'>
                  <label>Voyage Owner Name</label>
                  <InputField
                    value={values?.voyageOwnerName}
                    placeholder='Voyage Owner Name'
                    name='voyageOwnerName'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("voyageOwnerName", e.target.value);
                    }}
                  />
                </div>{" "}
                <div className='col-lg-3'>
                  <label>REG No</label>
                  <InputField
                    value={values?.regNo}
                    placeholder='REG No'
                    name='regNo'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("regNo", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='loadPort'
                    options={portDDL || []}
                    value={values?.loadPort}
                    label='Load Port'
                    onChange={(valueOption) => {
                      setFieldValue("loadPort", valueOption);
                    }}
                    placeholder='Load Port'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Arrived Time</label>
                  <InputField
                    value={values?.arrivedTime}
                    placeholder='Arrived Time'
                    name='arrivedTime'
                    type='time'
                    onChange={(e) => {
                      setFieldValue("arrivedTime", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Sailed Time</label>
                  <InputField
                    value={values?.sailedTime}
                    placeholder='Sailed Time'
                    name='sailedTime'
                    type='time'
                    onChange={(e) => {
                      setFieldValue("sailedTime", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.cargoName || ""}
                    options={[
                      {
                        value: 1,
                        label: "Clinker",
                      },
                      {
                        value: 2,
                        label: "Limestone",
                      },
                    ]}
                    name='cargoName'
                    placeholder='Cargo Name'
                    label='Cargo Name'
                    onChange={(valueOption) => {
                      setFieldValue("cargoName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Quantity</label>
                  <InputField
                    value={values?.quantity}
                    placeholder='Quantity'
                    name='quantity'
                    type='number'
                    onChange={(e) => {
                      setFieldValue("quantity", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Stevedore</label>
                  <InputField
                    value={values?.stevedore}
                    placeholder='Stevedore'
                    name='stevedore'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("stevedore", e.target.value);
                    }}
                  />
                </div>{" "}
                <div className='col-lg-3'>
                  <label>Cargo Owner</label>
                  <InputField
                    value={values?.cargoOwner}
                    placeholder='Cargo Owner'
                    name='cargoOwner'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("cargoOwner", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Remarks</label>
                  <InputField
                    value={values?.remarks}
                    placeholder='Remarks'
                    name='remarks'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-12'>
                  <hr />
                </div>
                <div className='col-lg-3'>
                  <label>Completion Date</label>
                  <InputField
                    value={values?.completionDate}
                    placeholder='Completion Date'
                    name='completionDate'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("completionDate", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='dischargePort'
                    options={portDDL || []}
                    value={values?.dischargePort}
                    label='Discharge Port'
                    onChange={(valueOption) => {
                      setFieldValue("dischargePort", valueOption);
                    }}
                    placeholder='Discharge Port'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <button
                    className='btn btn-primary mt-3'
                    onClick={() => {}}
                    disabled={!values?.completionDate || !values?.dischargePort}
                  >
                    Add
                  </button>
                </div>
              </div>
              <table className='table table-striped table-bordered global-table'>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Completion Date</th>
                    <th>Discharge Port</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td className='text-center'> {index + 1}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>

                      <td>
                        <div
                          className='d-flex justify-content-around'
                          style={{
                            gap: "8px",
                          }}
                        >
                          <span
                            onClick={() => {
                              const copyRowDto = [...rowDto];
                              copyRowDto.splice(index, 1);
                              setRowDto(copyRowDto);
                            }}
                          >
                            <IDelete />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default EstimatePDACreate;
