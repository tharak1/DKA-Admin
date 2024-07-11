import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { formatDate } from '../../../hooks/DateFormater';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { databaseStorage, db } from '../../../firebase_config';
import { v4 as uuidv4 } from 'uuid';
import { CharityUploadModel } from '../../../Models/CharityModel';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

interface ModalProps {
  type: string;
  charityData?: CharityUploadModel;
}

const CharityUploadModal: React.FC<ModalProps> = ({ type, charityData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [charity, setCharity] = useState<{ description: string; image: File | null }>({ description: '', image: null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCharity((prev) => ({ ...prev, image: file }));
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const uploadImage = async (): Promise<string> => {
    if (!charity.image) return '';
    const imageRef = ref(databaseStorage, `charities/${uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, charity.image);
    return await getDownloadURL(snapshot.ref);
  };

  const saveCharity = async () => {
    setLoading(true);
    const imageUrl = await uploadImage();
    const obj = {
      description: charity.description,
      date: formatDate(new Date()),
      image: imageUrl,
    };
    await addDoc(collection(db,"charityUpload"),obj);
    setLoading(false);
    setCharity({ description: '', image: null });
    setImagePreview(null);
    closeModal();
  };

  const updateCharity = async () => {
    setLoading(true);
    const obj = {
      description: charity.description,
      date: formatDate(new Date()),
      image: charityData?.image || '',
      id: charityData?.id,
    };
    await setDoc(doc(db,"charityUpload",obj.id!),obj);
    setLoading(false);
    setCharity({ description: '', image: null });
    setImagePreview(null);
    closeModal();
  };

  return (
    <>
      <div className="text-center rounded-lg text-white font-bold">
        <button
          type="button"
          onClick={openModal}
          className="px-3 bg-violet-600 py-2 text-center rounded-lg text-white font-bold p-2"
        >
          {type === 'create' ? "Add Charity" : "Update Charity"}
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl p-2 text-left align-middle shadow-xl transition-all bg-gray-50">
                  <section>
                    <div className="flex flex-col items-center justify-center py-8 mx-auto lg:py-0">
                      <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                          <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                              <label htmlFor="charityDescription" className="block mb-2 text-sm font-medium text-gray-900">
                                Charity Description
                              </label>
                              <textarea
                                value={charity.description}
                                onChange={(e) => setCharity((prev) => ({ ...prev, description: e.target.value }))}
                                name="charityDescription"
                                id="charityDescription"
                                className="border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="charityImage" className="block mb-2 text-sm font-medium text-gray-900">
                                Charity Image
                              </label>
                              <input
                                onChange={handleImageChange}
                                type="file"
                                name="charityImage"
                                id="charityImage"
                                accept="image/*"
                                className="border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                required
                              />
                            </div>
                            {type === 'create' && imagePreview && (
                              <div>
                                <img src={imagePreview} alt="Charity Preview" className="object-contain w-full h-48 mt-4 rounded-lg" />
                              </div>
                            )}
                            {type === 'update' && charityData?.image && (
                              <div>
                                <img src={charityData.image} alt="Charity Preview" className="object-contain w-full h-48 mt-4 rounded-lg" />
                              </div>
                            )}
                          </form>
                          <button
                            onClick={() => {
                              type === 'create' ? saveCharity() : updateCharity();
                            }}
                            type="button"
                            className={`focus:outline-none w-full text-white bg-violet-600 hover:bg-violet-800 outline-0 font-medium rounded-lg text-sm px-5 py-2.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                          >
                            {type === 'create' ? (loading ? "Loading..." : "Save Charity") : (loading ? "Loading..." : "Update Charity")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default CharityUploadModal;
