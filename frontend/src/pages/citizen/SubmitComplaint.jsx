import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';
import { formatTicket } from '../../utils/formatters';
import PageHeader from '../../components/common/PageHeader';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function SubmitComplaint() {
  useDocumentTitle('Report an issue');
  const toast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      const created = await api.complaints.create(form);
      toast.success(`Complaint ${formatTicket(created.id, created.createdAt)} submitted successfully.`);
      navigate(`/citizen/complaints/${created.id}`);
    } catch (err) {
      toast.error(err.message || 'Could not submit your complaint. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <PageHeader
        eyebrow="CITIZEN ISSUE DISPATCH"
        title="Report a Civic Problem"
        subtitle="Submit photographic and geo-tagged incident data. CiviGo automatically routes the ticket to the designated municipal department."
      />
      <div
        className="glass-card p-3.5 rounded-3 mb-4 d-flex gap-3 align-items-center"
        style={{
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
        }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 36, height: 36, background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cp-primary)' }}
        >
          <i className="bi bi-info-circle-fill fs-6" />
        </div>
        <small className="mb-0 text-white" style={{ lineHeight: 1.5 }}>
          Clear photographic evidence and an accurate landmark accelerate field dispatch by up to <strong>65%</strong>. Your profile contact details will be attached automatically for officer communication.
        </small>
      </div>

      <div className="glass-panel border-glow rounded-4 p-4 p-md-5 shadow-2xl">
        <ComplaintForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}

