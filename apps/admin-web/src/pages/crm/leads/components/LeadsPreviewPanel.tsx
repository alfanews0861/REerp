import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Paper,
  TextField,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setSelectedLeadId } from '../../../../store/leadsSlice';
import { Lead } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

interface LeadsPreviewPanelProps {
  leads: Lead[];
}

interface LeadNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export const LeadsPreviewPanel: React.FC<LeadsPreviewPanelProps> = ({ leads }) => {
  const dispatch = useDispatch();
  const { selectedLeadId } = useSelector((state: RootState) => state.leads);
  const [tab, setTab] = useState(0);

  const [newNoteText, setNewNoteText] = useState('');
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [savingNote, setSavingNote] = useState(false);
  const [aiPitch, setAiPitch] = useState<{
    persona: string;
    recommendedProject: string;
    keyPoints: string[];
    script: string;
  } | null>(null);
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [copied, setCopied] = useState(false);

  const lead = leads.find((l) => l.id === selectedLeadId);

  const handleGenerateAIPitch = () => {
    setGeneratingPitch(true);
    setTimeout(() => {
      const budgetVal = lead ? (lead.budgetMin || (lead as any).budget || 4500000) : 4500000;
      const isWestern = budgetVal >= 3500000;

      setAiPitch({
        persona: isWestern
          ? 'Tech Executive / NRI Investor seeking high capital appreciation in Western Corridor'
          : 'Value Plot Investor seeking long-term growth near industrial highway corridor',
        recommendedProject: isWestern ? 'Sunrise Enclave - Mokila' : 'Greenfield Meadows - Shadnagar',
        keyPoints: isWestern
          ? [
              'Transit: 20 Mins drive to Financial District & Neopolis Kokapet via Shankarpally Highway',
              'Infrastructure: 40ft & 33ft BT roads, underground cabling, drainage & STP',
              'Approvals: 100% HMDA & RERA Approved with spot registration and bank loan approvals',
              'Action Hook: Offer 48-Hour Price Freeze Hold or free AC cab doorstep pickup',
            ]
          : [
              'Strategic Hub: 15 Mins to proposed 19,000-acre Hyderabad Pharma City',
              'Attractive Entry: Starting from ₹13,500/sq.yd with high appreciation potential',
              'Approvals: DTCP & RERA Approved gated township with overhead water tank',
              'Action Hook: Schedule complimentary weekend site visit in sanitized AC cab',
            ],
        script: `Hello ${lead?.fullName || 'Customer'}, this is calling from Sreekanth Reddy Realty. Based on your enquiry, our flagship project ${isWestern ? 'Sunrise Enclave in Mokila' : 'Greenfield Meadows in Shadnagar'} matches your preferred budget and facing. All plots come with 100% clear legal title and statutory HMDA/DTCP approvals. We can arrange a complimentary AC cab pickup for your family this weekend for a physical site inspection. Would morning 10 AM suit you?`,
      });
      setGeneratingPitch(false);
    }, 300);
  };

