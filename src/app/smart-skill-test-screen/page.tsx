import GenAITestPlaceholder from "../components/GenAITestPlaceholder";
import ProtectedRoute from "../components/ProtectedRoute";

const SmartSkillTestScreen = () =>{
    return (
        <ProtectedRoute>
        <GenAITestPlaceholder></GenAITestPlaceholder>
        </ProtectedRoute>
    )
}

export default SmartSkillTestScreen;