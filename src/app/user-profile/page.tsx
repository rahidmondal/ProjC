import ProtectedRoute from "../Components/ProtectedRoute"; // Import ProtectedRoute
import ProfilePage from "./ProfilePage"; // Import ProfilePage component

export default function UserProfile() {
  return (
    <ProtectedRoute redirectTo="/login">
      {" "}
      {/* Redirect to register if not logged in */}
      <ProfilePage />
    </ProtectedRoute>
  );
}
