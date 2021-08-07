import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import SaveDialog from './SaveDialog';

const getDropEvent = (calendarEvents, dateId) => {
  for (let item = 0; item < calendarEvents.length; item++) {
    if (Number(calendarEvents[item].id) === Number(dateId)) {
      return calendarEvents[item];
    }
  }
};

const structureDate = (dateEvent) => {
  const day =
    String(dateEvent.getDate()).length === 1
      ? '0' + String(dateEvent.getDate())
      : dateEvent.getDate();
  const month =
    String(dateEvent.getMonth()).length === 1
      ? '0' + String(dateEvent.getMonth() + 1)
      : dateEvent.getMonth() + 1;
  const year = dateEvent.getFullYear();
  const newDate = year + '-' + month + '-' + day;
  return newDate;
};

function EventCalendar() {
  const [eventsInfo, setEventInfo] = React.useState(
    JSON.parse(localStorage.getItem('events')) || [],
  );
  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [isWholeDay, setIsWholeDay] = React.useState(true);
  const [eventOpenNow, setEventOpenNow] = React.useState({});
  const [dateClickItem, setDateClickItem] = React.useState('');
  const [eventId, setEventId] = React.useState(Number(localStorage.getItem('eventId')) || 0);
  React.useEffect(() => {
    localStorage.setItem('eventId', eventId);
  }, [eventId]);

  React.useEffect(() => {
    localStorage.setItem('events', JSON.stringify(eventsInfo));
  }, [eventsInfo]);

  const handleAddEvent = (addedEvent) => {
    if (addedEvent.date !== '') {
      const allDayEvent = addedEvent.allDay === 'true' || addedEvent.allDay === true ? true : false;
      setEventId((prevState) => prevState + 1);
      setEventInfo((prevState) => [
        ...prevState,
        {
          ...addedEvent,
          id: eventId,
          allDay: allDayEvent,
          start: new Date(`${addedEvent.date}T${addedEvent.time}:00`),
        },
      ]);
    } else {
      alert('Пожалуйста укажите дату');
    }
  };

  const handleDateClick = (dateClickInfo) => {
    setDateClickItem(dateClickInfo.dateStr);
    setIsOpenDialog(true);
  };

  const handleDrop = (date) => {
    const dateEvent = new Date(date.event._instance.range.start);
    const newDate = structureDate(dateEvent);
    const dragAndDropEvent = getDropEvent(eventsInfo, date.event._def.publicId);

    const OtherEvents = eventsInfo.filter(
      (item) => Number(item.id) !== Number(date.event._def.publicId),
    );
    const newEvents = [
      ...OtherEvents,
      {
        ...dragAndDropEvent,
        date: newDate,
        start: new Date(`${newDate}T${dragAndDropEvent.time}:00`),
      },
    ];
    setEventInfo(newEvents);
  };

  const eventEdit = (eventClick) => {
    const timeDate = `${eventClick.event.start}`.slice(16, 21);
    setIsWholeDay(eventClick.event.allDay);
    setEventOpenNow({
      title: eventClick.event.title,
      date: eventClick.event.startStr.slice(0, 10),
      allDay: eventClick.event.allDay,
      time: timeDate,
      id: eventClick.event.id,
      description: eventClick.event._def.extendedProps.description,
      backgroundColor: eventClick.event.backgroundColor,
      eventClick,
    });
    setIsOpenEdit(true);
  };

  return (
    <div>
      <FullCalendar
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        editable={true}
        droppable={true}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={eventsInfo}
        dateClick={handleDateClick}
        eventClick={eventEdit}
        eventDrop={handleDrop}
      />
      <SaveDialog
        eventsInfo={eventsInfo}
        setEventInfo={setEventInfo}
        eventOpenNow={eventOpenNow}
        setEventOpenNow={setEventOpenNow}
        isOpenEdit={isOpenEdit}
        onCloseEdit={setIsOpenEdit}
        dateClickItem={dateClickItem}
        isOpen={isOpenDialog}
        onClose={setIsOpenDialog}
        handleAddEvent={handleAddEvent}
        isWholeDay={isWholeDay}
        setIsWholeDay={setIsWholeDay}
      />
    </div>
  );
}

export default EventCalendar;
