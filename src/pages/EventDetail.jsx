import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, Video, ExternalLink, Settings, UserPlus, UserMinus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchEventAttendees();
  }, [id]);

  useEffect(() => {
    if (event && user && attendees.length > 0) {
      setIsAttending(attendees.some(attendee => attendee.id === user.id));
    }
  }, [event, user, attendees]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setEvent(data);
      } else {
        console.error('Failed to fetch event details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const fetchEventAttendees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}/attendees`);
      const data = await response.json();
      
      if (response.ok) {
        setAttendees(data);
      } else {
        console.error('Failed to fetch event attendees:', data.error);
      }
    } catch (error) {
      console.error('Error fetching event attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsAttending(true);
        fetchEventAttendees();
        fetchEventDetails();
      } else {
        console.error('Failed to register for event:', data.error);
        alert(data.error || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleUnregister = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}/unregister`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsAttending(false);
        fetchEventAttendees();
        fetchEventDetails();
      } else {
        console.error('Failed to unregister from event:', data.error);
        alert(data.error || 'Failed to unregister from event');
      }
    } catch (error) {
      console.error('Error unregistering from event:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const isEventFull = () => {
    return event?.max_attendees && event.attendees_count >= event.max_attendees;
  };

  const isRegistrationClosed = () => {
    if (!event?.registration_deadline) return false;
    return new Date() > new Date(event.registration_deadline);
  };

  const isEventPast = () => {
    return new Date() > new Date(event?.start_date);
  };

  const canRegister = () => {
    return !isEventFull() && !isRegistrationClosed() && !isEventPast() && !isAttending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
            <Button onClick={() => navigate('/events')}>
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>

        {/* Event Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Calendar className="h-12 w-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getEventTypeColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                      {isEventFull() && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                      {isRegistrationClosed() && (
                        <Badge variant="secondary">Registration Closed</Badge>
                      )}
                      {isEventPast() && (
                        <Badge variant="outline">Past Event</Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.start_date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatTime(event.start_date)}
                        {event.end_date && ` - ${formatTime(event.end_date)}`}
                      </div>
                      <div className="flex items-center gap-2">
                        {event.is_virtual ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        {event.is_virtual ? 'Virtual Event' : (event.location || 'Location TBA')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.attendees_count} attending
                        {event.max_attendees && ` / ${event.max_attendees} max`}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user && (
                      <>
                        {isAttending ? (
                          <Button
                            variant="outline"
                            onClick={handleUnregister}
                            className="flex items-center gap-2"
                            disabled={event.created_by === user.id}
                          >
                            <UserMinus className="h-4 w-4" />
                            Unregister
                          </Button>
                        ) : (
                          <Button
                            onClick={handleRegister}
                            className="flex items-center gap-2"
                            disabled={!canRegister()}
                          >
                            <UserPlus className="h-4 w-4" />
                            {isEventFull() ? 'Full' : isRegistrationClosed() ? 'Closed' : isEventPast() ? 'Past Event' : 'Register'}
                          </Button>
                        )}
                        {event.created_by === user.id && (
                          <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {event.description && (
              <CardDescription className="mt-4 text-base">
                {event.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Registration Warnings */}
        {event.registration_deadline && !isRegistrationClosed() && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  Registration closes on {formatDate(event.registration_deadline)} at {formatTime(event.registration_deadline)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Event Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {event.description || 'No description provided.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Date & Time</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Start: {formatDate(event.start_date)} at {formatTime(event.start_date)}</div>
                    {event.end_date && (
                      <div>End: {formatDate(event.end_date)} at {formatTime(event.end_date)}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {event.is_virtual ? (
                      <>
                        <Video className="h-4 w-4" />
                        <span>Virtual Event</span>
                        {event.meeting_url && isAttending && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(event.meeting_url, '_blank')}
                            className="ml-2"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Join Meeting
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4" />
                        <span>{event.location || 'Location TBA'}</span>
                      </>
                    )}
                  </div>
                </div>

                {event.max_attendees && (
                  <div>
                    <h3 className="font-medium mb-2">Capacity</h3>
                    <div className="text-sm text-gray-600">
                      {event.attendees_count} / {event.max_attendees} attendees
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <Badge className={getEventTypeColor(event.event_type)}>
                    {event.event_type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendees:</span>
                  <span>{event.attendees_count}</span>
                </div>
                {event.max_attendees && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Capacity:</span>
                    <span>{event.max_attendees}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{formatDate(event.created_at)}</span>
                </div>
                {event.registration_deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Deadline:</span>
                    <span className="text-right">{formatDate(event.registration_deadline)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attendees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
          </TabsList>

          <TabsContent value="attendees" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendees.map((attendee) => (
                <Card key={attendee.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={attendee.avatar_url} />
                        <AvatarFallback>
                          {attendee.first_name?.[0]}{attendee.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {attendee.first_name} {attendee.last_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">@{attendee.username}</p>
                        {attendee.college && (
                          <p className="text-xs text-gray-400 truncate">{attendee.college}</p>
                        )}
                        {attendee.id === event.created_by && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Organizer
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {attendees.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees yet</h3>
                  <p className="text-gray-500">
                    Be the first to register for this event!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventDetail;

