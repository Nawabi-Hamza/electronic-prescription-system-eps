import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, CheckCircle, File, FileTextIcon } from 'lucide-react';

const ImageUpload = ({
  onImageSelect,
  maxImages = 6,
  // columns = 3,
  // rows = 2,
  // aspectRatio = "1/1",
  // previewHeight = "h-24",
  accept = "image/*",
  label = "Upload Images",
  description = "Click to upload or drag and drop images",
  showStatus = true,
  className = ""
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // const totalSlots = rows * columns;

  const handleFileSelect = (files) => {
    const imageFiles = Array.from(files).filter(file => 
      accept === "image/*" ? file.type.startsWith('image/') : true
    );
    
    if (imageFiles.length > 0) {
      const newImages = imageFiles.slice(0, maxImages - selectedImages.length);
      const updatedImages = [...selectedImages, ...newImages];
      setSelectedImages(updatedImages);
      onImageSelect?.(updatedImages);
    }
  };

  const handleInputChange = (event) => {
    handleFileSelect(event.target.files);
    event.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    onImageSelect?.(newImages);
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700">
          {label}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Bottom preview container */}
      {selectedImages.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <div className="flex overflow-x-auto space-x-2 py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative flex-shrink-0">
                {/* {console.log(image.type)} */}
                { image.type === "application/pdf" ?
                  <div className=' flex items-center '>
                    <FileTextIcon size={40} />
                    <span className='text-[10px] line-clamp-none'>{image.name}</span>
                  </div>:
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="h-[50px] w-auto object-contain rounded border border-gray-200"
                  />
                }
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status info */}
      {showStatus && selectedImages.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {selectedImages.length} of {maxImages} {accept.includes("image") ? "image": accept.split('/')[1]} selected 
        </p>
      )}
    </div>
  );
};

export default ImageUpload;