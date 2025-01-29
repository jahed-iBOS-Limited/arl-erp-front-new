/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Form from './form';
import IForm from '../../../../_helper/_form';
import { useLocation } from 'react-router-dom';
import { isUniq } from '../../../../_helper/uniqChecker';
import { saveFinancialStatement, getFinancialStatementById } from '../helper';
import { toast } from 'react-toastify';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';

let initData = {
   fsComponent: '',
   fsComponentName: '',
   accountCategory: '',
   generalLedger: '',
   checkGl: false,
};
export function FinacialStatementForm({
   history,
   match: {
      params: { comId, busId },
   },
}) {
   const location = useLocation();
   const [isDisabled, setDisabled] = useState(true);
   const [generalLedgerRowDto, setGeneralLedgerRowDto] = useState([]);
   const [generalLedgerDDL, setGeneralLedgerDDL] = useState();
   const [, getCheckGLAdd, ] = useAxiosGet(false);

   // get user profile data from store
   const profileData = useSelector(state => {
      return state.authData.profileData;
   }, shallowEqual);

   // get selected business unit from store
   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);

   useEffect(() => {
      if (selectedBusinessUnit && profileData) {
         getFinancialStatementById(
            comId,
            selectedBusinessUnit.value,
            setGeneralLedgerRowDto
         );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedBusinessUnit, profileData]);

   const saveHandler = async (values, cb) => {
      setDisabled(true);
      if (values && selectedBusinessUnit && profileData) {
         const objRow = generalLedgerRowDto.map(itm => {
            return {
               fscomponentId: itm?.fscomponentId,
               fscomponentName: itm?.fscomponentName,
               fscomponentCode: itm?.fscomponentCode,
               accountId: itm?.accountId,
               businessUnitId: itm?.businessUnitId,
               accountCategoryId: itm?.accountCategoryId,
               generalLedgerId: itm?.generalLedgerId,
               actionBy: itm?.actionBy,
            };
         });
         const financialStatementData = objRow;
         saveFinancialStatement(financialStatementData, cb);
      } else {
         setDisabled(false);
      }
   };

   const disableHandler = cond => {
      setDisabled(cond);
   };

   const addGlGrid = values => {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;
      getCheckGLAdd(
        `/fino/FinancialStatement/GeneralLedgerAndComponentTypeCheck?businessUnitId=${businessunitid}&componentId=${location?.state?.fscomponentId}&componentType=${location?.state?.fscomponentType}&generalLedgerId=${values?.generalLedger?.value}`,
        res => {
          if (res?.isExists) {
            toast.warning(
              `${values?.generalLedger?.label} Already added in ${res?.fsComponentName}`
            );
          } else {
            if (values.checkGl === false) {
              let data = generalLedgerRowDto?.find(
                data => data?.generalLedgerId === values?.generalLedger?.value
              );
              if (data) {
                toast.warning('General Ledger Already added');
              } else {
                setGeneralLedgerRowDto([
                  ...generalLedgerRowDto,
                  {
                    fscomponentId: location?.state?.fscomponentId,
                    fscomponentName: values?.fsComponentName,
                    fscomponentCode: location?.state?.fscomponentCode,
                    accountCategoryId: values?.accountCategory?.value,
                    accountCategoryName: values?.accountCategory?.label,
                    generalLedgerId: values?.generalLedger?.value,
                    generalLedgerName: values?.generalLedger?.label,
                    accountId: accountId,
                    businessUnitId: businessunitid,
                    actionBy: actionBy,
                  },
                ]);
              }
            } else {
              let data = generalLedgerDDL?.map(data => {
                return {
                  fscomponentId: location?.state?.fscomponentId,
                  fscomponentName: values?.fsComponentName,
                  fscomponentCode: location?.state?.fscomponentCode,
                  accountCategoryId: values?.accountCategory?.value,
                  accountCategoryName: values?.accountCategory?.label,
                  generalLedgerId: data?.value,
                  generalLedgerName: data?.label,
                  accountId: accountId,
                  businessUnitId: businessunitid,
                  actionBy: actionBy,
                };
              });
              setGeneralLedgerRowDto([...data, ...generalLedgerRowDto]);
            }
          }
        }
      );
   };

   const setter = payload => {
      if (
         isUniq('generalLedgerId', payload.generalLedgerId, generalLedgerRowDto)
      ) {
         const { accountId, userId: actionBy } = profileData;
         const { value: businessunitid } = selectedBusinessUnit;
         setGeneralLedgerRowDto([
            ...generalLedgerRowDto,
            {
               accountId: accountId,
               businessUnitId: businessunitid,
               actionBy: actionBy,
               ...payload,
            },
         ]);
      }
   };

   const remover = payload => {
      const filterArr = generalLedgerRowDto.filter(
         itm => itm.generalLedgerId !== payload
      );
      setGeneralLedgerRowDto(filterArr);
   };

   const [objProps, setObjprops] = useState({});

   return (
      <IForm
         title={'Create Finacial Statement Config'}
         getProps={setObjprops}
         isDisabled={isDisabled}
      >
         <div className="mt-0">
            <Form
               {...objProps}
               initData={initData}
               saveHandler={saveHandler}
               disableHandler={disableHandler}
               profileData={profileData}
               selectedBusinessUnit={selectedBusinessUnit}
               locationData={location.state}
               generalLedgerRowDto={generalLedgerRowDto}
               setGeneralLedgerRowDto={setGeneralLedgerRowDto}
               setter={setter}
               remover={remover}
               addGlGrid={addGlGrid}
               generalLedgerDDL={generalLedgerDDL}
               setGeneralLedgerDDL={setGeneralLedgerDDL}
               // isEdit={id || false}
            />
         </div>
      </IForm>
   );
}
