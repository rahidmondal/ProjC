"use client";

import ProtectedRoute from "../../components/ProtectedRoute"; // update path if needed
import ProjectDetails from "../../components/ProjectDetails";

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <ProjectDetails />
    </ProtectedRoute>
  );
}
