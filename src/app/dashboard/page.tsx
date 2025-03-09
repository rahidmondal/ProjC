import ProtectedRoute from "@/components/ProtectedRoute";

const DashboardPage = () => {
  return (
    <ProtectedRoute redirectTo="/login">
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-xl">Welcome to your Dashboard!</h1>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
