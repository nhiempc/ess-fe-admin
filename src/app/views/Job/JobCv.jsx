import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Paper, TablePagination, Tooltip
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
    Add,
    Block,
    Save,
    Search
} from "@material-ui/icons";
import { ConfirmationDialog } from "egret";
import FileSaver from "file-saver";
import MaterialTable, {
    MTableToolbar
} from "material-table";
import moment from "moment";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import JobCvDialog from "./JobCvDialog";
import {
    deleteJobCv, searchByPage
} from "./JobCvService";
import { updateItem } from "./JobService";
const API_IMAGE = ConstantList.API_ENPOINT + "/public/api/image/";

toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

const LightTooltip = withStyles((theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}))(Tooltip);

function MaterialButton(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;
    return (
        <div className="none_wrap">
            {/* <LightTooltip
            title={t("general.editIcon")}
            placement="bottom"
            enterDelay={100}
            leaveDelay={100}
            arrow
        >
            <IconButton
                size="small"
                onClick={() => props.onSelect(item, 0)}
            >
                <Icon fontSize="small" color="primary">
                    edit
                </Icon>
            </IconButton>
        </LightTooltip> */}
            <LightTooltip
                title={t("general.deleteIcon")}
                placement="bottom"
                enterDelay={100}
                leaveDelay={100}
                arrow
            >
                <IconButton
                    size="small"
                    onClick={() => props.onSelect(item, 1)}
                >
                    <Icon fontSize="small" color="error">
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
                    size="small"
                    onClick={() => props.onSelect(item, 2)}
                >
                    <Icon fontSize="small" color="primary">
                        download
                    </Icon>
                </IconButton>
            </LightTooltip>
        </div>
    );
}
function DownloadCvButton(props) {
    const { t } = useTranslation();
    const item = props.item;
    return (
        <div className="none_wrap">
            <LightTooltip
                title={t("general.editIcon")}
                placement="bottom"
                enterDelay={300}
                leaveDelay={200}
                arrow
            >
                <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
                    <Icon fontSize="small" color="primary">
                        download
                    </Icon>
                </IconButton>
            </LightTooltip>
        </div>
    );
}

