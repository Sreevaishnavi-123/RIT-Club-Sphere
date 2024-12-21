import React, { useState } from 'react';
import './CoreDashboard.css';

const CoreDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Technical Workshop',
      date: '2024-05-15',
      venue: 'Seminar Hall 1',
      status: 'Upcoming'
    },
    {
      id: 2,
      title: 'Coding Competition',
      date: '2024-05-20',
      venue: 'Lab Complex',
      status: 'Upcoming'
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    venue: '',
    status: 'Upcoming'
  });

  // Add new state for voting and bookings
  const [elections, setElections] = useState([
    {
      id: 1,
      title: 'President Election 2024',
      status: 'Active',
      totalVotes: 120,
      endDate: '2024-05-30',
      candidates: [
        { id: 1, name: 'John Doe', votes: 45, department: 'CSE', year: '3rd' },
        { id: 2, name: 'Jane Smith', votes: 75, department: 'ECE', year: '4th' },
        { id: 3, name: 'Mike Johnson', votes: 60, department: 'CSE', year: '3rd' },
        { id: 4, name: 'Sarah Wilson', votes: 50, department: 'ECE', year: '4th' }
      ],
      hasVoted: false
    }
  ]);
  
  const [showVotingForm, setShowVotingForm] = useState(false);
  const [showVotingResults, setShowVotingResults] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [bookings, setBookings] = useState([
    {
      id: 1,
      hall: 'Seminar Hall 1',
      date: '2024-05-15',
      time: '10:00-12:00',
      status: 'Confirmed',
      purpose: 'Technical Workshop'
    }
  ]);
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    hall: '',
    date: '',
    time: '',
    purpose: ''
  });

  // Add new state for attendance
  const [eventAttendance, setEventAttendance] = useState([
    {
      id: 1,
      eventTitle: 'Technical Workshop',
      date: '2024-05-15',
      students: [
        { id: 1, name: 'John Doe', regNo: '20CS101', present: true },
        { id: 2, name: 'Jane Smith', regNo: '20CS102', present: true },
        { id: 3, name: 'Mike Johnson', regNo: '20CS103', present: true },
      ]
    },
    {
      id: 2,
      eventTitle: 'Coding Competition',
      date: '2024-05-20',
      students: [
        { id: 1, name: 'John Doe', regNo: '20CS101', present: true },
        { id: 2, name: 'Jane Smith', regNo: '20CS102', present: true },
        { id: 4, name: 'Sarah Wilson', regNo: '20CS104', present: false },
      ]
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle event deletion
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  // Handle edit button click
  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsEditing(true);
  };

  // Handle event update
  const handleUpdateEvent = (e) => {
    e.preventDefault();
    setEvents(events.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    ));
    setIsEditing(false);
    setEditingEvent(null);
  };

  // Handle new event submission
  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEventWithId = {
      ...newEvent,
      id: events.length + 1,
      status: 'Upcoming'
    };
    setEvents([...events, newEventWithId]);
    setShowAddForm(false);
    setNewEvent({
      title: '',
      date: '',
      venue: '',
      status: 'Upcoming'
    });
  };

  // Voting Functions
  const handleCreateElection = (e) => {
    e.preventDefault();
    const newElection = {
      id: elections.length + 1,
      title: e.target.title.value,
      status: 'Active',
      totalVotes: 0,
      candidates: e.target.candidates.value.split(',').map(name => ({
        name: name.trim(),
        votes: 0
      }))
    };
    setElections([...elections, newElection]);
    setShowVotingForm(false);
  };

  const handleViewResults = (election) => {
    setSelectedElection(election);
    setShowVotingResults(true);
  };

  // Booking Functions
  const handleCreateBooking = (e) => {
    e.preventDefault();
    const newBookingWithId = {
      ...newBooking,
      id: bookings.length + 1,
      status: 'Confirmed'
    };
    setBookings([...bookings, newBookingWithId]);
    setShowBookingForm(false);
    setNewBooking({
      hall: '',
      date: '',
      time: '',
      purpose: ''
    });
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Cancelled' }
          : booking
      ));
    }
  };

  // Attendance Functions
  const handleMarkAttendance = (eventId, studentId) => {
    setEventAttendance(eventAttendance.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          students: event.students.map(student => {
            if (student.id === studentId) {
              return { ...student, present: !student.present };
            }
            return student;
          })
        };
      }
      return event;
    }));
  };

  const getAttendanceStats = (event) => {
    const total = event.students.length;
    const present = event.students.filter(student => student.present).length;
    return { total, present, absent: total - present };
  };

  const handleViewAttendance = (event) => {
    setSelectedEvent(event);
    setShowAttendanceList(true);
  };

  const filteredStudents = (students) => {
    return students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Function to handle voting
  const handleVote = (electionId, candidateId) => {
    if (window.confirm('Are you sure you want to vote for this candidate? This action cannot be undone.')) {
      setElections(elections.map(election => {
        if (election.id === electionId) {
          return {
            ...election,
            hasVoted: true,
            totalVotes: election.totalVotes + 1,
            candidates: election.candidates.map(candidate => {
              if (candidate.id === candidateId) {
                return { ...candidate, votes: candidate.votes + 1 };
              }
              return candidate;
            })
          };
        }
        return election;
      }));
      setShowVotingModal(false);
      alert('Vote cast successfully!');
    }
  };

  // Function to open voting modal
  const handleVotingClick = (election) => {
    if (election.hasVoted) {
      alert('You have already voted in this election.');
      return;
    }
    setSelectedElection(election);
    setShowVotingModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <div className="events-section">
            <h3>Event Management</h3>
            
            {/* Add Event Form */}
            {showAddForm && (
              <div className="event-form-overlay">
                <div className="event-form">
                  <h4>Add New Event</h4>
                  <form onSubmit={handleAddEvent}>
                    <div className="form-group">
                      <label>Event Title:</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date:</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Venue:</label>
                      <input
                        type="text"
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="save-btn">Add Event</button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Event Form */}
            {isEditing && editingEvent && (
              <div className="event-form-overlay">
                <div className="event-form">
                  <h4>Edit Event</h4>
                  <form onSubmit={handleUpdateEvent}>
                    <div className="form-group">
                      <label>Event Title:</label>
                      <input
                        type="text"
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({
                          ...editingEvent,
                          title: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date:</label>
                      <input
                        type="date"
                        value={editingEvent.date}
                        onChange={(e) => setEditingEvent({
                          ...editingEvent,
                          date: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Venue:</label>
                      <input
                        type="text"
                        value={editingEvent.venue}
                        onChange={(e) => setEditingEvent({
                          ...editingEvent,
                          venue: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="save-btn">Save Changes</button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingEvent(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Event List */}
            <div className="event-list">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <h4>{event.title}</h4>
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>Venue: {event.venue}</p>
                  <p>Status: {event.status}</p>
                  <div className="event-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditClick(event)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="add-event-btn"
              onClick={() => setShowAddForm(true)}
            >
              Add New Event
            </button>
          </div>
        );
      case 'attendance':
        return (
          <div className="attendance-section">
            <h3>Attendance Tracker</h3>
            
            {/* Event List for Attendance */}
            <div className="attendance-list">
              {eventAttendance.map(event => {
                const stats = getAttendanceStats(event);
                return (
                  <div key={event.id} className="attendance-card">
                    <h4>{event.title}</h4>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Total Registered: {stats.total}</p>
                    <p>Present: {stats.present}</p>
                    <p>Absent: {stats.absent}</p>
                    <button 
                      className="view-btn"
                      onClick={() => handleViewAttendance(event)}
                    >
                      Mark Attendance
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Attendance Marking Modal */}
            {showAttendanceList && selectedEvent && (
              <div className="form-overlay">
                <div className="form-container attendance-container">
                  <h4>Mark Attendance - {selectedEvent.eventTitle}</h4>
                  
                  {/* Search Bar */}
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search by name or registration number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Attendance Table */}
                  <div className="attendance-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Reg. No</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents(selectedEvent.students).map(student => (
                          <tr key={student.id}>
                            <td>{student.regNo}</td>
                            <td>{student.name}</td>
                            <td>
                              <span className={`status-badge ${student.present ? 'present' : 'absent'}`}>
                                {student.present ? 'Present' : 'Absent'}
                              </span>
                            </td>
                            <td>
                              <button
                                className={`attendance-btn ${student.present ? 'mark-absent' : 'mark-present'}`}
                                onClick={() => handleMarkAttendance(selectedEvent.id, student.id)}
                              >
                                Mark {student.present ? 'Absent' : 'Present'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="attendance-summary">
                    <p>Total: {selectedEvent.students.length}</p>
                    <p>Present: {selectedEvent.students.filter(s => s.present).length}</p>
                    <p>Absent: {selectedEvent.students.filter(s => !s.present).length}</p>
                  </div>

                  <div className="form-buttons">
                    <button 
                      className="save-btn"
                      onClick={() => {
                        // Here you can add functionality to save attendance to a database
                        alert('Attendance saved successfully!');
                        setShowAttendanceList(false);
                      }}
                    >
                      Save Attendance
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setShowAttendanceList(false);
                        setSelectedEvent(null);
                        setSearchTerm('');
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'voting':
        return (
          <div className="voting-section">
            <h3>Core Member Elections</h3>
            
            {/* Voting List */}
            <div className="voting-list">
              {elections.map(election => (
                <div key={election.id} className="voting-card">
                  <h4>{election.title}</h4>
                  <p>Status: {election.status}</p>
                  <p>Total Votes: {election.totalVotes}</p>
                  <p>End Date: {new Date(election.endDate).toLocaleDateString()}</p>
                  <div className="voting-actions">
                    {!election.hasVoted && (
                      <button 
                        className="vote-btn"
                        onClick={() => handleVotingClick(election)}
                      >
                        Cast Vote
                      </button>
                    )}
                    <button 
                      className="view-results-btn"
                      onClick={() => handleViewResults(election)}
                    >
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="create-election-btn"
              onClick={() => setShowVotingForm(true)}
            >
              Create New Election
            </button>

            {/* Voting Modal */}
            {showVotingModal && selectedElection && (
              <div className="form-overlay">
                <div className="form-container voting-container">
                  <h4>Cast Your Vote - {selectedElection.title}</h4>
                  <div className="candidates-list">
                    {selectedElection.candidates.map(candidate => (
                      <div key={candidate.id} className="candidate-card">
                        <h5>{candidate.name}</h5>
                        <p>Department: {candidate.department}</p>
                        <p>Year: {candidate.year}</p>
                        <button
                          className={`vote-btn ${selectedCandidate === candidate.id ? 'selected' : ''}`}
                          onClick={() => setSelectedCandidate(candidate.id)}
                        >
                          Select Candidate
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="form-buttons">
                    <button
                      className="submit-vote-btn"
                      disabled={!selectedCandidate}
                      onClick={() => handleVote(selectedElection.id, selectedCandidate)}
                    >
                      Submit Vote
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setShowVotingModal(false);
                        setSelectedCandidate(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* New Election Form */}
            {showVotingForm && (
              <div className="form-overlay">
                <div className="form-container">
                  <h4>Create New Election</h4>
                  <form onSubmit={handleCreateElection}>
                    <div className="form-group">
                      <label>Election Title:</label>
                      <input
                        type="text"
                        name="title"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Candidates (comma-separated):</label>
                      <input
                        type="text"
                        name="candidates"
                        placeholder="John Doe, Jane Smith"
                        required
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="save-btn">Create</button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setShowVotingForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Voting Results Modal */}
            {showVotingResults && selectedElection && (
              <div className="form-overlay">
                <div className="form-container">
                  <h4>Election Results: {selectedElection.title}</h4>
                  <div className="results-container">
                    {selectedElection.candidates.map((candidate, index) => (
                      <div key={index} className="result-bar">
                        <p>{candidate.name}</p>
                        <div className="progress-bar">
                          <div 
                            className="progress"
                            style={{ 
                              width: `${(candidate.votes / selectedElection.totalVotes) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p>{candidate.votes} votes</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      setShowVotingResults(false);
                      setSelectedElection(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'booking':
        return (
          <div className="booking-section">
            <h3>Hall Booking</h3>
            
            {/* Booking List */}
            <div className="booking-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <h4>{booking.hall}</h4>
                  <p>Date: {booking.date}</p>
                  <p>Time: {booking.time}</p>
                  <p>Purpose: {booking.purpose}</p>
                  <p className={`status ${booking.status.toLowerCase()}`}>
                    Status: {booking.status}
                  </p>
                  {booking.status === 'Confirmed' && (
                    <button 
                      className="cancel-booking-btn"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              className="new-booking-btn"
              onClick={() => setShowBookingForm(true)}
            >
              New Booking
            </button>

            {/* New Booking Form */}
            {showBookingForm && (
              <div className="form-overlay">
                <div className="form-container">
                  <h4>New Hall Booking</h4>
                  <form onSubmit={handleCreateBooking}>
                    <div className="form-group">
                      <label>Hall:</label>
                      <select
                        value={newBooking.hall}
                        onChange={(e) => setNewBooking({
                          ...newBooking,
                          hall: e.target.value
                        })}
                        required
                      >
                        <option value="">Select Hall</option>
                        <option value="Seminar Hall 1">Seminar Hall 1</option>
                        <option value="Seminar Hall 2">Seminar Hall 2</option>
                        <option value="Conference Room">Conference Room</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date:</label>
                      <input
                        type="date"
                        value={newBooking.date}
                        onChange={(e) => setNewBooking({
                          ...newBooking,
                          date: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Time:</label>
                      <input
                        type="time"
                        value={newBooking.time}
                        onChange={(e) => setNewBooking({
                          ...newBooking,
                          time: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Purpose:</label>
                      <input
                        type="text"
                        value={newBooking.purpose}
                        onChange={(e) => setNewBooking({
                          ...newBooking,
                          purpose: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="save-btn">Book</button>
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="core-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h1>Core Member Dashboard</h1>
        </div>
        <div className="nav-right">
          <span className="user-info">Welcome, Core Member</span>
        </div>
      </nav>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Members</h3>
          <p>150</p>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h3>Pending Bookings</h3>
          <p>2</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Event Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance Tracker
          </button>
          <button
            className={`tab-btn ${activeTab === 'voting' ? 'active' : ''}`}
            onClick={() => setActiveTab('voting')}
          >
            Core Member Voting
          </button>
          <button
            className={`tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            Hall Booking
          </button>
        </div>

        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CoreDashboard; 