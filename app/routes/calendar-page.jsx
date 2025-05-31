import RentalCalendar from '../components/Rentals/RentalCalendar';
import Topbar from '../components/Home/TopBar';
import ProtectedRoute from "../components/Authentication/ProtectedRoute.jsx";

const CalendarPage = () => {
    return (
        <>
        <ProtectedRoute requiredRoles = {['view']} >
            < Topbar />
            < RentalCalendar />
        </ProtectedRoute>
        </>
    );
};

export default CalendarPage;