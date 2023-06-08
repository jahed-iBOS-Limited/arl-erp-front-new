import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import './styles.css';


const ScheduleMaintainanceModal = ({ clickedRowItem, setIsShowRowItemModal, viewHandler, landingValues}) => {
  const [, saveData] = useAxiosPost();
  const {
    accountId,
    actionBy,
    businessUnitId,
    completedDateTime,
    departmentId,
    departmentName,
    insertDateTime,
    isActive,
    lastActionDateTime,
    machineId,
    machineName,
    maintenanceDateTime,
    maintenanceTypeId,
    maintenanceTypeName,
    remarks,
    scheduleMaintenanceId,
    sl

  } = clickedRowItem;

  const initData = {
    sl: sl,
    scheduleMaintenanceId: scheduleMaintenanceId,
    accountId: accountId,
    businessUnitId: businessUnitId,
    maintenanceDateTime: maintenanceDateTime,
    maintenanceTypeId: maintenanceTypeId,
    maintenanceTypeName: maintenanceTypeName,
    departmentId: departmentId,
    departmentName: departmentName,
    machineId: machineId,
    machineName: machineName,
    completedDateTime: completedDateTime,
    remarks: remarks,
    actionBy: actionBy,
    insertDateTime: insertDateTime,
    lastActionDateTime: lastActionDateTime,
    isActive: isActive,

  };

  const [objProps, setObjprops] = useState({});

  const saveHandler = (values, cb) => {
    saveData(`/mes/ScheduleMaintenance/ScheduleMaintenanceCreateAndEdit`,
      [values], cb, true,
    )
  };
  return (
    <IForm isHiddenBack={true} isHiddenReset={true} title="" getProps={setObjprops}>
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setIsShowRowItemModal(false);
              viewHandler(landingValues);
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
              <Form className="form form-label-right">
                {false && <Loading />}

                <div className="schedule-maintainence-modal">
                  <div className="row form-group global-form">
                    <div className="col-lg-4">
                      <b>Machine Name</b>
                      <p>{machineName}</p>
                    </div>
                    <div className="col-lg-4">
                      <b>Department Name</b>
                      <p>{departmentName}</p>
                    </div>
                    <div className="col-lg-4">
                      <b>Maintenance Type</b>
                      <p>{maintenanceTypeName}</p>
                    </div>
                    <br /><br /><br />
                    <div className="col-lg-4">
                      <b>Maintenance Date</b>
                      <p>{_dateFormatter(maintenanceDateTime)}</p>
                    </div>
                    <div className="col-lg-4 schedule-maintainence-input">
                      <InputField
                        value={values?.completedDateTime}
                        label="Completed DateTime"
                        name="completedDateTime"
                        type="datetime-local"
                        placeholder="Completed DateTime"
                        onChange={(e) => {
                          setFieldValue("completedDateTime", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-4 schedule-maintainence-input">
                      <InputField
                        value={values?.remarks}
                        label="Remarks"
                        name="remarks"
                        type="text"
                        placeholder="Remarks"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                      />
                    </div>

                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  )
}

export default ScheduleMaintainanceModal