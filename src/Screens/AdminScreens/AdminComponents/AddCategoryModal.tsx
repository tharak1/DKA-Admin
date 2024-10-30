import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CreateCategory, editCategory } from '../../../redux/CategorySlice';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { formatDate } from '../../../hooks/DateFormater';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { databaseStorage } from '../../../firebase_config';
import { v4 as uuidv4 } from 'uuid';
import CategoryModel from '../../../Models/CategoryModel';
 
interface ModalProps{
    type:string;
    categoryData?:CategoryModel
}

interface CatModal{
    name: string; 
    image: string | null
}

const Modal:React.FC<ModalProps> = ({type,categoryData})=> {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    // const [category, setCategory] = useState<{ name: string; image: string | null }>({ name: categoryData ? categoryData.name:'' , image:categoryData ? categoryData.image : null });
    const [category, setCategory] = useState<CatModal>({
        name:"",
        image:""
    })
    const [imagePreview, setImagePreview] = useState<File | null>(null);
    const [loading,setLoading] = useState<boolean>(false);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(file);
            };
            reader.readAsDataURL(file);
            setImagePreview(file);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const uploadImage = async (): Promise<string> => {
        if (!imagePreview) return '';
        const imageRef = ref(databaseStorage, `categories/${category.name + uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, imagePreview!);
        return await getDownloadURL(snapshot.ref);
    };

    const saveCategory = async () => {
        setLoading(true);
        const imageUrl = await uploadImage();
        const obj = {
            name: category.name,
            date: formatDate(new Date()),
            image: imageUrl,
        };
        await dispatch(CreateCategory(obj));
        setLoading(false);
        setCategory({name: '', image: null });
        setImagePreview(null);

        closeModal();
    };

    const updateCategory = async() =>{
        setLoading(true);
        if(imagePreview){
            const baseUrl = "https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/";
            const filePath = decodeURIComponent(category.image!.split(baseUrl)[1].split("?")[0]);
            const desertRef = ref(databaseStorage, filePath);
            await deleteObject(desertRef);

            const imageUrl = await uploadImage();
            const obj = {
                name: category.name,
                date: formatDate(new Date()),
                image: imageUrl,
                id:categoryData?.id,
                prevCatName:categoryData?.name,
            }; 



            await dispatch(editCategory(obj));
        }
        else{
            const obj = {
                name: category.name,
                date: formatDate(new Date()),
                image: categoryData?.image!,
                id:categoryData?.id,
                prevCatName:categoryData?.name,
            };
            await dispatch(editCategory(obj));
        }
        setLoading(false);
        setCategory({name: category.name, image: null })
        setImagePreview(null);
        closeModal();
    }

    return (
        <>
            <div className="text-center rounded-lg text-white font-bold">
                <button
                    type="button"
                    onClick={openModal}
                    className="px-3 bg-violet-600 py-2 text-center rounded-lg text-white font-bold p-2"
                >
                    {type==='create'? "Add Category":"Update"}

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
                                                            <label htmlFor="categoryName" className="block mb-2 text-sm font-medium text-gray-900">Category Name</label>
                                                            <input
                                                                value={category.name}
                                                                onChange={(e) => setCategory((prev) => ({ ...prev, name: e.target.value }))}
                                                                type="text"
                                                                name="categoryName"
                                                                id="categoryName"
                                                                className="border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="categoryImage" className="block mb-2 text-sm font-medium text-gray-900">Category Image</label>
                                                            <input
                                                                onChange={handleImageChange}
                                                                type="file"
                                                                name="categoryImage"
                                                                id="categoryImage"
                                                                accept="image/*"
                                                                className="border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                                                required
                                                            />
                                                        </div>
                                                        {

                                                        type==='create'? 

                                                        imagePreview && (
                                                            <div>
                                                                <img src={URL.createObjectURL(imagePreview)} alt="Category Preview" className="object-contain w-full h-48 mt-4 rounded-lg" />
                                                            </div>
                                                        ):
                                                        <div>
                                                        <img src={imagePreview ?URL.createObjectURL(imagePreview) :categoryData?.image!} alt="Category Preview" className="object-contain w-full h-48 mt-4 rounded-lg" />
                                                    </div>
                                                    
                                                        }
                                                    </form>
                                                    <button
                                                        onClick={()=>{
                                                            type==='create'?saveCategory():updateCategory()
                                                        }}
                                                        type="button"
                                                        className={`focus:outline-none w-full text-white bg-violet-600 hover:bg-violet-800 outline-0 font-medium rounded-lg text-sm px-5 py-2.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={loading}
                                                    >
                                                        {type==='create'?loading?"Loading..." : "Save Category":loading?"Loading..." : "Update Category"}
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

export default Modal;
