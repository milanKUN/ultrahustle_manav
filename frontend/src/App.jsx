import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= PAGES ================= */
import Home from "./features/landing/pages/Home";
import User from "./features/dashboard/pages/User";
import DesktopLogin from "./features/auth/pages/DesktopLogin";
import DesktopSignup from "./features/auth/pages/DesktopSignup";
import DesktopForgotPassword from "./features/auth/pages/DesktopForgotPassword";
import DesktopEmailVerification from "./features/auth/pages/DesktopEmailVerification";
import OAuthSuccess from "./features/auth/pages/OAuthSuccess";

import CreatorOnboarding from "./features/onboarding/pages/CreatorOnboarding";

/* ================ COMPONENTS ================= */
import RoleSelection from "./features/onboarding/components/ForClient/RoleSelection";
import WorkTypeSelection from "./features/onboarding/components/ForClient/WorkTypeSelection";
import GoalsSelection from "./features/onboarding/components/ForClient/GoalsSelection";
import ClientNeeds from "./features/onboarding/components/ForClient/ClientNeeds";
import BusinessDetails from "./features/onboarding/components/ForClient/BusinessDetails";
import SetupWorkspace from "./features/onboarding/components/ForClient/SetupWorkspace";

import WorkTypeSelectionForCreator from "./features/onboarding/components/ForCreator/WorkTypeSelectionForCreator";
import CreatorGoalsSelection from "./features/onboarding/components/ForCreator/CreatorGoalsSelection";
import CreatorNeeds from "./features/onboarding/components/ForCreator/CreatorNeeds";
import SetupWorkspaceForCreator from "./features/onboarding/components/ForCreator/SetupWorkspaceForCreator";
import CreatorProfileSetup from "./features/onboarding/components/ForCreator/CreatorProfileSetup";
import ClientProfileSetup from "./features/onboarding/components/ForClient/ClientProfileSetup";
import CreateTeam from "./features/dashboard/pages/CreateTeam";
import TeamProfileLight from "./features/dashboard/pages/TeamProfileLight";
import PublicTeamProfile from "./features/dashboard/pages/PublicTeamProfile";
import UserProfile from "./features/dashboard/pages/UserProfile";
import PublicUserProfile from "./features/dashboard/pages/PublicUserProfile";
import SoloContractListing from "./features/marketplace/pages/SoloContractListing";
import Dashboard from "./features/dashboard/pages/Dashboard";
import ManageTeam from "./features/dashboard/pages/ManageTeam";

import MilestonesPage from "./features/marketplace/pages/MilestonesPage";
import SoloMilestonesPage from "./features/marketplace/pages/SoloMilestonesPage";
import CreateServiceListing from "./features/marketplace/pages/CreateServiceListing";
import AddNewListing from "./features/marketplace/pages/AddNewListing";

import RequireAuth from "./components/routing/RequireAuth";
import RequireOnboardingComplete from "./components/routing/RequireOnboardingComplete";


export default function App() {
  const THEME_KEY = "user-theme";

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "light";
  });

  useEffect(() => {
    // body classes safe way
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* MAIN */}
          <Route path="/" element={<Home />} />

          {/* PROFILE */}
          <Route
            path="/setting"
            element={
              <RequireOnboardingComplete>
                <User theme={theme} setTheme={setTheme} />
              </RequireOnboardingComplete>
            }
          />

          {/* AUTH */}
          <Route path="/desktop-forgot-password" element={<DesktopForgotPassword />} />
          <Route path="/forgot-password" element={<DesktopForgotPassword />} />
          <Route path="/reset-password" element={<DesktopForgotPassword />} />
          <Route path="/desktop-email-verification" element={<DesktopEmailVerification />} />
          <Route path="/login" element={<DesktopLogin />} />
          <Route path="/signup" element={<DesktopSignup />} />
          <Route path="/oauth/success" element={<OAuthSuccess />} />

          <Route path="/onboarding" element={<RequireAuth><CreatorOnboarding /></RequireAuth>} />
          <Route path="/role-selection" element={<RequireAuth><RoleSelection /></RequireAuth>} />
          <Route path="/client-work-type-selection" element={<RequireAuth><WorkTypeSelection /></RequireAuth>} />
          <Route path="/client-goals-selection" element={<RequireAuth><GoalsSelection /></RequireAuth>} />
          <Route path="/client-needs" element={<RequireAuth><ClientNeeds /></RequireAuth>} />
          <Route path="/client-business-details" element={<RequireAuth><BusinessDetails /></RequireAuth>} />
          <Route path="/client-setup-workspace" element={<RequireAuth><SetupWorkspace /></RequireAuth>} />
          <Route path="/client-role-selection" element={<RequireAuth><RoleSelection /></RequireAuth>} />

          <Route path="/creator-work-type-selection" element={<RequireAuth><WorkTypeSelectionForCreator /></RequireAuth>} />
          <Route path="/creator-goals-selection" element={<RequireAuth><CreatorGoalsSelection /></RequireAuth>} />
          <Route path="/creator-needs" element={<RequireAuth><CreatorNeeds /></RequireAuth>} />
          <Route path="/creator-setup-workspace" element={<RequireAuth><SetupWorkspaceForCreator /></RequireAuth>} />
          <Route path="/creator-profile-setup" element={<RequireAuth><CreatorProfileSetup /></RequireAuth>} />
          <Route path="/client-profile-setup" element={<RequireAuth><ClientProfileSetup /></RequireAuth>} />
          <Route path="/create-team" element={<RequireOnboardingComplete><CreateTeam theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/team-profile" element={<RequireOnboardingComplete><TeamProfileLight theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/public-team-profile" element={<PublicTeamProfile theme={theme} setTheme={setTheme} />} />
          <Route path="/user-profile" element={<RequireOnboardingComplete><UserProfile theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/public-user-profile" element={<PublicUserProfile theme={theme} setTheme={setTheme} />} />
          <Route path="/solo-contracts-listing" element={<SoloContractListing theme={theme} setTheme={setTheme} />} />
          <Route path="/milestones" element={<RequireOnboardingComplete><MilestonesPage theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/solo-milestones" element={<RequireOnboardingComplete><SoloMilestonesPage theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/create-service-listing" element={<RequireOnboardingComplete><CreateServiceListing theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/dashboard" element={<RequireOnboardingComplete><Dashboard theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/manage-team" element={<RequireOnboardingComplete><ManageTeam theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />
          <Route path="/add-listing" element={<RequireOnboardingComplete><AddNewListing theme={theme} setTheme={setTheme} /></RequireOnboardingComplete>} />

        </Routes>
      </div>
    </Router>
  );
}
