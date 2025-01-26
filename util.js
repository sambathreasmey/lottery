export class Util {

    getCurrentTime() {
        try {
            const now = new Date(); // Get the current date and time
            const options = {
                timeZone: 'Asia/Phnom_Penh', // Cambodia time zone
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Use 24-hour format
            };
    
            // Format the date according to the specified time zone
            const formatter = new Intl.DateTimeFormat([], options);
            const parts = formatter.formatToParts(now);
    
            // Extract the components
            const timeComponents = {};
            for (const part of parts) {
                if (part.type !== 'literal') {
                    timeComponents[part.type] = part.value;
                }
            }
    
            // Create a formatted date string
            const formattedDate = `${timeComponents.year}-${timeComponents.month}-${timeComponents.day} ${timeComponents.hour}:${timeComponents.minute}:${timeComponents.second}`;
            
            // Create a timestamp in seconds
            const timestamp = Math.floor(new Date(formattedDate).getTime() / 1000); // Convert to seconds
    
            // Return an object with both the formatted date and timestamp
            return {
                formattedDate: formattedDate,
                timestamp: timestamp
            };
        } catch (error) {
            console.error("Error getting current time in Cambodia:", error);
            return null; // Return null in case of an error
        }
    }
}