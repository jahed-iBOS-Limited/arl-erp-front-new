import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  GetItemProfileConfigList_api,
  GetItemProfileInfoByItemID_api,
} from '../../helper';
import Loading from './../../../../../_helper/_loading';
import CreateItemCogs from './configItemCogs/createItemCogs';
import ConfigItemPlantWareHouse from './configItemPlantWareHouse/configItemPlantWareHouse';
import CreateItemPurchaseInfo from './configItemPurchaseInfo/createItemPurchaseInfo';
import CreateItemSalesInfo from './configItemSales/createItemSalesInfo';
import ConfigItemAttribute from './configureItemAttribute/configItemAttribute';
import DynamicItemProfileForm from './dynamicItemProfile/Form/addEditForm';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function MainCollapsePanel() {
  const { id } = useParams();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [expandedTwo, setExpandedTwo] = React.useState(false);
  const [profileConfigList, setProfileConfigList] = useState([]);
  const [fetchCostWarehouse, setFetchCostWarehouse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [itemProfileInfoByItemID, setItemProfileInfoByItemID] = useState({});

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const location = useLocation();
  const isViewPage = location?.pathname?.includes('view');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkBox === 'itemStatus') {
      setExpanded(1);
    } else if (state?.checkBox === 'itemAttributeConfigStatus') {
      setExpanded(3);
    } else if (state?.checkBox === 'itemPlantWarehouseStatus') {
      setExpanded(2);
    } else if (state?.checkBox === 'itemPurchaseStatus') {
      setExpanded(4);
    } else if (state?.checkBox === 'itemSalesStatus') {
      setExpanded(5);
    } else if (state?.checkBox === 'itemWareHouseCostStatus') {
      setExpanded(6);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const components = [
    // {
    //   id: 1,
    //   component: <ItemBasicEditForm isViewPage={isViewPage} />,
    //   title: "Basic item info",
    // },
    {
      id: 2,
      component: (
        <ConfigItemPlantWareHouse
          isViewPage={isViewPage}
          onSuccess={(e) => {
            setTimeout(() => setFetchCostWarehouse(!fetchCostWarehouse), 1000);
          }}
        />
      ),
      title: 'Config Item Plant Warehosue',
    },
    {
      id: 3,
      component: <ConfigItemAttribute isViewPage={isViewPage} />,
      title: 'Config Item Attribute',
    },
    {
      id: 4,
      component: <CreateItemPurchaseInfo isViewPage={isViewPage} />,
      title: 'Purchase Information',
    },
    {
      id: 5,
      component: <CreateItemSalesInfo isViewPage={isViewPage} />,
      title: 'Sales Information',
    },
    {
      id: 6,
      component: (
        <CreateItemCogs
          isViewPage={isViewPage}
          fetchCostWarehouse={fetchCostWarehouse}
        />
      ),
      title: 'Costing Information',
    },
  ];
  // Create

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetItemProfileConfigList_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setProfileConfigList,
        setLoading,
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const ItemProfileInfoByItemIDFunc = (itemProfileId) => {
    GetItemProfileInfoByItemID_api(
      profileData.accountId,
      selectedBusinessUnit.value,
      id,
      itemProfileId,
      setItemProfileInfoByItemID,
      setLoadingTwo,
    );
  };
  const handleChangeTow = (panel, itm) => (event, isExpanded) => {
    setExpandedTwo(isExpanded ? panel : false);
    ItemProfileInfoByItemIDFunc(itm?.objConfig?.itemProfileId);
  };

  return (
    <div className={classes.root}>
      {loading && <Loading />}
      {components.map((itm) => (
        <>
          {isViewPage ? (
            <div>{itm.component}</div>
          ) : (
            <ExpansionPanel
              expanded={expanded === itm.id}
              onChange={handleChange(itm.id)}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>{itm.title}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>{itm.component}</div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </>
      ))}

      {/* dynamic item profile create */}
      {profileConfigList.map((itm, indx) => (
        <>
          <ExpansionPanel
            expanded={expandedTwo === indx}
            onChange={handleChangeTow(indx, itm)}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                {itm?.objConfig?.itemProfileName}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <DynamicItemProfileForm
                profileConfigList={profileConfigList}
                singleProfileList={itm}
                title={itm?.objConfig?.itemProfileName}
                itemProfileInfoByItemID={itemProfileInfoByItemID}
                ItemProfileInfoByItemIDFunc={ItemProfileInfoByItemIDFunc}
                loadingTwo={loadingTwo}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </>
      ))}
    </div>
  );
}
