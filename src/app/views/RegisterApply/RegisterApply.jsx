import {
    Button,
    FormControl,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    Tooltip,
    withStyles,
    Card,
    CardContent,
    Checkbox,
    CardHeader,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { ConfirmationDialog, Breadcrumb } from "egret";
import FileSaver from 'file-saver';
import MaterialTable, {
    MTableToolbar
} from "material-table";
import moment from 'moment';
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import NicePagination from "../Component/Pagination/NicePagination";
import RegisterApplyDialog from "./RegisterApplyDialog";
import { deleteRegisterApply, searchByPage } from "./RegisterApplyServices";
import { handleDeleteAll } from "../../../utils";
const API_IMAGE = ConstantList.API_ENPOINT + "/public/api/image/";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

const LightTooltip = withStyles(theme => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}))(Tooltip);

function MaterialButton(props) {
    const { t } = useTranslation();
    const item = props.item;
    return (
        <div className="none_wrap">
            <LightTooltip
                title={t("general.deleteIcon")}
                placement="bottom"
                enterDelay={100}
                leaveDelay={100}
                arrow
            >
                <IconButton
                    size="medium"
                    onClick={() => props.onSelect(item, ConstantList.actionMethod.delete)}
                >
                    <Icon fontSize="medium" color="error">
                        delete
                    </Icon>
                </IconButton>
            </LightTooltip>
            <LightTooltip
                title={"Tải về CV"}
                placement="bottom"
                enterDelay={100}
                leaveDelay={100}
                arrow
            >
                <IconButton
                    size="medium"
                    onClick={() => props.onSelect(item, ConstantList.actionMethod.print)}
                >
                    <Icon fontSize="medium" color="primary">
                        download
                    </Icon>
                </IconButton>
            </LightTooltip>
        </div>
    );
}

class RegisterApply extends Component {
    state = {
        keyword: "",
        rowsPerPage: 10,
        page: 1,
        totalPage: 0,
        eQAHealthOrgType: [],
        item: {},
        shouldOpenEditorDialog: false,
        shouldOpenEditorServiceDialog: false,
        shouldOpenConfirmationDialog: false,
        selectAllItem: false,
        selectedList: [],
        totalElements: 0,
        shouldOpenConfirmationDeleteAllDialog: false,
        text: "",
        loading: true,
        id: "",
    };
    numSelected = 0;
    rowCount = 0;

    setPage = page => {
        this.setState({ page }, function () {
            this.updatePageData();
        });
    };

    setRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value }, function () {
            this.updatePageData();
        });
    };

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleTextChange = event => {
        this.setState({ text: event.target.value });
    };

    handleKeyDownEnterSearch = e => {
        if (e.key === "Enter") {
            this.updatePageData();
        }
    };

    updatePageData = () => {
        this.data = []
        let searchObject = {};
        this.setState({ loading: true });
        searchObject.keyword = this.state.text;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.type = 1;
        searchByPage(searchObject).then(({ data }) => {
            this.setState({
                itemList: [...data.content],
                selectedList: [],
                totalElements: data.totalElements,
                totalPage: data.totalPages,
                loading: false,
            });
        });
    };

    handleDialogClose = () => {
        this.setState({
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDialog: false,
            shouldOpenConfirmationDeleteAllDialog: false,
            shouldOpenEditorServiceDialog: false
        });
        this.updatePageData()
    };

    handleOKEditClose = () => {
        this.setState(
            {
                shouldOpenEditorDialog: false,
                shouldOpenConfirmationDialog: false,
                shouldOpenEditorServiceDialog: false,
                shouldOpenConfirmationDeleteAllDialog: false
            },
            () => this.updatePageData()
        );
    };

    handleDeleteUser = id => {
        this.setState({
            id,
            shouldOpenConfirmationDialog: true,
        });
    };

    handleConfirmationResponse = () => {
        const { t } = this.props;
        deleteRegisterApply(this.state.id)
            .then(() => {
                toast.success(t("general.deleteSuccess"));
                this.handleOKEditClose();
            })
            .catch(() => {
                toast.error(t("Tài khoản đang được sử dụng. Không thể xóa"));
                this.handleDialogClose();
            });
    };

    componentDidMount() {
        this.updatePageData();
    }

    handleDownloadCv = (url) => {
        if (url) {
            const downloadUrl = API_IMAGE + url
            FileSaver.saveAs(downloadUrl, 'CV.pdf')
        } else {
            toast.error('Ứng viên chưa đính kèm CV')
        }
    }
    handleEditItem = item => {
        this.setState({
            item: item,
            shouldOpenEditorDialog: true,
        });
    };
    handleEditServiceItem = item => {

        this.setState({
            item: item,
            shouldOpenEditorServiceDialog: true,
        });
    };

    handleDelete = id => {
        this.setState({
            id,
            shouldOpenConfirmationDialog: true,
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
        await handleDeleteAll(deleteRegisterApply, this.data)
        this.handleDialogClose();
    };

    handleKeyDownEnterSearch = (e) => {
        if (e.key === "Enter") {
            this.search();
        }
    };


    search() {
        this.setState({ page: 0 }, function () {
            let searchObject = {};
            searchObject.keyword = this.state.keyword;
            searchObject.pageIndex = this.state.page + 1;
            searchObject.pageSize = this.state.rowsPerPage;
            searchObject.type = 2;
            searchByPage(searchObject).then(res => {
                this.setState({
                    itemList: [...res.data.content],
                    totalElements: res.data.totalElements,
                    totalPages: res.data.totalPages
                })
            }).catch(err => { console.log(err) });
        });
    }

    render() {
        const { t, i18n } = this.props;
        let {
            rowsPerPage,
            page,
            totalElements,
            itemList,
            item,
            shouldOpenConfirmationDialog,
            shouldOpenEditorDialog,
            loading,
            keyword,
            totalPage,
            shouldOpenConfirmationDeleteAllDialog
        } = this.state;

        let columns = [
            {
                title: t("general.action"),
                field: "custom",
                align: "center",
                minWidth: 120,
                maxWidth: 120,
                render: rowData => (
                    <MaterialButton
                        item={rowData}
                        onSelect={(rowData, method) => {
                            if (method === 0) {
                                this.handleEditItem(rowData);
                            } else if (method === ConstantList.actionMethod.delete) {
                                this.handleDelete(rowData.id);
                            } else if (method === ConstantList.actionMethod.print) {
                                this.handleDownloadCv(rowData.imagePath);
                            }
                            else {
                                alert("Call Selected Here:" + rowData.id);
                            }
                        }}
                    />
                ),
                headerStyle: ConstantList.styleTable.columnFirst,
                cellStyle: ConstantList.styleTable.columnFirst,
            },
            {
                title: t("RegisterApply.name"),
                field: "name",
                minWidth: 300,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,
                    paddingRight: "0px",
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("RegisterApply.dateOfBirth"),
                field: "dateOfBirth",
                minWidth: 100,
                align: "center",
                render: (row) => {
                    return row.dateOfBirth ? moment(row.dateOfBirth).format('DD/MM/YYYY') : '';
                },
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("RegisterApply.email"),
                field: "email",
                minWidth: 250,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("RegisterApply.phoneNumber"),
                field: "phoneNumber",
                minWidth: 100,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("RegisterApply.address"),
                field: "address",
                minWidth: 300,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,
                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst,
                },
            },
            {
                title: t("RegisterApply.timeReadyForWork"),
                field: "timeReadyForWork",
                minWidth: 140,
                align: "center",
                render: (row) => {
                    return row.timeReadyForWork ? moment(row.timeReadyForWork).format('DD/MM/YYYY') : ''
                },
                headerStyle: ConstantList.styleTable.columnFirst,
                cellStyle: ConstantList.styleTable.columnFirst,
            }
        ];

        return (
            <div className="m-50">
                <Helmet>
                    <title>
                        {t("Dashboard.registerApply")} | {t("web_site")}
                    </title>
                </Helmet>

                <Grid
                    container spacing={2} justify="space-between"
                >
                    <div className="mb-sm-30 pb-16 w-100" xs={12} style={{ borderBottom: '1px solid #ccc' }}>
                        <Breadcrumb
                            routeSegments={[
                                { name: t("Dashboard.RegisterApply") },
                                { name: t("Dashboard.registerApply") }
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
                            <Grid item sm={12} md={12}>
                                <MaterialTable
                                    title={t("List")}
                                    data={itemList}
                                    columns={columns}
                                    isLoading={loading}
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
                                        sorting: false,
                                        rowStyle: (rowData, index) => ({
                                            backgroundColor:
                                                index % 2 === 1 ? "#EEE" : "#FFF",
                                        }),
                                        maxBodyHeight: "450px",
                                        minBodyHeight: "370px",
                                        minWidth: "1200px",
                                        headerStyle: ConstantList.styleTable.header,
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
                                <NicePagination
                                    totalPages={totalPage}
                                    handleChangePage={this.handleChangePage}
                                    setRowsPerPage={this.setRowsPerPage}
                                    pageSize={rowsPerPage}
                                    pageSizeOption={[1, 2, 3, 5, 10, 25]}
                                    t={t}
                                    totalElements={totalElements}
                                    page={page}
                                />
                            </Grid>
                            {shouldOpenEditorDialog && (
                                <RegisterApplyDialog
                                    t={t}
                                    i18n={i18n}
                                    handleClose={this.handleDialogClose}
                                    open={shouldOpenEditorDialog}
                                    handleOKEditClose={this.handleOKEditClose}
                                    item={item}
                                />
                            )}
                            {shouldOpenConfirmationDialog && (
                                <ConfirmationDialog
                                    open={shouldOpenConfirmationDialog}
                                    onConfirmDialogClose={this.handleDialogClose}
                                    title={t("general.confirm")}
                                    text={t("general.deleteConfirm")}
                                    onYesClick={this.handleConfirmationResponse}
                                    agree={t("general.agree")}
                                    cancel={t("general.cancel")}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </div>
        );
    }
}

export default RegisterApply;
