import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from "react-i18next";
const TypeOfSailorTable = EgretLoadable({
    loader: () => import("./TypeOfSailor"),
});

const ViewComponent = withTranslation()(TypeOfSailorTable);

const TypeOfSailorRoutes = [
    {
        path: ConstantList.ROOT_PATH + "dashboard/type-of-sailors",
        exact: true,
        component: ViewComponent,
    },
];

export default TypeOfSailorRoutes;
