import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from "react-i18next";
const TypeOfSailorTable = EgretLoadable({
    loader: () => import("./TypeOfSailor"),
});
// const React15TabulatorSample = EgretLoadable({
//   loader: () => import("./React15TabulatorSample")
// });
const ViewComponent = withTranslation()(TypeOfSailorTable);
// const ViewTabuComponent = withTranslation()(React15TabulatorSample);

const TypeOfSailorRoutes = [
    {
        path: ConstantList.ROOT_PATH + "dashboard/TypeOfSailors",
        exact: true,
        component: ViewComponent,
    },
    // {
    //   path: ConstantList.ROOT_PATH + "dashboard/TabuTypeOfShips",
    //   exact: true,
    //   component: ViewTabuComponent
    // }
];

export default TypeOfSailorRoutes;
