import ProtectedRoute from "../components/ProtectedRoute";
import SkillSelection from "../components/SkillSelection";

const SkillTestPage = () => {
  return (
    <ProtectedRoute>
      <SkillSelection />
    </ProtectedRoute>
  );
};

export default SkillTestPage;