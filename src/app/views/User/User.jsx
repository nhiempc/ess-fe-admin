import React, { Component } from "react";
import {
    Grid,
    IconButton,
    Icon,
    TablePagination,
    Button,
    TextField,
    FormControl,
    Input,
    InputAdornment,
    Card,
    CardContent,
    CardHeader,
    Checkbox
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { findUserByUserName, deleteItem, searchByPage, getItemById } from "./UserService";
import UserEditorDialog from "./UserEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import shortid from "shortid";
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import ConstantList from '../../appConfig'
import AddIcon from '@material-ui/icons/Add';
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});
function MaterialButton(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;
    return <div>
        <IconButton size="medium" onClick={() => props.onSelect(item, 0)}>
            <Icon size="medium" color="primary">edit</Icon>
        </IconButton>
    </div>;
}

class User extends Component {
    state = {
        keyword: '',
        rowsPerPage: 10,
        page: 0,
        eQAHealthOrgType: [],
        item: {},
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
        selectAllItem: false,
        selectedList: [],
        totalElements: 0,
        shouldOpenConfirmationDeleteAllDialog: false
    };
    numSelected = 0;
    rowCount = 0;

    handleTextChange = event => {
        this.setState({ keyword: event.target.value }, function () {
        })
    };

    handleKeyDownEnterSearch = e => {
        if (e.key === 'Enter') {
            this.updatePageData();
        }
    };

    setPage = page => {
        this.setState({ page }, function () {
            this.updatePageData();
        })
    };

    setRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
            this.updatePageData();
        });
    };

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };



    updatePageData = () => {
        this.data = []
        let searchObject = {};
        searchObject.text = this.state.keyword;
        searchObject.pageIndex = this.state.page + 1;
        searchObject.pageSize = this.state.rowsPerPage;
        if (searchObject.text && searchObject.text.trim().length > 0) {
            findUserByUserName(searchObject.text, searchObject.pageIndex, searchObject.pageSize).then(({ data }) => {
                this.setState({ itemList: [...data.content], selectedList: [], totalElements: data.totalElements })
            });
        } else {
            searchByPage(searchObject.pageIndex, searchObject.pageSize).then(({ data }) => {
                this.setState({ itemList: [...data.content], selectedList: [], totalElements: data.totalElements })
            });
        }
    };

    handleDownload = () => {
        let blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "hello world.txt");
    }
    handleDialogClose = () => {
        this.setState({
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDialog: false,
            shouldOpenConfirmationDeleteAllDialog: false
        });
        this.updatePageData()
    };

    handleOKEditClose = () => {
        this.setState({
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDialog: false
        });
        this.updatePageData();
    };

    handleDeleteUser = id => {
        this.setState({
            id,
            shouldOpenConfirmationDialog: true
        });
    };

    handleEditUser = item => {
        getItemById(item.id).then((result) => {
            this.setState({
                item: result.data,
                shouldOpenEditorDialog: true
            });
        });
    };

    handleConfirmationResponse = () => {
        deleteItem(this.state.id).then(() => {
            this.updatePageData();
            this.handleDialogClose();
        });
    };

    componentDidMount() {
        this.updatePageData();
    }

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

    handleDeleteAll = async () => {
        let listAlert = [];
        let { t } = this.props;
        for (let i = 0; i < this.data.length; i++) {
            try {
                await deleteItem(this.data[i].id);
            } catch (error) {
                listAlert.push(this.data[i].name);
            }
        }
        this.handleDialogClose();
        if (listAlert.length === this.data.length) {
            alert(t("general.isUsed"));
        } else if (listAlert.length > 0) {
            alert(t("general.deleteUsed"));
        } else {
            alert(t("general.deleteSuccess"))
        }
    };

    handleEditItem = item => {
        this.setState({
            item: item,
            shouldOpenEditorDialog: true
        });
    };

    handleDelete = id => {
        this.setState({
            id,
            shouldOpenConfirmationDialog: true
        });
    };

    async handleDeleteList(list) {
        for (let i = 0; i < list.length; i++) {
            await deleteItem(list[i].id);
        }
    }

    handleDeleteAll = (event) => {
        this.handleDeleteList(this.data).then(() => {
            this.updatePageData();
            this.handleDialogClose();
        }
        );
    };

    render() {
        const { t, i18n } = this.props;
        let {
            keyword,
            rowsPerPage,
            page,
            totalElements,
            itemList,
            item,
            shouldOpenConfirmationDialog,
            shouldOpenEditorDialog,
            shouldOpenConfirmationDeleteAllDialog
        } = this.state;

        let columns = [
            {
                title: t("Action"),
                field: "custom",
                align: "center",
                minWidth: 80,
                maxWidth: 120,
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,

                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
                render: rowData => <MaterialButton item={rowData}
                    onSelect={(rowData, method) => {
                        if (method === 0) {
                            getItemById(rowData.id).then(({ data }) => {
                                if (data.parent === null) {
                                    data.parent = {};
                                }
                                this.setState({
                                    item: data,
                                    shouldOpenEditorDialog: true
                                });
                            })
                        } else if (method === 1) {
                            this.handleDelete(rowData.id);
                        } else {
                            alert('Call Selected Here:' + rowData.id);
                        }
                    }}
                />
            },
            {
                title: t("username"),
                field: "username",
                minWidth: 150,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,

                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("user.displayName"),
                field: "person.displayName",
                minWidth: 300,
                align: "center",
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,

                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },
            {
                title: t("general.email"),
                field: "email",
                align: "center",
                minWidth: 300,
                headerStyle: {
                    ...ConstantList.styleTable.columnFirst,

                },
                cellStyle: {
                    ...ConstantList.styleTable.columnFirst
                },
            },


        ];

        return (
            <div className="m-50">
                <div className="mb-sm-30 pb-16" style={{ borderBottom: '1px solid #ccc' }}>
                    <Breadcrumb
                        routeSegments={[
                            { name: t("Dashboard.manage") },
                            { name: t("user.title") }
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
                                    onYesClick={this.handleDeleteAll}
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
                        title={t('general.selected') + this.state.selectedList.length}
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
                        <Grid container spacing={3} justifyContent="space-between">
                            {this.state.shouldOpenConfirmationDeleteAllDialog && (
                                <ConfirmationDialog
                                    open={this.state.shouldOpenConfirmationDeleteAllDialog}
                                    onConfirmDialogClose={this.handleDialogClose}
                                    onYesClick={this.handleDeleteAll}
                                    text={t("DeleteAllConfirm")}
                                    cancel={t("general.cancel")}
                                    agree={t("general.agree")}
                                />
                            )}
                            <Grid item xs={12}>
                                <div>
                                    {shouldOpenEditorDialog && (
                                        <UserEditorDialog t={t} i18n={i18n}
                                            handleClose={this.handleDialogClose}
                                            open={shouldOpenEditorDialog}
                                            handleOKEditClose={this.handleOKEditClose}
                                            item={item}
                                        />
                                    )}

                                    {shouldOpenConfirmationDialog && (
                                        <ConfirmationDialog
                                            title={t("confirm")}
                                            open={shouldOpenConfirmationDialog}
                                            onConfirmDialogClose={this.handleDialogClose}
                                            onYesClick={this.handleConfirmationResponse}
                                            text={t('DeleteConfirm')}
                                        />
                                    )}
                                </div>
                                <MaterialTable
                                    title={t("List")}
                                    data={itemList}
                                    columns={columns}
                                    parentChildData={(row, rows) => {
                                        let list = rows.find(a => a.id === row.parentId);
                                        return list;
                                    }}
                                    options={{
                                        actionsColumnIndex: 0,
                                        selection: true,
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
                                    onSelectionChange={(rows) => {
                                        this.setState({ selectedList: [...rows] })
                                        this.data = rows;
                                    }}
                                    actions={[
                                        {
                                            hidden: true,
                                            isFreeAction: true,
                                            tooltip: 'Remove All Selected Users',
                                            icon: 'delete',
                                            onClick: (evt, data) => {
                                                this.handleDeleteAll(data);
                                                alert('You want to delete ' + data.length + ' rows');
                                            }
                                        },
                                    ]}
                                />
                                <TablePagination
                                    align="left"
                                    className="px-16"
                                    rowsPerPageOptions={[1, 2, 3, 5, 10, 25, 50, 100]}
                                    component="div"
                                    count={totalElements}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    backIconButtonProps={{
                                        "aria-label": "Previous Page"
                                    }}
                                    nextIconButtonProps={{
                                        "aria-label": "Next Page"
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

export default User;
