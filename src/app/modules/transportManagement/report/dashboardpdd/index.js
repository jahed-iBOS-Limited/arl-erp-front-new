import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls/Card";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import "./style.scss";
import CategoryWiseCard from "./categoryWiseCard";
import IViewModal from "../../../_helper/_viewModal";
import WarehouseWiseStockReport from "../../../inventoryManagement/reports/whStockReport";
import DepoPendingChart from "./DepoPendingChart";
const initData = {
  shipPoint: { value: 0, label: "All" },
};

function Dashboardpdd() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    isInventoryStockModalOpen: false,
  });

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shippointDDL = useSelector((state) => {
    return state.commonDDL.shippointDDL;
  }, shallowEqual);

  React.useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      {loading && <Loading />}
      <div className='Dashboardpdd'>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"DashBoard PDD"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <>
                  <Form>
                    <div className='row global-form p-0 m-0 pb-1'>
                      <div className='col-lg-3'>
                        <NewSelect
                          name='shipPoint'
                          options={
                            [{ value: 0, label: "All" }, ...shippointDDL] || []
                          }
                          value={values?.shipPoint}
                          label='Ship Point'
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                          placeholder='Ship Point'
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-lg-12'>
                        <div className='DashboardpddBox'>
                          <CategoryWiseCard
                            className='DashboardpddBox__One'
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "DC Pending",
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: 100,
                                },
                                {
                                  title: "Special",
                                  value: 200,
                                },
                                {
                                  title: "Express",
                                  value: 300,
                                },
                              ],
                            }}
                          />

                          <CategoryWiseCard
                            className='DashboardpddBox__Two'
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "DC Delivered",
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: 100,
                                },
                                {
                                  title: "Special",
                                  value: 200,
                                },
                                {
                                  title: "Express",
                                  value: 300,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Three'
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "DC Prosessing",
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: 100,
                                },
                                {
                                  title: "Special",
                                  value: 200,
                                },
                                {
                                  title: "Express",
                                  value: 300,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Four'
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "Delivered Qty",
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: 100,
                                },
                                {
                                  title: "Special",
                                  value: 200,
                                },
                                {
                                  title: "Express",
                                  value: 300,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Five'
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "Vehicle  Available",
                              categoryList: [
                                {
                                  title: "Company",
                                  value: 100,
                                },
                                {
                                  title: "Supplier",
                                  value: 100,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Six'
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "Vehicle  Out",
                              categoryList: [
                                {
                                  value: 100,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Seven'
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "Transport  Qty",
                              categoryList: [
                                {
                                  value: 100,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Eight'
                            categoryWiseCardObj={{
                              title: "Inventory  Stock",
                              categoryList: [
                                {
                                  value: 100,
                                },
                              ],
                            }}
                            customOnClick={(item) => {
                              setIsModalOpen({
                                ...isModalOpen,
                                isInventoryStockModalOpen: true,
                              });
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Nine'
                            categoryWiseCardObj={{
                              title: "DC Pending Qty",
                              categoryList: [
                                {
                                  value: 100,
                                },
                              ],
                            }}
                            customOnClick={(item) => {
                              setIsModalOpen({
                                ...isModalOpen,
                                isInventoryStockModalOpen: true,
                              });
                            }}
                          />
                          <CategoryWiseCard
                            className='DashboardpddBox__Ten'
                            categoryWiseCardObj={{
                              title: "On Time Delivery",
                              categoryList: [
                                {
                                  value: 100,
                                },
                              ],
                            }}
                            customOnClick={(item) => {
                              setIsModalOpen({
                                ...isModalOpen,
                                isInventoryStockModalOpen: true,
                              });
                            }}
                          />
                        </div>
                      </div>

                      {/* DepoPending Chart  */}
                      <div className="col-lg-12">
                      <DepoPendingChart/>
                      </div>
                      
                    </div>

                    {/* Inventory  Stock Model */}
                    <IViewModal
                      show={isModalOpen?.isInventoryStockModalOpen}
                      onHide={() => {
                        setIsModalOpen({
                          ...isModalOpen,
                          isInventoryStockModalOpen: false,
                        });
                      }}
                    >
                      <WarehouseWiseStockReport />
                    </IViewModal>
                  </Form>
                </>
              </CardBody>
            </Card>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Dashboardpdd;
