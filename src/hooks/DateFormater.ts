const formatDate = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const day = date.getDate();
    const daySuffix = (day: number): string => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const weekday = days[date.getDay()];
  
    return `${day}${daySuffix(day)} ${month}, ${year}; ${weekday}`;
  };

  const formatWeekday = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = days[date.getDay()];
    return weekday;
  };





  const formatDateString = (dateString:string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
  
    const getDayWithSuffix = (day:any) => {
      if (day > 3 && day < 21) return day + 'th';
      switch (day % 10) {
        case 1: return day + 'st';
        case 2: return day + 'nd';
        case 3: return day + 'rd';
        default: return day + 'th';
      }
    };
  
    return `${getDayWithSuffix(day)} ${month}, ${year}; ${dayOfWeek}`;
  };



export {formatDate,formatWeekday,formatDateString};