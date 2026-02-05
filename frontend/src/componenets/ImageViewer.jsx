import React, { useState, useEffect } from 'react';
import { Eye, User } from 'lucide-react';
import { apiURL } from '../api/axios';
import Modal from './ModalContainer';
import { cacheImageByPath, getCachedImageByPath } from '../utils/offlineDB';

const ImageViewer = ({
  imagePath,
  altText = "Profile",
  className = "w-15 h-15 rounded-full object-cover",
  showPreview = true,
  onError,
  onLoad,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let objectUrl;

    if (!imagePath) {
      setImageUrl('/profile-icon.png');
      setIsLoading(false);
      setError('');
      return;
    }

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError('');

        // 1) Try IndexedDB first (fast & offline)
        const cachedBlob = await getCachedImageByPath(imagePath);
        if (cachedBlob) {
          objectUrl = URL.createObjectURL(cachedBlob);
          setImageUrl(objectUrl);
          return;
        }

        // 2) Fetch online then cache
        const blob = await cacheImageByPath(imagePath, apiURL);
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
        onLoad && onLoad();
      } catch (err) {
        console.error("Image load failed:", err);
        setError("Failed to load image");
        setImageUrl('/profile-icon.png');
        onError && onError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imagePath]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-full ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-full ${className}`}>
        <User size={20} className="text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <div className={`relative group overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={altText}
          className={className}
          loading="lazy"
        />
        {showPreview && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 cursor-pointer bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Eye size={16} className="text-white" />
          </button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} containerStyle="sm" title={altText}>
        <div className="flex justify-center items-center">
          <img src={imageUrl} alt={altText} className="max-h-[70vh] object-contain rounded-md" />
        </div>
      </Modal>
    </>
  );
};

export default ImageViewer;





// import React, { useState, useEffect } from 'react';
// import { Eye, User } from 'lucide-react';
// import { apiURL } from '../api/axios';
// import Modal from './ModalContainer';

// // Memory cache for images   
// const imageCache = new Map();

// const ImageViewer = ({ 
//   imagePath, 
//   altText = "Profile", 
//   className = "w-15 h-15 rounded-full object-cover",
//   showPreview = true,
//   onError,
//   onLoad 
// }) => {
//   const [imageUrl, setImageUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (!imagePath) {
//       setImageUrl('/profile-icon.png');
//       setIsLoading(false);
//       setError('');
//     } else {
//       loadImage(imagePath);
//     }
//   }, [imagePath]);

//   const loadImage = async (ip) => {
//     try {
//       setIsLoading(true);
//       setError('');

//       // Check cache first
//       if (imageCache.has(ip)) {
//         setImageUrl(imageCache.get(ip));
//         setIsLoading(false);
//         return;
//       }

//       const isPublicImage = ip.includes('/students/');
//       if (isPublicImage) {
//         const url = `${apiURL}${ip}`;
//         setImageUrl(url);
//         imageCache.set(ip, url); // cache it
//         setIsLoading(false);
//         return;
//       }

//       // Fetch protected image
//       const response = await fetch(`${apiURL}${ip}`, {
//         credentials: 'include',
//         headers: { 'Cache-Control': 'no-cache' },
//       });

//       if (!response.ok) {
//         if (response.status === 403) setError('Access denied');
//         else if (response.status === 404) setError('Image not found');
//         else setError('Failed to load image');
//         setIsLoading(false);
//         return;
//       }

//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);
//       imageCache.set(ip, url); // cache the loaded blob
//       setImageUrl(url);
//       onLoad && onLoad();
//     } catch (err) {
//       console.error('Error loading image:', err);
//       setError('Failed to load image');
//       onError && onError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleImageError = (e) => {
//     setError('Failed to load image');
//     e.target.src = '/profile-icon.png';
//     onError && onError(new Error('Image load failed'));
//   };

//   const handlePreview = () => {
//     if (imageUrl) setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   if (isLoading) {
//     return (
//       <div className={`flex items-center justify-center bg-gray-100 rounded-full ${className}`}>
//         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`flex items-center justify-center bg-gray-100 rounded-full ${className}`}>
//         <User size={20} className="text-gray-400" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className={`relative group overflow-hidden ${className}`}>
//         <img
//           src={imageUrl}
//           alt={altText}
//           className={className}
//           onError={handleImageError}
//           crossOrigin="use-credentials"
//           loading="lazy"

//         />
//         {showPreview && (
//           <button
//             onClick={handlePreview}
//             className="absolute inset-0 cursor-pointer bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
//             title="Preview image"
//           >
//             <Eye size={16} className="text-white opacity-0 group-hover:opacity-100" />
//           </button>
//         )}
//       </div>

//       {/* Modal Preview */}
//       <Modal isOpen={isModalOpen} onClose={handleCloseModal} containerStyle="sm" title={altText}>
//         <div className="flex justify-center items-center">
//           <img
//             crossOrigin="use-credentials"
//             loading="lazy"
//             src={imageUrl}
//             alt={altText}
//             className="max-h-[70vh] object-contain rounded-md"
//           />
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default ImageViewer;
