import ProtectedRoute from "../components/ProtectedRoute"; 
import ProfilePage from "../components/ProfilePage"; 

export default function UserProfile() {
  return (
    <ProtectedRoute redirectTo="/login">
      {" "}
      {/* Redirect to register if not logged in */}
      <ProfilePage />
    </ProtectedRoute>
  );
}
