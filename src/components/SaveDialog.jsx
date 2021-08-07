import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CancelIcon from '@material-ui/icons/Cancel';
import { IconButton } from '@material-ui/core';

function SaveDialog({
  eventOpenNow,
  dateClickItem,
  isOpen,
  onClose,
  handleAddEvent,
  isOpenEdit,
  onCloseEdit,
  setEventInfo,
  eventsInfo,
  isWholeDay,
  setIsWholeDay,
}) {
  const [newEvent, setNewEvent] = React.useState({
    title: '',
    date: dateClickItem,
    allDay: true,
    time: '08:30',
    description: '',
    backgroundColor: '',
  });
  const [isTitleError, setIsTitleError] = React.useState(true);
  //const [isWholeDay, setIsWholeDay] = React.useState(true);
  console.log(newEvent);

  const handleClose = () => {
    setNewEvent({
      title: '',
      date: '',
      allDay: isWholeDay,
      time: '08:00',
      description: '',
      backgroundColor: '',
    });
    setIsWholeDay(true);
    setIsTitleError(true);
    onClose(false);
    onCloseEdit(false);
  };

  const handleRemoveEvent = (id) => {
    eventOpenNow.eventClick.event.remove();
    const newEvents = eventsInfo.filter((removedEvent) => Number(removedEvent.id) !== Number(id));
    setEventInfo(newEvents);
    setIsTitleError(true);
    onCloseEdit(false);
  };

  //console.log('new event', newEvent);
  //console.log('open now event', eventOpenNow);

  const handleEditEvent = () => {
    console.log(eventOpenNow.time, newEvent.time);
    const editedEvents = eventsInfo.map((editedEvent) => {
      if (Number(editedEvent.id) === Number(eventOpenNow.id)) {
        return {
          title: newEvent.title || eventOpenNow.title,
          date: newEvent.date || eventOpenNow.date,
          backgroundColor: newEvent.backgroundColor || eventOpenNow.backgroundColor,
          allDay: isWholeDay, //newEvent.allDay,
          time: newEvent.time || eventOpenNow.time,
          start: new Date(`${eventOpenNow.date} ${newEvent.time}`),
          description: newEvent.description || eventOpenNow.description,
          id: Number(eventOpenNow.id),
        };
      }
      return editedEvent;
    });
    setEventInfo(editedEvents);
    onCloseEdit(false);
    setNewEvent({
      title: '',
      date: '',
      allDay: isWholeDay,
      time: '08:00',
      description: '',
      backgroundColor: '',
    });
    setIsWholeDay(true);
    setIsTitleError(true);
  };

  const addEventToCalendar = () => {
    handleAddEvent(newEvent);
    setNewEvent({
      title: '',
      date: '',
      allDay: 'true',
      description: '',
      time: '08:00',
      backgroundColor: '',
    });
    setIsWholeDay(true);
    setIsTitleError(true);
    onClose(false);
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    //console.log(name, typeof value);
    if (name === 'allDay' && (value === 'true' || value === true)) {
      setIsWholeDay(true);
    } else if (name === 'allDay' && (value === 'false' || value === false)) {
      setIsWholeDay(false);
    }
    if (name === 'title' && (value === '' || value.length > 30)) {
      setIsTitleError(true);
    } else {
      setIsTitleError(false);
      setNewEvent((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open={isOpen || isOpenEdit} onClose={handleClose}>
      <IconButton
        onClick={handleClose}
        style={{ position: 'absolute', top: '5px', right: '5px' }}
        aria-label="delete">
        <CancelIcon />
      </IconButton>
      <DialogContent style={{ marginTop: '25px' }}>
        <TextField
          name="title"
          label="event name"
          fullWidth
          onChange={onChange}
          defaultValue={isOpenEdit ? eventOpenNow.title : ''}
        />
        <TextField
          onChange={onChange}
          name="date"
          label="event date"
          type="date"
          defaultValue={isOpenEdit ? eventOpenNow.date : ''}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl style={{ width: '100%' }}>
          <InputLabel htmlFor="age-native-simple">event time</InputLabel>
          <Select
            native
            defaultValue={isOpenEdit ? eventOpenNow.allDay : true}
            onChange={onChange}
            inputProps={{
              name: 'allDay',
              id: 'age-native-simple',
            }}>
            <option value={true}>Весь день</option>
            <option value={false}>Определенное время</option>
          </Select>
        </FormControl>
        {!isWholeDay ? (
          <TextField
            onChange={onChange}
            label="event time"
            type="time"
            name="time"
            defaultValue={
              isOpenEdit ? eventOpenNow.time : '08:30'
            } /* {isOpenEdit ? eventOpenNow.time : "08:30"} */
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        ) : null}
        <TextField
          onChange={onChange}
          defaultValue={isOpenEdit ? eventOpenNow.description : ''}
          name="description"
          label="notes"
          fullWidth
        />
        <FormControl style={{ width: '100%' }}>
          <InputLabel htmlFor="age-native-simple">event color</InputLabel>
          <Select
            native
            defaultValue={isOpenEdit ? eventOpenNow.backgroundColor : ''}
            onChange={onChange}
            inputProps={{
              name: 'backgroundColor',
              id: 'age-native-simple',
            }}>
            <option aria-label="None" value="" />
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="orange">Orange</option>
          </Select>
        </FormControl>
        <DialogActions>
          {!isOpenEdit ? (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={addEventToCalendar} disabled={isTitleError}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleRemoveEvent(eventOpenNow.eventClick.event.id)}>
                Remove
              </Button>
              <Button onClick={handleEditEvent} disabled={isTitleError}>
                Edit
              </Button>
            </>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default SaveDialog;
