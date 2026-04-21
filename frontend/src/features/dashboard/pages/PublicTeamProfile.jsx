import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../../../pages/InReviewLight.css";
import "./TeamProfileLight.css";
import "../../../Darkuser.css";

import NavbarLight from "../../../components/layout/Navbar";

import TeamProfileContent from "./TeamProfileContent";

import { getTeamByUsername } from "../api/teamApi";
import { getPublicTeamPortfolio } from "../api/portfolioApi";

const PublicTeamProfile = (props) => {
  const { username } = useParams();

  const [localTheme, setLocalTheme] = useState("light");
  const theme = props.theme || localTheme;
  const setTheme = props.setTheme || setLocalTheme;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [team, setTeam] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getTeamByUsername(username);

        const fetchedTeam =
          res?.data?.team ||
          res?.team ||
          null;

        const fetchedMemberships =
          res?.data?.memberships ||
          res?.memberships ||
          [];

        if (!fetchedTeam) {
          throw new Error("Team not found.");
        }

        setTeam(fetchedTeam);
        setMemberships(Array.isArray(fetchedMemberships) ? fetchedMemberships : []);

        if (fetchedTeam?.id) {
          try {
            const portfolioRes = await getPublicTeamPortfolio(username);

            const rawProjects =
              portfolioRes?.projects ||
              portfolioRes?.data?.projects ||
              [];

            const sortedProjects = Array.isArray(rawProjects)
              ? [...rawProjects].sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
              : [];

            setPortfolioProjects(sortedProjects);
          } catch {
            setPortfolioProjects([]);
          }
        } else {
          setPortfolioProjects([]);
        }
      } catch (err) {
        setError(err?.message || "Failed to load team profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return (
    <TeamProfileContent
      mode="public"
      theme={theme}
      team={team}
      memberships={memberships}
      portfolioProjects={portfolioProjects}
      loading={loading}
      error={error}
      NavbarComponent={NavbarLight}
      SidebarComponent={null}
      onToggleSidebar={null}
      isSidebarOpen={false}
      onDropdownChange={() => {}}
      sidebarProps={{      }}
    />
  );
};

export default PublicTeamProfile;
