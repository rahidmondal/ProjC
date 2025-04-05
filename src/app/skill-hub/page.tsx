"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { getUserSkills } from "../services/users";
import SkillHub from "../components/SkillHub";
import { useUser } from "../contexts/UserContext";
import recommendationsData from '../data/recommendations.json';

interface Recommendation {
  name: string;
  link: string;
  category: string;
  image: string;
  skills?: string[];
}

const SkillHubPage = () => {
  const { authUser, isLoading: isContextLoading } = useUser();
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSkills = async (userId: string) => {
      setIsSkillsLoading(true);
      try {
        const skills = await getUserSkills(userId);
        setUserSkills(skills || []);
      } catch (error) { console.error("Error fetching user skills:", error); setUserSkills([]); }
      finally { setIsSkillsLoading(false); }
    };

    if (!isContextLoading && authUser) { fetchSkills(authUser.$id); }
    else if (!isContextLoading && !authUser) { setUserSkills([]); setIsSkillsLoading(false); }

  }, [isContextLoading, authUser]);

  useEffect(() => {
    const dynamicRecs: Recommendation[] = recommendationsData.dynamic;
    const defaultRecs: Recommendation[] = recommendationsData.default;

    if (!isSkillsLoading && userSkills.length > 0) {
      const filteredRecommendations = dynamicRecs.filter((rec) =>
        rec.skills?.some((skill) =>
          userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        )
      );
      console.log("Filtered Recommendations:", filteredRecommendations);
      setRecommendations(filteredRecommendations.length > 0 ? filteredRecommendations : defaultRecs);
    } else if (!isSkillsLoading && userSkills.length === 0) {
      console.log("Using default recommendations:", defaultRecs);
      setRecommendations(defaultRecs);
    }

  }, [userSkills, isSkillsLoading]);
  const overallLoading = isContextLoading || isSkillsLoading;

  return (
    <ProtectedRoute>
      <SkillHub
        userSkills={userSkills}
        recommendations={recommendations}
        loading={overallLoading}
      />
    </ProtectedRoute>
  );
};

export default SkillHubPage;