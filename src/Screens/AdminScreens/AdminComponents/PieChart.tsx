// MyResponsivePie.js
import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { CourseModel } from '../../../Models/CourceModel';
import { db } from '../../../firebase_config';
import { collection, getDocs } from 'firebase/firestore';


interface  transformedModel {
    id: string | undefined;
    label: string | undefined;
    value: number;
    color: string;
}

const MyResponsivePie:React.FC = () => {
  const [data, setData] = useState<transformedModel[]>([]);

  const fetchCourses = async () => {
    const coursesSnapshot = await getDocs(collection(db,"courses"));
    const courses = coursesSnapshot.docs.map(doc => doc.data()) as CourseModel[];
    return courses;
  };

  const convertCoursesToDataArray = (courses : CourseModel[]) => {
    return courses.map((course:CourseModel) => ({
      id: course.courseName,
      label: course.courseName,
      value: course.coursesSold || 0, // Default to 0 if coursesSold is not provided
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)` // Generate random color
    }));
  };

  useEffect(() => {
    const getData = async () => {
      const courses = await fetchCourses();
      const transformedData = convertCoursesToDataArray(courses);
      setData(transformedData);
    };

    getData();
  }, []);

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            0.2
          ]
        ]
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [
          [
            'darker',
            2
          ]
        ]
      }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      fill={[
        {
          match: {
            id: 'ruby'
          },
          id: 'dots'
        },
        {
          match: {
            id: 'c'
          },
          id: 'dots'
        },
        {
          match: {
            id: 'go'
          },
          id: 'dots'
        },
        {
          match: {
            id: 'python'
          },
          id: 'dots'
        },
        {
          match: {
            id: 'scala'
          },
          id: 'lines'
        },
        {
          match: {
            id: 'lisp'
          },
          id: 'lines'
        },
        {
          match: {
            id: 'elixir'
          },
          id: 'lines'
        },
        {
          match: {
            id: 'javascript'
          },
          id: 'lines'
        }
      ]}
      // legends={[
      //     {
      //         anchor: 'bottom',
      //         direction: 'row',
      //         justify: false,
      //         translateX: 0,
      //         translateY: 0,
      //         itemsSpacing: 0,
      //         itemWidth: 50,
      //         itemHeight: 18,
      //         itemTextColor: '#999',
      //         itemDirection: 'left-to-right',
      //         itemOpacity: 1,
      //         symbolSize: 18,
      //         symbolShape: 'circle',
      //         effects: [
      //             {
      //                 on: 'hover',
      //                 style: {
      //                     itemTextColor: '#000'
      //                 }
      //             }
      //         ]
      //     }
      // ]}
    />
  );
};

export default MyResponsivePie;
