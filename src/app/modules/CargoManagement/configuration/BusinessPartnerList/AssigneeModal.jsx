import { Button } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import IDelete from '../../../_helper/_helperIcons/_delete';
import NewSelect from '../../../_helper/_select';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { toast } from 'react-toastify';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';

const initialValues = {
  shipper: '',
  consignee: '',
  deliveryAgent: '',
  notifyParty: '',
  type: '',
};

export default function AssigneeModal({ isModalOpen, setIsModalOpen }) {
  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [consigneeListDDL, getConsigneeListDDL] = useAxiosGet();
  const [, getParticipantsWithConsigneeDtl] = useAxiosGet();
  const [
    participantDDL,
    getParticipantDDL,
    ,
    setParticipantDDL,
  ] = useAxiosGet();
  const formikRef = React.useRef(null);
  const [addedItem, setAddedItem] = React.useState([]);
  const [
    participantTypeListDDL,
    GetParticipantTypeListDDL,
    ,
    setParticipantTypeList,
  ] = useAxiosGet();
  const [, saveParticipntMapping] = useAxiosPost();

  const saveHandler = (values, cb) => {
    // addItem minimum 1 item check
    if (addedItem?.length === 0)
      return toast.warning('Please add at least one item');

    const modifiedData = addedItem?.map((item) => {
      return {
        ...item,
      };
    });
    saveParticipntMapping(
      `${imarineBaseUrl}/domain/ShippingService/SaveParticipntMapping`,
      modifiedData,
      () => {
        setAddedItem([]);
        setIsModalOpen(false);
        if (cb) {
          cb();
        }
      },
      'save',
    );
  };

  React.useEffect(() => {
    GetParticipantTypeListDDL(
      `${imarineBaseUrl}/domain/ShippingService/GettblParticipantType`,
      (redData) => {
        const updatedData = redData?.filter((item) => item.value !== 1);
        setParticipantTypeList(updatedData);
      },
    );
    commonGeParticipantDDL(getConsigneeListDDL, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commonGeParticipantDDL = (actionName, type) => {
    actionName(
      `${imarineBaseUrl}/domain/ShippingService/GetParticipantDDL?typeId=${type}`,
    );
  };

  const onChangeParticipantType = (type) => {
    setParticipantDDL([]);
    if (type === 4) {
      getParticipantDDL(
        `${imarineBaseUrl}/domain/ShippingService/GetShippingUserDDL`,
      );
    } else {
      commonGeParticipantDDL(getParticipantDDL, type);
    }
  };

  const addButtonHandler = (values) => {
    const obj = {
      mappingId: 0,
      consigneeId: values?.consignee?.value || 0,
      consigneeName: values?.consignee?.label || '',
      participantTypeId: values?.type?.value || 0,
      participantType: values?.type?.label || '',
      participantId: values?.participant?.value || 0,
      participantName: values?.participant?.label || '',
      isActive: true,
      createdBy: profileData?.userId || 0,
      createdAt: new Date(),
    };

    // duplicate check "participantTypeId, participantId"
    const isExist = addedItem?.find(
      (item) =>
        item?.participantTypeId === obj?.participantTypeId &&
        item?.participantId === obj?.participantId,
    );
    if (isExist) return toast.warning('Duplicate item not allowed');

    setAddedItem((prev) => [...prev, obj]);
  };

  const consigneeOnChangeHandler = (valueOption) => {
    // /domain/ShippingService/GetParticipantsWithConsigneeDtl?consigneeId=1

    getParticipantsWithConsigneeDtl(
      `${imarineBaseUrl}/domain/ShippingService/GetParticipantsWithConsigneeDtl?consigneeId=${valueOption?.value}`,
      (redData) => {
        const shipperList = redData?.shipperList?.map((item) => {
          return {
            ...item,
            participantTypeId: 4,
            participantType: 'Shipper',
            participantId: item?.shipperId || 0,
            participantsName: item?.shipperName || '',
          };
        });
        const deliveryAgentList = redData?.deliveryAgentList || [];
        const notifyPartyList = redData?.notifyPartyList || [];

        // how to setAddedItem here
        const allItems = [
          ...shipperList,
          ...deliveryAgentList,
          ...notifyPartyList,
        ];
        const addedItems = allItems.map((item) => {
          return {
            mappingId: item?.mappingId || 0,
            consigneeId: valueOption?.value || 0,
            consigneeName: valueOption?.label || '',
            participantTypeId: item?.participantTypeId || 0,
            participantType: item?.participantType || '',
            participantId: item?.participantId || 0,
            participantName: item?.participantsName || '',
            isActive: true,
            createdBy: profileData?.userId || 0,
            createdAt: new Date(),
          };
        });
        setAddedItem(addedItems);
      },
    );
  };
  return (
    <div>
      <IViewModal
        title="Assignee Modal"
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
        }}
      >
        <ICustomCard
          title={'Assign Business Partner'}
          backHandler={() => {
            setIsModalOpen(false);
          }}
          saveHandler={(values) => {
            saveHandler(values);
          }}
          resetHandler={() => {
            formikRef.current.resetForm();
          }}
        >
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            innerRef={formikRef}
          >
            {({
              errors,
              touched,
              setFieldValue,
              isValid,
              values,
              resetForm,
            }) => (
              <>
                <Form className="form form-label-right">
                  <div className="form-group row global-form">
                    {/* Consignee */}
                    <div className="col-lg-3">
                      <NewSelect
                        label="Select Consignee"
                        options={consigneeListDDL || []}
                        value={values?.consignee}
                        name="consignee"
                        onChange={(valueOption) => {
                          setFieldValue('consignee', valueOption);
                          consigneeOnChangeHandler(valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={addedItem?.length > 0}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="Type"
                        options={participantTypeListDDL || []}
                        value={values?.type}
                        name="type"
                        onChange={(valueOption) => {
                          setFieldValue('type', valueOption);
                          setFieldValue('participant', '');
                          onChangeParticipantType(valueOption?.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.type && (
                      <>
                        {' '}
                        <div className="col-lg-3">
                          <NewSelect
                            label={`Select ${values?.type?.label}`}
                            options={participantDDL || []}
                            value={values?.participant}
                            name="participant"
                            onChange={(valueOption) => {
                              setFieldValue('participant', valueOption || ``);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    )}
                    <div className="col-lg-3">
                      <div className="d-flex my-1">
                        <button
                          type="button"
                          className="btn btn-primary mt-5"
                          onClick={() => {
                            addButtonHandler(values);
                          }}
                          disabled={
                            !values?.consignee ||
                            !values?.type ||
                            !values?.participant
                          }
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </>
            )}
          </Formik>
          {addedItem?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Consignee</th>
                    <th>Type</th>
                    <th>Participant</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {addedItem?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>{item?.consigneeName}</td>
                      <td>{item?.participantType}</td>
                      <td>{item?.participantName}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Button
                            onClick={() => {
                              setAddedItem((prev) =>
                                prev.filter((itm, i) => i !== index),
                              );
                            }}
                            color="error"
                            size="small"
                            title="Remove"
                          >
                            <IDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ICustomCard>
      </IViewModal>
    </div>
  );
}
