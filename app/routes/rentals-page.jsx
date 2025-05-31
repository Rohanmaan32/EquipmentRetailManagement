import RentalList from '../components/Rentals/RentalList';
import ProtectedRoute from '../components/Authentication/ProtectedRoute';
import Topbar from '../components/Home/TopBar';

const RentalsPage = () => {
    return(
        <>
        <ProtectedRoute requiredRoles = {['view']} >
            <Topbar />
            < RentalList />
        </ProtectedRoute>
        </>
    );
};

export default RentalsPage;
