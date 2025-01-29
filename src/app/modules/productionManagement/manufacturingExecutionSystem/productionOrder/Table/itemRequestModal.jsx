import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import IViewModal from "./../../../../_helper/_viewModal";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import { createItemRequestNew } from "./../helper";
import { getSBUDDL_api } from "../../receiveFromShopFloor/helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import NewSelect from "../../../../_helper/_select";
import { confirmAlert } from "react-confirm-alert";

const initData = {
  sbu: "",
  plant: "",
  warehouse: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    value: Yup.string().required("SBU is required"),
    label: Yup.string().required("SBU is required"),
  }),
});

export default function ItemRequestModal({
  show,
  onHide,
  rowDto,
  selectItemRequest,
  setItemRequestModal,
  callLandingApiAgain,
  wareHouseId,
  warehouseDDL,
}) {
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // business unit 171 "Magnum Steel Industries Limited"
  const requestQtyType =
    selectedBusinessUnit?.value === 171 || selectedBusinessUnit?.value === 224
      ? "reqQty"
      : "requestQty";

  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };

  const saveHandler = async (values, cb) => {
    const modifyProductionId = selectItemRequest?.map((item) => {
      return {
        productionId: item?.productionOrderId,
      };
    });
    const modifyRowDto = rowDto?.map((item) => {
      return {
        itemId: item?.itemId,
        itemName: item?.itemName,
        itemCode: item?.itemCode,
        requestedQTY: item?.[requestQtyType],
      };
    });
    const payload = {
      actionBy: profileData?.userId,
      sbuId: values?.sbu?.value,
      sbuName: values?.sbu?.label,
      productionid: modifyProductionId,
      itemList: modifyRowDto,
      shopFloorId: selectItemRequest?.[0]?.shopFloorId || 0,
      plantId: wareHouseId === 0 ? values?.plant?.value : null,
      wareHouseId: wareHouseId === 0 ? values?.warehouse?.value : wareHouseId,
    };

    const callbackFunck = () => {
      callLandingApiAgain();
      setItemRequestModal(false);
    };

    createItemRequestNew(payload, callbackFunck, IConfirmModal, setLoading);
  };
  const [sbuDDL, setSbuDDL] = useState([]);
  // const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
  // const [warehouseDDL, getWarehouseDDL, warehouseDDLloader] = useAxiosGet();

  // useEffect(() => {
  //   getPlantDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId
  //     }&AccId=${profileData?.accountId
  //     }&BusinessUnitId=${selectedBusinessUnit?.value
  //     }&OrgUnitTypeId=7`)
  // }, []);

  useEffect(() => {
    getSBUDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <div>
      <IViewModal show={show} onHide={onHide} title={""} btnText="Close">
        {loading && <Loading />}
        <>
          <Formik
            enableReinitialize={true}
            initialValues={{
              ...initData,
            }}
            validationSchema={validationSchema}
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
              errors,
              touched,
              setFieldValue,
              isValid,
              setValues,
            }) => (
              <div className="">
                <Card>
                  {true && <ModalProgressBar />}
                  <CardHeader title={"Create Item Request"}>
                    <CardHeaderToolbar>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                      >
                        Save
                      </button>
                    </CardHeaderToolbar>
                  </CardHeader>
                  <CardBody>
                    <div className="row global-form">
                      <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL}
                          value={values?.sbu}
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder="SBU"
                        />
                      </div>
                      {wareHouseId === 0 ? (
                        <>
                          {/* <div className="col-lg-3 pb-2">
                              <NewSelect
                                name="plant"
                                options={plantDDL}
                                value={values?.plant}
                                onChange={(valueOption) => {
                                  setFieldValue("warehouse", "");
                                  setFieldValue("plant", valueOption);
                                  getWarehouseDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId
                                    }&AccId=${profileData?.accountId
                                    }&BusinessUnitId=${selectedBusinessUnit?.value
                                    }&PlantId=${valueOption?.value
                                    }&OrgUnitTypeId=8`)
                                }}
                                errors={errors}
                                touched={touched}
                                placeholder="Plant"
                              />
                            </div> */}
                          <div className="col-lg-3 pb-2">
                            <NewSelect
                              name="warehouse"
                              options={warehouseDDL}
                              value={values?.warehouse}
                              onChange={(valueOption) => {
                                setFieldValue("warehouse", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                              placeholder="Warehouse"
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                    <Form className="form form-label-right">
                      {/* Start Table Part */}
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UoM</th>
                            <th>Request Qty.</th>
                            {/* <th>Wearhouse Stock Qty.</th> */}
                          </tr>
                        </thead>
                        <tbody className="production-order-css">
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center align-middle">
                                {index + 1}
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.itemCode}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.itemName}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.uomName}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.[requestQtyType]}
                                </div>
                              </td>
                              {/* <td>
                                <div className="text-right pr-2">
                                  {(item?.stockQty).toFixed(2)}
                                </div>
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* End Table Part */}
                    </Form>
                  </CardBody>
                </Card>
              </div>
            )}
          </Formik>
        </>
      </IViewModal>
    </div>
  );
}
