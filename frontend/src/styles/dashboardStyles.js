// src/styles/dashboardStyles.js
export const mainSectionStyles = {
  container: "p-4 md:p-6 w-full overflow-auto  animate__fadeIn animate__animated animate__delay-.5s",
  header: "text-2xl font-bold mb-6",
  card: "bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300",
  cardTitle: "text-lg font-semibold mb-2",
  cardValue: "text-3xl font-bold text-sky-600",
  grid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
  section: "bg-white p-4 rounded-lg shadow mb-6",
  sectionTitle: "text-xl font-semibold mb-4 border-b pb-2",
  tableWrapper: "overflow-x-auto",
  table: "min-w-full divide-y divide-gray-200",
  tableHeader: "bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tableCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
};

export const topbarStyles = {
  wrapper: "bg-white shadow p-4 flex justify-between items-center rounded-b",
  title: "text-xl font-bold flex items-center gap-3 text-sky-600 ",
  welcome: "text-gray-600 flex items-center gap-2",
  menuButton: "p-2 rounded hover:bg-gray-200 focus:outline-none",
};

// styles/dashboardStyles.js
export const sidebarStyles = {
  link: (collapsed, isActive = false) =>
    `flex items-center gap-1 p-2 md:p-3 rounded transition-colors 
     ${isActive ? "bg-gray-200 text-black" : "text-gray-700 hover:bg-gray-100"}
     ${collapsed ? "justify-center" : ""}`,
  linkText: "ml-2 text-sm text-nowrap",
  logout: (collapsed) =>
    `flex items-center p-2 md:p-3 rounded-md text-red-600 hover:bg-red-100
     ${collapsed ? "justify-center" : ""}`,
  wrapper: (collapsed) =>
    `h-screen  transition-all duration-300 ${
      collapsed ? "w-20" : "w-74"
    } flex flex-col`,
  header: "flex items-center justify-between p-3 ",
  nav: "flex-1 flex flex-col overflow-y-auto text-nowrap space-y-2 p-3 mb-4 shadow rounded-r bg-white/80 backdrop-blur-md border border-gray-200",

};

export const clockStyle = {
  container: "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-800 flex items-center flex-wrap justify-between text-white p-4 mb-4 rounded-md shadow-md",
  time: "text-4xl font-bold tracking-wide",
  date: "text-sm mt-2 opacity-90",
  shamsiDate: "text-lg font-medium bg-white/20 px-3 py-1 rounded-md shadow",
}