import React, { Component } from "react";
import {
    Grid,
    IconButton,
    Icon,
    TablePagination,
    Button,
    Input,
    InputAdornment,
    Checkbox,
    Tooltip,
    Menu,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from '@material-ui/icons/Add';
import MaterialTable from "material-table";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { format } from 'date-fns'
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import { deleteSailor, printCV, searchByPage } from "./SailorService";
import { toast } from "react-toastify";
import "./Sailor.scss";
import FileSaver from "file-saver";
import SailorDialog from "./SailorDialog";
import { searchByPage as searchPositionTitleLevel } from "app/views/PositionTitleLevel/PositionTitleLevelService";
import { searchByPage as searchNation } from "app/views/Nation/NationService";
import { searchByPage as searchShip } from "app/views/Ships/ShipsService";
import { searchByPage as searchTypeOfShip } from "app/views/TypeOfShip/TypeOfShipService";
import { getAllItem as searchSailorStatus } from "app/views/SailorStatus/SailorStatusService";
import { Add, LocalPrintshopRounded, MoreVert } from "@material-ui/icons";
import FilterListIcon from '@material-ui/icons/FilterList';
import FilteringGroupInput from "./SailorSearchFilterForm";
import { withStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConstantList from '../../appConfig'
import { handleDeleteAll } from "../../../utils";
import CurriculumnVitaeSailorDialog from "./CurriculumnVitaeSailorDialog";
function MaterialButton(props) {
    const { t } = useTranslation();
    const item = props.item;

    const LightTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: theme.palette.common.white,
            color: "rgba(0, 0, 0, 0.87)",
            boxShadow: theme.shadows[1],
            fontSize: 11,
            position: "absolute",
            top: "-15px",
            left: "-30px",
            width: "130px",
        },
    }))(Tooltip);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSelect = (item, number) => {
        props.onSelect(item, number)
        handleClose()
    }

    return (
        <div>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreVert fontSize="small" />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => onSelect(item, ConstantList.actionMethod.view)} dense>
                    <IconButton size="small" disabled className="mr-10 view">
                        <Icon fontSize="small" color="view">visibility</Icon>
                    </IconButton>
                    {t("general.view") + ' ' + t("general.information")}
                </MenuItem>
                <MenuItem onClick={() => onSelect(item, ConstantList.actionMethod.edit)}>
                    <IconButton size="small" disabled className="mr-10">
                        <Icon fontSize="small" color="primary">edit</Icon>
                    </IconButton>
                    {t("general.update") + ' ' + t("general.information")}
                </MenuItem>
                <MenuItem onClick={() => onSelect(item, ConstantList.actionMethod.delete)}>
                    <IconButton size="small" disabled className="mr-10">
                        <Icon fontSize="small" color="error">delete</Icon>
                    </IconButton>
                    {t("general.delete") + ' ' + t("general.information")}
                </MenuItem>
                <MenuItem onClick={() => onSelect(item, ConstantList.actionMethod.viewCV)}>
                    <IconButton size="small" className="mr-10 print">
                        <LocalPrintshopRounded fontSize="small" />
                    </IconButton>
                    {t("Print") + ' ' + t("general.information")}
                </MenuItem>
            </Menu>
        </div>
    );
}

class Sailor extends Component {
    state = {
        keyword: "",
        rowsPerPage: 10,
        page: 0,
        item: {},
        itemList: [],
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
        selectAllItem: false,
        selectedList: [],
        totalElements: 0,
        shouldOpenConfirmationDeleteAllDialog: false,
        shouldOpenFilterSearchGroupInput: false,
        isAddNew: false,
        viewOnly: false,
        selectedId: "",
        positionTitleList: [],
        nationList: [],
        typeOfShipList: [],
        sailorStatusList: [],
        shipList: [],
        tempData: [],
        deleteItems: true,
        searchObject: {
            ship: null,
            shipType: null,
            titleSailor: null,
            status: null,
            signOnShip: null,
            contractExpiryDate: null,
            signOffShip: null,
        },
        isLoading: false,
        shouldOpenViewCVDialog: false
    };

    handleTextChange = (event) => {
        this.setState({ keyword: event.target.value }, () => {
            if (this.state.keyword === "" || this.state.keyword === null) {
                this.updatePageData()
            }
        })
    }


    handleFilterSelectChange = (event) => {
        let { tempData } = this.state;
        let searchList = tempData.filter(item => {
            if (item?.currentShip?.nameOfShip?.toLowerCase().includes(event.target.value.trim().toLowerCase())) {
                return item
            }
            else if (item?.positionTitleLevelId?.toLowerCase().includes(event.target.value.trim().toLowerCase())) {
                return item
            }
            else if (item?.currentShip?.typeOfShip?.toLowerCase().includes(event.target.value.trim().toLowerCase())) {
                return item
            }
        })
        this.setState({ itemList: searchList })
    };

