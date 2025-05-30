import EquipmentList from "../components/Equipment/Equipment";
import Topbar from '../components/Home/TopBar';
import ProtectedRoute from "../components/Authentication/ProtectedRoute.jsx";
const EquipmentPage = () => {
    
    return (
        <>
        <ProtectedRoute requiredRoles = {['view']} >
        <Topbar />
        <EquipmentList />
        </ProtectedRoute>
        </>
    );
};

export default EquipmentPage;