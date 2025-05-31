import MaintenanceList from '../components/Maintenance/MaintenanceList'
import ProtectedRoute from '../components/Authentication/ProtectedRoute';
import Topbar from '../components/Home/TopBar';
const MaintenancePage = () => {
    return (
        <>
            <ProtectedRoute requiredRoles={['view']}>
                <Topbar />
                <MaintenanceList />
            </ProtectedRoute>
        </>
    );
};
export default MaintenancePage;
