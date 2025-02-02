export const formatDateTime = (isoString: string): {date: string; time: string} => {
    const date = new Date(isoString);
  
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'
    ];
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return {
      date: `${day} /${month} /${year} `,
      time: `${hours}:${minutes}`
    };
};

export const currentDateTime = () => {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // return `${date}-${month}-${year} ${hours}:${minutes}`; // Format: DD-MM-YYYY HH:MM
    return {
      date: `${date} / ${month} / ${year}`,
      time: `${hours} : ${minutes}`
    };
};
  

  