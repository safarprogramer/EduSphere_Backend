import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { CourseRoutes } from "../modules/course/course.route";
import { OrderRoutes } from "../modules/order/order.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { AnalyticsRoutes } from "../modules/analytics/analytics.route";
import { LayoutRoutes } from "../modules/layouts/layout.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/layout",
    route: LayoutRoutes,
  },
  {
    path: "/analytics",
    route: AnalyticsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const routes = router;
