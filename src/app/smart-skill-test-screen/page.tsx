import React, { Suspense } from "react";
import SmartSkillTestScreen from "./SmartSkillTestScreen";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SmartSkillTestScreen />
    </Suspense>
  );
}