import React, { Suspense } from "react";
import TestScreen from "./TestScreen";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestScreen />
    </Suspense>
  );
}