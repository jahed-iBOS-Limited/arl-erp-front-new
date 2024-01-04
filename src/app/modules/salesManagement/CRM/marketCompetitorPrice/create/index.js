import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import RowTable from "./rowTable";
const initData = {
  date: _todayDate(),
  businessUnit: "",
  channel: "",
  district: "",
  policeStation: "",
  territory: "",
};
export const validationSchema = Yup.object().shape({});

function Form() {
  // get user profile data from store
  const {
    profileData: { accountId: accId, userId, userName },
    selectedBusinessUnit: { value: buId },
    tokenData: { token },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [rowDto, setRowDto] = React.useState([1]);
  const [businessUnitDDL, setBusinessUnitDDL] = useAxiosGet([]);
  const [districtDDL, setDistrictDDL] = useAxiosGet();
  const [channelList, setDDLChannelList] = useAxiosGet();
  const [policeStationDDL, setPoliceStationDDL] = useAxiosGet();
  const [territoryDDL, setTerritoryDDL] = useAxiosGet();

  useEffect(() => {
    if (buId && accId) {
      setDistrictDDL(
        `/oms/TerritoryInfo/GetDistrictDDL?countryId=${18}&divisionId=${0}`
      );
      setDDLChannelList(`/oms/CompetitorPrice/GetDDLCompetitorChannelList`);
      setBusinessUnitDDL(
        `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=0`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const history = useHistory();

  const saveHandler = (values, cb) => {};

  const viewHandler = () => {};
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
        }) => (
          <ICustomCard
            title={"Create Market Competitor Price"}
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
            <form>
              <div className='row global-form'>
                <div className='col-lg-3'>
                  <label>
                    <b
                      style={{
                        color: "red",
                      }}
                    >
                      *
                    </b>{" "}
                    Date
                  </label>
                  <InputField
                    value={values?.date}
                    placeholder='date'
                    name='date'
                    type='date'
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    isRequiredSymbol={true}
                    name='businessUnit'
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    label='Business Unit'
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                      setFieldValue("territory", "");
                      setTerritoryDDL(
                        `/oms/TerritoryInfo/GetTerritoryList?AccountId=${accId}&BusinessUnitId=${valueOption?.value}`
                      );
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    isRequiredSymbol={true}
                    name='channel'
                    options={[{
                      label: 'Building Material',
                      value: 1
                    }] || []}
                    value={values?.channel}
                    label='Channel'
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption || "");
                    }}
                    placeholder='Channel'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    isRequiredSymbol={true}
                    name='district'
                    options={districtDDL || []}
                    value={values?.district}
                    label='District'
                    onChange={(valueOption) => {
                      setFieldValue("district", valueOption || "");
                      setFieldValue("policeStation", "");
                      setPoliceStationDDL(
                        `/oms/TerritoryInfo/GetThanaDDL?countryId=${18}&divisionId=${0}&districtId=${
                          valueOption?.value
                        }`
                      );
                    }}
                    placeholder='District'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3 '>
                  <NewSelect
                    name='policeStation'
                    options={policeStationDDL || []}
                    value={values?.policeStation}
                    label='Police Station'
                    onChange={(valueOption) => {
                      setFieldValue("policeStation", valueOption);
                    }}
                    placeholder='Police Station'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3 '>
                  <NewSelect
                    name='territory'
                    options={territoryDDL || []}
                    value={values?.territory}
                    label='Territory'
                    onChange={(valueOption) => {
                      setFieldValue("territory", valueOption);
                    }}
                    placeholder='Territory'
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className='mt-3'>
                  <button
                    className='btn btn-primary mt-3'
                    onClick={() => {
                      viewHandler();
                    }}
                    type='button'
                    disabled={!values?.channel || !values?.district}
                  >
                    View
                  </button>
                </div>
              </div>

              <RowTable
                propsObj={{
                  rowDto,
                  setRowDto,
                  values,
                }}
              />
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default Form;
