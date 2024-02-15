import { useState, useEffect } from 'react';
import './Calender.css';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
Modal.setAppElement('#root');

function Calender( {selectedDate, setSelectedDate} ) {
  // let currentDate = new Date();
  const [focusedDate, setFocusedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthYear, setMonthYear] = useState('')
  const [dates, setDates] = useState([])
  // const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalDates, setModalDates] = useState([]);

  // const handleDatePickerChange = (date) => {
  //   setCurrentDate(date);
  //   setFocusedDate(date);
  //   setShowDatePicker(false);
  // }

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
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), date.getDate())); // Set the clicked date as the current date
  
    const dbDate = convertDateForDB(date);
    console.log(dbDate);
    console.log('Clicked date:', date);
    console.log('Selected date:', selectedDate);
  
    setShowDatePicker(false); // Close the date picker modal
  }
  
  //   const dbDate = convertDateForDB(date);
  //   console.log(dbDate);
  //   console.log('Clicked date:', date);
  //   console.log('Selected date:', selectedDate);
  // }

  const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
  
    const firstDay = new Date(currentYear, currentMonth, currentDay - currentDate.getDay());
    const lastDay = new Date(currentYear, currentMonth, currentDay + (6 - currentDate.getDay()));
  
    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'}); 
    setMonthYear(monthYearString);
  
    let datesArray = [];
  
    for(let i = 0; i < 7; i++) {
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
      datesArray.push({ day: date.getDate(), activeClass: '' });
    }
  
    setDates(datesArray);
  }

  const updateModalCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
  
    let datesArray = [];
  
    // Add placeholders for the days before the first day of the month
    for(let i = 0; i < firstDay.getDay(); i++) {
      datesArray.push({ day: null, activeClass: '' });
    }
  
    for(let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isActive = focusedDate && focusedDate.toDateString() === date.toDateString();
      const activeClass = isActive ? 'active' : '';
      datesArray.push({ day: i, activeClass });
    }
  
    setModalDates(datesArray);
  }

  useEffect(() => {
    if (showDatePicker) {
      updateModalCalendar();
    }
  }, [showDatePicker, currentDate]);


  const handlePrevBtn = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  }
  
  const handleNextBtn = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  }

  const handleModalPrevBtn = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  }
  
  const handleModalNextBtn = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  }

  useEffect(() => {
    updateCalendar();
  }, [currentDate]);

  return (
    <div className="calender">
      <div className="header">
        <button id="prevBtn" onClick={handlePrevBtn}>
            <i className="fa-solid fa-chevron-left">&lt;</i>
        </button>
        <div className="monthYear" id="monthYear">
          {currentDate.toDateString()}
          <button onClick={() => setShowDatePicker(true)}>
          <img class="calender-icon" src="https://i.pinimg.com/originals/cd/8f/b3/cd8fb3a1168e5b702f1e6cb0c0d34859.jpg" alt="Open Date Picker" />
          </button>
        </div>
        <button id="nextBtn" onClick={handleNextBtn}>
          <i className="fa-solid fa-chevron-right">&gt;</i>
        </button>
        <Modal 
          isOpen={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
          contentLabel="Date Picker"
          className="datePickerModal"
        >
          <div className="calender">
            <div className="header">
            <button id="prevBtn" onClick={handleModalPrevBtn}>
              <i className="fa-solid fa-chevron-left">&lt;</i>
            </button>
            <div className="monthYear" id="monthYear">{monthYear}</div>
            <button id="nextBtn" onClick={handleModalNextBtn}>
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
              {modalDates.map(({ day, activeClass }, index) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
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
        </Modal>
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
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + index);
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