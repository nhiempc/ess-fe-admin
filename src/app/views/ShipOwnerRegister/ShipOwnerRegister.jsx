import {
    Button, FormControl, Grid, Icon, IconButton, Input,
    InputAdornment, TablePagination,
    Tooltip, Checkbox, Menu, MenuItem, Card,
    CardContent,
    CardHeader,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { ConfirmationDialog, Breadcrumb } from "egret";
import MaterialTable, {
    MTableToolbar
} from "material-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShipOwnerRegisterDialog from "./ShipOwnerRegisterDialog";
import {
    deleteShipOwnerRegister, searchByPage, getOne
} from "./ShipOwnerRegisterService";
import { LocalPrintshopRounded, MoreVert } from "@material-ui/icons";
import NicePagination from "../Component/Pagination/NicePagination";
import ConstantList from '../../appConfig'
import AddIcon from '@material-ui/icons/Add';
import { handleDeleteAll } from "../../../utils";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});
const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: theme.shadows[1],
        fontSize: 11,
        position: "absolute",
        top: "-15px",
        left: "-30px",
        width: "80px",
    },
}))(Tooltip);

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
                <MenuItem onClick={() => onSelect(item, ConstantList.actionMethod.edit)}>
                    <IconButton size="medium" disabled className="mr-10">
                        <Icon fontSize="medium" color="primary">edit</Icon>
                    </IconButton>
                    {t("general.update") + ' ' + t("general.information")}
                </MenuItem>
                <MenuItem onClick={() => onSelect(item, ConstantList.actionMethod.delete)}>
                    <IconButton size="medium" disabled className="mr-10">
                        <Icon fontSize="medium" color="error">delete</Icon>
                    </IconButton>
                    {t("general.delete") + ' ' + t("general.information")}
                </MenuItem>
            </Menu>
        </div>
    );
}
class ShipOwner extends React.Component {
    state = {
        rowsPerPage: 10,
        page: 0,
        data: [],
        totalElements: 0,
        itemList: [],
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
        shouldOpenConfirmationDeleteAllDialog: false,
        keyword: "",
        shouldOpenNotificationPopup: false,
        Notification: "",
        totalPages: 0,
        selectedList: []
    };
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    handleTextChange(event) {
        this.setState({ keyword: event.target.value });
    }
    componentDidMount() {
        this.updatePageData();
    }

    handleKeyDownEnterSearch = (e) => {
        this.setState({ page: 0 }, function () {
            let searchObject = {};
            searchObject.keyword = this.state.keyword;
            searchObject.pageIndex = this.state.page + 1;
            searchObject.pageSize = this.state.rowsPerPage;
            searchByPage(searchObject).then(res => {
                this.setState({
                    itemList: [...res.data.content],
                    totalElements: res.data.totalElements,
                    totalPages: res.data.totalPages
                })
            }).catch(err => { console.log(err) });
        });
    };


    updatePageData = () => {
        this.data = []
        let searchObject = {};
        searchObject.keyword = this.state.keyword;
        searchObject.pageIndex = this.state.page + 1;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.type = 2;
        searchByPage(searchObject).then(({ data }) => {
            this.setState({
                itemList: [...data.content],
                selectedList: [],
                totalElements: data.totalElements,
                totalPages: data.totalPages
            })
        });
    };
    setPage = (page) => {
        this.setState({ page }, function () {
            this.updatePageData();
        });
    };

    setRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
            this.updatePageData();
        });
    };

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleOKEditClose = () => {
        this.setState(
            {
                shouldOpenEditorDialog: false,
                shouldOpenConfirmationDialog: false,
            },
            () => {
                this.updatePageData();
            }
        );
    };

    handleDelete = (id) => {
        this.setState({
            id,
            shouldOpenConfirmationDialog: true,
        });
    };
    handleDialogClose = () => {
        this.setState(
            {
                shouldOpenEditorDialog: false,
                shouldOpenConfirmationDialog: false,
                shouldOpenConfirmationDeleteAllDialog: false,
                shouldOpenNotificationPopup: false,
                data: [],
            },
            () => {
                this.updatePageData();
            }
        );
    };

    handleOKEditClose = () => {
        this.setState({
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDialog: false,
            shouldOpenConfirmationDeleteAllDialog: false,
        });
        this.setPage(0);
    };

    handleDelete = (id) => {
        this.setState({
            id,
            shouldOpenConfirmationDialog: true,
        });
    };

    handleConfirmationResponse = () => {
        let { t } = this.props
        if (this.state.itemList.length === 1 && this.state.page === 1) {
            let count = this.state.page - 1;
            this.setState({
                page: count,
            })
        }
        deleteShipOwnerRegister(this.state.id).then(() => {
            this.updatePageData();
            this.handleDialogClose();
            toast.success(t("general.deleteSuccess"));
        }).catch(() => {
            toast.warning(t("general.errorSuccess"));
        });
    };
    handleEditItem = (item) => {
        if (item) {
            getOne(item).then(({ data }) => {
                this.setState({
                    item: data,
                    shouldOpenEditorDialog: true,
                });
            }).catch(() => {
                toast.error(this.props.t("general.error"))
            })
        }
        this.setState({
            item: item,
            shouldOpenEditorDialog: true,
        });
    };
    handleDeleteButtonClick = () => {
        let { t } = this.props
        if (!this.data || this.data.length === 0) {
            toast.warning(t("general.noti_check_data"));

        } else if (this.data.length === this.state.itemList.length) {
            this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
        } else {
            this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
        }
    };

    handleDeleteSelected = async (event) => {
        await handleDeleteAll(deleteShipOwnerRegister, this.data)
        this.handleDialogClose();
    };

    render() {
        const { t, i18n } = this.props;
        let { keyword, shouldOpenNotificationPopup, page, rowsPerPage, totalPages, totalElements, shouldOpenConfirmationDeleteAllDialog } = this.state;

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
                            } else if (method === ConstantList.actionMethod.print) {
                                this.handlePrintCV(
                                    rowData
                                )
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
                },
            },
            {
                title: t("ShipOwnerRegister.name"),
                field: "name",
                minWidth: 300,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },

            {
                title: t("ShipOwnerRegister.company"),
                field: "company",
                minWidth: 300,
                align: 'center',
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("ShipOwnerRegister.email"),
                field: "email",
                minWidth: 150,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("ShipOwnerRegister.phoneNumber"),
                field: "phoneNumber",
                minWidth: 150,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            }
        ];
        return (
            <div className="m-50">
                <div className="mb-sm-30 pb-16" style={{ borderBottom: '1px solid #ccc' }}>
                    <Breadcrumb
                        routeSegments={[
                            { name: t("Dashboard.RegisterApply") },
                            { name: t("Dashboard.shipOwnerRegister") }]}
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
                                        placeholder={t("general.enterSearch")}
                                        id="search_box"
                                    />
                                </FormControl>
                            </Grid>
                            <Button
                                variant="contained"
                                className="ml-16"
                                color="primary"
                                onClick={() => this.handleKeyDownEnterSearch()}
                            >
                                {t("general.search")}
                            </Button>

                        </Grid>
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
                                    style={{ borderRadius: '8px' }}
                                    variant="contained"
                                    className="ml-16"
                                    color="primary"
                                    onClick={() => { this.handleEditItem(null) }}
                                >

                                    <AddIcon /> {t("general.add")}
                                </Button>
                            </Grid>
                        }
                    >
                    </CardHeader>
                    <CardContent deviders>
                        <Grid container spacing={2} justify="space-between">
                            <Grid item xs={12}>
                                <div>
                                    {this.state.shouldOpenEditorDialog && (
                                        <ShipOwnerRegisterDialog
                                            t={t}
                                            i18n={i18n}
                                            handleClose={this.handleDialogClose}
                                            open={this.state.shouldOpenEditorDialog}
                                            handleOKEditClose={this.handleOKEditClose}
                                            item={this.state.item}
                                        />
                                    )}

                                    {this.state.shouldOpenConfirmationDialog && (
                                        <ConfirmationDialog
                                            title={t("general.confirm")}
                                            open={this.state.shouldOpenConfirmationDialog}
                                            onConfirmDialogClose={this.handleDialogClose}
                                            onYesClick={this.handleConfirmationResponse}
                                            text={t('DeleteConfirm')}
                                            agree={t('general.agree')}
                                            cancel={t('general.cancel')}
                                        />
                                    )}
                                </div>
                                <MaterialTable
                                    title={t("general.list")}
                                    data={this.state.itemList}
                                    columns={columns}
                                    parentChildData={(row, rows) => {
                                        let list = rows.find((a) => a.id === row.parentId);
                                        return list;
                                    }}
                                    localization={{
                                        body: {
                                            emptyDataSourceMessage: `${t(
                                                "general.emptyDataMessageTable"
                                            )}`,
                                        },
                                        toolbar: {
                                            nRowsSelected: `${t("general.selects")}`,
                                        },
                                    }}
                                    options={{
                                        selection: true,
                                        actionsColumnIndex: 0,
                                        paging: false,
                                        search: false,
                                        toolbar: false,
                                        draggable: false,
                                        sorting: false,
                                        toolbar: false,
                                        rowStyle: (rowData, index) => ({
                                            backgroundColor:
                                                index % 2 === 1 ? "#EEE" : "#FFF",
                                        }),
                                        maxBodyHeight: "450px",
                                        minBodyHeight: "370px",
                                        headerStyle: ConstantList.styleTable.header,
                                    }}
                                    components={{
                                        Toolbar: (props) => <MTableToolbar {...props} />,
                                    }}
                                    onSelectionChange={(rows) => {
                                        this.setState({ selectedList: [...rows] })
                                        this.data = rows;
                                    }}
                                />
                                <NicePagination
                                    totalPages={totalPages}
                                    handleChangePage={this.handleChangePage}
                                    setRowsPerPage={this.setRowsPerPage}
                                    pageSize={rowsPerPage}
                                    pageSizeOption={[1, 2, 3, 5, 10, 25]}
                                    t={t}
                                    totalElements={totalElements}
                                    page={page}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}
export default ShipOwner;
