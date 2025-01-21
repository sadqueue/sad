
    export const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
      
        // Extract date components
        const month = date.getMonth() + 1; // Months are 0-indexed
        const day = date.getDate();
        const year = date.getFullYear();
      
        // Extract time components
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        // Convert to 12-hour format
        hours = hours % 12 || 12;
      
        // Combine into desired format
        return `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;
      }