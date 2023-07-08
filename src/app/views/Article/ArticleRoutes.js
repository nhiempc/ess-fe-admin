import { EgretLoadable } from "egret";
import { withTranslation } from 'react-i18next';
import ConstantList from "../../appConfig";
const ArticleTable = EgretLoadable({
  loader: () => import("./ArticleTable")
});

const ViewComponent = withTranslation()(ArticleTable);

const articleRoutes = [
  {
    path: ConstantList.ROOT_PATH + "list/article",
    exact: true,
    component: ViewComponent
  }
];

export default articleRoutes;
