'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Hash, Lock, Plus, Search } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
}

interface Team {
  id: string;
  name: string;
  channels: Channel[];
}

interface TeamsPanelProps {
  onChannelSelect: (teamId: string, channelId: string) => void;
  selectedChannel: string | null;
}

export default function TeamsPanel({ onChannelSelect, selectedChannel }: TeamsPanelProps) {
  const [expandedTeams, setExpandedTeams] = useState<string[]>(['team1']);

  // Mock data - will be replaced with Firebase data
  const teams: Team[] = [
    {
      id: 'team1',
      name: 'Engineering Team',
      channels: [
        { id: 'general', name: 'General', isPrivate: false },
        { id: 'development', name: 'Development', isPrivate: false },
        { id: 'bugs', name: 'Bug Reports', isPrivate: false },
        { id: 'private', name: 'Private Channel', isPrivate: true },
      ],
    },
    {
      id: 'team2',
      name: 'Marketing',
      channels: [
        { id: 'general', name: 'General', isPrivate: false },
        { id: 'campaigns', name: 'Campaigns', isPrivate: false },
      ],
    },
  ];

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  return (
    <div className="w-64 bg-[#F5F5F5] border-r border-gray-300 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-300">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Teams List */}
      <div className="flex-1 overflow-y-auto">
        {teams.map((team) => {
          const isExpanded = expandedTeams.includes(team.id);
          return (
            <div key={team.id} className="mb-2">
              <button
                onClick={() => toggleTeam(team.id)}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="font-semibold text-sm">{team.name}</span>
                </div>
                <Plus size={16} className="text-gray-500" />
              </button>

              {isExpanded && (
                <div className="pl-4">
                  {team.channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => onChannelSelect(team.id, channel.id)}
                      className={`w-full px-4 py-1.5 flex items-center space-x-2 hover:bg-gray-200 transition-colors ${
                        selectedChannel === channel.id ? 'bg-gray-200' : ''
                      }`}
                    >
                      {channel.isPrivate ? (
                        <Lock size={16} className="text-gray-500" />
                      ) : (
                        <Hash size={16} className="text-gray-500" />
                      )}
                      <span className="text-sm">{channel.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
