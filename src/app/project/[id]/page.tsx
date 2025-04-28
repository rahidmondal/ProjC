"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import ProjectDetails from "../../components/ProjectDetails";

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <ProjectDetails />
    </ProtectedRoute>
  );
}
