import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from "react-i18next";
const SailorStatus = EgretLoadable({
    loader: () => import("./SailorStatus"),
});

const ViewComponent = withTranslation()(SailorStatus);

const SailorStatusRoutes = [
    {
        path: ConstantList.ROOT_PATH + "dashboard/sailors-status",
        exact: true,
        component: ViewComponent,
    },
];

export default SailorStatusRoutes;
