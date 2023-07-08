import {
    Grid,
    IconButton,
    Icon,
    Button,
    TablePagination,
    FormControl,
    Input,
    InputAdornment,
    Tooltip,
} from "@material-ui/core";
import React from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation } from "react-i18next";
import { uuid, v4 } from "uuidv4";

import { searchByPage, deleteItem, getAllItem } from "./TypeOfSailorService";

import TypeOfSailorDialog from "./TypeOfSailorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
                <IconButton
                    size="small"
                    onClick={() => props.onSelect(item, 0)}
                >
                    <Icon fontSize="small" color="primary">
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
                <IconButton
                    size="small"
                    onClick={() => props.onSelect(item, 1)}
                >
                    <Icon fontSize="small" color="error">
                        delete
                    </Icon>
                </IconButton>
            </LightTooltip>
        </div>
    );
}
class TypeOfSailor extends React.Component {
    state = {
        rowsPerPage: 10,
        page: 0,
        data: [],
        totalElements: 0,
        itemList: [],
        deleteItems: true,
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
        shouldOpenConfirmationDeleteAllDialog: false,
        keyword: "",
        shouldOpenNotificationPopup: false,
        Notification: "",
    };
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    handleTextChange(event) {
        this.setState({
            itemList: this.fakeData.filter((item) => {
                if (
                    item.name
                        .toLocaleLowerCase()
                        .includes(event.target.value.toLocaleLowerCase())
                ) {
                    console.log(item.name);
                    return item;
                } else return item;
            }),
        });
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

    handleDialogClose = () => {
        this.setState(
            {
                shouldOpenEditorDialog: false,
                shouldOpenConfirmationDialog: false,
                shouldOpenConfirmationDeleteAllDialog: false,
                shouldOpenNotificationPopup: false,
                deleteItems: true,
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
                this.handleDialogClose();
                toast.success(t("general.deleteSuccess"));
            })
            .catch(() => {
                toast.warning(t("general.disAllowDelete"));
            });
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
    async handleDeleteList(list) {
        let listAlert = [];
        let { t } = this.props;
        for (let i = 0; i < list.length; i++) {
            try {
                await deleteItem(list[i].id);
            } catch (error) {
                listAlert.push(list[i].name);
            }
        }
        this.handleDialogClose();
        if (listAlert.length === list.length) {
            toast.warning(t("general.isUsed"));
        } else if (listAlert.length > 0) {
            toast.warning(t("general.deleteUsed"));
        }
    }
    handleDeleteAll = (event) => {
        this.handleDeleteList(this.data)
            .then(() => {
                this.updatePageData();
                toast.success(t("general.deleteSuccess"));
                this.data = null;
            })
            .catch((err) => {
                toast.error("general.deleteError");
            });
    };

    fakeData = [
        {
            id: uuid(),
            stt: 1,
            name: "Thuyền viên phòng máy",
            code: "MTV01",
            createbyDate: 1,
        },
        {
            id: uuid(),
            stt: 2,
            name: "Thuyền viên dọn dẹp",
            code: "MTV02",
            createbyDate: 4,
        },
        {
            id: uuid(),
            stt: 3,
            name: "Thuyền viên phụ bếp",
            code: "MTV03",
            createbyDate: 3,
        },
        {
            id: uuid(),
            stt: 4,
            name: "Thuyền viên phụ bếp",
            code: "MTV04",
            createbyDate: 2,
        },
        {
            id: uuid(),
            stt: 5,
            name: "Thuyền viên buồng lái",
            code: "MTV05",
            createbyDate: 5,
        },
        {
            id: uuid(),
            stt: 6,
            name: "Thuyền viên phòng y tế",
            code: "MTV06",
            createbyDate: 6,
        },
    ];

    render() {
        const { t, i18n } = this.props;
        let { keyword, shouldOpenNotificationPopup } = this.state;

        let columns = [
            {
                title: t("general.action"),
                field: "custom",
                align: "left",
                width: "80px",
                headerStyle: {
                    width: "80px",
                    padding: 0,
                    textAlign: "center",
                },
                cellStyle: {
                    width: "80px",
                    borderRight: "1px solid #f6f6f6",
                    borderLeft: "1px solid #f6f6f6",
                    padding: "0 0 0 16px",
                },

                render: (rowData) => (
                    <MaterialButton
                        item={rowData}
                        onSelect={(rowData, method) => {
                            if (method === 0) {
                                if (rowData.id) {
                                    this.handleEditItem(rowData);
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
                title: t("general.stt"),
                field: "stt",
                align: "center",
                width: "60",
                headerStyle: {
                    width: "60px",
                    padding: 0,
                    textAlign: "center",
                },
                cellStyle: {
                    width: "60px",
                    borderRight: "1px solid #f6f6f6",
                },
            },
            {
                title: "Mã loại thuyền viên",
                field: "code",
                align: "left",
                width: "80",
                headerStyle: {
                    padding: 0,
                    width: "120px",
                    textAlign: "center",
                },
                cellStyle: {
                    width: "150px",
                    borderRight: "1px solid #f6f6f6",
                },
            },
            {
                title: "Loại thuyền viên",
                field: "name",
                width: "170",
                headerStyle: {
                    padding: 0,
                    width: "120px",
                    textAlign: "center",
                },
                cellStyle: {
                    width: "300px",
                    borderRight: "1px solid #f6f6f6",
                },
            },
            {
                title: t("general.note"),
                field: "note",
                align: "",
                width: "150",
                headerStyle: {
                    textAlign: "center",
                },
                cellStyle: {
                    padding: "0 0 0 20px",
                },
            },
        ];
        return (
            <div className="m-50">
                <div className="mb-sm-30">
                    <Breadcrumb
                        routeSegments={[{ name: t("Dashboard.typeofsailor") }]}
                    />
                </div>
                <Grid container spacing={2} justify="space-between">
                    <Grid item md={3} xs={12}>
                        <Button
                            className="align-bottom mr-16 mb-16"
                            variant="contained"
                            color="primary"
                            onClick={() => this.handleEditItem(null)}
                        >
                            {t("general.add")}
                        </Button>
                        <Button
                            className="align-bottom mb-16"
                            variant="contained"
                            color="secondary"
                            disabled={this.state.deleteItems}
                            onClick={this.handleDeleteButtonClick}
                        >
                            {t("general.delete")}
                        </Button>

                        {this.state.shouldOpenConfirmationDeleteAllDialog && (
                            <ConfirmationDialog
                                open={
                                    this.state
                                        .shouldOpenConfirmationDeleteAllDialog
                                }
                                onConfirmDialogClose={this.handleDialogClose}
                                onYesClick={this.handleDeleteAll}
                                title={t("confirm")}
                                text={t("DeleteAllConfirm")}
                                agree={t("general.agree")}
                                cancel={t("general.cancel")}
                            />
                        )}
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth style={{ marginTop: "6px" }}>
                            <Input
                                className="search_box w-100"
                                onChange={this.handleTextChange}
                                onKeyDown={this.handleKeyDownEnterSearch}
                                placeholder={t("general.search")}
                                id="search_box"
                                startAdornment={
                                    <InputAdornment>
                                        <Link>
                                            {" "}
                                            <SearchIcon
                                                onClick={() => this.updatePageData()}
                                                onChange={() => this.handleTextChange}
                                                style={{
                                                    position: "absolute",
                                                    top: "0",
                                                    right: "0",
                                                }}
                                            />
                                        </Link>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <div>
                            {this.state.shouldOpenEditorDialog && (
                                <TypeOfSailorDialog
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
                                    open={
                                        this.state.shouldOpenConfirmationDialog
                                    }
                                    onConfirmDialogClose={
                                        this.handleDialogClose
                                    }
                                    onYesClick={this.handleConfirmationResponse}
                                    text="bạn có chắc chắn muốn xóa loại thuyền viên"
                                    agree={t("general.agree")}
                                    cancel={t("general.cancel")}
                                />
                            )}
                        </div>
                        <MaterialTable
                            title={t("general.list")}
                            data={this.state.itemList}
                            columns={columns}
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
                                sorting: false,
                                draggable: false,
                                selection: true,
                                actionsColumnIndex: -1,
                                paging: true,
                                pageSize: 10,
                                pageSizeOptions: [5, 10, 20, 30],
                                search: false,
                                rowStyle: (rowData, index) => ({
                                    backgroundColor:
                                        index % 2 === 1 ? "#EEE" : "#FFF",
                                }),
                                cellStyle: {
                                    height: "40px",
                                    padding: 0,
                                },
                                maxBodyHeight: "450px",
                                minBodyHeight: "370px",
                                headerStyle: {
                                    backgroundColor: "#2a80c8",
                                    color: "#fff",
                                    height: "60px",
                                    border: "1px solid #fff",
                                },
                                toolbar: false,
                            }}
                            onSelectionChange={(rows) => {
                                this.data = rows;
                                if (rows.length > 0)
                                    this.setState({ deleteItems: false });
                                else this.setState({ deleteItems: true });
                            }}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default TypeOfSailor;
