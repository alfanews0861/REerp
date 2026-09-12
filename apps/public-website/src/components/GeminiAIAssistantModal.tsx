import React, { FC, useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
  Chip,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LockClockIcon from '@mui/icons-material/LockClock';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useI18n } from '../providers/LanguageContext';
import { PublicPlot } from '../data/venturesData';
import { AIMessage, queryGeminiRealEstateAssistant } from '../services/geminiAiService';

export interface GeminiAIAssistantModalProps {
  open: boolean;
  onClose: () => void;
  onHoldPlot?: (plot: PublicPlot) => void;
  onVisitPlot?: (plot: PublicPlot) => void;
  availablePlots?: PublicPlot[];
}

export const GeminiAIAssistantModal: FC<GeminiAIAssistantModalProps> = ({
  open,
  onClose,
  onHoldPlot,
  onVisitPlot,
  availablePlots,
}) => {
  const { t, language } = useI18n();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: AIMessage = {
    id: 'msg-init',
    sender: 'assistant',
    text:
      language === 'te'
        ? `నమస్కారం! నేను మీ **జెమిని AI రియల్ ఎస్టేట్ సలహాదారుని**. \n\nహైదరాబాద్‌లోని HMDA/DTCP ఆమోదిత లేఅవుట్లు, మోకిల, శంకర్‌పల్లి, షాద్‌నగర్, కొల్లూరు కారిడార్లలో ప్లాట్లు, రిజిస్ట్రేషన్ మరియు మీ బడ్జెట్‌లోని ప్లాట్ల గురించి అడగండి.`
        : language === 'hi'
        ? `नमस्ते! मैं आपका **जेमिनी एआई रियल एस्टेट सलाहकार** हूँ। \n\nहैदराबाद के HMDA/DTCP प्रोजेक्ट्स, मोकिला, शादनगर गलियारों, रजिस्ट्री प्रक्रिया और अपने बजट में प्लॉट्स के बारे में पूछें।`
        : `Hello! I am your **Gemini AI Real Estate Advisor**. \n\nI can assist you with Hyderabad growth corridors, HMDA vs DTCP regulatory guidelines, finding plots within your exact budget, and scheduling complimentary AC cab site visits.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<AIMessage[]>([initialGreeting]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await queryGeminiRealEstateAssistant(textToSend, language, availablePlots);
      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.replyText,
        recommendedPlots: response.recommendedPlots,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: AIMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered a temporary connection glitch. Please feel free to ask again or call our senior advisor at +91 98765 43210.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([initialGreeting]);
  };

  const quickPrompts = [
    t('ai_quick_prompt_1'),
    t('ai_quick_prompt_2'),
    t('ai_quick_prompt_3'),
    t('ai_quick_prompt_4'),
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, height: '80vh', display: 'flex', flexDirection: 'column' } }}>
      {/* Header */}
      <DialogTitle
        sx={{
          p: 2,
          bgcolor: 'primary.dark',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', color: '#ffffff' }}>
            <AutoAwesomeIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {t('ai_advisor_title')}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Active &bull; Google Gemini Real Estate Intelligence
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleClear} size="small" sx={{ color: '#ffffff', opacity: 0.8 }} title="Clear Chat">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Chat Messages */}
      <DialogContent sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto', bgcolor: '#f9fafb' }}>
        <Stack spacing={2}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, maxWidth: '90%', alignItems: 'flex-start' }}>
                  {!isUser && (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', mt: 0.5 }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: isUser ? 'primary.main' : '#ffffff',
                      color: isUser ? '#ffffff' : 'text.primary',
                      border: isUser ? 'none' : '1px solid #e5e7eb',
                      boxShadow: isUser ? '0 2px 8px rgba(25, 118, 210, 0.25)' : '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        '& strong': { color: isUser ? '#ffffff' : 'primary.dark' },
                      }}
                    >
                      {msg.text}
                    </Typography>

                    {/* Render Recommended Plot Cards if available */}
                    {msg.recommendedPlots && msg.recommendedPlots.length > 0 && (
                      <Stack spacing={1.5} sx={{ mt: 2 }}>
                        {msg.recommendedPlots.map((plot) => (
                          <Card
                            key={plot.id}
                            variant="outlined"
                            sx={{
                              borderColor: '#93c5fd',
                              bgcolor: '#eff6ff',
                              borderRadius: 2,
                            }}
                          >
                            <CardContent sx={{ p: 1.5, pb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" fontWeight={800} color="primary.dark">
                                  Plot #{plot.plotNumber} ({plot.facing} Facing)
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                  ₹{(plot.totalPrice / 100000).toFixed(2)} L
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {plot.projectName} &bull; {plot.areaSqYds} Sq.Yds ({plot.dimensions})
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 1, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
                              {onVisitPlot && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<DirectionsCarIcon fontSize="small" />}
                                  onClick={() => {
                                    onClose();
                                    onVisitPlot(plot);
                                  }}
                                  sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25 }}
                                >
                                  Free Cab Visit
                                </Button>
                              )}
                              {onHoldPlot && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  startIcon={<LockClockIcon fontSize="small" />}
                                  onClick={() => {
                                    onClose();
                                    onHoldPlot(plot);
                                  }}
                                  sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, fontWeight: 700 }}
                                >
                                  Hold 48h
                                </Button>
                              )}
                            </CardActions>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Paper>
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, px: 1 }}>
                  {msg.timestamp}
                </Typography>
              </Box>
            );
          })}
          {loading && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                <SmartToyIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Paper sx={{ p: 1.5, px: 2, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={16} color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    Gemini AI is analyzing layout databases...
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </DialogContent>

      {/* Suggested Quick Prompts */}
      <Box sx={{ px: 2, py: 1, bgcolor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
          Suggested Questions:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {quickPrompts.map((qp, idx) => (
            <Chip
              key={idx}
              label={qp}
              size="small"
              onClick={() => handleSend(qp)}
              disabled={loading}
              clickable
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: '#f3f4f6',
                '&:hover': { bgcolor: '#e0e7ff', color: 'primary.main' },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Input Bar */}
      <Box sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('ai_placeholder')}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f9fafb',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
            endIcon={<SendIcon />}
            sx={{ borderRadius: 3, px: 2.5, fontWeight: 700, textTransform: 'none' }}
          >
            {t('ai_ask_button')}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
