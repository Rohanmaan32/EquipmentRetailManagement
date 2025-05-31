import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
    index("routes/_index.jsx"),
    route("/login","routes/login-page.jsx"),
    route("/equipment","routes/equipment-page.jsx"),
    route("/rentals", "routes/rentals-page.jsx"),
    route("/maintenance", "routes/maintenance-page.jsx"),
    route("/calendar", "routes/calendar-page.jsx"),
    route("/dashboard", "routes/dashboard-page.jsx")
] satisfies RouteConfig;
