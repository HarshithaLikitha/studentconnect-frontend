import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar, Plus, Search, Filter, MapPin, Clock, Users, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'meetup',
    start_date: '',
    end_date: '',
    location: '',
    is_virtual: false,
    meeting_url: '',
    max_attendees: '',
    registration_deadline: '',
    image_url: ''
  });
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const eventTypes = [
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'conference', label: 'Conference' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'networking', label: 'Networking' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [currentPage, selectedType, showUpcoming]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '12',
        upcoming: showUpcoming.toString()
      });
      
      if (selectedType) {
        params.append('type', selectedType);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events);
        setTotalPages(data.pages);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const eventData = {
        ...newEvent,
        max_attendees: newEvent.max_attendees ? parseInt(newEvent.max_attendees) : null
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsCreateDialogOpen(false);
        setNewEvent({
          title: '',
          description: '',
          event_type: 'meetup',
          start_date: '',
          end_date: '',
          location: '',
          is_virtual: false,
          meeting_url: '',
          max_attendees: '',
          registration_deadline: '',
          image_url: ''
        });
        fetchEvents();
      } else {
        console.error('Failed to create event:', data.error);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'hackathon': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'meetup': return 'bg-green-100 text-green-800';
      case 'conference': return 'bg-red-100 text-red-800';
      case 'seminar': return 'bg-yellow-100 text-yellow-800';
      case 'networking': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventFull = (event) => {
    return event.max_attendees && event.attendees_count >= event.max_attendees;
  };

  const isRegistrationClosed = (event) => {
    if (!event.registration_deadline) return false;
    return new Date() > new Date(event.registration_deadline);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-gray-600 mt-2">Discover and attend exciting events in your community</p>
            </div>
            
            {user && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Organize an event for the student community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Describe your event"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event_type">Event Type</Label>
                      <Select value={newEvent.event_type} onValueChange={(value) => setNewEvent({...newEvent, event_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start_date">Start Date & Time</Label>
                        <Input
                          id="start_date"
                          type="datetime-local"
                          value={newEvent.start_date}
                          onChange={(e) => setNewEvent({...newEvent, start_date: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end_date">End Date & Time (optional)</Label>
                        <Input
                          id="end_date"
                          type="datetime-local"
                          value={newEvent.end_date}
                          onChange={(e) => setNewEvent({...newEvent, end_date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_virtual"
                        checked={newEvent.is_virtual}
                        onCheckedChange={(checked) => setNewEvent({...newEvent, is_virtual: checked})}
                      />
                      <Label htmlFor="is_virtual">Virtual Event</Label>
                    </div>
                    {newEvent.is_virtual ? (
                      <div className="grid gap-2">
                        <Label htmlFor="meeting_url">Meeting URL</Label>
                        <Input
                          id="meeting_url"
                          value={newEvent.meeting_url}
                          onChange={(e) => setNewEvent({...newEvent, meeting_url: e.target.value})}
                          placeholder="https://zoom.us/j/..."
                        />
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                          placeholder="Enter event location"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="max_attendees">Max Attendees (optional)</Label>
                        <Input
                          id="max_attendees"
                          type="number"
                          value={newEvent.max_attendees}
                          onChange={(e) => setNewEvent({...newEvent, max_attendees: e.target.value})}
                          placeholder="No limit"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="registration_deadline">Registration Deadline (optional)</Label>
                        <Input
                          id="registration_deadline"
                          type="datetime-local"
                          value={newEvent.registration_deadline}
                          onChange={(e) => setNewEvent({...newEvent, registration_deadline: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image_url">Image URL (optional)</Label>
                      <Input
                        id="image_url"
                        value={newEvent.image_url}
                        onChange={(e) => setNewEvent({...newEvent, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.start_date}>
                      Create Event
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="upcoming"
                checked={showUpcoming}
                onCheckedChange={setShowUpcoming}
              />
              <Label htmlFor="upcoming" className="text-sm">Upcoming only</Label>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-green-600 rounded-t-lg flex items-center justify-center">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <Calendar className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                      <Badge className={getEventTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.start_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {formatTime(event.start_date)}
                      {event.end_date && ` - ${formatTime(event.end_date)}`}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-3">
                      {event.description || 'No description available'}
                    </CardDescription>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      {event.is_virtual ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      <span className="truncate">
                        {event.is_virtual ? 'Virtual Event' : (event.location || 'Location TBA')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.attendees_count} attending
                        {event.max_attendees && ` / ${event.max_attendees}`}
                      </div>
                      <div className="flex gap-1">
                        {isEventFull(event) && (
                          <Badge variant="destructive" className="text-xs">Full</Badge>
                        )}
                        {isRegistrationClosed(event) && (
                          <Badge variant="secondary" className="text-xs">Closed</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedType
                ? 'Try adjusting your search or filter criteria'
                : showUpcoming
                ? 'No upcoming events. Check back later!'
                : 'Be the first to create an event!'}
            </p>
            {user && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create First Event
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

