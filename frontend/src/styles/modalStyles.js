// src/styles/modalStyles.js
export const modalStyles = {
  overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-50 ",
  container: "bg-white p-6 rounded-lg w-[96%]  shadow-lg animate__animated animate__fadeInDown animate__delay-.5s",
  containerXSm: "bg-white rounded-lg shadow-xl  max-w-xl w-full p-6 relative cursor-default animate__animated animate__fadeInDown animate__delay-.5s",
  containerSm: "bg-white rounded-lg shadow-xl  max-w-4xl w-full p-6 relative cursor-default animate__animated animate__fadeInDown animate__delay-.5s",
  containerMd: "bg-white rounded-lg shadow-xl  max-w-6xl w-full p-6 relative cursor-default animate__animated animate__fadeInDown animate__delay-.5s",
  header:"flex justify-between items-center  mb-4 p-3 shadow rounded",
  title: "text-xl text-sky-800 font-bold",
  input: "w-full border p-2 rounded",
  buttonGroup: "flex justify-end gap-2",
  cancelBtn: "px-4 py-2 bg-gray-300 rounded hover:bg-gray-400",
  saveBtn: "px-4 py-2 bg-sky-600 cursor-pointer text-white rounded hover:bg-sky-700",
  overFlowY: "overflow-y-auto max-h-[90%]",
  overFlowX: "overflow-x-auto",
  closeBtnIcon: "w-5 h-5 text-white cursor-pointer"
};

export const showModalStyle = {
  headerContainer: "flex flex-col md:flex-row md:items-center  md:gap-8",
  imageContainer: "flex-shrink-0 w-36 max-h-36 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-semibold select-none mb-6 md:mb-0",
  image: "w-100 h-auto object-cover",
  headerContent: " md:grid grid-cols-3  w-full gap-5 justify-between text-gray-700 text-sm",
}