import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getItemData,
  getItemTypeData,
  getSingleDataEdit,
  setShipPointData,
  validationSchema,
} from "../helper";

export default function _Form({
  id,
  type,
  buId,
  title,
  accId,
  portDDL,
  initData,
  setLoading,
  saveHandler,
  setMotherVesselDDL,
}) {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [gridData, getGridData, loading] = useAxiosGet();
  const [rowDto, setRowDto] = useState([]);
  const [itemTypeDDL, setItemTypeDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);

  const [shipDDL, setShipDDL] = useState([]);
  const [editedItem, setEditedItem] = useState([]);

  const setShipPoint = () => {
    const url = `wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`;
    setShipPointData(url, setShipDDL);
  };

  useEffect(() => {
    setShipPoint();
    getItemTypeData(accId, buId, setItemTypeDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const setLandingData = (_pageNo, _pageSize, values) => {
    const item = {
      itemName: values?.item?.label || "",
      itemId: values?.item?.value || "",
      bustingBagQnt: +values?.bustingBagQnt || 0,
      othersBagQnt: +values?.othersBagQnt || 0,
      cnfbagQnt: +values?.cnfbagQnt || 0,
      totalQty:
        (+values?.bustingBagQnt || 0) +
        (+values?.othersBagQnt || 0) +
        (+values?.cnfbagQnt || 0),
      shippingPointId: values?.shipPoint?.value,
      shippingPointName: values?.shipPoint?.label,
      dteDate: values?.date || _todayDate(),
    };
    if (
      rowDto.filter(
        (itm) =>
          itm.itemName === item.itemName &&
          itm.bustingBagQnt === item.bustingBagQnt &&
          itm?.othersBagQnt === item?.othersBagQnt &&
          itm.cnfbagQnt === item?.cnfbagQnt
      ).length === 0
    ) {
      setRowDto([...rowDto, item]);
    } else {
      toast.warning("Already Added");
    }
  };

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this Empty Bag information?",
      yesAlertFunc: () => {
        console.log(rowDto);
        const filterData = rowDto.filter((itm, index) => index !== id);
        setRowDto(filterData);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  useEffect(() => {
    if (id) {
      const url = `tms/LigterLoadUnload/GetG2GItemInfoById?IntId=${id}`;
      getSingleDataEdit(url, setEditedItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (id) {
    initData = {
      ...initData,
      item: {
        value: editedItem?.itemId,
        label: editedItem?.itemName,
      },
      shipPoint: {
        value: editedItem?.shippingPointId,
        label: editedItem?.shipPointName,
      },
      date: _dateFormatter(editedItem?.dteDate),
      bustingBagQnt: editedItem?.bustingBagQnt,
      othersBagQnt: editedItem?.othersBagQnt,
      cnfbagQnt: editedItem?.cnfbagQnt,
    };
  }
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={id ? validationSchema : null}
        onSubmit={(values, { resetForm }) => {
          rowDto &&
            saveHandler(
              values,
              () => {
                !id && resetForm(initData);
                setRowDto([]);
              },
              rowDto,
              id
            );
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => resetForm(initData)}
            saveHandler={() => handleSubmit()}
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-3">
                  <NewSelect
                    name="itemType"
                    options={itemTypeDDL || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                      getItemData(accId, buId, valueOption?.value, setItemDDL);
                      setFieldValue("item", "");
                    }}
                    placeholder="Item Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={itemDDL || []}
                    value={values?.item}
                    label="Item Name"
                    disabled={!values?.itemType}
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    placeholder="Item"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.itemType?.value}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Busting Bag Quantity</label>
                  <InputField
                    value={values?.bustingBagQnt}
                    name="bustingBagQnt"
                    placeholder="Busting Bag Quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("bustingBagQnt", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Others Bag Quantity</label>
                  <InputField
                    value={values?.othersBagQnt}
                    name="othersBagQnt"
                    placeholder="Others Bag Quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("othersBagQnt", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>CNF Bag Quantity</label>
                  <InputField
                    value={values?.cnfbagQnt}
                    name="cnfbagQnt"
                    placeholder="Cnf Bag Quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("cnfbagQnt", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipDDL || []}
                    value={values?.shipPoint}
                    label="ship Point"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                    }}
                    placeholder="Ship Point"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>

                {!id && (
                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary mt-5"
                      type="button"
                      onClick={() => {
                        setLandingData(pageNo, pageSize, values);
                        resetForm(initData);
                      }}
                      disabled={
                        !values?.itemType || !values?.item || !values?.shipPoint
                      }
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
              {!id && (
                <div className="row cash_journal">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ width: "40px" }}>SL</th>
                            <th>Item Name</th>
                            <th>Ship Point Name</th>
                            <th>Busting Bag Qty</th>
                            <th>CNF Bag Qty</th>
                            <th>Others Bag Qty</th>
                            <th>total Qty</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto &&
                            rowDto?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>{item?.itemName}</td>
                                  <td>{item?.shippingPointName}</td>
                                  <td className="text-right">
                                    {item?.bustingBagQnt}
                                  </td>
                                  <td className="text-right">
                                    {item?.cnfbagQnt}
                                  </td>
                                  <td className="text-right">
                                    {item?.othersBagQnt}
                                  </td>
                                  <td className="text-right">
                                    {item?.totalQty}
                                  </td>
                                  <td>{_dateFormatter(item?.dteDate, true)}</td>
                                  <td className="text-center">
                                    <div className="d-flex justify-content-around">
                                      <span>
                                        <IDelete
                                          id={index}
                                          remover={(id) => {
                                            deleteHandler(id, values);
                                          }}
                                        />
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {gridData?.data?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
                      setPositionHandler={setLandingData}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              )}
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
