import {
    Button, FormControl, Grid, Icon, IconButton, Input,
    InputAdornment, TablePagination,
    Tooltip,
    Checkbox,
    Card, CardContent, CardHeader,
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
import ContactDialog from "./ContactEditorDialog";
import {
    deleteItem, searchByPage
} from "./ContactService";
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
    const { t, i18n } = useTranslation();
    const item = props.item;
    return (
        <div className="none_wrap">
            <LightTooltip
                title={t("general.editIcon")}
                placement="right-end"
                enterDelay={300}
                leaveDelay={200}
            >
                <IconButton size="medium" onClick={() => props.onSelect(item, 0)}>
                    <Icon fontSize="medium" color="primary">
                        edit
                    </Icon>
                </IconButton>
            </LightTooltip>
            <LightTooltip
                title={t("general.deleteIcon")}
                placement="right-end"
                enterDelay={300}
                leaveDelay={200}
            >
                <IconButton size="medium" onClick={() => props.onSelect(item, 1)}>
                    <Icon fontSize="medium" color="error">
                        delete
                    </Icon>
                </IconButton>
            </LightTooltip>
        </div>
    );
}
class Contact extends React.Component {
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
        selectedList: []
    };
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    handleTextChange(event) {
        this.setState({ keyword: event.target.value });
    }

    handleKeyDownEnterSearch = (e) => {
        if (e.key === "Enter") {
            this.updatePageData();
        }
    };
    componentDidMount() {
        this.updatePageData();
    }

    updatePageData = () => {
        this.data = []
        let searchObject = {};
        searchObject.keyword = this.state.keyword;
        searchObject.pageIndex = this.state.page + 1;
        searchObject.pageSize = this.state.rowsPerPage;
        searchByPage(searchObject).then(({ data }) => {
            this.setState({
                itemList: [...data.content],
                selectedList: [],
                totalElements: data.totalElements,
            });
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
        let { t } = this.props;
        if (this.state.itemList.length === 1 && this.state.page === 1) {
            let count = this.state.page - 1;
            this.setState({
                page: count,
            });
        }
        deleteItem(this.state.id)
            .then(() => {
                this.updatePageData();
                toast.success(t("general.deleteSuccess"));
            })
            .catch(() => {
                toast.warning(t("general.disAllowDelete"));
            });
        this.handleDialogClose();
    };
    handleEditItem = (item) => {
        this.setState({
            item: item,
            shouldOpenEditorDialog: true,
        });
    };
    handleDeleteButtonClick = () => {
        let { t } = this.props;
        if (!this.data || this.data.length === 0) {
            toast.warning(t("general.noti_check_data"));
        } else if (this.data.length === this.state.itemList.length) {
            this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
        } else {
            this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
        }
    };
    handleDeleteSelected = async (event) => {
        await handleDeleteAll(deleteItem, this.data)
        await this.handleDialogClose();
    };

    render() {
        const { t, i18n } = this.props;
        let { keyword, shouldOpenNotificationPopup } = this.state;

        let columns = [
            {
                title: t("general.action"),
                field: "custom",
                align: "center",
                minWidth: 120,
                maxWidth: 120,
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                render: (rowData) => (
                    <MaterialButton
                        item={rowData}
                        onSelect={(rowData, method) => {
                            if (method === 0) {
                                if (rowData.id) {
                                    this.setState({
                                        item: rowData,
                                        shouldOpenEditorDialog: true,
                                    });
                                }
                            } else if (method === 1) {
                                this.handleDelete(rowData.id);
                            } else {
                                alert("Call Selected Here:" + rowData.id);
                            }
                        }}
                    />
                ),
            },
            {
                title: t("user.displayName"),
                field: "fullName",
                align: "center",
                minWidth: 300,
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                }
            },
            {
                title: t("general.email"),
                field: "email",
                align: "center",
                minWidth: 200,
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                }
            },
            {
                title: t("user.phone"),
                field: "phone",
                minWidth: 150,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                }
            },
            {
                title: t("user.address"),
                field: "address",
                minWidth: 600,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                }
            }
        ];
        return (
            <div className="m-50">
                <div className="mb-sm-30 pb-16" style={{ borderBottom: '1px solid #ccc' }}>
                    <Breadcrumb
                        routeSegments={[
                            { name: t("Dashboard.directory") },
                            { name: t("Dashboard.contactUs") }
                        ]}
                    />
                </div>
                <Card elevation={2} className="mb-16 w-100" >
                    <CardHeader
                        title={t("general.search")}
                    >
                    </CardHeader>
                    <CardContent>
                        <Grid item container xs={8} className="mb-16">
                            {this.state.shouldOpenConfirmationDeleteAllDialog && (
                                <ConfirmationDialog
                                    open={this.state.shouldOpenConfirmationDeleteAllDialog}
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
                                                    onClick={() => this.updatePageData()}
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
                            {this.state.shouldOpenConfirmationDeleteAllDialog && (
                                <ConfirmationDialog
                                    open={this.state.shouldOpenConfirmationDeleteAllDialog}
                                    onConfirmDialogClose={this.handleDialogClose}
                                    onYesClick={this.handleDeleteSelected}
                                    title={t("confirm")}
                                    text={t("DeleteAllConfirm")}
                                    agree={t("general.agree")}
                                    cancel={t("general.cancel")}
                                />
                            )}
                            <Grid item xs={12}>
                                <div>
                                    {this.state.shouldOpenEditorDialog && (
                                        <ContactDialog
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
                                            text={t("DeleteConfirm")}
                                            agree={t("general.agree")}
                                            cancel={t("general.cancel")}
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
                                        actionsColumnIndex: -1,
                                        selection: true,
                                        paging: false,
                                        search: false,
                                        toolbar: false,
                                        draggable: false,
                                        sorting: false,
                                        rowStyle: (rowData, index) => ({
                                            backgroundColor:
                                                index % 2 === 1 ? "#EEE" : "#FFF",
                                        }),
                                        maxBodyHeight: "450px",
                                        minBodyHeight: "370px",
                                        headerStyle: ConstantList.styleTable.header,
                                        padding: "dense",
                                        toolbar: false,
                                    }}
                                    components={{
                                        Toolbar: (props) => <MTableToolbar {...props} />,
                                    }}
                                    onSelectionChange={(rows) => {
                                        this.setState({ selectedList: [...rows] })
                                        this.data = rows;
                                    }}
                                />
                                <TablePagination
                                    align="left"
                                    className="px-16"
                                    rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
                                    component="div"
                                    labelRowsPerPage={t("general.rows_per_page")}
                                    labelDisplayedRows={({ from, to, count }) =>
                                        `${from}-${to} ${t("general.of")} ${count !== -1 ? count : `more than ${to}`
                                        }`
                                    }
                                    count={this.state.totalElements}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.page}
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
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}
export default Contact;
