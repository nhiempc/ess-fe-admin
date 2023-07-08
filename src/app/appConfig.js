const APPLICATION_PATH = "/";
const VOUCHER_TYPE = {
    Liquidate: -2,// Thanh lý
    StockOut: -1,//Xuất kho vật tư
    StockIn: 1,//Nhập kho vật tư
    Allocation: 2,//Cấp phát
    Transfer: 3,//Điều chuyển
    ReceivingAsset: 4,//Tiếp nhận tài sản
    TransferToAnotherUnit: 5//Điều chuyển đơn vị khác

};

const expireCertificate= {
    expired: -1,
    expireUnder12M: 0,
    expireOver12M: 1
}

const exportType = {
    excel: 9
}
const styleTable = {
    header: {
        backgroundColor: "#8298AB",
        color: "#fff",
        height: "50px",
    },
    columnFirst: {
        borderRight: "1px solid #DBDBDB",
        borderLeft: "1px solid #DBDBDB",
        padding: 16,
    }
}

const actionMethod = {
    view: 2,
    delete: 1,
    edit: 0,
    print: 3,
    viewCV: 4,
}

//const APPLICATION_PATH="/asset_develop/";//Đặt homepage tại package.json giống như tại đây nếu deploy develop
module.exports = Object.freeze({
    //ROOT_PATH : "/egret/",
    ROOT_PATH: APPLICATION_PATH,
    ACTIVE_LAYOUT: "layout2",//layout1 = vertical, layout2=horizontal
    //     API_ENPOINT: "http://localhost:8992/ess",    //local
    //     // API_ENPOINT: "http://globits.net:8992/",
    //     // API_ENPOINT: "http://localhost:8081/core",    //local
    //     API_ENPOINT: "http://globits.net:8062/tb",
    // API_ENPOINT:  "https://367a-222-252-21-66.ngrok-free.app/ess",
    API_ENPOINT: "http://admin.eastar-dev.oceantech.com.vn/ess", //local

    // API_ENPOINT: "http://localhost:8992/ess",    //local
    // API_ENPOINT: "http://essapi.oceantech.vn/ess",
    IMAGE_URL: "D:/image/",
    //API_ENPOINT: "http://globits.net:8081/core",
    LOGIN_PAGE: APPLICATION_PATH + "session/signin",//Nếu là Spring
    HOME_PAGE: APPLICATION_PATH + "sailor_manager/sailor",//Nếu là Spring
    //HOME_PAGE:APPLICATION_PATH+"dashboard/learning-management"//Nếu là Keycloak
    //HOME_PAGE:APPLICATION_PATH+"landing3",//Link trang landing khi bắt đầu
    VOUCHER_TYPE: VOUCHER_TYPE,
    expireCertificate: expireCertificate,
    exportType: exportType,
    styleTable: styleTable,
    actionMethod: actionMethod,
    MATERIAL_DEPARTMENT_CODE: "VPB4",

});