import ProtectedRoute from "../Components/ProtectedRoute";
import ProjectProposePage from "./ProjectPropose";

export default function ProjectPropose() {
  return (
    <ProtectedRoute redirectTo="/login">
      <ProjectProposePage />
    </ProtectedRoute>
  );
}
