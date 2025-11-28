import { motion } from  "framer-motion"; 
import { Loader2 } from "lucide-react";

export default function ProgressContainer({ progress, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-8 rounded-md shadow-2xl w-[350px] text-center space-y-6"
      >
        {/* Animated Spinner */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="w-14 h-14 text-sky-600" />
        </motion.div>

        {/* Progress text */}
        <div className="text-xl font-semibold text-gray-800">
          {progress < 100 ? `Uploading ${progress}%` : "✅ Upload Complete"}
        </div>

        {/* Modern Progress Bar */}
        <div className="relative w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {progress}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
