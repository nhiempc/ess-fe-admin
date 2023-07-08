import React from "react";
import {
    Dialog,
    Grid,
    Tabs,
    Tab,
    Box,
    Typography,
    IconButton,
    withStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import PropTypes from "prop-types";
import * as SailorDialogTabs from "./SailorDialogTabs";
import { useEffect } from "react";
import { addAdditionalTrainingNeeds, getSailorById, searchByPage } from "./SailorService";
import { Translation } from "react-i18next";


toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});
const CustomTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        '&:hover': {
            backgroundColor: "#FFFFFF",
            color: '#0758A3',
            opacity: .7,
        },
        '&$selected': {
            color: '#0758A3',
            backgroundColor: "#FFFFFF",
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#0758A3',
            backgroundColor: "#FFFFFF",
        },
    },
    selected: {},
}))((props) => <Tab className="bac" disableRipple {...props} />);

const CustomTabs = withStyles({
    root: {
        width: "400px",
        backgroundColor: '#1377D3',
        color: '#FFFFFF'
    },
    indicator: {
        backgroundColor: '#1377D3',
        "&:hover": {
            opacity: .7,
        }
    },
})(Tabs);

function TabPanel(props) {
    const { children, title, value, index, ...other } = props;


    return (
        <div
            role="tabpanel"
            hidden={props.viewOnly === false ?  (value !== index) : false}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            className="TabPanelSailor"
        >
            <div className="titleSailor">
                {title}
            </div>
            {(props.viewOnly === false ?  (value === index) : props.viewOnly) && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const listTabSailor = [
    { value: 0, name: "tabPersonalInfor", component: (dataSailor) => <SailorDialogTabs.PersonalInfor dataSailor={dataSailor}/> },
    { value: 1, name: "tabCurrentTrain", component: (dataSailor) => <SailorDialogTabs.CurrentTrain dataSailor={dataSailor} /> },
    { value: 2, name: "tabPassportAndCrewBook", component: (dataSailor) => <SailorDialogTabs.PassportAndCrewBook dataSailor={dataSailor}/> },
    { value: 3, name: "tabRelatives", component: (dataSailor) => <SailorDialogTabs.Relatives dataSailor={dataSailor}/> },
    { value: 4, name: "tabDependentPerson", component: (dataSailor) => <SailorDialogTabs.DependentPerson dataSailor={dataSailor}/> },
    { value: 5, name: "tabExperience", component: (dataSailor) => <SailorDialogTabs.Experience dataSailor={dataSailor}/> },
    { value: 6, name: "tabUnitInfor", component: (dataSailor) => <SailorDialogTabs.UnitInfor dataSailor={dataSailor} /> },
    { value: 7, name: "tabInternalCertificate", component: (dataSailor) => <SailorDialogTabs.InternalCertificate dataSailor={dataSailor}/> },
    { value: 8, name: "tabCertificateShipOwner", component: (dataSailor) => <SailorDialogTabs.CertificateShipOwner dataSailor={dataSailor}/> },
    { value: 9, name: "tabDocumentCertificate", component: (dataSailor) => <SailorDialogTabs.DocumentCertificate dataSailor={dataSailor}/> },
    { value: 10, name: "tabInterviewFeedback", component: (dataSailor) => <SailorDialogTabs.InterviewFeedback dataSailor={dataSailor}/> },
    { value: 11, name: "tabHealthReport", component: (dataSailor) => <SailorDialogTabs.HealthReport dataSailor={dataSailor}/> },
    { value: 12, name: "tabTraining", component: (dataSailor) => <SailorDialogTabs.Training dataSailor={dataSailor}/> },
    { value: 13, name: "tabAdditionalTrainingNeeds", component: (dataSailor) => <SailorDialogTabs.AdditionalTrainingNeeds dataSailor={dataSailor}/> },
    { value: 14, name: "tabComment", component: (dataSailor) => <SailorDialogTabs.Comment dataSailor={dataSailor}/> },
    { value: 15, name: "tabCrewFeedback", component: (dataSailor) => <SailorDialogTabs.CrewFeedback dataSailor={dataSailor}/> },
    // { value: 15, name: "tabHistorySeafaring", component: (dataSailor) => <SailorDialogTabs.HistorySeafaring dataSailor={dataSailor}/> },
]

function SailorDialog(props) {
    const { t, i18n } = useTranslation();
    let { open, handleClose, itemData, id, viewOnly, updatePageData, selectedId } = props;
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(0)
    const [sailorId, setSailorId] = useState(id)
    const [dataSailor, setDataSailor] = useState({})

    let searchObject = {};
    searchObject.keyword = "";
    searchObject.pageIndex = page + 1;
    searchObject.pageSize = 999;

    const handleResetId = (id)=> {
        setSailorId(id)
    }

    const handleChangeTab = (event, newValue) => {
        if(sailorId){
            setValue(newValue);
        } else {
            toast.error(t("Sailor.preventChangeTab"))
        }
    };
    return (
        <Dialog open={open}  maxWidth={!viewOnly ? 'xl' : "lg"} fullWidth className="sailor-dialog">
            <Grid container xs={12} justifyContent={"space-between"} className="mt-8">
                <h3 className=" pl-8 ml-16 color-white before-title">
                    {t("Sailor.information")}
                </h3>
                <IconButton onClick={handleClose} className="color-white">
                    <Close />
                </IconButton>
            </Grid>
            <Box
                sx={{ flexGrow: 1, display: 'flex', minHeight: "calc(100vh - 400px)", maxHeight: "calc(100vh - 100px)" }}
            >
                {!viewOnly &&
                    <CustomTabs
                        className=" pl-32 pr-32"
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChangeTab}
                        aria-label="Vertical tabs example"
                    >
                        {listTabSailor.map((item, index) => (
                            <CustomTab className="align_left" key={index} label={t(`Sailor.${item.name}`)} {...a11yProps(item?.value)} />
                        ))}
                    </CustomTabs>
                }
                <div className="panel-sailor">
                    {listTabSailor.map((item, index) => {
                        let Component = item?.component;
                        return (
                            <TabPanel style={{ overFlow: 'hidden' }} title={t(`Sailor.${item.name}`)} maxHeight='600px' value={value} viewOnly={viewOnly} index={item?.value}>
                                <Component handleClose={handleClose} handleUpdate handleResetId={handleResetId} viewOnly={viewOnly} dataSailor={dataSailor} id={sailorId} />
                            </TabPanel>
                        )
                    })}
                </div>
            </Box>
        </Dialog>
    );

}

export default SailorDialog;
