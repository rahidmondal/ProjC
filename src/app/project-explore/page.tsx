import ProtectedRoute from "../components/ProtectedRoute";
import ProjectExplorePage from "../components/ProjectExplore";

export default function ProjectExplore() {
  return (
    <ProtectedRoute redirectTo="/login">
      <ProjectExplorePage />
    </ProtectedRoute>
  );
}
