import React from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccountClass from "./collpaseComponent/accountClass/accountClass";
import AccountCategory from "./collpaseComponent/accountCategory/accountCategory";
import GeneralLadgerEditForm from "./collpaseComponent/generalLadger/generalLadger";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "./../../../../../../_metronic/_partials/controls/ModalProgressBar";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function MainCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };

  let history = useHistory();
  const backToPrevPage = () => {
    history.push(`/financial-management/configuration/general-ladger`);
  };

  return (
    <div className={classes.root}>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Create General Ledger">
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={backToPrevPage}
              className="btn btn-light"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-3">
            {/* Account Class Information */}
            <ExpansionPanel
              className="general-ledger-collapse-custom"
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>
                  Account Class
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>
                  <AccountClass />
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            {/* Account Category Information */}
            <ExpansionPanel
              className="general-ledger-collapse-custom"
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography className={classes.heading}>
                  Account Category
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>
                  <AccountCategory />
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            {/* Account Category Information */}
            <ExpansionPanel
              className="general-ledger-collapse-custom"
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography className={classes.heading}>
                  General Ledger
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>
                  <GeneralLadgerEditForm />
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
