import { Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import IButton from "../../../../_helper/iButton";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import Loading from "../../../../_helper/_loading";
import IDelete from "../../../../_helper/_helperIcons/_delete";

export default function _Form({
  show,
  title,
  rowDto,
  loader,
  history,
  setShow,
  initData,
  itemList,
  setRowDto,
  saveHandler,
  removeHandler,
  itemAddHandler,
  createOfferGroup,
  discountOfferGroups,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => {
              resetForm(initData);
              setRowDto([]);
            }}
            saveHandler={() => {
              saveHandler(values, () => {
                resetForm(initData);
                setRowDto([]);
              });
            }}
          >
            <form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-3">
                  <div className="d-flex">
                    <NewSelect
                      name="offerGroupName"
                      value={values?.offerGroupName}
                      label="Discount Offer Group Name"
                      placeholder="Discount Offer Group Name"
                      options={discountOfferGroups?.data}
                      onChange={(v) => {
                        setFieldValue("offerGroupName", v);
                      }}
                    />
                    <ICon title="Create a new offer group">
                      <i
                        onClick={() => {
                          setShow(true);
                        }}
                        style={{ fontSize: "15px", color: "#3699FF" }}
                        className="fa pointer fa-plus-circle mt-7 pl-3"
                        aria-hidden="true"
                      ></i>
                    </ICon>
                  </div>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemName"
                    value={values?.itemName}
                    label="Item Name"
                    placeholder="Select Item"
                    options={itemList}
                    onChange={(v) => {
                      setFieldValue("itemName", v);
                    }}
                  />
                </div>
                <IButton
                  onClick={() => {
                    itemAddHandler(values, () => {
                      setFieldValue("itemName", "");
                    });
                  }}
                >
                  Add Item
                </IButton>
              </div>
              <>
                {rowDto?.length > 0 && (
                  <div className="scroll-table _table">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table mt-0">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Discount Group Name</th>
                            <th>Item Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody style={{ overflow: "scroll" }}>
                          {rowDto?.map((itm, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{itm?.discountGroupName}</td>
                              <td>{itm?.itemName}</td>
                              <td className="text-center">
                                <IDelete remover={removeHandler} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            </form>
            <IViewModal
              show={show}
              onHide={() => setShow(false)}
              modelSize={"md"}
            >
              {loader && <Loading />}
              <form className="form form-label-right">
                <div className="row global-form global-form-custom">
                  <div className="col-lg-10">
                    <InputField
                      name="groupName"
                      value={values?.groupName}
                      label="Offer Group Name"
                      placeholder="Enter Offer Group Name"
                    />
                  </div>
                  <IButton
                    onClick={() => {
                      createOfferGroup(values);
                    }}
                  >
                    Done
                  </IButton>
                </div>
              </form>
            </IViewModal>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
