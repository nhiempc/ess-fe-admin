import React, { useEffect } from "react";
import {
    Dialog,
    Grid,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    InputLabel
} from "@material-ui/core";
import { Close, ArrowForwardIos, ArrowBackIos } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import PropTypes from "prop-types";
import * as CurriculumnVitaeSailorTabs from "./CurriculumnVitaeSailorTabs";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ConstantList from '../../appConfig';
import { getSailorById, printCV } from "./SailorService";
import FileSaver from "file-saver";
import CircularProgress from "@material-ui/core/CircularProgress";

toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

function TabPanel(props) {
    const { children, title, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={props.viewOnly === false ? (value !== index) : false}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {(props.viewOnly === false ? (value === index) : props.viewOnly) && (
                <Typography>{children}</Typography>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const listTabCurriculumn = [
    {
        tabIndex: 0,
        name: "tabExcelCurriculumn",
        component: [
            {
                index: 0,
                page: (dataSailor) => <CurriculumnVitaeSailorTabs.ExcelCurriculumn dataSailor={dataSailor} />,
            },
            {
                index: 1,
                page: (dataSailor) => <CurriculumnVitaeSailorTabs.ExcelCurriculumn2 dataSailor={dataSailor} />
            }
        ]
    },
    {
        tabIndex: 1,
        name: "tabPdfCurriculumn",
        component: [
            {
                index: 0,
                page: (dataSailor) => <CurriculumnVitaeSailorTabs.PdfCurriculumn dataSailor={dataSailor} />,
            },
            {
                index: 1,
                page: (dataSailor) => <CurriculumnVitaeSailorTabs.PdfCurriculumn2 dataSailor={dataSailor} />
            }
        ]
    }
]

function CurriculumnVitaeSailorDialog(props) {
    const { t, i18n } = useTranslation();
    let { open, handleClose, itemData, id, viewOnly } = props;
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(0)
    const [sailorId, setSailorId] = useState(id)
    const [dataSailor, setDataSailor] = useState({})
    const [loading, setLoading] = useState(false)
    const [exportType, setExportType] = useState(9);

    const handleChangeTab = (event, newValue) => {
        let tabIndex = newValue.tabIndex;
        switch (tabIndex) {
            case 0:
                setExportType(9)
                break;
            case 1:
                setExportType(2)
                break;
            default:
                setExportType(9)
                break;
        }
        setTabIndex(newValue?.tabIndex || 0);
        setPage(0)
    };

    const handlePrintCV = (rowData, exportType) => {
        setLoading(true)
        printCV(exportType, rowData.id)
            .then((res) => {
                toast.info(t("general.successExport"));
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                FileSaver.saveAs(blob, rowData.name + '_' + rowData.positionTitleLevel.name + ".xlsx");
                setLoading(false)
            })
            .catch((err) => {
                toast.warning(t("general.failExport"));
                setLoading(false)
            });
    }

    const handleChangePage = (string) => {
        if (string === 'increase') {
            setPage(page + 1)
        } else if (string === 'decrease') {
            setPage(page - 1)
        }
    }

    useEffect(() => {
        if(itemData.id){
            getSailorById(itemData.id).then(data => setDataSailor(data.data.data))
        }
    },[itemData.id])

    return (
        <Dialog open={open} maxWidth={"xl"} fullWidth className="curriculumn-dialog" justifyContent={"space-between"}>
            {loading ? (
                <div
                    style={{
                        zIndex: "10000000",
                        position: "fixed",
                        height: "100%",
                        width: "100%",
                        top: 0,
                        left: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.54)",
                    }}>
                    <CircularProgress size={60} style={{}} />
                </div>
            ) : null}
            <Grid container xs={12} justifyContent={"space-between"} className="mt-8 title-curriculumn">
                <IconButton className="color-white">
                </IconButton>
                <h3 className=" pl-8 ml-16 color-white before-title">
                    {t("Sailor.CV")}
                </h3>
                <IconButton onClick={handleClose} className="color-white">
                    <Close />
                </IconButton>
            </Grid>
            <Grid container item className="container-curriculumn mb-4">
                <Grid container item lg={12} justifyContent="center">
                    <Grid lg={12} container className="px-48">
                        <Grid lg={5} md={5}>
                            <Box display="flex" alignItems="center">
                                <InputLabel>
                                    <DashboardIcon />
                                </InputLabel>
                                <Autocomplete
                                    className="select-curriculumn mt-0"
                                    options={listTabCurriculumn}
                                    getOptionLabel={(option) => {
                                        return t(`CV.${option.name}`)
                                    }}
                                    onChange={(event, newValue) => handleChangeTab(event, newValue)}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label='Đổi mẫu'
                                        />}
                                />
                            </Box>
                        </Grid>
                        <Grid container lg={2} md={2}>
                            <Button
                                onClick={() => handleChangePage('decrease')}
                                disabled={page === 0}
                            >
                                <ArrowBackIos className={page === 0 ? "disable-icon" : ""} />
                            </Button>

                            <Button
                                onClick={() => handleChangePage('increase')}
                                disabled={(listTabCurriculumn[tabIndex].component.length - 1) === page}
                            >
                                <ArrowForwardIos />
                            </Button>
                        </Grid>
                        <IconButton></IconButton>
                    </Grid>
                    <Grid lg={12} container justifyContent="center">
                        {listTabCurriculumn.map((item, index) => {
                            if (index === tabIndex) {
                                let Component = item?.component[page].page;
                                return (
                                    <TabPanel
                                        className="panel-curriculumn p-16"
                                        title={t(`CV.${item.name}`)}
                                        value={page}
                                        viewOnly={viewOnly}
                                        index={item?.component[page]?.index}
                                    >
                                        <Component
                                            handleClose={handleClose}
                                            handleUpdate
                                            viewOnly={viewOnly}
                                            dataSailor={dataSailor}
                                            id={sailorId}
                                        />
                                    </TabPanel>
                                )
                            }
                        })}
                    </Grid>
                    <Grid lg={12} container justifyContent="center" className="mb-8">
                        <Button
                            variant="contained"
                            className="ml-16"
                            color="primary"
                            onClick={() => handlePrintCV(itemData, exportType)}
                        >
                            {t("general.exportCV")}
                        </Button>
                        <Button
                            variant="contained"
                            className="ml-16"
                            color="secondary"
                            onClick={() => handleClose()}
                        >
                            {t("general.cancel")}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    );

}

export default CurriculumnVitaeSailorDialog;
