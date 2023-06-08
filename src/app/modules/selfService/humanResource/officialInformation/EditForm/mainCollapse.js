import React, { useEffect } from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHistory, useLocation } from "react-router-dom";
// import AdministrativeInformation from "./collpaseComponent/administrativeInformation/addEditForm";
import BankInformation from "./collpaseComponent/bankInformation/addEditForm";
import ICustomCard from "./../../../../_helper/_customCard";
import BasicEmployeeInformation from "./collpaseComponent/basicEmployeeInformation/addEditForm";
import DocumentManagement from "./collpaseComponent/documentMgt/addEditForm";
import RoasterSetup from "./collpaseComponent/roasterSetup/addEditForm";

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

export default function OfficialInfoCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [isConsolidatedEmpRemu, setIsConsolidatedEmpRemu] = React.useState();
  const [basicDataSave, setBasicDataSave] = React.useState(false);
  const history = useHistory();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };
  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === "employeeInformation") {
      setExpanded("panel0");
    } else if (state?.checkbox === "administrativeInformation") {
      setExpanded("panel1");
    } else if (state?.checkbox === "employeeRemuneration") {
      setExpanded("panel12");
    } else if (state?.checkbox === "banklInformation") {
      setExpanded("panel10");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const backHandler = () => {
    history.goBack();
  };


  return (
    <div className={classes.root}>
      <ICustomCard
        title={`Official Information [${state?.employeeFullName ||
          state?.tableData
            ?.employeeFullName}, Emp.Code: ${state?.employeeCode ||
          state?.tableData?.employeeCode}]`}
        backHandler={backHandler}
      >
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel0"}
          onChange={handleChange("panel0")}
          defaultExpanded={true}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel0bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Basic Employee Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <BasicEmployeeInformation
                isConsolidatedEmpRemu={isConsolidatedEmpRemu}
                setIsConsolidatedEmpRemu={setIsConsolidatedEmpRemu}
                setBasicDataSave={setBasicDataSave}
                basicDataSave={basicDataSave}
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          defaultExpanded={true}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Administrative Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <AdministrativeInformation basicDataSave={basicDataSave} />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}

        {/* Employment Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel11"}
          onChange={handleChange("panel11")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel11bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Employment Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <EmploymentInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}

        {/* Employee Remuneration Setup */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel12"}
          onChange={handleChange("panel12")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel12bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Employee Remuneration Setup
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              {remunaration?.isView ? (
                <EmployeeRemunerationSetup
                  isConsolidatedEmpRemu={isConsolidatedEmpRemu}
                  setIsConsolidatedEmpRemu={setIsConsolidatedEmpRemu}
                />
              ) : (
                <strong>You don't have permission to view</strong>
              )}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}

        {/* Bank Information */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel10"}
          onChange={handleChange("panel10")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel10bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Bank Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <BankInformation
                empName={
                  state?.employeeFullName || state?.tableData?.employeeFullName
                }
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {/* Document Management */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel11"}
          onChange={handleChange("panel11")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel10bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Document Management
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <DocumentManagement />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {/* Roaster Setup */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel13"}
          onChange={handleChange("panel13")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel10bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              {/* Roster Setup */}
              Work Schedule
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <RoasterSetup basicDataSave={basicDataSave} />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </ICustomCard>
    </div>
  );
}
