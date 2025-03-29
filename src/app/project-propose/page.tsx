import ProtectedRoute from "../components/ProtectedRoute";
import ProjectProposePage from "../components/ProjectPropose";

export default function ProjectPropose() {
  return (
    <ProtectedRoute redirectTo="/login">
      <ProjectProposePage />
    </ProtectedRoute>
  );
}
