import React from 'react';
import { Clock, Edit, Trash2, FileText, ArrowLeft, Calendar } from 'lucide-react';

const EventCard = ({ event, onEdit, onDelete, onBack }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      {/* Header with Back Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-6">
        
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Event Details</span>
          </div>
        </div>
      </div>

      {/* Main Event Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          {/* Event Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Event</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Time Card */}
            <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-2">Duration</h3>
                  <p className="text-xl font-bold text-white">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-green-600/20 rounded-xl border border-green-500/30">
                    <Calendar className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-2">Status</h3>
                  <p className="text-xl font-bold text-white">Scheduled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {event.description && (
            <div className="mb-8">
              <div className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/30">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-500/30">
                      <FileText className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Description</h3>
                    <p className="text-slate-200 leading-relaxed text-lg">{event.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-600/50">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onEdit(event)}
                className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                <Edit className="h-4 w-4" />
                Edit Event
              </button>
            </div>
            
            <button
                onClick={() => onDelete(event.id)}
                className="flex items-center gap-3 px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/30"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;