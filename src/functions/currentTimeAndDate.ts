import { format } from "date-fns"

function getCurrentTimeAndDate() {
	const currentDate = new Date()
	// Format the current date as "MM/dd/yyyy" (10/12/2003)
	const formattedDate = format(currentDate, "MM/dd/yyyy")
	// Format the current time as "hh:mm a" (10:15 PM)
	const formattedTime = format(currentDate, "hh:mm a")
	return { time: formattedTime, date: formattedDate }
}

export default getCurrentTimeAndDate
