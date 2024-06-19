import React, { useState } from 'react'
import { CourseModel } from '../../../Models/CourceModel'
import { MyCourseModal, UserModel } from '../../../Models/UserModel';
import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase_config';

interface AddCashCourseCardProps{
    course:CourseModel;
    user:UserModel;
}

const AddCashCourseCard:React.FC<AddCashCourseCardProps> = ({ course,user }) => {
    const [selectedSession, setSelectedSession] = useState<string>("");
    const [selectedClassType, setSelectedClassType] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);
    const [error,setError] = useState<string>("");

    const [updatedUser,setUpdatedUser] = useState({ ...user });

    const handleJoinCourse = async(course: CourseModel) => {
        setLoading(true);
        const orderObj = {
            paymentId: "cash",
            studentId: user.id,
            studentName: user.name,
            courseId: course.id,
            courseName: course.courseName,
            courseImageUrl: course.image,
            courseAmount: course.price,
            courseType: selectedClassType,
            courseSession: selectedSession,
            branch: "hyd",
            parentName: user.fatherName,
            parentPhoneNo: user.contactNo,
            email: user.email,
            date: new Date().toISOString().split('T')[0], // Assuming formatDate function returns YYYY-MM-DD
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Assuming oneMonthAgo is actually one month from now
            status: "Cash"
        };

        if(selectedClassType !=='' && selectedClassType !==''){

            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
            
            await addDoc(collection(db, 'payments',), orderObj);
            if (updatedUser.registeredCourses?.some(joinedCourse => joinedCourse.courseId === course.id)) {
                setUpdatedUser(
{                    ...user,
                    registeredCourses: user.registeredCourses.map(joinedCourse => 
                        joinedCourse.courseId === course.id 
                        ? { ...joinedCourse, endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] }
                        : joinedCourse
                    )}
                );
                await setDoc(doc(db,"students",user.id),{...updatedUser});

                console.log('Updated Registered Course:', updatedUser);
                setLoading(false);
            } else {
                const newCourse: MyCourseModal = {
                    courseId: course.id!,
                    courseName: course.courseName!,
                    boughtDate: new Date().toISOString().split('T')[0],
                    paymentId: "cash",
                    courseType: selectedClassType as "offline" | "online",
                    courseSession: selectedSession,
                    branch: "hyd",
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                    status: "Success"
                };
                setUpdatedUser( {
                    ...user,
                    registeredCourses: [...user.registeredCourses, newCourse]
                });
                // console.log('New Order:', newCourse);
                // await setDoc(doc(db,"students",user.id),{...updatedUser});

                await updateDoc(doc(db,'students',user.id),{registeredCourses:arrayUnion(newCourse)});
                const docSnap = await getDoc(doc(db,'performances',course.id!));
                const performance = docSnap.data()!.performanceTemplate;
                await updateDoc(doc(db,'performances',course.id!),{students:arrayUnion({studentId:user.id,studentName:user.name,...performance})})
                await updateDoc(doc(db,"regStuByCourse",course.id!),{students:arrayUnion(user.id)})

                setLoading(false);
            }
        }else{
            setError("session or type not selected");
            setLoading(false);

        }
    };
  return (
    <div className='w-full rounded-md bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-between p-3 my-2 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500' key={course.id}>
        <div className='flex flex-row justify-between items-center w-full'>

            <div className='flex flex-row justify-start items-center'>
            <img className="w-12 h-12 rounded-full" src={course.image} alt="group avatar" />
            <h2 className='ml-2 dark:text-white'>{course.courseName}</h2>
            </div>

            <h2>Amount : {course.price}</h2>
        </div>

        <div className='w-full flex flex-col justify-center items-start '>
            <label htmlFor="sessions" className='text-lg mt-2'>Select sessions :</label>
            {course.sessions!.map((obj) => (
                <div key={obj} className="flex items-center">
                    <input 
                        type="radio" 
                        name={`sessions-${course.id}`} 
                        id={`session-${obj}`} 
                        value={obj} 
                        checked={selectedSession === obj} 
                        onChange={() => setSelectedSession(obj)} 
                        className="mr-2"
                    />
                    <label htmlFor={`session-${obj}`} className="dark:text-white">{obj}</label>
                </div>
            ))}
        </div>
        <div className='w-full flex flex-col justify-center items-start'>

        <label htmlFor="sessions" className='text-lg mt-2'>Select ClassType :</label>
        <div className=' '>
            <input 
                type="radio" 
                name={`classtype-${course.id}`} 
                id={`classtype-online-${course.id}`} 
                value="online" 
                checked={selectedClassType === "online"} 
                onChange={() => setSelectedClassType("online")} 
                className="mr-2"
            />
            <label htmlFor={`classtype-online-${course.id}`} className="dark:text-white">Online</label>
        </div>
        <div>
            <input 
                type="radio" 
                name={`classtype-${course.id}`} 
                id={`classtype-offline-${course.id}`} 
                value="offline" 
                checked={selectedClassType === "offline"} 
                onChange={() => setSelectedClassType("offline")} 
                className="mr-2"
            />
            <label htmlFor={`classtype-offline-${course.id}`} className="dark:text-white">Offline</label>
        </div>
        </div>
            <div className='w-full text-red'>
                 {error}
            </div>
        <div>
            {updatedUser.registeredCourses?.some(joinedCourse => joinedCourse.courseId === course.id) ? (
                <button className='py-1 px-4 bg-gray-500 rounded-md cursor-not-allowed' disabled>Renew</button>
            ) : (
                <button className='py-1 px-4 bg-green-500 hover:bg-green-400 rounded-md' onClick={() => handleJoinCourse(course)}>{loading?(
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                ):("Join")}</button>
            )}
        </div>
    </div>
  )
}

export default AddCashCourseCard
