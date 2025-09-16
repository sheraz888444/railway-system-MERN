import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface StaffReport {
  _id: string;
  staffId: {
    name: string;
    email: string;
  };
  date: string;
  type: string;
  content: string;
  metrics: {
    passengersAssisted: number;
    issuesResolved: number;
    trainsMonitored: number;
    delaysReported: number;
  };
  status: string;
  reviewComments?: string;
}

interface StaffReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: StaffReport[];
  onUpdateReportStatus: (reportId: string, status: string, reviewComments?: string) => Promise<void>;
}

const StaffReportsModal: React.FC<StaffReportsModalProps> = ({ isOpen, onClose, reports, onUpdateReportStatus }) => {
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('draft');
  const [reviewComments, setReviewComments] = useState<string>('');

  const startEditing = (report: StaffReport) => {
    setEditingReportId(report._id);
    setStatus(report.status);
    setReviewComments(report.reviewComments || '');
  };

  const cancelEditing = () => {
    setEditingReportId(null);
    setStatus('draft');
    setReviewComments('');
  };

  const saveChanges = async () => {
    if (!editingReportId) return;
    try {
      await onUpdateReportStatus(editingReportId, status, reviewComments);
      toast.success('Report updated successfully');
      cancelEditing();
    } catch (error) {
      toast.error('Failed to update report');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Reports</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {reports.length === 0 && <p className="text-center text-gray-500">No reports available.</p>}
          {reports.map((report) => (
            <div key={report._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold text-lg">{report.staffId.name} ({report.staffId.email})</p>
                  <p className="text-sm text-gray-600">{new Date(report.date).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 capitalize">Type: {report.type}</p>
                </div>
                {editingReportId === report._id ? (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                    <Button onClick={saveChanges}>Save</Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => startEditing(report)}>Review</Button>
                )}
              </div>
              <p className="mb-2 whitespace-pre-wrap">{report.content}</p>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>Passengers Assisted: {report.metrics.passengersAssisted}</div>
                <div>Issues Resolved: {report.metrics.issuesResolved}</div>
                <div>Trains Monitored: {report.metrics.trainsMonitored}</div>
                <div>Delays Reported: {report.metrics.delaysReported}</div>
              </div>
              {editingReportId === report._id ? (
                <>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    className="mt-2"
                    placeholder="Add review comments"
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    rows={3}
                  />
                </>
              ) : (
                report.reviewComments && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="font-semibold">Review Comments:</p>
                    <p className="whitespace-pre-wrap">{report.reviewComments}</p>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffReportsModal;
