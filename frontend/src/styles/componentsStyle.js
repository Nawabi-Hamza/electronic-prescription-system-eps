
export const background = {
    primary: "bg-sky-500"
}

export const tableStyles = {
  wrapper: "overflow-x-auto w-auto max-w-full bg-white shadow rounded-lg",
  table: "min-w-max w-full divide-y divide-gray-200",
  thead: "bg-sky-600",
  th: "px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap",
  tbody: "bg-white divide-y divide-gray-200",
  bodyRow: "hover:bg-gray-100 transition-colors duration-300 ease-in-out",
  td: "px-3 py-2 whitespace-nowrap text-sm text-gray-700",
  primaryBtn: "text-sky-400 cursor-pointer",
  dangerBtn: "text-red-400 cursor-pointer",
  prevBtn: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer",
  nextBtn: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer",
  pagination: "flex justify-between items-center mt-4 text-sm text-gray-700",
  emptyRecord: "text-center py-4 text-gray-500",
};


export const btnStyle = {
    // filled:"px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 cursor-pointer text-nowrap",
    filled:"px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 cursor-pointer text-nowrap",
    filledSm:"px-2 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 cursor-pointer text-nowrap",
    success:"px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 cursor-pointer text-nowrap",
    white:"px-4 py-2 bg-white text-black rounded hover:bg-gray-100 cursor-pointer text-nowrap",
    outlined: "px-4 py-2 border-1 border-sky-600 text-sky-700 rounded hover:bg-sky-700 hover:text-white transition-all duration-300 cursor-pointer",
    secondary: "px-4 cursor-pointer py-2 bg-gray-300 rounded hover:bg-gray-400",
    danger:"px-4 cursor-pointer py-2 bg-red-300 rounded hover:bg-red-400",
    dangerSm:"px-2 py-1 text-sm bg-red-300 cursor-pointer rounded hover:bg-red-400",
    backBtn: `text-red-400 cursor-pointer cursor-pointer font-bold`,
    disabled:"px-4 py-2 bg-sky-600 text-white opacity-[0.4] rounded cursor-wait text-nowrap",
}

export const labelStyle = {
    simple: "mb-1 text-gray-500 font-medium",
    primary: `
        block mb-2 text-sm font-medium text-gray-700
        transition-all duration-200 ease-in-out
        group-hover:text-blue-600 text-nowrap
    `,
}

export const inputStyle = {
    simple: "border-1 border-sky-700 focus:border-sky-700 w-full p-2 px-4 py-2 rounded",
    primary: `w-full p-2 px-4 rounded-md
            border-1 border-gray-300 
            focus:outline-none focus:border-0 focus:border-b-2 focus:ring-0 focus:border-b-sky-500 
            transition-all duration-200
            placeholder-gray-400
            text-gray-700
            bg-white
            `,
    fieldError: "text-red-500 text-sm mt-1",
    searchIcon: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5"
}

export const dropdownStyle = {
    base: `
        w-full p-2 px-4 pr-10
        rounded-md border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        text-gray-700
        bg-white hover:border-sky-400
        appearance-none
        cursor-pointer
        capitalize
        `,
    withIcon: `
        relative
        after:w-5 after:h-5
        after:bg-no-repeat after:bg-center
        after:pointer-events-none
        after:absolute after:right-3 after:top-1/2 after:-translate-y-1/2
        after:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjdCQjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==")]
    `,
    disabled: `
        opacity-70 cursor-not-allowed bg-gray-100
        hover:border-gray-300 hover:shadow-sm
    `,
    error: `
        border-red-400 focus:ring-red-300
        hover:border-red-500
    `,
}

export const gridStyle = {
    item2atRow: 'grid grid-cols-1 grid-cols-2  gap-3 overflow-y-auto  py-4',
    item3atRow: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto px-2 py-4',
    item4atRow: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[70vh] overflow-y-auto px-2 py-1',
    item3atRowNoScroll: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-4',
    item4atRowNoScroll: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-4',
    overFlowY: 'overflow-y-auto max-h-[90%]'
}

export const divStyle = {
    betweenResponsiveReverse: "flex flex-col-reverse sm:flex-row justify-between gap-2"
}

export const flexStyle = {
    between: "flex items-center justify-between w-full",
    start: "flex items-center justify-start w-full",
    around: "flex items-center justify-around w-full",
    end: "flex items-center justify-end w-full",
    center: "flex items-center justify-center w-full",
}

export const cardStyle = {
    cardContainer: "bg-white rounded-md shadow p-4 lg:p-6 flex flex-col items-start cursor-pointer hover:shadow-lg transition"
}

export const title = {
    h1: "text-2xl font-bold mb-4"
}


export const badge = {
    success: "text-xs text-nowrap text-green-800 bg-green-100 py-2 px-3 rounded-md",
    successSm: "text-xs text-nowrap text-green-800 bg-green-100 py-1 shadow-sm px-2 rounded-md",
    primarySm: "text-xs text-nowrap text-sky-800 bg-sky-100 py-1 shadow-sm px-2 rounded-md",
    warningSm: "text-xs text-nowrap text-amber-800 bg-amber-100 py-1 shadow-sm px-2 rounded-md",
    dangerSm: "text-xs text-nowrap text-red-800 bg-red-100 py-1 shadow-sm px-2 rounded-md",
    warning: "text-xs text-nowrap text-amber-800 bg-amber-100 py-2 px-3 rounded-md",
    warningLg: "text text-nowrap text-amber-800 bg-amber-100 py-2 px-3 rounded-md"
} 

export const banner = {
    back: " z-10 bg-white max-w-[120px] border border-red-300 font-bold shadow-md shadow-red-100  mb-4 p-3 text-md sticky -top-4 rounded-r-full text-red-600 flex items-center gap-2"
}

export const stepper = {
    title: 'text-lg font-semibold mb-4 text-sky-600 p-2 rounded-md bg-sky-100',
    steps: 'w-8 h-8 fancy-border-radius shadow-sm flex items-center justify-center text-white font-bold ',
    passed: 'bg-green-300',
    current: 'bg-sky-600',
    remain: 'bg-gray-300', 
}

export const icon = {
    primary: "text-sky-500 cursor-pointer hover:text-sky-300 transition",
    danger: "text-red-500 cursor-pointer hover:text-red-300 transition",
}