import React from 'react'
import Sidebar from "../../../componenets/Sidebar";
import { LayoutDashboard, BookCopy, HatGlasses, Grid3X3, BrainCog, Grid2X2Check, UserRound, SquareActivity, Activity } from "lucide-react";

const sidebarLinks = [
  {
    type: "link",
    path: "/owner/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    type: "link",
    path: "/owner/doctors",
    label: "Doctors",
    icon: SquareActivity,
  },
  {
    type: "link",
    path: "/owner/usages",
    label: "Usages",
    icon: Activity,
  },
  {
    type: "dropdown",
    label: "Timetables",
    icon: Grid2X2Check,
    children: [
      { label: "Subjects", path: "/admin/subjects", icon: BookCopy },
      { label: "Teacher/Subject", path: "/admin/teacher-class-subject", icon: HatGlasses },
      { label: "Classes", path: "/admin/timetable", icon: Grid3X3 },
      { label: "Teachers", path: "/admin/teacher-timetable", icon: Grid3X3 },
    ],
  },
  {
    type: "link",
    path: "/owner/profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    type: "link",
    path: "/owner/ai-mode",
    label: "AI Mode",
    icon: BrainCog,
  },
];


function OwnerSidebar() {
  return (
    <Sidebar sidebarTitle="Owner" sidebarItems={sidebarLinks} />
  )
}

export default OwnerSidebar