class JobCv extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            rowsPerPage: 10,
            page: 0,
            data: [],
            totalElements: 0,
            shouldOpenConfirmationDialog: false,
            shouldOpenServiceProviderDialog: false,
            shouldOpenConfirmationDeleteAllDialog: false,
            shouldOpenEditorDialog: false,
            itemEdit: {},
            itemId: "",
            itemList: [],
        };
    }

    componentDidMount() {
        if (this.props.item) {
            this.setState({
                ...this.state,
                job: this.props.item,
                id: this.props.item?.id,
            },
                () => {
                    this.updateTableData();
                });

            this.setState({
                itemList: this.props.item?.JobCvs
            })
        }

    }

    handleFormSubmit = () => {
        const { t } = this.props;
        if (this.props.item) {
            updateItem(this.state.job)
                .then(() => {
                    toast.success(t("general.addSuccess"));
                    this.props.handleOKEditClose();
                })
                .catch(() => {
                    toast.error(t("general.error"));
                    this.props.handleClose();
                });
        }
    }

    handleDateChange = (date) => {
        this.setState({
            dengueLocation: {
                ...this.state.dengueLocation,
                investigationDate: date,
            },
        });
    };
    handleEditItem = (item) => {
        this.setState({
            item: item,
            shouldOpenEditorDialog: true,
        });
    };
    handleItemChange = (e) => {
        this.setState({
            royalLocationDto: {
                ...this.state.royalLocationDto,
                [e.target.name]: e.target.value,
            },
        });
    };
    handleDeleteAll = (event) => {
        this.handleDeleteList(this.data)
            .then(() => {
                this.updatePageData();
                toast.success("Xóa thành công");
                this.data = null;
            })
            .catch((err) => {
                console.log("loi");
            });
    };
    async handleDeleteList(list) {
        let listAlert = [];
        var { t } = this.props;
        for (var i = 0; i < list.length; i++) {
            try {
                await deleteJobCv(list[i].id);
            } catch (error) {
                listAlert.push(list[i].name);
            }
        }
        this.handleDialogClose();
        if (listAlert.length === list.length) {
            toast.warning(t("Danh mục đã được sử dụng"));
            // alert("Các trạng thái đều đã sử dụng");
        } else if (listAlert.length > 0) {
            toast.warning(t("Đã xoá các danh mục chưa sử dụng"));
            // alert("Đã xoá các trạng thái chưa sử dụng");
        }
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
    handleDialogClose = () => {
        this.setState({
            shouldOpenConfirmationDialog: false,
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDeleteAllDialog: false
        });
    };

    setRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
            this.updatePageData();
        });
    };
    setPage = (page) => {
        this.setState({ page }, function () {
            this.updatePageData();
        });
    };
    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };
    handleOKDialog = () => {
        this.setState(
            {
                shouldOpenEditorDialog: false,
            },
            () => this.updatePageData()
        );
    };
    updatePageData = () => {
        var searchObject = {};
        searchObject.keyword = "";
        searchObject.pageIndex = this.state.page + 1;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.idJob = this.state.id;
        searchByPage(searchObject).then(({ data }) => {
            this.setState({ itemList: [...data.content], totalElements: data.totalElements, })
        });
    };

    handleOpenDengueItemDialog = () => {
        this.setState({
            ...this.state,
            shouldOpenDengueItemDialog: true,
        });
    };

    // Table Item
    updateListData = (itemData, source) => {
        const index = this.state.itemList.findIndex(
            (i) => i.tableData.id === itemData?.tableData?.id
        );
        let newList = [...this.state.itemList];

        if (index !== -1) {
            newList[index] = itemData;
            this.setState({
                itemList: newList,
            });
        } else {
            this.setState({
                itemList: [...this.state.itemList, itemData],
            });
        }
    };

    updateTableData = (data, name) => {
        let searchObject = {};
        // searchObject.dengueLocation = this.props.item;
        searchObject.pageIndex = 1;
        searchObject.pageSize = 10000;
        searchObject.idJob = this.state.id;
        console.log(data, name);

        if (this.props.item) {
            searchByPage(searchObject).then(({ data }) => {
                this.setState({
                    itemList: data.content,
                });
            });
        }
    };

    handleSearchInputChange = (e, source) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
        if (e.target.value === "") {
            this.search(source);
        }
    };

    handleKeyDownEnterSearch = (e, source) => {
        e.stopPropagation();
        if (e.key === "Enter") {
            this.search(source);
            e.preventDefault();
        }
    };

    search = (source) => {
        let searchObject = {};
        searchObject.text = this.state.search;
        searchObject.pageIndex = 1;
        searchObject.pageSize = 1000;
        searchObject.idJob = this.state.id;
        searchByPage(searchObject).then(({ data }) => {
            this.setState({
                itemList: data.content,
            });
        });
    };

    handleChangePage = (event, newPage) => {
        this.setState(
            {
                page: newPage,
            },
            () => this.updateTableData()
        );
    };

    handleDownloadCv = (url) => {
        if (url) {
            const downloadUrl = API_IMAGE + url
            FileSaver.saveAs(downloadUrl, 'CV.pdf')
        } else {
            toast.error('Ứng viên chưa đính kèm CV')
        }
    };

    handleDelete = itemId => {
        this.setState({
            itemId: itemId,
            shouldOpenConfirmationDialog: true,
        });
    };

    handleConfirmationResponse = () => {
        let { t } = this.props;

        deleteJobCv(this.state.itemId)
            .then(() => {
                toast.success(t("general.deleteSuccess"));
                this.updateTableData();
                this.handleDialogClose();
            })
            .catch(() => toast.error(t("general.error")));
    };
    handleConfirmDelete = () => {
        let { t } = this.props;

        deleteJobCv(this.state.itemId)
            .then(() => {
                toast.success(t("general.deleteSuccess"));
                this.updatePatientData();
                this.handleDialogClose();
            })
            .catch(() => toast.error(t("general.error")));
    };


    onOpenImportExcel = (source) => {
        if (source === "vector") {
            this.setState({
                excelURL: "/api/dengue-location-item/importExcel",
                openImportExcelDialog: true,
            });
        } else {
            this.setState({
                excelURL: "/api/patientInformation/importExcel",
                openImportExcelDialog: true,
            });
        }
    };

    handleCloseImport = () => {
        this.setState({
            openImportExcelDialog: false,
        });
    };

    render() {
        const { t, open, handleClose, i18n } = this.props;

        const {
            shouldOpenDengueItemDialog,
            item,
            shouldOpenConfirmationDialog,
            shouldOpenEditorDialog,
            tabActive,
            openImportExcelDialog,
            excelURL,
            name,
            itemList
        } = this.state;

        let columns = [
            {
                title: t("general.action"),
                field: "custom",
                align: "left",
                width: "120",
                headerStyle: {
                    padding: "0px",
                },
                cellStyle: {
                    padding: "0px",
                },
                render: rowData => (
                    <MaterialButton
                        item={rowData}
                        onSelect={(rowData, method) => {
                            if (method === 0) {
                                this.handleEditItem(rowData);
                            } else if (method === 1) {
                                this.handleDelete(rowData.id);
                            } else if (method === 2) {
                                this.handleDownloadCv(rowData.imagePath);
                            }
                            else {
                                alert("Call Selected Here:" + rowData.id);
                            }
                        }}
                    />
                ),
            },
            {
                title: t("RegisterApply.name"),
                field: "name",
                width: "100",
                headerStyle: {
                    minWidth: "100px",
                    paddingLeft: "10px",
                    paddingRight: "0px",
                },
                cellStyle: {
                    minWidth: "100px",
                    paddingLeft: "10px",
                    paddingRight: "0px",
                    textAlign: "left",
                },
            },
            {
                title: t("RegisterApply.dateOfBirth"),
                field: "dateOfBirth",
                width: "100",
                render: (row) => {
                    return row.dateOfBirth ? moment(row.dateOfBirth).format('DD/MM/YYYY') : '';
                }
            },
            {
                title: t("RegisterApply.email"),
                field: "email",
                width: "100",
            },
            {
                title: t("RegisterApply.phoneNumber"),
                field: "phoneNumber",
                width: "100",
            },
            {
                title: t("RegisterApply.address"),
                field: "address",
                width: "100",
            },
            {
                title: t("RegisterApply.timeReadyForWork"),
                field: "timeReadyForWork",
                width: "100",
                render: (row) => {
                    return row.timeReadyForWork ? moment(row.timeReadyForWork).format('DD/MM/YYYY') : ''
                }
            }

        ];
        return (
            <Dialog
                open={open}
                fullWidth
                maxWidth="lg"
                onClose={handleClose}
                PaperComponent={PaperComponent}
            >

                {this.state.shouldOpenConfirmationDeleteAllDialog && (
                    <ConfirmationDialog
                        open={this.state.shouldOpenConfirmationDeleteAllDialog}
                        onConfirmDialogClose={this.handleDialogClose}
                        onYesClick={this.handleDeleteAll}
                        title={t("confirm")}
                        text={t('DeleteAllConfirm')}
                        agree={t('general.agree')}
                        cancel={t('general.cancel')}
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
                {shouldOpenEditorDialog && (
                    <JobCvDialog
                        open={shouldOpenEditorDialog}
                        handleClose={this.handleDialogClose}
                        handleOKDialog={this.handleOKDialog}
                        t={t}
                        i18n={i18n}
                        item={item}
                        updateTableData={this.updateTableData}
                        parent={this.state.job}
                    />
                )}
                <DialogTitle
                    style={{ cursor: "move", backgroundColor: "#f9fafb" }}
                    id="draggable-dialog-title"
                >
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                        }}
                    >
                        {t("Job.listCv")}
                    </p>
                </DialogTitle>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleFormSubmit}
                    onError={(err) => console.log(err)}
                >
                    <DialogContent>
                        <Paper square elevation={3}>
                            <Grid
                                container
                                spacing={2}
                                alignItems="flex-end"
                                justifyContent="space-between"
                            >
                                <Grid
                                    item
                                    sm={8}
                                    md={9}
                                    lg={9}
                                    className="flex flex-align-end"
                                    spacing={2}
                                >
                                    <Button
                                        style={{ marginTop: "50px" }}
                                        variant="contained"
                                        color="secondary"
                                        className="ml-12"
                                        onClick={this.handleDeleteButtonClick}
                                    >
                                        {t("general.delete")}
                                    </Button>
                                </Grid>

                                {
                                    <Grid item md={4} lg={3} xl={3}>
                                        <FormControl className="mr-8 w-100" size="small">
                                            <InputLabel htmlFor="standard-adornment">
                                                {t("EnterSearch")}
                                            </InputLabel>
                                            <Input
                                                id="standard-basic"
                                                type="text"
                                                name="search"
                                                value={this.state.search}
                                                label={t("EnterSearch")}
                                                onChange={(e) =>
                                                    this.handleSearchInputChange(e, "search")
                                                }
                                                onKeyDown={(e) =>
                                                    this.handleKeyDownEnterSearch(e, "search")
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => this.search("search")}
                                                        >
                                                            <Search />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                }
                                <Grid item md={12}>
                                    <MaterialTable
                                        title={t("general.list")}
                                        data={itemList}
                                        columns={columns}
                                        //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
                                        parentChildData={(row, rows) => {
                                            var list = rows.find((a) => a.id === row.parentId);
                                            return list;
                                        }}
                                        localization={{
                                            body: {
                                                emptyDataSourceMessage: `${t(
                                                    "general.emptyDataMessageTable"
                                                )}`,
                                            },
                                            toolbar: {
                                                // nRowsSelected: `${t('general.selects')}`,
                                                nRowsSelected: `${t("general.selects")}`,
                                            },
                                        }}
                                        options={{
                                            selection: true,
                                            actionsColumnIndex: -1,
                                            paging: false,
                                            search: false,
                                            rowStyle: (rowData, index) => ({
                                                backgroundColor:
                                                    index % 2 === 1 ? "#EEE" : "#FFF",
                                            }),
                                            maxBodyHeight: "450px",
                                            minBodyHeight: "370px",
                                            headerStyle: {
                                                backgroundColor: "#2a80c8",
                                                color: "#fff",
                                                height: "50px",
                                            },
                                            padding: "dense",
                                            toolbar: false,
                                        }}
                                        components={{
                                            Toolbar: (props) => <MTableToolbar {...props} />,
                                        }}
                                        onSelectionChange={(rows) => {
                                            this.data = rows;
                                        }}
                                    // actions={[
                                    //   {
                                    //     tooltip: 'Remove All Selected Users',
                                    //     icon: 'delete',
                                    //     onClick: (evt, data) => {
                                    //       this.handleDeleteAll(data);
                                    //       console.log(data)
                                    //       alert('You want to delete ' + data.length + ' rows');
                                    //     }
                                    //   },
                                    // ]}
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
                        </Paper>

                    </DialogContent>

                    <DialogActions>
                        <div className="flex flex-middle mr-8">
                            <Button
                                startIcon={<Block />}
                                variant="contained"
                                className="mr-12"
                                color="secondary"
                                onClick={() => this.props.handleClose()}
                            >
                                {t("general.cancel")}
                            </Button>
                            <Button
                                startIcon={<Save />}
                                variant="contained"
                                className="mr-8"
                                color="primary"
                                type="submit"
                            >
                                {t("general.save")}
                            </Button>
                        </div>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        );
    }
}
export default JobCv;
