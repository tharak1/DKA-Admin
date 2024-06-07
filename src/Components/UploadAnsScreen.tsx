import React, { useState } from 'react'
import { ImagePreview } from '../Models/ExamModel';
import uploadImage from '../hooks/UploadImage';

const UploadAnsScreen:React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleRemoveImage = (index: number) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
      };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newPreviews = files.map(file => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          return new Promise<ImagePreview>((resolve) => {
            reader.onload = () => resolve({ file, preview: reader.result as string });
          });
        });
      
        Promise.all(newPreviews).then(newPreviews => {
          setSelectedFiles(prevFiles => [...prevFiles, ...files]);
          // setQuestionPaper(prevqp =>({...prevqp,questionsImages:[...prevqp.questionsImages! ,...newPreviews ]}))
          setImagePreviews(prevFiles => [...prevFiles, ...newPreviews]);
        });
      };

    const handleUploadImages = async () => {
        setUploading(true);
      
        const updatedImages = await Promise.all(imagePreviews.map(async (img: ImagePreview, index) => {
          const newPreview = await uploadImage(img.file!, `qp${index}`, 'questionpaper');
          return { ...img, preview: newPreview }; // Create a new object with the updated preview
        }));

        console.log(updatedImages);
        
        setImagePreviews([]);
        setSelectedFiles([]);
        setUploading(false);
      };

  return (
    <div className='w-full h-full flex justify-center items-center'>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleFileChange}
      className="hidden"
      id="imageInput"
    />
    <label htmlFor="imageInput" className="bg-sky-600 px-4 py-1 rounded-md ml-4 mt-2 cursor-pointer">
      Select Images
    </label>
    <button
      className="bg-sky-600 px-4 py-1 rounded-md ml-4 mt-2"
      onClick={handleUploadImages}
      disabled={ selectedFiles.length === 0 }
    >
      { uploading ? "Uploading..." : "Upload" }
    </button>


{    imagePreviews.map((image, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <img src={image.preview} alt={`preview-${index}`} className="w-40 h-40 object-cover mr-2 rounded-md" />
                      <button
                        className={`bg-red-500 px-2 py-1 rounded-md text-white`}
                        onClick={() => handleRemoveImage(index)}
                         
                      >
                        Remove
                      </button>
                    </div>
                  ))}
  </div>
  )
}

export default UploadAnsScreen
