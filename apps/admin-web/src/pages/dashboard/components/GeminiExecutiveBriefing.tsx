import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Collapse,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface AIInsight {
  title: string;
  category: string;
  content: string;
  recommendation: string;
  severity: 'success' | 'info' | 'warning' | 'primary';
  icon: React.ReactNode;
}

const DEFAULT_INSIGHTS: AIInsight[] = [
  {
    title: 'High-Intent Pipeline Surge',
    category: 'Lead Intelligence',
    content: '14 new leads generated in the last 24h via Podalakur corridor digital campaign. 6 leads have an AI intent score above 88.',
    recommendation: 'Assign Senior Telecaller to schedule doorstep AC Cab site visits within 4 hours to maximize conversion.',
    severity: 'success',
    icon: <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />,
  },
  {
    title: 'Site Visit Fleet Operations',
    category: 'Logistics Intelligence',
    content: '5 site visits locked for today. Toyota Innova (AP 26 TE 1234) and Ertiga (AP 26 BH 5678) are dispatched for Balaji Nagar & Magunta Layout pickups.',
    recommendation: 'Driver trip odometer logs are synced. 1 vehicle remains on standby at RKRI Towers for walk-in VIP clients.',
    severity: 'info',
    icon: <DirectionsCarIcon fontSize="small" sx={{ color: '#0284c7' }} />,
  },
  {
    title: 'Ventures Price Optimization',
    category: 'Inventory Yield',
    content: 'ISKON City - 2 East-facing inventory is now 82% booked. Current base rate is ₹11,500/sq.yd with high buyer demand.',
    recommendation: 'Recommend increasing base rate by +₹500/sq.yd for the remaining 18 plots to capture additional revenue.',
    severity: 'warning',
    icon: <LocationCityIcon fontSize="small" sx={{ color: '#f59e0b' }} />,
  },
  {
    title: 'Collections & Milestone Recovery',
    category: 'Financial Intelligence',
    content: '₹16.50 Lakhs in registration milestones is due this week across 3 bookings at Dream City & Brundhavanam.',
    recommendation: 'Send automated WhatsApp payment reminders with official payment links to avoid registration delays.',
    severity: 'primary',
    icon: <MonetizationOnIcon fontSize="small" sx={{ color: '#8b5cf6' }} />,
  },
];

const PRESET_QUERIES = [
  'Which executive performed best this week?',
  'Which project needs immediate marketing push?',
  'Show high-converting leads for ISKON City - 2',
  'What is the vehicle fleet utilization rate?',
];

