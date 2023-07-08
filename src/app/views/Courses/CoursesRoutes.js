import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from "react-i18next";
const Courses = EgretLoadable({
    loader: () => import("./Courses"),
});

const ViewComponent = withTranslation()(Courses);

const CoursesRoutes = [
    {
        path: ConstantList.ROOT_PATH + "dashboard/courses",
        exact: true,
        component: ViewComponent,
    },
];

export default CoursesRoutes;
