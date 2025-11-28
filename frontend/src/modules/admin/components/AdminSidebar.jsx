import React from 'react'
import Sidebar from "../../../componenets/Sidebar";
import { LayoutDashboard, UsersRound, User, ClipboardClock, ClipboardCheck, BookCopy, HatGlasses, Info, Grid3X3, BellElectric, BrainCog, SquareCheck, ListCheck, NotepadText, Grid2X2Check, UserRound, Magnet, Settings, Coins } from "lucide-react";

const sidebarLinks = [
  {
    type: "link",
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    type: "dropdown",
    label: "Management",
    icon: Settings,
    children: [
      { label: "Students", path: "/admin/students", icon: UserRound },
      { label: "Fees", path: "/admin/fees", icon: Coins },
      { label: "Classes", path: "/admin/classes", icon: ClipboardCheck },
      { label: "Class Supervisor", path: "/admin/class-supervisor", icon: BellElectric },
      { label: "3 Parcha", path: "/admin/student-leave", icon: NotepadText },
    ],
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
    type: "dropdown",
    label: "Attendance",
    icon: ListCheck,
    children: [
      { label: "Students", path: "/admin/student-attendance", icon: ClipboardCheck },
      { label: "Teachers", path: "/admin/teacher-attendance", icon: SquareCheck },
    ],
  },
  {
    type: "dropdown",
    label: "Reports",
    icon: ClipboardClock,
    children: [
      { label: "Student Attendance", path: "/admin/attendance-report", icon: BookCopy },
      { label: "Unpaid Fees", path: "/admin/student-unpaid-fees", icon: UserRound },
      { label: "Students", path: "/admin/student-status-report", icon: UserRound },
    ],
  },
  {
    type: "link",
    path: "/admin/profile",
    label: "Profile",
    icon: User,
  },
  {
    type: "link",
    path: "/admin/user-manual", 
    label: "User Manual",
    icon: Info,
  },
  {
    type: "link",
    path: "/admin/ai-mode",
    label: "AI Mode",
    icon: BrainCog,
  },
];


function AdminSidebar() {
  return (
    <Sidebar sidebarTitle="Admin Panel" sidebarItems={sidebarLinks} />
  )
}

export default AdminSidebar
