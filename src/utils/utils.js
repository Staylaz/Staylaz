export default function timestampTo12Hour(timestamp) {
  return transformDate(timestamp)
}

function transformDate(date) {
    const time = new Date(parseInt(date) * 1000);
    let year = time.getFullYear();
    let mouth = time.getMonth() + 1;
    let day = time.getDate();
    let hours = time.getHours() ;
    let minutes = time.getMinutes() ;
    let seconds = time.getSeconds();
    let meridiem = 'AM';
    if (hours > 11) {
        meridiem = 'PM'
    }
    if (hours > 12) {
        hours = hours - 12
        
    }
    if (mouth < 10) {
        mouth = "0" + mouth
    }
    if (day < 10) {
        day = "0" + day
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }

  

    
    if (getDateDiff(date)) {
        return `${hours}:${minutes} ${meridiem}`
    }
    
    return `${year}-${mouth}-${day}`
}


function getDateDiff(date)  {  
    const time = new Date(parseInt(date) * 1000);
    let _currentDate = new Date();
    return (_currentDate.getFullYear() === time.getFullYear() && _currentDate.getMonth()  === time.getMonth() && _currentDate.getDate()  === time.getDate() ) 
}
