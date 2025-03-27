import { Form, Formik } from 'formik';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import Loading from '../../../_helper/_loading';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IConfirmModal from '../../../_helper/_confirmModal';

const initialValues = {
  shipper: '',
  consignee: '',
  deliveryAgent: '',
  notifyParty: '',
  participantType: '',
  tradeType: 1,
};

export default function ShipperCreateModalOpen({
  isModalOpen,
  setIsModalOpen,
  isViewMoadal,
  clickRowData,
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const formikRef = React.useRef(null);
  const [gridData, setGridData] = React.useState([]);
  const [, saveShipperUserToPartner, saveShipperUserToPartnerLoading] =
    useAxiosPost();

  const [, getAllShipperUser, allShipperUserLoading] = useAxiosGet();

  React.useEffect(() => {
    fatchGetAllShipperUser();

  }, []);

  const fatchGetAllShipperUser = (tradeTypeId) => {
    getAllShipperUser(
      `${imarineBaseUrl}/domain/ShippingService/GetAllShipperUser`,
      (resData) => {
        setGridData(resData);
      },
    );
  };

  const saveHandler = (item) => {
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to add ${item?.userName} as a Shipper?`,
      yesAlertFunc: () => {
        const payload = {
          userId: item?.userId || 0,
          userName: item?.userName || '',
          accountId: profileData?.accountId || 0,
          businessUnit: selectedBusinessUnit?.value || 0,
          loginId: item?.loginId || '',
          password: '',
          contact: item?.contact || '',
          contactPerson: item?.contactPerson || '',
          address: item?.address || '',
          countryId: item?.countryId || 0,
          countryName: item?.countryName || '',
          stateId: item?.stateId || 0,
          stateName: item?.stateName || '',
          city: item?.city || '',
          zipCode: item?.zipCode || '',
          bin: item?.bin || '',
          licenseNo: item?.licenseNo || '',
          email: item?.email || '',
          nid: item?.nid || '',
          userTypeId: item?.userTypeId || 0,
          userType: item?.userType || '',
          userImageFile: item?.userImageFile || '',
          userReferenceId: item?.userReferenceId || 0,
          isSuperUser: false,
          actionBy: profileData?.userId || 0,
          lastActionDateTime: new Date(),
          isActive: true,
          isApproved: true,
          updatedBy: profileData?.userId || 0,
          updatedAt: new Date(),
          serverDateTime: new Date(),
        };
        saveShipperUserToPartner(
          `${imarineBaseUrl}/domain/ShippingService/SaveShipperUserToPartner`,
          payload,
          (res) => {
            setIsModalOpen(false);
            fatchGetAllShipperUser();
          },
          true,
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <div>
      <IViewModal
        title=""
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
        }}
      >
        <ICustomCard title={'Pending Shipper List '}>
          {(saveShipperUserToPartnerLoading || allShipperUserLoading) && (
            <Loading />
          )}
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
              <Form className="form form-label-right">
                {!isViewMoadal && (
                  <>
                    {' '}
                    {/* <div className="form-group row global-form"></div> */}
                  </>
                )}
                {gridData?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Shipper Name</th>
                          <th>Country</th>
                          <th>State</th>
                          <th>City</th>
                          <th>Zip Code</th>
                          <th>Address</th>
                          <th>Contact</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.userName}</td>
                            <td>{item?.countryName}</td>
                            <td>{item?.stateName}</td>
                            <td>{item?.city}</td>
                            <td>{item?.zipCode}</td>
                            <td>{item?.address}</td>
                            <td>{item?.contact}</td>
                            <td>{item?.email}</td>
                            <td>
                              <button
                                className="btn btn-primary mr-2"
                                onClick={() => {
                                  saveHandler(item);
                                }}
                              >
                                Create
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </ICustomCard>
      </IViewModal>
    </div>
  );
}
