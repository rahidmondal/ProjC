import ProtectedRoute from "../components/ProtectedRoute";
import ProjectProposePage from "./ProjectPropose";

export default function ProjectPropose() {
  return (
    <ProtectedRoute redirectTo="/login">
      <ProjectProposePage />
    </ProtectedRoute>
  );
}
