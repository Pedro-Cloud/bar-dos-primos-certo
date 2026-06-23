export const BUSINESS_HOURS = {
  lunch: [
    { label: 'Seg - Sáb', days: [1, 2, 3, 4, 5, 6], time: '11h - 15h', open: 11, close: 15 }
  ],
  dinner: [
    { label: 'Ter - Qui', days: [2, 3, 4], time: '17h - 01h', open: 17, close: 25 },
    { label: 'Sex - Sáb', days: [5, 6], time: '17h - 03h', open: 17, close: 27 },
    { label: 'Dom', days: [0], time: '16h - 23h', open: 16, close: 23 },
    { label: 'Segunda', days: [1], time: 'Fechado', open: null, close: null }
  ]
};

export const checkIsOpen = (date: Date): { isOpen: boolean; nextOpenStr: string } => {
  const currentDay = date.getDay();
  const currentHour = date.getHours();
  // Using minutes to be more precise if we needed, but hours are fine here since they open at the top of the hour
  const currentTotalHours = currentHour + date.getMinutes() / 60;

  let isOpen = false;

  let virtualHour = currentTotalHours;
  let virtualDay = currentDay;
  if (currentHour < 6) { 
     virtualHour += 24;
     virtualDay = (currentDay - 1 + 7) % 7;
  }

  // Check lunch
  for (const period of BUSINESS_HOURS.lunch) {
    if (period.days.includes(currentDay) && period.open !== null && period.close !== null) {
       if (currentTotalHours >= period.open && currentTotalHours < period.close) {
           isOpen = true;
       }
    }
  }

  // Check dinner
  for (const period of BUSINESS_HOURS.dinner) {
    if (period.days.includes(virtualDay) && period.open !== null && period.close !== null) {
      if (virtualHour >= period.open && virtualHour < period.close) {
        isOpen = true;
      }
    }
  }

  // Find next open time if closed
  let nextOpenStr = '';
  if (!isOpen) {
    // Check later today
    let found = false;
    // Check lunch today (if before lunch)
    for (const period of BUSINESS_HOURS.lunch) {
      if (period.days.includes(currentDay) && period.open !== null && currentTotalHours < period.open) {
        nextOpenStr = `Abre hoje às ${period.open}h`;
        found = true;
        break;
      }
    }

    if (!found) {
      // Check dinner today
      for (const period of BUSINESS_HOURS.dinner) {
         if (period.days.includes(currentDay) && period.open !== null && currentTotalHours < period.open) {
            nextOpenStr = `Abre hoje às ${period.open}h`;
            found = true;
            break;
         }
      }
    }

    if (!found) {
      // Find the next day it opens
      // Just check the next 7 days in order
      for(let offset = 1; offset <= 7; offset++) {
         const nextDay = (currentDay + offset) % 7;
         let dayFound = false;
         
         // Lunch first
         for (const period of BUSINESS_HOURS.lunch) {
           if (period.days.includes(nextDay) && period.open !== null) {
              const dayName = getDayName(nextDay);
              nextOpenStr = Object.is(offset, 1) ? `Abre amanhã às ${period.open}h` : `Abre ${dayName} às ${period.open}h`;
              dayFound = true;
              break;
           }
         }
         
         if (dayFound) break;

         // Dinner second
         for (const period of BUSINESS_HOURS.dinner) {
           if (period.days.includes(nextDay) && period.open !== null) {
              const dayName = getDayName(nextDay);
              nextOpenStr = Object.is(offset, 1) ? `Abre amanhã às ${period.open}h` : `Abre ${dayName} às ${period.open}h`;
              dayFound = true;
              break;
           }
         }
         if (dayFound) break;
      }
    }
  }

  return { isOpen, nextOpenStr };
};

const getDayName = (day: number) => {
  const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  return days[day];
};
