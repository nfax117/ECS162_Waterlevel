import React, {useState} from 'react';
// an third-party component from NPM
import MonthYearPicker from 'react-month-year-picker';


function MonthPicker(props) {
let date = props.date;
console.log(props);

const [visible,updateVisible] = useState(false);

function showFun () {
  updateVisible(true);
}

function pickedYear (year) {
  console.log("Picked year", year)
  updateVisible(false); //makes the month picker disappear after changing year
  props.yearFun(year);
}

function pickedMonth (month) {
  console.log("Picked month")
  updateVisible(false); //makes the month picker disappear after changing month
  props.monthFun(month);
}
console.log("is it: ",visible)
  if (visible) {
return (
      <div>
        <MonthYearPicker
          caption=""
          selectedMonth={date.month}
          selectedYear={date.year}
          minYear={2000}
          maxYear={2022}
          onChangeYear = {pickedYear}
          onChangeMonth = {pickedMonth}
        />
      </div> 
        );
  } else {

    let names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let monthname = "No Month";
    
    for(let k=1; k<=12; k++){
      if(date.month == k){
        monthname = names[k-1];
      }
    }
    return (
      <button className="MonthButton" onClick={showFun}>{monthname + " " + date.year}</button>
    )
  }
}

export default MonthPicker;