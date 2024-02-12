import { useState, useEffect } from 'react';
import './Calender.css';

function Calender() {
  // let currentDate = new Date();
  const [focusedDate, setFocusedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthYear, setMonthYear] = useState('')
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(null);

  const convertDateForDB = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const yearString = String(year);
    const monthString = month < 10 ? '0' + month : String(month);
    const dayString = day < 10 ? '0' + day : String(day);

    const dbDateString = `${yearString}-${monthString}-${dayString}`;

    return dbDateString;
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFocusedDate(date); // Set the clicked date as the focused date
  
    // Check if the clicked date is in the previous month
    if (date.getMonth() < currentDate.getMonth() || date.getFullYear() < currentDate.getFullYear()) {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    }
    // Check if the clicked date is in the next month
    else if (date.getMonth() > currentDate.getMonth() || date.getFullYear() > currentDate.getFullYear()) {
      setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    }
  
    const dbDate = convertDateForDB(date);
    console.log(dbDate);
  }

  const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    const firstDay = new Date(currentYear, currentMonth, 1); // changed from 0 to 1
    const lastDay = new Date(currentYear, currentMonth + 1, 0); // changed from 0 to 1
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
  
    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'}); 
    setMonthYear(monthYearString);
  
    let datesArray = [];
  
    for(let i = firstDayIndex; i > 0; i--) {
      const prevDate = new Date(currentYear, currentMonth, 1 - i);
      datesArray.push(prevDate.getDate());
    }
  
    for(let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      datesArray.push({ day: i, activeClass: '' });
    }
    
    
    for(let i = 1; i<= 7 - lastDayIndex; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      datesArray.push({ day: nextDate.getDate(), activeClass: 'inactive' });
    }
  
    setDates(datesArray);
  }


  const handlePrevBtn = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  }

  const handleNextBtn = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  }

  useEffect(() => {
    updateCalendar();
  }, [currentDate]);

  return (
    <div className="calender">
      <p>Calender</p>
      <div className="header">
        <button id="prevBtn" onClick={handlePrevBtn}>
            <i className="fa-solid fa-chevron-left">&lt;</i>
        </button>
        <div className="monthYear" id="monthYear">{monthYear}</div>
        <button id="nextBtn" onClick={handleNextBtn}>
            <i className="fa-solid fa-chevron-right">&gt;</i>
        </button>
      </div>
      <div className="days">
        <div className="day">Sun</div>
        <div className="day">Mon</div>
        <div className="day">Tues</div>
        <div className="day">Weds</div>
        <div className="day">Thurs</div>
        <div className="day">Fri</div>
        <div className="day">Sat</div>
      </div>
      <div className="dates" id="dates">
      {dates.map(({ day, activeClass }, index) => {
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  // If the date is from the previous month
  if (activeClass === 'inactive' && day > 7) {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
  }
  // If the date is from the next month
  else if (activeClass === 'inactive' && day <= 7) {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  const date = new Date(year, month, day);
  const isActive = focusedDate && focusedDate.toDateString() === date.toDateString();
  return (
    <div 
      key={index} 
      className={`date ${isActive ? 'active' : activeClass}`} 
      onClick={() => handleDateClick(date)}
    >
      {day}
    </div>
  );
})}
    </div>
  </div>
);
}

export default Calender;