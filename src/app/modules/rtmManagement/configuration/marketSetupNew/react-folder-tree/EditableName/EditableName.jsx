import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import PropTypes from 'prop-types';
import {
  iconContainerClassName,
  iconClassName,
} from '../utils/iconUtils';
import { getTerritoryTypeDDLAction } from '../../../../../salesManagement/configuration/salesTerritory/_redux/Actions'
import { createSalesTerritory } from '../../helper'

const EditableName = ({
  isEditing,
  setIsEditing,
  onNameChange,
  OKIcon,
  CancelIcon,
  nodeData,
}) => {
  const { name } = nodeData;
  const [inputVal, setInputVal] = useState(name);
  const [territoryTypeId, setTerritoryTypeId] = useState('');
  const onInputChange = e => setInputVal(e.target.value);
  const dispatch = useDispatch();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get territory type ddl from store
  const territoryTypeDDL = useSelector((state) => {
    return state?.salesTerritory?.territoryTypeDDL;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getTerritoryTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const handleChange=(value)=>{
    if(value!=="new territory"){
      localStorage.setItem('parentTerritory', value);
    }
  }

  const cancelEditing = () => {
    setInputVal(name);
    setIsEditing(false);
  };

  const handleNameChange = () => {
    const parentTerritory = localStorage.getItem('parentTerritory')
    const payload = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit.value,
      territoryCode: inputVal,
      territoryName: inputVal,
      territoryTypeId: territoryTypeId,
      parentTerritoryId: 0,
      parentTerritoryName: parentTerritory,
      address: '',
      actionBy: profileData.userId,
    };
    createSalesTerritory(payload)
    onNameChange(inputVal);
    setIsEditing(false);
  };
  
  const editingName = (
    <span className='editingName'>
      <input
        type='text'
        value={ inputVal }
        onChange={ onInputChange }
      />
      <select 
        name="cars" 
        id="cars" 
        style={{marginLeft: 10, height: 25, width: 150 }} 
        onChange={(e)=>{ 
          setTerritoryTypeId(e.target.value)
        }}
      >
        {territoryTypeDDL && territoryTypeDDL.map(data=>(
          <option value={data?.value}>{data?.label}</option>
        ))}
      </select>
      <span className={ iconContainerClassName('editableNameToolbar') }>
        <OKIcon
          className={ iconClassName('OKIcon') }
          onClick={ handleNameChange }
          nodeData={ nodeData }
        />
        <CancelIcon
          className={ iconClassName('CancelIcon') }
          onClick={ cancelEditing }
          nodeData={ nodeData }
        />
      </span>
    </span>
  );

  const displayName = (
    <span className='displayName'
      onClick={()=>{
        handleChange(name)
        }
      } 
    >
      { name }
    </span>
  );

  return (
    <span className='EditableName'>
      { isEditing ? editingName : displayName }
    </span>
  );
};

EditableName.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  OKIcon: PropTypes.func.isRequired,
  CancelIcon: PropTypes.func.isRequired,
  nodeData: PropTypes.object.isRequired,
};

export default EditableName;
