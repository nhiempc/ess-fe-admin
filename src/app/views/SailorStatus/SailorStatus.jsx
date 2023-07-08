import {
    Button,
    FormControl,
    Grid,
    Icon,
    IconButton,
    Input,
    InputAdornment,
    Link,
    TablePagination,
    Tooltip,
    withStyles,
    Card,
    CardContent,
    Checkbox,
    CardHeader,
} from "@material-ui/core";
import { Breadcrumb, ConfirmationDialog } from "egret";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@material-ui/icons/Search";
import MaterialTable from "material-table";
import SailorStatusDialog from "./SailorStatusDialog";
import { useState } from "react";
import { deleteItem, searchByPage, deleteItemList } from "./SailorStatusService";
import { useEffect } from "react";
import { appConst } from "app/AppConst";
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
                <IconButton
                    size="medium"
                    onClick={() => props.onSelect(item, 0)}
                >
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
                <IconButton
                    size="medium"
                    onClick={() => props.onSelect(item, 1)}
                >
                    <Icon fontSize="medium" color="error">
                        delete
                    </Icon>
                </IconButton>
            </LightTooltip>
        </div>
    );
}

function SailorStatus() {
    const { t } = useTranslation();

    const [shouldOpenConfirmationDialog, setShouldOpenConfirmationDialog] = useState(false)
    const [shouldOpenConfirmationDeleteAllDialog, setShouldOpenConfirmationDeleteAllDialog] = useState(false)
    const [shouldOpenEditorDialog, setShouldOpenEditorDialog] = useState(false)
    const [dataSelect, setDataSelect] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [selectedList, setSelectedList] = useState([])
    const [itemSailor, setItemSailor] = useState({});
    const [itemList, setItemList] = useState([]);

    const updatePageData = () => {
        setDataSelect([])
        setSelectedList([])
        let searchObject = {};
        searchObject.pageIndex = page + 1;
        searchObject.pageSize = rowsPerPage;
        searchObject.keyword = keyword;
        //xem lại api để phân trang
        searchByPage(searchObject)
            .then(({ data }) => {
                setItemList(data?.content);
                setTotalElements(data?.totalElements);
            }).catch(() => {
                toast.error(t("general.error"));
            });
    }

    useEffect(() => {
        updatePageData();
    }, [page, rowsPerPage]);

    const handleEditItem = (item) => {
        setItemSailor(item);
        setShouldOpenEditorDialog(true);
    };

    const handleDelete = (item) => {
        setItemSailor(item);
        setShouldOpenConfirmationDialog(true);
    }
    const handleTextChange = (event) => {
        setKeyword(event.target.value)
    }

    const handleClose = () => {
        setShouldOpenConfirmationDialog(false);
        setShouldOpenEditorDialog(false);
        setShouldOpenConfirmationDeleteAllDialog(false);
        updatePageData()
    }

    const handleOKEditClose = () => {
        handleClose();
        updatePageData();
    }

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleConfirmationResponse = (rowData) => {
        if (itemList.length === 1 && page === 1) {
            let count = page - 1;
            setPage(count)
        }
        deleteItem(itemSailor.id)
            .then(({ data }) => {
                if (data.code === 200) {
                    updatePageData();
                    toast.success(t("general.deleteSuccess"));
                } else {
                    toast.error(data.message);
                }
            }).catch(() => {
                toast.warning(t("general.disAllowDelete"));
            });
        handleDialogClose();
    };

    const handleDeleteButtonClick = () => {
        if (!dataSelect || dataSelect.length === 0) {
            toast.warning(t("general.noti_check_data"));

        } else if (dataSelect.length === itemList.length) {
            setShouldOpenConfirmationDeleteAllDialog(true)
        } else {
            setShouldOpenConfirmationDeleteAllDialog(true)
        }
    };
    const handleDialogClose = () => {
        setShouldOpenConfirmationDialog(false)
        setShouldOpenEditorDialog(false)
        setShouldOpenConfirmationDeleteAllDialog(false)
        updatePageData()
    }
    const handleDeleteSelected = async (event) => {
        await handleDeleteAll(deleteItem, dataSelect)
        handleDialogClose();
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value);
        setPage(0);
    }

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
                            handleEditItem(rowData);
                        } else if (method === 1) {
                            handleDelete(rowData);
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
            minWidth: 120,
            headerStyle: {
                ...ConstantList.styleTable.columnFirst
            },
            cellStyle: {
                ...ConstantList.styleTable.columnFirst
            },
            render: (rowData) => rowData.tableData.id + 1,
        },
        {
            title: t("sailorStatus.code"),
            field: "code",
            align: "center",
            minWidth: 150,
            headerStyle: {
                ...ConstantList.styleTable.columnFirst
            },
            cellStyle: {
                ...ConstantList.styleTable.columnFirst
            },
        },
        {
            title: t("sailorStatus.name"),
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
            title: t("sailorStatus.note"),
            field: "note",
            minWidth: 400,
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
                        { name: t("Dashboard.directory") },
                        { name: t("Dashboard.sailorStatus") }
                    ]}
                />
            </div>
            <Card elevation={2} className="mb-16 w-100" >
                <CardHeader
                    title={'Tìm kiếm'}
                >
                </CardHeader>
                <CardContent>
                    <Grid item container xs={8} className="mb-16">
                        {shouldOpenConfirmationDialog && (
                            <ConfirmationDialog
                                title={t("general.confirm")}
                                open={shouldOpenConfirmationDialog}
                                onConfirmDialogClose={handleDialogClose}
                                onYesClick={handleConfirmationResponse}
                                text={t('DeleteConfirm')}
                                agree={t('general.agree')}
                                cancel={t('general.cancel')}
                            />
                        )}
                        {shouldOpenConfirmationDeleteAllDialog && (
                            <ConfirmationDialog
                                open={shouldOpenConfirmationDeleteAllDialog}
                                onConfirmDialogClose={handleDialogClose}
                                onYesClick={handleDeleteSelected}
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
                                    onChange={handleTextChange}
                                    onKeyDown={updatePageData}
                                    placeholder={"Họ tên hoặc ID"}
                                    id="search_box"
                                    startAdornment={
                                        <InputAdornment>
                                            <SearchIcon
                                                onClick={() => updatePageData()}
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
                            onClick={() => updatePageData()}
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
                    title={'Đã chọn: ' + selectedList.length}
                    action={
                        <Grid container className="space-between">
                            <Button
                                variant="contained"
                                className="ml-16 delete-button"
                                onClick={() => handleDeleteButtonClick()}
                            >
                                {t("general.deleteSelected")}
                            </Button>
                            <Button
                                style={{ borderRadius: '8px' }}
                                variant="contained"
                                className="ml-16"
                                color="primary"
                                onClick={() => { handleEditItem(null) }}
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
                                {shouldOpenEditorDialog && (
                                    <SailorStatusDialog
                                        t={t}
                                        handleClose={handleClose}
                                        open={shouldOpenEditorDialog}
                                        handleOKEditClose={handleOKEditClose}
                                        item={itemSailor}
                                    />
                                )}
                            </div>
                            <MaterialTable
                                title={t("general.list")}
                                data={itemList}
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
                                    paging: false,
                                    search: false,
                                    rowStyle: (rowData, index) => ({
                                        backgroundColor:
                                            index % 2 === 1 ? "#EEE" : "#FFF",
                                    }),
                                    cellStyle: {
                                        height: "40px",
                                        padding: 0,
                                    },
                                    maxBodyHeight: "430px",
                                    minBodyHeight: "370px",
                                    headerStyle: ConstantList.styleTable.header,
                                    toolbar: false,
                                }}
                                onSelectionChange={(rows) => {
                                    setSelectedList([...rows])
                                    setDataSelect(rows)
                                }}
                            />
                            <TablePagination
                                align="left"
                                className="px-16"
                                rowsPerPageOptions={appConst.ROWS_PER_PAGE_OPTIONS.TABLE}
                                component="div"
                                labelRowsPerPage={t("general.rows_per_page")}
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} ${t("general.of")} ${count !== -1 ? count : `more than ${to}`
                                    }`
                                }
                                count={totalElements}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                backIconButtonProps={{
                                    "aria-label": "Previous Page",
                                }}
                                nextIconButtonProps={{
                                    "aria-label": "Next Page",
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default SailorStatus;
