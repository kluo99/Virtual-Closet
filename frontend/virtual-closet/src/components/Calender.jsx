import { useState, useEffect } from 'react';
import './Calender.css';

function Calender() {
  // let currentDate = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthYear, setMonthYear] = useState('')
  const [dates, setDates] = useState([])

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
      const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
      datesArray.push({ day: i, activeClass });
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
        {dates.map(({ day, activeClass }) => (
          <div className={`date ${activeClass}`}>{day}</div>
        ))}
      </div>
    </div>
  );
}

export default Calender;