import React, { useState } from "react";
import Review from "../../dashboard/components/Additional/Review";
import ProfileCompletion from "../../dashboard/components/Additional/ProfileCompletion";
import SuggestionBox from "../../dashboard/components/Additional/SuggestionBox";
import AttachImage from "../../dashboard/components/Additional/AttachImage";
import CustomerSupport from "../../dashboard/components/Additional/CustomerSupport";
import FriendSuggestion from "../../dashboard/components/Additional/FriendSuggestion";
import Cookies from "../../dashboard/components/Additional/Cookies";
import ChatSupport from "../../dashboard/components/Additional/ChatSupport";

import UserNavbar from "../../../components/layout/UserNavbar";


export default function Components({ theme, setTheme }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col gap-6 p-10">
            <SuggestionBox theme={theme} />
            <ProfileCompletion theme={theme} />
            <AttachImage theme={theme} />
            <CustomerSupport theme={theme} />
            <FriendSuggestion theme={theme} />
            <Review theme={theme} />

            <Cookies theme={theme} />
            <ChatSupport theme={theme} />
        </div>
    );
}