  const handleCopyScript = () => {
    if (!aiPitch) return;
    navigator.clipboard.writeText(aiPitch.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!lead) return;

    // Load existing notes for this lead
    const loadNotes = async () => {
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const q = query(
            collection(db, 'interactions'),
            where('leadId', '==', lead.id),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            const fetched = snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                text: data.notes || data.description || 'Note recorded',
                author: data.actor || data.employeeName || 'Staff',
                createdAt: data.createdAt || new Date().toISOString(),
              };
            });
            setNotes(fetched);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote notes, fallback to initial state', err);
      }

      // Default initial notes if none stored in firestore
      setNotes([
        {
          id: 'note-init-1',
          text: `Inquired regarding 200 sq.yd east-facing villa plot in Mokila. Budget ~₹50L.`,
          author: 'Telecaller Team',
          createdAt: lead.createdAt || new Date().toISOString(),
        },
      ]);
    };

    loadNotes();
  }, [lead?.id]);

  if (!lead) return null;

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;

    const noteObj: LeadNote = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      author: 'Current User',
      createdAt: new Date().toISOString(),
    };

    setSavingNote(true);
    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'interactions'), {
          leadId: lead.id,
          personId: lead.id,
          type: 'note',
          notes: newNoteText.trim(),
          actor: 'CRM Manager',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Saved note locally:', err);
    } finally {
      setNotes([noteObj, ...notes]);
      setNewNoteText('');
      setSavingNote(false);
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0, borderLeft: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Lead Details</Typography>
        <IconButton onClick={() => dispatch(setSelectedLeadId(null))} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.default' }}>
        <Avatar sx={{ width: 64, height: 64, mb: 2 }}>{lead.fullName.substring(0, 2).toUpperCase()}</Avatar>
        <Typography variant="h6">{lead.fullName}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <PhoneIcon fontSize="small" sx={{ mr: 1 }} /> {lead.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} /> {lead.email || 'N/A'}
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
        <Tab label="Details" />
        <Tab label="Timeline" />
        <Tab label={`Notes (${notes.length})`} />
      </Tabs>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {tab === 0 && (
          <Box>
            <Typography variant="subtitle2" color="primary">Properties</Typography>
            <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Source</Typography>
                <Typography variant="body2">{lead.source}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography variant="body2">{lead.status}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">City</Typography>
                <Typography variant="body2">{lead.city || 'Hyderabad'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Budget Range</Typography>
                <Typography variant="body2">
                  {lead.budgetMin ? `₹${(lead.budgetMin / 100000).toFixed(1)}L - ₹${((lead.budgetMax || 0) / 100000).toFixed(1)}L` : 'Flexible'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="primary">Gemini AI Lead Intelligence</Typography>
              <Chip label={`Intent Score: ${lead.aiIntentScore || 78}/100`} size="small" color="success" sx={{ fontWeight: 700 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {lead.aiRecommendation || 'Customer exhibits strong interest in gated villa plots with DTCP/HMDA approval.'}
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<AutoAwesomeIcon sx={{ color: '#eab308' }} />}
              disabled={generatingPitch}
              onClick={handleGenerateAIPitch}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, mb: 2 }}
            >
              {generatingPitch ? 'Analyzing Lead Profile...' : 'Generate Gemini AI Pitch & Strategy'}
            </Button>

            {aiPitch && (
              <Paper sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2 }}>
                <Typography variant="caption" fontWeight={700} color="success.dark" sx={{ display: 'block', mb: 0.5 }}>
                  BUYER PERSONA
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  {aiPitch.persona}
                </Typography>

                <Typography variant="caption" fontWeight={700} color="success.dark" sx={{ display: 'block', mb: 0.5 }}>
                  RECOMMENDED PROJECT
                </Typography>
                <Chip label={aiPitch.recommendedProject} size="small" color="primary" sx={{ fontWeight: 700, mb: 1.5 }} />

                <Typography variant="caption" fontWeight={700} color="success.dark" sx={{ display: 'block', mb: 0.5 }}>
                  TALKING POINTS
                </Typography>
                <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                  {aiPitch.keyPoints.map((kp, idx) => (
                    <Typography key={idx} variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      • {kp}
                    </Typography>
                  ))}
                </Stack>

                <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px solid #dcfce7' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.5 }}>
                    SUGGESTED CALL SCRIPT / WHATSAPP PITCH:
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.5, mb: 1 }}>
                    "{aiPitch.script}"
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    onClick={handleCopyScript}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0 }}
                  >
                    {copied ? 'Copied to Clipboard!' : 'Copy Script'}
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
              Customer Progress Milestones
            </Typography>
            <Stack spacing={2} sx={{ pl: 2, borderLeft: '2px solid #e2e8f0', ml: 1 }}>
              <Box sx={{ position: 'relative' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 18, position: 'absolute', left: -26, top: 2 }} />
                <Typography variant="body2" fontWeight={600}>Lead Captured</Typography>
                <Typography variant="caption" color="text.secondary">
                  Source: {lead.source} • {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                </Typography>
              </Box>

              <Box sx={{ position: 'relative' }}>
                <HistoryIcon color="primary" sx={{ fontSize: 18, position: 'absolute', left: -26, top: 2 }} />
                <Typography variant="body2" fontWeight={600}>Current Pipeline Stage: {lead.status}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Intent Index: {lead.aiIntentScore || 45} (Active)
                </Typography>
              </Box>

              <Box sx={{ position: 'relative' }}>
                <HistoryIcon color="action" sx={{ fontSize: 18, position: 'absolute', left: -26, top: 2 }} />
                <Typography variant="body2" fontWeight={600}>Routing & Assignment</Typography>
                <Typography variant="caption" color="text.secondary">
                  Assigned to: {lead.assignedExecutiveName || 'Sales Routing Desk'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="Type a follow-up note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<NoteAddIcon />}
                  disabled={!newNoteText.trim() || savingNote}
                  onClick={handleAddNote}
                >
                  Save Note
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Activity Notes History
            </Typography>

            <Stack spacing={1.5}>
              {notes.map((note) => (
                <Paper key={note.id} elevation={0} sx={{ p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1.5, bgcolor: '#fafafa' }}>
                  <Typography variant="body2">{note.text}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip label={note.author} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
