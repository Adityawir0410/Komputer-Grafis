"use client";
import { useAuth } from "../_context/AuthContext";

export default function MainContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative overflow-hidden">
      {/* Empty content area */}
    </div>
  );
}
