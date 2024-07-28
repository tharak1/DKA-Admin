import React from 'react'

interface MarksEntryCardProps{
    performance:any;
    index:number;
    studentPerformances:any[];
    setStudentPerformances:(performances: any[]) => void;
}

const MarksEntryCard:React.FC<MarksEntryCardProps> = ({performance,index,studentPerformances,setStudentPerformances}) => {
    const formatLabel = (key: string): string => {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
      };
  return (
    <div key={index} className='bg-slate-200 dark:bg-slate-600 rounded-md p-3 flex flex-col items-start'>
    <h2>Student Name: {performance.studentName}</h2>
    <h2>Student Id: {performance.studentId}</h2>
    <div className='grid grid-cols-4 mb-3 w-full'>

      <h2>Start Date : {performance.startDate}</h2>
      <h2>End Date : {performance.endDate}</h2>
      <h2>Total classes Taken : {performance.TotalClassesTaken}</h2>
      <h2>Total Marks : {performance.totalMarks}</h2>
    </div>
    <div className='grid grid-cols-3 max-sm:grid-cols-2 mb-3'>
      {Object.entries(performance).map(([key, val]) => (
        key !== 'studentName' && key !== 'studentId' && key !== 'startDate' && key !== 'endDate' && key !== 'TotalClassesTaken' && key !== 'TotalClassesAttended' && key !== 'Grade' && key !== 'totalMarks' && key !== 'totalMarksObtained'  && (
          <div className="text-center flex justify-start items-center px-5 my-1" key={key}>
            <p className="text-gray-700 mr-3">{formatLabel(key)}</p>
            <input
              value={val as string}
              onChange={(e) => {
                const newPerformances = [...studentPerformances];
                newPerformances[index] = { ...newPerformances[index], [key]: e.target.value };
                setStudentPerformances(newPerformances);
              }}
              type='text'
              className="text-xl font-bold bg-gray-100 rounded-md border-2 border-gray-400 flex items-center justify-center dark:text-black w-full"
            />
          </div>
        )
      ))}
    </div>

    <div>
    <div className="text-center flex justify-start items-center my-1">
            <p className="text-gray-700 mr-3">Total Marks :</p>
            <input
              value={performance.totalMarksObtained}
              onChange={(e) => {
                const newPerformances = [...studentPerformances];
                newPerformances[index] = { ...newPerformances[index], totalMarksObtained : e.target.value };
                setStudentPerformances(newPerformances);
              }}
              type='text'
              className="text-xl font-bold bg-gray-100 rounded-md border-2 border-gray-400 flex items-center justify-center dark:text-black"
            />
          </div>

          <div className="text-center flex justify-start items-center my-1">
            <p className="text-gray-700 mr-3">Total Classes Attended :</p>
            <input
              value={performance.TotalClassesAttended}
              onChange={(e) => {
                const newPerformances = [...studentPerformances];
                newPerformances[index] = { ...newPerformances[index], TotalClassesAttended : e.target.value };
                setStudentPerformances(newPerformances);
              }}
              type='text'
              className="text-xl font-bold bg-gray-100 rounded-md border-2 border-gray-400 flex items-center justify-center dark:text-black"
            />
          </div>

          <div className="text-center flex justify-start items-center my-1">
            <p className="text-gray-700 mr-3">Grade :</p>
            <input
              value={performance.Grade}
              onChange={(e) => {
                const newPerformances = [...studentPerformances];
                newPerformances[index] = { ...newPerformances[index], Grade : e.target.value };
                setStudentPerformances(newPerformances);
              }}
              type='text'
              className="text-xl font-bold bg-gray-100 rounded-md border-2 border-gray-400 flex items-center justify-center dark:text-black"
            />
          </div>       
    </div>
  </div>
  )
}

export default MarksEntryCard
