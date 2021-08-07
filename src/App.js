import React from 'react';
import EventCalendar from './components/FullCalendar';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <Container maxWidth="lg">
      <EventCalendar />
    </Container>
  );
}

export default App;
