import ProtectedRoute from "../Components/ProtectedRoute"; 
import ProfilePage from "../Components/ProfilePage"; 

export default function UserProfile() {
  return (
    <ProtectedRoute redirectTo="/login">
      {" "}
      {/* Redirect to register if not logged in */}
      <ProfilePage />
    </ProtectedRoute>
  );
}
