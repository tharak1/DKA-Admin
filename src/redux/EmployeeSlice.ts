import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase_config";
import { EmployeeModel } from "../Models/EmployeeModel";
import { createUserWithEmailAndPassword } from 'firebase/auth';


function generateEmployeeId(): string {
    const prefix = "DKA";
    const randomPart = Math.random().toString(36).substring(2, 5); // Generate a random string of 5 characters
  
    return prefix + randomPart;
  }

interface EmployeeSlice {
  employees: EmployeeModel[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmployeeSlice = {
  employees: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    const docRef = collection(db, "employees");
    const employeesSnap = await getDocs(docRef);

    const employees: EmployeeModel[] = employeesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EmployeeModel[];

    return employees;
  }
);

export const createEmployee = createAsyncThunk(
    'employees/createEmployee',
    async (employeeData: EmployeeModel) => {
      let employeeId = generateEmployeeId();
  
      // Check if the generated employeeId already exists
      while (await doesEmployeeIdExist(employeeId)) {
        employeeId = generateEmployeeId(); // Generate a new ID if it exists
      }
  
      // Add the employee to Firestore with the final unique ID
      const userCredential = await createUserWithEmailAndPassword(auth,employeeData.email, employeeData.password);
      await setDoc(doc(db, "employees",employeeId), {
        ...employeeData,
        id: employeeId,
        uid:userCredential.user.uid
      });
  
      return { id: employeeId, ...employeeData };
    }
  );
  
  // Function to check if an employee ID already exists in Firestore
  async function doesEmployeeIdExist(employeeId: string): Promise<boolean> {
    const docRef = doc(db, 'employees', employeeId);
    const docSnap = await getDoc(docRef);
  
    return docSnap.exists();
  }

// Async thunk to edit an employee
export const editEmployee = createAsyncThunk(
  'employees/editEmployee',
  async (updatedEmployeeData: EmployeeModel) => {
    const employeeId = updatedEmployeeData.id;
    const employeeRef = doc(db, 'employees', employeeId!);
    await setDoc(employeeRef, updatedEmployeeData, { merge: true });

    return updatedEmployeeData;
  }
);

// Async thunk to delete an employee
export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (employeeId: string) => {
    await deleteDoc(doc(db, "employees", employeeId));
    return employeeId;
  }
);

// Create the slice
const EmployeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      })

      .addCase(createEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      })

      .addCase(editEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedEmployee = action.payload;
        state.employees = state.employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      })

      .addCase(deleteEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((employee) => employee.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  }
});

// Selector function to get employees from state
export const GetEmployees = (state:any) => state.employees.employees;

// Export the reducer
export default EmployeeSlice.reducer;
