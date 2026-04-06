import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../../pages/InReviewLight.css";
import "./TeamProfileLight.css";
import "../../../Darkuser.css";

import NavbarLight from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import TeamProfileContent from "./TeamProfileContent";

import { getTeam, getTeamByUsername } from "../api/teamApi";
import { getMyPortfolio } from "../api/portfolioApi";

const TeamProfileLight = (props) => {
  const navigate = useNavigate();
  const params = useParams();

  const teamId = useMemo(() => {
    const raw = params?.teamId;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [params?.teamId]);

  const username = params?.username || null;

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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        let res = null;

        if (teamId) {
          res = await getTeam(teamId);
        } else if (username) {
          res = await getTeamByUsername(username);
        } else {
          throw new Error("Missing team identifier.");
        }

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
            const portfolioRes = await getMyPortfolio({
              mode: "team",
              teamId: fetchedTeam.id,
            });

            const rawProjects =
              portfolioRes?.projects ||
              portfolioRes?.data?.projects ||
              portfolioRes?.portfolio?.projects ||
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
  }, [teamId, username]);

  return (
    <TeamProfileContent
      mode="private"
      theme={theme}
      team={team}
      memberships={memberships}
      portfolioProjects={portfolioProjects}
      loading={loading}
      error={error}
      NavbarComponent={NavbarLight}
      SidebarComponent={Sidebar}
      onToggleSidebar={() => setSidebarOpen((p) => !p)}
      isSidebarOpen={sidebarOpen}
      onDropdownChange={() => {}}
      sidebarProps={{
        expanded: sidebarOpen,
        setExpanded: setSidebarOpen,
        showSettings,
        setShowSettings,
        activeSetting,
        onSectionChange: setActiveSetting,
        setTheme,
      }}
      onNavigateUserProfile={(member) => {
        if (member?.username) {
          navigate(`/public-user-profile/${member.username}`);
        }
      }}
    />
  );
};

export default TeamProfileLight;