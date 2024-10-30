import { useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Adjust the import path based on your project structure
import { db } from '../firebase_config';

interface UserModel {
    registeredCourses: Array<{
        courseId: string;
        endDate: string;
    }>;
}


const useAddExtraDays = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addExtraDays = useCallback(async (studentId: string, courseId: string) => {
        setLoading(true);
        setError(null);

        try {
            const stuDoc = await getDoc(doc(db, 'students', studentId));
            if (!stuDoc.exists()) {
                throw new Error('Student not found');
            }

            const student = stuDoc.data() as UserModel;
            const course = student.registeredCourses.find(course => course.courseId === courseId);

            if (!course) {
                throw new Error('Course not found');
            }

            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            course.endDate = currentDate.toISOString().split('T')[0];

            await updateDoc(doc(db, 'students', studentId), {
                registeredCourses: student.registeredCourses
            });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { addExtraDays, loading, error };
};

export default useAddExtraDays;
