import { deleteObject, ref } from "firebase/storage";
import { databaseStorage } from "../firebase_config";

export const deleteImage = async(imgString:string) => {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/";
    const filePath = decodeURIComponent(imgString.split(baseUrl)[1].split("?")[0]);
    const desertRef = ref(databaseStorage, filePath);
    console.log(filePath);
    
    await deleteObject(desertRef);
  }