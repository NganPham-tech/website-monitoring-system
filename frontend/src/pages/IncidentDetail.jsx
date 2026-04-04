import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import incidentService from '../services/incidentService';

import IncidentOverview from '../components/incidents/IncidentOverview';
import ImpactAnalysis from '../components/incidents/ImpactAnalysis';
import IncidentTimeline from '../components/incidents/IncidentTimeline';
import IncidentMetadata from '../components/incidents/IncidentMetadata';
import IncidentActions from '../components/incidents/IncidentActions';

const IncidentDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // 1. Fetch Incident Data
  const { 
    data: incident, 
    isLoading: isIncidentLoading,
    isRefetching
  } = useQuery({
    queryKey: ['incident', id],
    queryFn: () => incidentService.getIncidentById(id),
    staleTime: 30000,
  });

  const isDataLoading = isIncidentLoading && !isRefetching;

  // 2. Mutations
  const resolveMutation = useMutation({
    mutationFn: () => incidentService.resolveIncident(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Đã giải quyết sự cố thành công!');
        queryClient.invalidateQueries(['incident', id]);
      }
    },
    onError: () => {
      toast.error('Lỗi khi đánh dấu giải quyết. Vui lòng thử lại.');
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: (note) => incidentService.addTimelineNote(id, note),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Đã thêm ghi chú mới!');
        queryClient.invalidateQueries(['incident', id]);
      }
    },
    onError: () => {
      toast.error('Lỗi khi thêm ghi chú. Vui lòng thử lại.');
    }
  });

  const assignMutation = useMutation({
    mutationFn: (userId) => incidentService.assignIncident(id, userId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Gán người xử lý thành công!');
        queryClient.invalidateQueries(['incident', id]);
      }
    },
    onError: () => {
      toast.error('Lỗi khi gán người xử lý. Vui lòng thử lại.');
    }
  });

  // Handlers for Actions
  const handleResolve = () => resolveMutation.mutateAsync();
  const handleAddNote = (note) => addNoteMutation.mutateAsync(note);
  const handleAssign = (userId) => assignMutation.mutateAsync(userId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-20">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Context */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Sự cố</span>
        <span>/</span>
        <span className="font-semibold text-slate-700">Chi tiết #{id}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Left Column (Main Content) */}
        <div className="flex-[1_1_100%] xl:flex-[1_1_65%] space-y-6 lg:space-y-8 w-full min-w-0">
          <IncidentOverview 
            incident={incident} 
            isLoading={isDataLoading} 
          />
          
          <ImpactAnalysis 
            impact={incident?.impact} 
            isLoading={isDataLoading} 
          />
          
          <IncidentTimeline 
            timeline={incident?.timeline} 
            isLoading={isDataLoading} 
          />
          
          <IncidentActions 
            incident={incident}
            isLoading={isDataLoading}
            onResolve={handleResolve}
            onAddNote={handleAddNote}
            onAssign={handleAssign}
          />
        </div>

        {/* Right Column (Sidebar/Metadata) */}
        <div className="flex-[1_1_100%] xl:flex-[1_1_35%] w-full min-w-0">
          <IncidentMetadata 
            incident={incident} 
            isLoading={isDataLoading} 
          />
        </div>

      </div>
    </div>
  );
};

export default IncidentDetail;