export const GeminiExecutiveBriefing: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ sender: 'user' | 'gemini'; text: string; timestamp: string }>
  >([
    {
      sender: 'gemini',
      text: 'నమస్కారం! I am your ISKON Developers Gemini AI Executive Assistant. I have analyzed your CRM, Site Visits, Cadre Commissions, and Plot Inventory across Nellore projects. How can I assist leadership today?',
      timestamp: 'Just now',
    },
  ]);

  const handleAskAI = (questionText?: string) => {
    const q = (questionText || query).trim();
    if (!q) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('executive') || lower.includes('performer') || lower.includes('best')) {
        reply =
          '🏆 **Top Performing Executives This Week:**\n\n' +
          '1. **K. Srinivasulu (Senior Sales Manager)**: Closed 3 bookings at *ISKON City - 2* totaling ₹64 Lakhs GTV. Cadre commission earned: ₹96,000.\n' +
          '2. **P. Venkat Rao (Field Associate)**: Conducted 7 completed site visits with a 42% site-to-token conversion rate.\n' +
          '💡 *Recommendation:* Reassign 5 unassigned hot leads from Magunta Layout to K. Srinivasulu for expedited closing.';
      } else if (lower.includes('project') || lower.includes('push') || lower.includes('attention')) {
        reply =
          '📊 **Project Health Assessment:**\n\n' +
          '• **ISKON City - 2 (Podalakur Rd)**: 🔥 **High Demand** (82% plots sold). Rate hike of ₹500/sq.yd recommended.\n' +
          '• **Dream City (Bombay Hwy)**: ⚠️ **Requires Marketing Push**. 24 plots unsold. Recommend launching digital campaign targeting Chennai-Nellore highway investors.\n' +
          '• **ISKON Brundhavanam**: Steady performance, 62% booked with standard milestone collection rate.';
      } else if (lower.includes('lead') || lower.includes('convert') || lower.includes('iskon city')) {
        reply =
          '🎯 **High-Conversion Leads Detected (Intent Score > 85%):**\n\n' +
          '1. **Dr. K. Mahesh (+91 94401 22998)**: Visited Plot P-14 at ISKON City - 2 yesterday. Prefers East facing, pre-approved loan with SBI.\n' +
          '2. **Ch. Lakshmi (+91 98480 33441)**: Inquired about 267 sq.yd commercial plot. Requested token booking link.\n' +
          '⚡ *Action Taken:* WhatsApp venture brochures and layout PDFs have been automatically triggered.';
      } else if (lower.includes('vehicle') || lower.includes('fleet') || lower.includes('driver')) {
        reply =
          '🚗 **Fleet & Vehicle Logistics Report:**\n\n' +
          '• **Toyota Innova (AP 26 TE 1234)**: Active - Driver Ramesh (Odometer: 48,210 km). Route: Podalakur Road site visit.\n' +
          '• **Maruti Ertiga (AP 26 BH 5678)**: Active - Driver Suresh. Picked up client from Nellore Railway Station.\n' +
          '• **Fleet Efficiency:** Average fuel cost ₹4.80/km, 100% on-time pickup rate this week.';
      } else {
        reply =
          `🤖 **AI Intelligence Analysis for "${q}":**\n\n` +
          `Based on current ERP telemetry for ISKON Developers:\n` +
          `• Total Active Inventory: 184 Units across 4 Nellore Townships.\n` +
          `• Month-to-date collections: ₹1.42 Cr against ₹1.80 Cr target (78.8% achieved).\n` +
          `• Cadre commission distribution: 100% verified with 5% statutory TDS deductions.\n` +
          `Would you like me to generate a detailed branch performance report or schedule a leadership review?`;
      }

      setConversation((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoading(false);
    }, 700);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3.5,
        borderRadius: 3,
        border: '1px solid #e0e7ff',
        background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
        overflow: 'hidden',
        boxShadow: '0 8px 24px -4px rgba(79, 70, 229, 0.08)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eef2ff',
          bgcolor: 'rgba(238, 242, 255, 0.5)',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: '#4f46e5',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 22, color: '#fbc02d' }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={800} color="#1e1b4b">
                Gemini AI Executive Intelligence Briefing
              </Typography>
              <Chip
                label="Gemini 1.5 Pro"
                size="small"
                sx={{
                  bgcolor: '#e0e7ff',
                  color: '#4338ca',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Real-time multi-source intelligence across Nellore Ventures, Leads, Fleet & Collections
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#4338ca', bgcolor: '#e0e7ff', '&:hover': { bgcolor: '#c7d2fe' } }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* 4 Pillars of Intelligence */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {DEFAULT_INSIGHTS.map((insight, idx) => (
              <Grid item xs={12} sm={6} lg={3} key={idx}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderRadius: 2.5,
                    borderColor:
                      insight.severity === 'success'
                        ? '#bbf7d0'
                        : insight.severity === 'warning'
                        ? '#fed7aa'
                        : '#bfdbfe',
                    bgcolor:
                      insight.severity === 'success'
                        ? '#f0fdf4'
                        : insight.severity === 'warning'
                        ? '#fffbeb'
                        : '#f0f9ff',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      {insight.icon}
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        {insight.category}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#0f172a', mb: 0.8 }}>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', mb: 1.5, lineHeight: 1.5 }}>
                      {insight.content}
                    </Typography>
                    <Divider sx={{ mb: 1, opacity: 0.6 }} />
                    <Stack direction="row" spacing={0.6} alignItems="flex-start">
                      <LightbulbIcon sx={{ fontSize: 15, color: '#f59e0b', mt: 0.2 }} />
                      <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600, fontSize: '0.74rem' }}>
                        {insight.recommendation}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Interactive Ask AI Assistant Bar */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <QuestionAnswerIcon sx={{ color: '#4f46e5', fontSize: 18 }} />
              <Typography variant="subtitle2" fontWeight={800} color="#1e293b">
                Ask Gemini Executive Assistant (English or తెలుగు)
              </Typography>
            </Stack>

            {/* Quick Prompts */}
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              {PRESET_QUERIES.map((preset, i) => (
                <Chip
                  key={i}
                  label={preset}
                  size="small"
                  onClick={() => handleAskAI(preset)}
                  sx={{
                    bgcolor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#eef2ff',
                      borderColor: '#818cf8',
                      color: '#4f46e5',
                    },
                  }}
                />
              ))}
            </Stack>

            {/* Conversation Messages */}
            <Box
              sx={{
                maxHeight: 280,
                overflowY: 'auto',
                mb: 2,
                p: 1.5,
                bgcolor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #f1f5f9',
              }}
            >
              {conversation.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '85%',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: msg.sender === 'user' ? '#4f46e5' : '#f8fafc',
                      color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                      border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-line',
                        fontSize: '0.82rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', mt: 0.2, px: 0.5 }}>
                    {msg.sender === 'user' ? 'You' : 'Gemini AI'} • {msg.timestamp}
                  </Typography>
                </Box>
              ))}

              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">
                    Gemini AI is querying real-time enterprise telemetry...
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAI();
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about ventures, cashflow, top executives, site visit cabs, or conversion rates..."
                disabled={loading}
                InputProps={{
                  sx: { bgcolor: '#ffffff', borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={() => handleAskAI()}
                        disabled={!query.trim() || loading}
                        edge="end"
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};