    handleFilterDateChange = (event) => {
        this.setState({ keyword: event })
    };


    handleKeyDownEnterFilterSearch = (e) => {
        if (e.key === "Enter") {
            this.updatePageData();
        }
    };


    handleKeyDownEnterSearch = (e) => {
        if (e.key === "Enter") {
            this.updatePageData();
        }
    };

    setPage = (page) => {
        this.setState({ page }, function () {
            this.updatePageData();
        });
    };

    setRowsPerPage = (event) => {
        this.setState(
            { rowsPerPage: event.target.value, page: 0 },
            function () {
                this.updatePageData();
            }
        );
    };

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };


    searchPositionTitleLevelById = (id) => {
        let position = this.state.positionTitleList.find(
            (item) => item.id === id
        );
        return position?.name;
    };
    searchNationById = (id) => {
        let nation = this.state.nationList.find((item) => item.id === id);
        return nation?.name;
    };
    getDataList = () => {
        let { t } = this.props;
        let searchObject = {};
        searchObject.keyword = "";
        searchObject.pageIndex = this.state.page + 1;
        searchObject.pageSize = 999;
        searchPositionTitleLevel(searchObject).then(({ data }) => {
            this.setState({ positionTitleList: [...data.content] });
        });
        searchNation(searchObject).then(({ data }) => {
            this.setState({ nationList: [...data.content] });
        }).catch(err => {
            toast.error(t("Sailor.dataError"));
        });
        searchShip(searchObject).then(({ data }) => {
            this.setState({ shipList: data.content });
        }).catch(err => {
            toast.error(t("Sailor.dataError"));
        });
        searchTypeOfShip(searchObject).then(({ data }) => {
            this.setState({ typeOfShipList: data.content });
        }).catch(err => {
            toast.error(t("Sailor.dataError"));
        });
        searchSailorStatus().then(({ data }) => {
            this.setState({ sailorStatusList: data });
        }).catch(err => {
            toast.error(t("Sailor.dataError"));
        });
    }
    updatePageData = () => {
        this.data = []
        let searchObject = {
            pageSize: this.state.rowsPerPage,
            pageIndex: this.state.page + 1,
            text: this.state.keyword,
            ...this.state.searchObject
        };
        searchByPage(searchObject)
            .then(({ data }) => {
                this.setState({
                    itemList: [...data.content],
                    selectedList: [],
                    totalElements: data.totalElements,
                    tempData: [...data.content]
                });
            })
            .catch((err) => {
                toast.error("Dữ liệu bị lỗi");
            });
    };

    handleDownload = () => {
        let blob = new Blob(["Hello, world!"], {
            type: "text/plain;charset=utf-8",
        });
        saveAs(blob, "hello world.txt");
    };
    handleDialogClose = () => {
        this.setState({
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDialog: false,
            shouldOpenConfirmationDeleteAllDialog: false,
            deleteItems: true,
            shouldOpenViewCVDialog: false
        });
        this.updatePageData();

    };

    handleOKEditClose = () => {
        this.setState({
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDialog: false,
            shouldOpenViewCVDialog: false
        });
        this.updatePageData();
    };


    componentDidMount() {
        this.updatePageData();
        this.getDataList();
    }

    handleEditItem = (item) => {
        this.setState({
            item: item,
            shouldOpenEditorDialog: true,
        });
    };

    handleConfirmationResponse = () => {
        let { t } = this.props;
        if (this.state.itemList.length === 1 && this.state.page === 1) {
            let count = this.state.page - 1;
            this.setState({
                page: count,
            });
        }
    };

    handleSearch = () => {
        let { keyword } = this.state
        let objectFilter = {
            ship: keyword.nameOfShip,
            shipType: keyword.typeOfShip,
            titleSailor: keyword.positionTitleLevelId,
            status: keyword?.sailorStatusId,
            signOnShip: keyword.signOnShip,
            contractExpiryDate: keyword.expiryContract,
            signOffShip: keyword.signOffShip,
        }
        this.handleSearchFilter(objectFilter)
    }

    handleSearchReset = () => {
        let objectFilter = {}
        this.setState({ keyword: {} })
        this.handleSearchFilter(objectFilter);
    }

    handleDelete = (id) => {
        this.setState({

            shouldOpenConfirmationDialog: true,
        });
        this.state.selectedList.push(id)
    };

    handleDeleteButtonClick = () => {
        const { t } = this.props;
        if (!this.data || this.data.length === 0) {
            toast.warning(t("general.noti_check_data"));
        } else {
            this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
        }
    };

    handleDeleteSelected = async (event) => {
        await handleDeleteAll(deleteSailor, this.data)
        this.handleDialogClose();
    }

    handleSearchFilter = (objectFilter) => {
        this.setState({ searchObject: { ...objectFilter } }, () => {
            let obj = {
                ...this.state.searchObject,
                pageSize: this.state.rowsPerPage,
                pageIndex: this.state.page + 1,
                text: this.state.keyword
            }

            searchByPage(obj)
                .then(({ data }) => {
                    this.setState({
                        itemList: data.content,
                        totalElements: data.totalElements,
                    })
                })
                .catch(err => toast.error(err))
        })
    }

    handlePrintCV = (rowData) => {
        this.setState({ isLoading: true })
        printCV(ConstantList.exportType.excel, rowData.id)
            .then((res) => {
                toast.info(this.props.t("general.successExport"));
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                FileSaver.saveAs(blob, rowData.name + '_' + rowData.positionTitleLevel.name + ".xlsx");
                this.setState({ isLoading: false })
            })
            .catch((err) => {
                toast.warning(this.props.t("general.failExport"));
                this.setState({ isLoading: false })
            });
    }

    handleViewCV = (rowData) => {
        this.setState({item: rowData}, ()=> this.setState({shouldOpenViewCVDialog: true}))
    }

    render() {
        const { t, i18n } = this.props;
        let {
            keyword,
            rowsPerPage,
            page,
            totalElements,
            itemList,
            tempData,
            shipList,
            typeOfShipList,
            sailorStatusList,
            positionTitleList,
            item,
            shouldOpenConfirmationDialog,
            shouldOpenEditorDialog,
            shouldOpenConfirmationDeleteAllDialog,
            shouldOpenFilterSearchGroupInput,
            shouldOpenViewCVDialog
        } = this.state;
        let columns = [
            {
                title: t("general.action"),
                field: "custom",
                align: "center",
                minWidth: 120,
                maxWidth: 120,
                render: (rowData) => (
                    <MaterialButton
                        item={rowData}
                        onSelect={(rowData, method) => {
                            if (method === ConstantList.actionMethod.edit) {
                                if (rowData.id) {
                                    this.setState({
                                        shouldOpenEditorDialog: true,
                                        isAddNew: false,
                                        selectedId: rowData.id,
                                        item: rowData,
                                        viewOnly: false,
                                    });
                                }
                            } else if (method === ConstantList.actionMethod.delete) {
                                this.handleDelete(rowData.id);
                            } else if (method === ConstantList.actionMethod.view) {

                                if (rowData.id) {
                                    this.setState({
                                        shouldOpenEditorDialog: true,
                                        isAddNew: false,
                                        selectedId: rowData.id,
                                        item: rowData,
                                        viewOnly: true,
                                    });
                                }
                            } else if(method === ConstantList.actionMethod.viewCV){
                                this.handleViewCV(rowData)
                            } else {
                                alert("Call Selected Here:" + rowData.id);
                            }
                        }}
                    />
                ),
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst,
                    padding: 0,
                },
            },
            {
                title: "ESS ID",
                field: "essId",
                minWidth: 140,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,
                    width: '182px',
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst,
                    width: '182px'
                }
            },
            {
                title: t("Sailor.name"),
                minWidth: 280,
                render: (rowData) => (
                    <Grid container>
                        <Grid container className="sailor__name">
                            {rowData.name}
                        </Grid>
                        <Grid>
                            {rowData?.positionTitleLevel?.id
                                ? this.searchPositionTitleLevelById(rowData?.positionTitleLevel?.id)
                                : null}
                            {rowData.nationalId
                                ? " | " + this.searchNationById(rowData?.nationalId) : null}
                            {rowData?.age ? " | " + rowData?.age + " " + t("Sailor.age") : ' | 0 tuổi'}
                        </Grid>
                    </Grid>
                ),
                align: "center",
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,
                },
            },
            {
                title: t("Sailor.gender"),
                minWidth: 120,
                render: (rowData) => (
                    <Grid container>
                        <Grid>
                            {rowData?.age ? " | " + rowData?.age + " " + t("Sailor.age") : ' | 0 tuổi'}
                        </Grid>
                    </Grid>
                ),
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: (
                    <Grid className="text--center">
                        <Grid className="header--small border__bottom--gray">
                            {t("Sailor.date")}
                        </Grid>
                        <Grid container>
                            <Grid xs item className="header--small">
                                {t("Sailor.join")}
                            </Grid>
                            <Grid
                                className="header--small border__left--gray"
                                xs
                                item>
                                {t("Sailor.expired")}
                            </Grid>
                            <Grid
                                className="header--small border__left--gray"
                                xs
                                item>
                                {t("Sailor.leave")}
                            </Grid>
                        </Grid>
                    </Grid>
                ),
                render: (rowData) => (
                    <Grid
                        container
                        alignItems={"center"}
                        className="text--center">
                        <Grid xs={4} item className="cell-padding">
                            {rowData.currentShip?.signOnShip
                                ? format(new Date(rowData.currentShip?.signOnShip), 'dd/MM/yyyy')
                                : null}
                        </Grid>
                        <Grid
                            xs={4}
                            item
                            className="border__left--gray cell--padding">
                            {rowData.currentShip?.contractExpiryDate
                                ? format(new Date(rowData.currentShip?.contractExpiryDate), 'dd/MM/yyyy')
                                : null}
                        </Grid>
                        <Grid
                            xs={4}
                            item
                            className="border__left--gray cell--padding">
                            {rowData.currentShip?.signOffShip
                                ? format(new Date(rowData.currentShip?.signOffShip), 'dd/MM/yyyy')
                                : null}
                        </Grid>
                    </Grid>
                ),
                align: "left",
                minWidth: 480,
                headerStyle: {
                    padding: 0
                },
                cellStyle: {
                    padding: 0
                },
            },
            {
                title: t("Sailor.ship"),
                render: (rowData) => this.state.shipList?.find(item => item.id === rowData?.currentShip?.ship?.id)?.name,
                align: "center",
                minWidth: 200,
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("Sailor.status"),
                render: (rowData) => this.state.sailorStatusList?.find(item => item.id === rowData?.crewStatus?.id)?.name,
                align: "center",
                minWidth: 200,
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("Sailor.createBy"),
                field: "createdBy",
                align: "center",
                minWidth: 150,
                headerStyle: ConstantList.styleTable.columnFirst,
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst,
                }
            }
        ];

        return (
            <div className="m-50">
                {this.state.isLoading ? (
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
                <div className="mb-sm-30 pb-16" style={{ borderBottom: '1px solid #ccc' }}>
                    <Breadcrumb
                        routeSegments={[{ name: t("manage.sailor") }]}
                    />
                </div>
                <Card elevation={2} className="mb-16 w-100" >
                    <CardHeader
                        title={t("general.search")}
                    >
                    </CardHeader>
                    <CardContent>
                        <Grid item container xs={8} className="mb-16">
                            {shouldOpenConfirmationDeleteAllDialog && (
                                <ConfirmationDialog
                                    open={shouldOpenConfirmationDeleteAllDialog}
                                    onConfirmDialogClose={this.handleDialogClose}
                                    onYesClick={this.handleDeleteSelected}
                                    text={t("DeleteAllConfirm")}
                                    cancel={t("general.cancel")}
                                    agree={t("general.agree")}
                                />
                            )}
                        </Grid>

                        <Grid container md={12} sm={12} xs={12}>
                            <Grid item md={5} sm={5}>
                                <FormControl className="w-100" style={{ marginTop: "6px" }}>
                                    <Input
                                        className="search_box w-100"
                                        onChange={this.handleTextChange}
                                        onKeyDown={this.handleKeyDownEnterSearch}
                                        placeholder={t("general.enterSearch")}
                                        id="search_box"
                                        startAdornment={
                                            <InputAdornment>
                                                <SearchIcon
                                                    onClick={() => this.updatePageData(keyword)}
                                                    style={{
                                                        position: "relative",
                                                        top: "0",
                                                        left: "0",
                                                    }}
                                                />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Button
                                variant="contained"
                                className="ml-16"
                                color="primary"
                                onClick={() => this.updatePageData()}
                            >
                                {t("general.search")}
                            </Button>
                            <Button
                                variant="contained"
                                className="ml-16"
                                color="secondary"
                                onClick={() => this.setState({ shouldOpenFilterSearchGroupInput: !shouldOpenFilterSearchGroupInput })}
                            >
                                {t("general.advanceSearch")}
                                <FilterListIcon />
                            </Button>
                        </Grid>
                        {
                            shouldOpenFilterSearchGroupInput &&
                            <FilteringGroupInput
                                shipList={this.state.shipList}
                                typeOfShipList={this.state.typeOfShipList}
                                positionTitleList={this.state.positionTitleList}
                                handleSearchFilter={this.handleSearchFilter}
                                sailorStatusList={sailorStatusList}
                                itemList={itemList}
                            />
                        }
                    </CardContent>
                </Card>

                <Card elevation={2} className="mb-16 w-100" >
                    <CardHeader
                        titleTypographyProps={{ variant: 'h6' }}
                        className="cardHeader-table"
                        title={t("general.selected") + this.state.selectedList.length}
                        action={
                            <Grid container className="space-between">
                                <Button
                                    variant="contained"
                                    className="ml-16 delete-button"
                                    onClick={() => this.handleDeleteButtonClick()}
                                >
                                    {t("general.deleteSelected")}
                                </Button>
                                <Button
                                    variant="contained"
                                    className="ml-16"
                                    color="primary"
                                    onClick={() => {
                                        this.handleEditItem({
                                            startDate: new Date(),
                                            endDate: new Date(),
                                            isAddNew: true,
                                        });
                                        this.setState({
                                            shouldOpenEditorDialog: true,
                                            isAddNew: true,
                                            viewOnly: false,
                                        });
                                    }}
                                >

                                    <AddIcon /> {t("general.add")}
                                </Button>
                            </Grid>
                        }
                    >
                    </CardHeader>
                    <CardContent deviders>
                        <Grid item xs={12}>
                            <div>
                                {shouldOpenEditorDialog && (
                                    <SailorDialog
                                        t={t}
                                        i18n={i18n}
                                        handleClose={this.handleDialogClose}
                                        open={shouldOpenEditorDialog}
                                        handleOKEditClose={this.handleOKEditClose}
                                        updatePageData={this.updatePageData}
                                        itemData={item}
                                        id={this.state.isAddNew ? null : this.state.selectedId}
                                        viewOnly={this.state.viewOnly}
                                    />
                                )}

                                {shouldOpenConfirmationDialog && (
                                    <ConfirmationDialog
                                        title={t("confirm")}
                                        open={shouldOpenConfirmationDialog}
                                        onConfirmDialogClose={this.handleDialogClose}
                                        onYesClick={() => this.handleDeleteList(this.state.selectedList)}
                                        text={"Bạn có chắc chắn xóa bản ghi"}
                                        cancel={"Hủy"}
                                        agree={"Đồng ý"}
                                    />
                                )}
                                {shouldOpenViewCVDialog && (
                                    <CurriculumnVitaeSailorDialog
                                        t={t}
                                        i18n={i18n}
                                        handleClose={this.handleDialogClose}
                                        open={shouldOpenViewCVDialog}
                                        handleOKEditClose={this.handleOKEditClose}
                                        updatePageData={this.updatePageData}
                                        itemData={item}
                                        handlePrintCV={this.handlePrintCV}
                                        id={this.state.isAddNew ? null : this.state.selectedId}
                                        viewOnly={this.state.viewOnly}
                                    />
                                )}
                            </div>
                            <MaterialTable
                                title={t("List")}
                                data={itemList}
                                columns={columns}
                                parentChildData={(row, rows) => {
                                    return rows.find((a) => a.id === row.parentId);
                                }}
                                options={{
                                    loadingType: "overlay",
                                    selection: true,
                                    actionsColumnIndex: 0,
                                    padding: false,
                                    paging: false,
                                    search: false,
                                    toolbar: false,
                                    draggable: false,
                                    sorting: false,
                                    rowStyle: (rowData, index) => ({
                                        backgroundColor: index % 2 === 1 ? "#EEE" : "#FFF",
                                    }),
                                    editCellStyle: {
                                        height: "50px"
                                    },
                                    maxBodyHeight: "450px",
                                    minBodyHeight: "370px",
                                    headerStyle: ConstantList.styleTable.header,
                                }}
                                localization={{
                                    body: {
                                        emptyDataSourceMessage: `${t("general.emptyDataMessageTable")}`,
                                    },
                                    toolbar: {
                                        nRowsSelected: `${t("general.selects")}`,
                                    },
                                }}
                                onSelectionChange={(rows) => {
                                    this.setState({ selectedList: [...rows] })
                                    this.data = rows;
                                }}
                            />
                            <TablePagination
                                align="left"
                                className="px-16"
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={totalElements}
                                rowsPerPage={rowsPerPage}
                                labelRowsPerPage={t("general.rows_per_page")}
                                page={page}
                                backIconButtonProps={{
                                    "aria-label": "Previous Page",
                                }}
                                nextIconButtonProps={{
                                    "aria-label": "Next Page",
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.setRowsPerPage}
                            />
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default Sailor;
