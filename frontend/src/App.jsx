import React, { useEffect, useState } from "react";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./features/landing/pages/Home";
import User from "./features/dashboard/pages/User";
import DesktopLogin from "./features/auth/pages/DesktopLogin";
import DesktopSignup from "./features/auth/pages/DesktopSignup";
import DesktopForgotPassword from "./features/auth/pages/DesktopForgotPassword";
import DesktopEmailVerification from "./features/auth/pages/DesktopEmailVerification";
import CreatorOnboarding from "./features/onboarding/pages/CreatorOnboarding";
import UserUserName from "./features/onboarding/components/UserUserName";
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
import EditTeam from "./features/dashboard/pages/EditTeam";
import TeamProfileLight from "./features/dashboard/pages/TeamProfileLight";
import TeamInvitePage from "./features/dashboard/pages/TeamInvitePage";
import PublicTeamProfile from "./features/dashboard/pages/PublicTeamProfile";
import UserProfile from "./features/dashboard/pages/UserProfile";
import PublicUserProfile from "./features/dashboard/pages/PublicUserProfile";
import SoloContractListing from "./features/marketplace/pages/SoloContractListing";
import Dashboard from "./features/dashboard/pages/Dashboard";
import ManageTeam from "./features/dashboard/pages/ManageTeam";
import CreatorMilestonesPage from "./features/marketplace/pages/CreatorMilestonesPage";
import ClientMilestonePage from "./features/marketplace/pages/ClientMilestonePage";
import CreatorMilestoneCancellation from "./features/marketplace/pages/CreatorMilestoneCancellation";
import ClientMilestoneCancellation from "./features/marketplace/pages/ClientMilestoneCancellation";
import SoloMilestonesPage from "./features/marketplace/pages/SoloMilestonesPage";
import CreatorWallet from "./features/marketplace/pages/CreatorWallet";
import ClientWallet from "./features/marketplace/pages/ClientWallet";
import CreateServiceListing from "./features/marketplace/pages/CreateServiceListing";
import CreateDigitalProduct from "./features/marketplace/pages/CreateDigitalProduct";
import Marketplace from "./features/marketplace/pages/Marketplace";
import AddNewListing from "./features/marketplace/pages/AddNewListing";
import TeamServiceListing from "./features/marketplace/pages/TeamServiceListing";
import ServiceListing from "./features/marketplace/pages/ServiceListing";
import DigitalProductListing from "./features/marketplace/pages/DigitalProductListing";
import MyListings from "./features/marketplace/pages/MyListings";
import MyListingPage from "./features/marketplace/pages/MyListingPage";
import CreateCourse from "./features/marketplace/pages/CreateCourse";
import CourseListing from "./features/marketplace/pages/CourseListing";
import ProductDeliverables from "./features/marketplace/pages/ProductDeliverables.jsx";
import CourseDeliverables from "./features/marketplace/pages/CourseDeliverables";
import WebinarDeliverables from "./features/marketplace/pages/WebinarDeliverables";
import WebinarListing from "./features/marketplace/pages/WebinarListing";
import CreateWebinar from "./features/marketplace/pages/CreateWebinar";
import MessageBox from "./features/marketplace/pages/MessageBox";
import MyCartPage from "./features/marketplace/pages/MyCartPage";
import MyOrderCreatorPage from "./features/marketplace/pages/MyOrderCreatorPage";
import MyOrderClientPage from "./features/marketplace/pages/MyOrderClientPage";
import ActiveProjectPage from "./features/marketplace/pages/ActiveProjectPage";
import ResolutionCenter from "./features/marketplace/pages/ResolutionCenter";




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
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/setting"
                        element={
                            <ProtectedRoute>
                                <User theme={theme} setTheme={setTheme} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/desktop-forgot-password"
                        element={<DesktopForgotPassword />}
                    />
                    <Route
                        path="/desktop-email-verification"
                        element={<DesktopEmailVerification />}
                    />
                    <Route path="/login" element={<DesktopLogin />} />
                    <Route path="/signup" element={<DesktopSignup />} />
                    <Route path="/onboarding" element={<CreatorOnboarding />} />
                    <Route path="/username" element={<UserUserName />} />
                    <Route path="/role-selection" element={<RoleSelection />} />
                    <Route
                        path="/client-work-type-selection"
                        element={<WorkTypeSelection />}
                    />
                    <Route
                        path="/client-goals-selection"
                        element={<GoalsSelection />}
                    />
                    <Route path="/client-needs" element={<ClientNeeds />} />
                    <Route
                        path="/client-business-details"
                        element={<BusinessDetails />}
                    />
                    <Route
                        path="/client-setup-workspace"
                        element={<SetupWorkspace />}
                    />
                    <Route
                        path="/client-role-selection"
                        element={<RoleSelection />}
                    />
                    <Route
                        path="/creator-work-type-selection"
                        element={<WorkTypeSelectionForCreator />}
                    />
                    <Route
                        path="/creator-goals-selection"
                        element={<CreatorGoalsSelection />}
                    />
                    <Route path="/creator-needs" element={<CreatorNeeds />} />
                    <Route
                        path="/creator-setup-workspace"
                        element={<SetupWorkspaceForCreator />}
                    />
                    <Route
                        path="/creator-profile-setup"
                        element={<CreatorProfileSetup />}
                    />
                    <Route
                        path="/client-profile-setup"
                        element={<ClientProfileSetup />}
                    />
                    <Route
                        path="/marketplace"
                        element={
                            <Marketplace theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/create-team"
                        element={
                            <CreateTeam theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/edit-team/:teamId"
                        element={<EditTeam theme={theme} setTheme={setTheme} />}
                    />
                    <Route
                        path="/team-profile/:username"
                        element={
                            <TeamProfileLight
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/public-team-profile"
                        element={
                            <PublicTeamProfile
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/user-profile"
                        element={
                            <ProtectedRoute>
                                <UserProfile
                                    theme={theme}
                                    setTheme={setTheme}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/public-user-profile"
                        element={
                            <PublicUserProfile
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/contracts-listing"
                        element={
                            <SoloContractListing
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/creator-milestone"
                        element={
                            <CreatorMilestonesPage
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/client-milestone"
                        element={
                            <ClientMilestonePage
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/creator-milestone-cancellation"
                        element={
                            <CreatorMilestoneCancellation
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/client-milestone-cancellation"
                        element={
                            <ClientMilestoneCancellation
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/solo-milestones"
                        element={
                            <SoloMilestonesPage
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/creator-wallet"
                        element={
                            <CreatorWallet
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/client-wallet"
                        element={
                            <ClientWallet
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/create-service-listing"
                        element={
                            <CreateServiceListing
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/create-digital-product"
                        element={
                            <CreateDigitalProduct
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard theme={theme} setTheme={setTheme} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manage-team"
                        element={
                            <ManageTeam theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/add-listing"
                        element={
                            <AddNewListing theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/team-invite"
                        element={
                            <TeamInvitePage theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/my-listings"
                        element={
                            <MyListingPage theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/team-service-listing"
                        element={
                            <TeamServiceListing
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/service-listing"
                        element={
                            <ServiceListing theme={theme} setTheme={setTheme} />
                        }
                    />

                    <Route
                        path="/digital-product-listing"
                        element={
                            <DigitalProductListing
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <MyCartPage theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/my-listings"
                        element={
                            <MyListings theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/create-course"
                        element={
                            <CreateCourse theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/course-listing"
                        element={
                            <CourseListing theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/product-deliverables"
                        element={
                            <ProductDeliverables
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/course-deliverables"
                        element={
                            <CourseDeliverables
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/webinar-deliverables"
                        element={
                            <WebinarDeliverables
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/webinar-listing"
                        element={
                            <WebinarListing theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/create-webinar"
                        element={
                            <CreateWebinar theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <MessageBox theme={theme} setTheme={setTheme} />
                        }
                    />
                    <Route
                        path="/creator-orders"
                        element={
                            <MyOrderCreatorPage
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/client-orders"
                        element={
                            <MyOrderClientPage
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/active-projects"
                        element={
                            <ActiveProjectPage
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                    <Route
                        path="/resolution-center"
                        element={
                            <ResolutionCenter
                                theme={theme}
                                setTheme={setTheme}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}
