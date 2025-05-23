import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import ICustomCard from '../../../_helper/_customCard';
import ShipmentForm from './collapsePanels/shipment/form/addEditForm';
import PackingForm from './collapsePanels/packing/form/addEditForm';

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

export default function InsurancePolicyCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);
  const history = useHistory();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const { type, id } = useParams();
  const location = useLocation();
  const { state } = location;
  const { shipmentId } = state;

  // console.log("id", id);
  // console.log(state, "state")
  // console.log(type, location,"test")
  useEffect(() => {
    if (state?.checkbox === 'shipmentInformation') {
      setExpanded('panel2');
    } else if (state?.checkbox === 'packingInformation') {
      setExpanded('panel3');
    }
  }, [state]);

  const backHandler = () => {
    history.goBack();
  };
  return (
    <div className={classes.root}>
      <ICustomCard
        title="Shipment And Packing Policy"
        backHandler={backHandler}
      >
        {/* Insurance Information */}
        {state?.checkbox === 'shipmentInformation' && (
          <Accordion
            className="general-ledger-collapse-custom"
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                {/* Shipment */}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <ShipmentForm
                  type={type}
                  id={id}
                  poNumber={location?.state?.ponumber}
                  lcNumber={location?.state?.lcnumber}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        )}
        {/* Shipment Wise Policy */}
        {state?.checkbox === 'packingInformation' && (
          <Accordion
            className="general-ledger-collapse-custom"
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography className={classes.heading}>Packing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <PackingForm shipmentId={shipmentId} />
              </div>
            </AccordionDetails>
          </Accordion>
        )}
      </ICustomCard>
    </div>
  );
}
