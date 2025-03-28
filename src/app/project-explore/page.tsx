import ProtectedRoute from "../components/ProtectedRoute";
import ProjectExplorePage from "./ProjectExplore";

export default function ProjectExplore() {
  return (
    <ProtectedRoute redirectTo="/login">
      <ProjectExplorePage />
    </ProtectedRoute>
  );
}
