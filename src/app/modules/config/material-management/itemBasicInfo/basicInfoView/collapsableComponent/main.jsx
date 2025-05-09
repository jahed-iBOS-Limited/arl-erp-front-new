import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ItemBasicEditForm from '../editForm';
import ConfigItemPlantWareHouse from './configItemPlantWareHouse/configItemPlantWareHouse';
import ConfigItemAttribute from './configureItemAttribute/configItemAttribute';
import CreateItemPurchaseInfo from './configItemPurchaseInfo/createItemPurchaseInfo';
import CreateItemSalesInfo from './configItemSales/createItemSalesInfo';
import CreateItemCogs from './configItemCogs/createItemCogs';
import { useLocation } from 'react-router-dom';

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
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [fetchCostWarehouse, setFetchCostWarehouse] = useState(false);

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
  }, [state]);

  const components = [
    {
      id: 1,
      component: <ItemBasicEditForm isViewPage={isViewPage} />,
      title: 'Basic item info',
    },
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
      title: 'Config Item Plant Warehouse',
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
  return (
    <div className="viewItemBasicInfo">
      <div className={classes.root}>
        {components.map((itm) => (
          <>
            {isViewPage ? (
              <div>{itm.component}</div>
            ) : (
              <Accordion
                expanded={expanded === itm.id}
                onChange={handleChange(itm.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className={classes.heading}>
                    {itm.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div>{itm.component}</div>
                </AccordionDetails>
              </Accordion>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
