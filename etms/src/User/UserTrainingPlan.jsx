import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = dayjsLocalizer(dayjs);

const UserTrainingPlanPage = () => {
    const [trainingPlans, setTrainingPlans] = useState([]);

    useEffect(() => {
        fetchTrainingPlans();
    }, []);

    const fetchTrainingPlans = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/training-plans'); // Assuming your API is at '/api/training-plans'
            setTrainingPlans(response.data);
        } catch (error) {
            console.error('Error fetching training plans:', error);
        }
    };


    const transformData = () => {
        return trainingPlans.map(plan => {
            const start = new Date(plan.schedule.startDate);
            const end = new Date(plan.schedule.endDate);

            // Check if the event spans multiple days
            const isMultiDayEvent = !dayjs(start).isSame(dayjs(end), 'day');

            // Calculate difference in milliseconds
            const diffInMs = end - start;

            // Calculate difference in days
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            // Calculate remaining hours after subtracting full days
            const remainingHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            // Format the duration
            let formattedDays = diffInDays === 1 ? 'day' : 'days';
            let formattedHours = remainingHours === 1 ? 'hour' : 'hours';
            // Format the start and end times
            const formattedStartTime = dayjs(start).format('HH:mm');
            const formattedEndTime = dayjs(end).format('HH:mm');

            if (diffInDays === 0) {
                // If the duration is less than a day, only display hours
                return {
                    title: plan.planName,
                    start: start,
                    end: end,
                    resource: plan,
                    tooltip: `Time: ${formattedStartTime} - ${formattedEndTime} PM \nDuration: ${remainingHours} ${formattedHours}\nDescription: ${plan.description}`,
                };
            } else {
                return {
                    title: plan.planName,
                    start: start,
                    end: end,
                    resource: plan,
                    tooltip: `Time: ${formattedStartTime} - ${formattedEndTime}  \nDuration: ${diffInDays} ${formattedDays} and ${remainingHours} ${formattedHours}\nDescription: ${plan.description}`,
                };
            }
        });
    };


    return (
        <div>
            <h1>Your Training Plan</h1>
            <div style={{ height: 500 }}>
                <Calendar
                    localizer={localizer}
                    events={transformData()}
                    startAccessor="start"
                    endAccessor="end"
                    style={{
                        margin: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f8f6e3', // Background color
                        border: '2px solid #5d79fb', // Border color
                        color: '#333', // Text color
                    }}
                    tooltipAccessor="tooltip" // Set tooltipAccessor to show the duration on hover

                />
            </div>
        </div>
    );
};

export default UserTrainingPlanPage;
