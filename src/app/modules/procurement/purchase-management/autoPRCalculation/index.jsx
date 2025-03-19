import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';
import ForecastVsActual from './forecastvsActual';
import OthersItem from './othersItem';
import RawMaterialAutoPRNew from './rawMaterialNew';

const initData = {
  purchaseOrganization: '',
};
export default function AutoPRCalculation() {
  const [, setObjprops] = useState({});
  const saveHandler = (values, cb) => {};
  const [, , loader] = useAxiosPost();
  const [
    ,
    getItemTypeList,
    itemTypeListLoader,
    setItemTypeList,
  ] = useAxiosGet();

  useEffect(() => {
    getItemTypeList('/item/ItemCategory/GetItemTypeListDDL', (data) => {
      const modData = data?.map((itm) => {
        return {
          ...itm,
          value: itm?.itemTypeId,
          label: itm?.itemTypeName,
        };
      });
      setItemTypeList(modData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
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
          {(loader || itemTypeListLoader) && <Loading />}
          <IForm
            isHiddenBack
            isHiddenSave
            isHiddenReset
            title="Material Requirment Planing"
            getProps={setObjprops}
            renderProps={() => {
              return (
                <div className="d-flex align-items-center justify-content-between"></div>
              );
            }}
          >
            <Tabs
              defaultActiveKey="raw-material"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab unmountOnExit eventKey="raw-material" title="Raw Material">
                <RawMaterialAutoPRNew />
              </Tab>
              <Tab unmountOnExit eventKey="others" title="Others Item">
                <OthersItem />
              </Tab>
              <Tab
                unmountOnExit
                eventKey="ForecastvsActual"
                title="Forecast vs Actual"
              >
                <ForecastVsActual />
              </Tab>
            </Tabs>
          </IForm>
        </>
      )}
    </Formik>
  );
}
