import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from "react-redux";
import FolderTree from "../react-folder-tree/FolderTree/FolderTree";
import {
  Card,
  CardHeader,
  CardBody
} from "../../../../../../_metronic/_partials/controls/Card";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls/ModalProgressBar";
import { getSalesTerritoryGridData } from '../helper'


const TableRow = () => {
  const [teritoryGridData, setTeritoryGridData] = useState([])
  const [gridData, setGridData] = useState({})

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getSalesTerritoryGridData(
        profileData?.accountId, 
        selectedBusinessUnit?.value,
        setTeritoryGridData
      )
    }
  }, [profileData, selectedBusinessUnit])
  
  useEffect(() => {
    var treeView={
      name:'Sales Territory', 
    }
    treeView.children=teritoryGridData
    setGridData(treeView)
  }, [teritoryGridData])

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Market Setup">
      </CardHeader>
      <CardBody>
        <FolderTree
          data={ gridData }
        />
      </CardBody>
    </Card>  
  );
};

export default TableRow;