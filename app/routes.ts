import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
    index("routes/_index.jsx"),
    route("/login","routes/login-page.jsx"),
    route("/equipment","routes/equipment.jsx")

] satisfies RouteConfig;
