import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Axios from 'axios';
import NewSelect from './../../../../../../_helper/_select';
import InputField from '../../../../../../_helper/_inputField';
import useAxiosGet from '../../../../../../_helper/customHooks/useAxiosGet';
import Loading from '../../../../../../_helper/_loading';

// Validation schema
const ProductEditSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    label: Yup.string().required('SBU is required'),
    value: Yup.string().required('SBU is required'),
  }),
  generalLedgerName: Yup.object().shape({
    label: Yup.string().required('General ledger is required'),
    value: Yup.string().required('General ledger is required'),
  }),
  accuredGeneralLedgerName: Yup.object().shape({
    label: Yup.string().required('Accured General ledger is required'),
    value: Yup.string().required('Accured General ledger is required'),
  }),
  advancedGeneralLedgerName: Yup.object().shape({
    label: Yup.string().required('Advanced General ledger is required'),
    value: Yup.string().required('Advanced General ledger is required'),
  }),
  purchaseOrganization: Yup.object().shape({
    label: Yup.string().required('Purchase organization is required'),
    value: Yup.string().required('Purchase organization is required'),
  }),
});

export default function _Form({
  product,
  btnRef,
  savePurchase,
  resetBtnRef,
  businessPartnerCode,
  selectedBusinessUnit,
  accountId,
  profileData,
  setter,
  remover,
  rowDto,
  shipPointRowDto,
  shipPointSetter,
  shipPointRemover,
  id,
  rowDtoHandler,
}) {
  const [purchaseOrgList, setPurchaseOrgList] = useState([]);
  const [gneralLedgerList, setgneralLedgerList] = useState([]);
  // const [accuredGeneralLedgerList, setAccuredGeneralLedgerList] = useState([]);
  const [advancedGeneralLedgerList, setAdvancedGeneralLedgerList] = useState(
    [],
  );
  const [
    tdsSupplierType,
    getTdsSupplierType,
    tdsSupplierLoading,
  ] = useAxiosGet();
  const [natureofBusinessDDL, getNatureofBusinessDDL] = useAxiosGet();

  const [gneralLedgerListOption, setgneralLedgerOption] = useState([]);
  // const [accuredGeneralLedgerOption, setAccuredGeneralLedgerOption] = useState(
  //   []
  // );

  const [
    advancedGeneralLedgerOption,
    setAdvancedGeneralLedgerOption,
  ] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);

  useEffect(() => {
    // PriceDDL(accountId, selectedBusinessUnit.value);
    getNatureofBusinessDDL(
      `/partner/BusinessPartnerPurchaseInfo/GetVdssupplierTypesDDL`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, accountId]);

  useEffect(() => {
    getPurchaseOrganizationData(accountId, selectedBusinessUnit.value);
  }, [selectedBusinessUnit, accountId]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getAccountPayableGL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setgneralLedgerList,
      );
      getTdsSupplierType(
        `/partner/BusinessPartnerPurchaseInfo/GetTdssupplierTypesDDL`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // useEffect(() => {
  //   if(profileData?.accountId && selectedBusinessUnit?.value) {
  //     setTimeout(() => {
  //       getAccruedPayableGL(
  //         profileData?.accountId,
  //         selectedBusinessUnit?.value,
  //         setAccuredGeneralLedgerList
  //       );
  //     },1000)
  //   }
  // }, [profileData,selectedBusinessUnit]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      setTimeout(() => {
        getAdvancePayableGL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          setAdvancedGeneralLedgerList,
        );
      }, 1000);
    }
  }, [profileData, selectedBusinessUnit]);

  // const PriceDDL = async (accId, buId) => {
  //   try {
  //     const res = await Axios.get(
  //       `/item/PriceStructure/GetPriceStructureDDLByPriceStructureType?accountId=${accId}&businessUnitId=${buId}`
  //     );
  //     setPriceDDL(res.data);
  //   } catch (error) {}
  // };

  const getPurchaseOrganizationData = async (accountId, buId) => {
    try {
      const res = await Axios.get(
        `/item/ItemPurchaseInfo/GetPurchaseOrganizationDDL?AccountId=${accountId}&BusinessUnitId=${buId}`,
      );
      setPurchaseOrgList(res.data);
    } catch (error) {}
  };

  const getAccountPayableGL = async (accountId, buId, setter) => {
    try {
      const res = await Axios.get(
        `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=7`,
      );
      setter(res?.data);
    } catch (error) {}
  };
  // const getAccruedPayableGL = async (accountId, buId, setter) => {
  //   try {
  //     const res = await Axios.get(
  //       `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=7`
  //     );
  //     setter(res?.data);
  //   } catch (error) {
  //
  //   }
  // };
  const getAdvancePayableGL = async (accountId, buId, setter) => {
    try {
      const res = await Axios.get(
        `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=5`,
      );
      setter(res?.data);
    } catch (error) {}
  };

  const getSbuDDL = async (accId, buId) => {
    try {
      const res = await Axios.get(
        `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
      );
      setSbuDDL(res?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getSbuDDL(accountId, selectedBusinessUnit?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  useEffect(() => {
    const glTypes = [];
    gneralLedgerList &&
      gneralLedgerList.forEach((item) => {
        let items = {
          value: item?.generalLedgerId,
          label: item?.generalLedgerName,
        };
        glTypes.push(items);
      });
    setgneralLedgerOption(glTypes);
  }, [gneralLedgerList]);

  // useEffect(() => {
  //   const glTypes = [];
  //   accuredGeneralLedgerList &&
  //     accuredGeneralLedgerList.forEach((item) => {
  //       let items = {
  //         value: item?.generalLedgerId,
  //         label: item?.generalLedgerName,
  //       };
  //       glTypes.push(items);
  //     });
  //   setAccuredGeneralLedgerOption(glTypes);
  // }, [accuredGeneralLedgerList]);

  useEffect(() => {
    const glTypes = [];
    advancedGeneralLedgerList &&
      advancedGeneralLedgerList.forEach((item) => {
        let items = {
          value: item?.generalLedgerId,
          label: item?.generalLedgerName,
        };
        glTypes.push(items);
      });
    setAdvancedGeneralLedgerOption(glTypes);
  }, [advancedGeneralLedgerList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          savePurchase(values, () => {
            if (!id) {
              resetForm(product);
            }
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <>
            {tdsSupplierLoading && <Loading />}
            <Form className="form form-label-right">
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    label="Select SBU"
                    options={sbuDDL || []}
                    value={values?.sbu}
                    name="sbu"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue('sbu', valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Purchase Organization"
                    options={purchaseOrgList || []}
                    value={values?.purchaseOrganization}
                    name="purchaseOrganization"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue('purchaseOrganization', valueOption);
                    }}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <NewSelect
                    label="Price structure"
                    options={priceDDL || []}
                    value={values?.priceStructure}
                    name="priceStructure"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue("priceStructure", valueOption);
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    label="AC Payable GL"
                    options={gneralLedgerListOption || []}
                    value={values?.generalLedgerName}
                    name="generalLedgerName"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue('generalLedgerName', valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Accrued Payable GL"
                    options={gneralLedgerListOption || []}
                    value={values?.accuredGeneralLedgerName}
                    name="accuredGeneralLedgerName"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue('accuredGeneralLedgerName', valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Advance GL"
                    options={advancedGeneralLedgerOption || []}
                    value={values?.advancedGeneralLedgerName}
                    name="advancedGeneralLedgerName"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue('advancedGeneralLedgerName', valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Supplier Type"
                    options={tdsSupplierType || []}
                    value={values?.tdsSupplierType}
                    name="tdsSupplierType"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue('tdsSupplierType', valueOption);
                      } else {
                        setFieldValue('tdsSupplierType', '');
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Nature of Business"
                    options={natureofBusinessDDL || []}
                    value={values?.natureofBusiness}
                    name="natureofBusiness"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue('natureofBusiness', valueOption);
                    }}
                  />
                </div>
              </div>
              <br />

              {/* rowDtos */}

              {/* <h3 style={{ fontSize: "1.275rem" }}>Supplier Item Assignment</h3>
              <div className="row global-form">
                <div className="col-lg-4">
                  <label>Item Category</label>
                  <Field
                    name="conditionType"
                    placeholder="Item Category"
                    component={() => (
                      <Select
                        options={itemCategory}
                        placeholder="Item Category"
                        defaultValue={values?.itemCategory}
                        onChange={(valueOption) => {
                          getItemName(valueOption?.value);
                          setFieldValue("itemName", "");
                          setFieldValue("itemCategory", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                </div>
                <div className="col-lg-4">
                  <ISelect
                    label="Item Name"
                    options={itemName || []}
                    value={values?.itemName}
                    name="itemName"
                    setFieldValue={setFieldValue}
                    isDisabled={!values.itemCategory}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <button
                    onClick={() => {
                      const obj = {
                        ...values,
                        configId: 0,
                        itemId: values?.itemName?.value,
                        itemName: values?.itemName.label,
                        itemCode: values?.itemName?.code,
                      };
                      setter(obj);
                      setFieldValue("itemCategory","")
                      setFieldValue("itemName","")
                    }}
                    style={{ marginTop: "15px" }}
                    className="btn btn-primary ml-2"
                    disabled={!values?.itemCategory || !values?.itemName?.value}
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div> */}

              {/* <div>
                {rowDto.length ? (
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Item Name</th>
                        <th>Code</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto.map((itm, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{itm.itemName}</td>
                          <td>{itm.itemCode}</td>
                          <td className="text-center">
                            <span>
                              <i
                                onClick={() => remover(itm.itemId)}
                                className="fa fa-trash deleteBtn"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}
              </div> */}

              {/* shipPointRowDto */}
              <h3 style={{ fontSize: '1.275rem' }}>Supplier Shippoint</h3>
              <div className="row global-form">
                <div className="col-lg-4 mb-2">
                  <InputField
                    value={values?.shipPointName}
                    label="Ship Point Name"
                    placeholder="Ship Point Name"
                    type="text"
                    name="shipPointName"
                  />
                </div>
                <div className="col-lg-4">
                  <button
                    onClick={() => {
                      const obj = {
                        id: 0,
                        shipPointName: values?.shipPointName,
                        isActive: true,
                      };
                      shipPointSetter(obj);
                    }}
                    style={{ marginTop: '15px' }}
                    className="btn btn-primary ml-2"
                    disabled={!values?.shipPointName}
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                {shipPointRowDto.length ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Shippoint Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipPointRowDto
                          .filter((data) => data.isActive === true)
                          .map((itm, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>
                                <div className="pl-2">{itm.shipPointName}</div>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  //disabled={itm?.id === 0 ? false : true}
                                  onClick={() => {
                                    rowDtoHandler('isActive', false, idx);
                                    shipPointRemover(itm, idx);
                                  }}
                                  style={{
                                    border: '0',
                                    background: 'transparent',
                                  }}
                                >
                                  <i className="fa fa-trash deleteBtn"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  ''
                )}
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
