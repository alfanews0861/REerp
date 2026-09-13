import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tooltip,
  Alert,
  Menu,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  Campaign as CampaignIcon,
  Add as AddIcon,
  DoneAll as DoneAllIcon,
  PriorityHigh as PriorityHighIcon,
  SupervisorAccount as SupervisorAccountIcon,
  FlashOn as QuickReplyIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@real-estate-erp/hooks';
import {
  InternalConversation,
  InternalMessage,
  SystemNotificationItem,
  UserProfile,
  MessagePriority,
  RecipientScope,
  CADRE_DISPLAY_NAMES,
} from '@real-estate-erp/types';
import { messagingService } from '../../services/messagingService';
import {
  canSendMessage,
  filterAllowedRecipients,
  getAllowedRecipientCategories,
  isCGM,
  isOfficeStaff,
  isMarketingMember,
} from '../../services/messagingRules';
import { DEFAULT_STAFF_USERS } from '../administration/UserManagementWorkspace';

export const CommunicationsWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const currentUser: UserProfile = useMemo(() => {
    if (user) return user;
    return {
      id: 'usr-001',
      uid: 'usr-001',
      email: 'admin@reerp.com',
      displayName: 'Rajesh Kumar (Managing Director)',
      role: 'director',
      cadre: 'director',
      status: 'active',
      permissions: ['*:*'],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };
  }, [user]);

  const [conversations, setConversations] = useState<InternalConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [notifications, setNotifications] = useState<SystemNotificationItem[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'DIRECT' | 'CHANNELS' | 'ALERTS'>('ALL');

  // New message input state
  const [inputMessage, setInputMessage] = useState('');
  const [inputSubject, setInputSubject] = useState('');
  const [messagePriority, setMessagePriority] = useState<MessagePriority>('NORMAL');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick reply menu anchor
  const [quickReplyAnchor, setQuickReplyAnchor] = useState<null | HTMLElement>(null);

  // Compose Modal State
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [composeRecipientScope, setComposeRecipientScope] = useState<RecipientScope>('INDIVIDUAL');
  const [composeTargetUserId, setComposeTargetUserId] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composePriority, setComposePriority] = useState<MessagePriority>('NORMAL');
  const [composeError, setComposeError] = useState<string | null>(null);

  // Load conversations and notifications
  useEffect(() => {
    const unsubConv = messagingService.subscribeToConversations(currentUser.uid, (convs) => {
      setConversations(convs);

      // Select conversation from URL or default to first
      const paramId = searchParams.get('conversationId');
      if (paramId && convs.some((c) => c.id === paramId)) {
        setActiveConversationId(paramId);
      } else if (!activeConversationId && convs.length > 0) {
        setActiveConversationId(convs[0].id);
      }
    });

    const unsubNotif = messagingService.subscribeToNotifications(currentUser.uid, (notifs) => {
      setNotifications(notifs);
    });

    return () => {
      unsubConv();
      unsubNotif();
    };
  }, [currentUser.uid, searchParams]);

  // Load active conversation messages
  useEffect(() => {
    if (!activeConversationId) return;

    messagingService.markConversationAsRead(activeConversationId, currentUser.uid);

    const unsubMsg = messagingService.subscribeToMessages(activeConversationId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });

    return () => {
      unsubMsg();
    };
  }, [activeConversationId, currentUser.uid]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Filtered users for composing messages
  const allowedRecipients = useMemo(() => {
    return filterAllowedRecipients(currentUser, DEFAULT_STAFF_USERS);
  }, [currentUser]);

  const allowedCategories = useMemo(() => {
    return getAllowedRecipientCategories(currentUser);
  }, [currentUser]);

  // Metrics
  const stats = useMemo(() => {
    const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCounts[currentUser.uid] || 0), 0);
    const unreadAlerts = notifications.filter((n) => !n.read).length;
    const channelsCount = conversations.filter((c) => c.type === 'GROUP' || c.type === 'BROADCAST').length;
    return {
      totalConversations: conversations.length,
      unreadMessages,
      unreadAlerts,
      channelsCount,
    };
  }, [conversations, notifications, currentUser.uid]);

  // Filtered conversation list
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Category filter
      if (selectedCategory === 'DIRECT' && conv.type !== 'DIRECT') return false;
      if (selectedCategory === 'CHANNELS' && conv.type === 'DIRECT') return false;
      if (selectedCategory === 'ALERTS' && conv.channelCategory !== 'SYSTEM') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = conv.title.toLowerCase().includes(query);
        const matchMsg = conv.lastMessage?.content.toLowerCase().includes(query);
        const matchSender = conv.lastMessage?.senderName.toLowerCase().includes(query);
        return matchTitle || matchMsg || matchSender;
      }
      return true;
    });
  }, [conversations, selectedCategory, searchQuery]);

  // Send Message in Active Conversation
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConversationId || !activeConversation) return;

    await messagingService.sendMessage({
      conversationId: activeConversationId,
      sender: currentUser,
      content: inputMessage.trim(),
      subject: inputSubject.trim() || undefined,
      priority: messagePriority,
      type: activeConversation.type === 'BROADCAST' ? 'BROADCAST' : 'DIRECT',
      recipientType: activeConversation.channelCategory === 'ALL_STAFF' ? 'OFFICE_STAFF' : 'INDIVIDUAL',
    });

    setInputMessage('');
    setInputSubject('');
    setMessagePriority('NORMAL');
  };

  // Quick Preset Replies
  const quickReplies = [
    'Document verified by Accounts team.',
    'Customer payment confirmed. Advance receipt generated.',
    'Lead follow-up done. Site visit scheduled for Sunday.',
    'CGM Weekly Review meeting details updated.',
    'Plot reservation token acknowledged.',
    'Please verify and send approval.',
  ];

  const handleApplyQuickReply = (text: string) => {
    setInputMessage((prev) => (prev ? `${prev} ${text}` : text));
    setQuickReplyAnchor(null);
  };

  // Handle Compose Submit
  const handleComposeSubmit = async () => {
    setComposeError(null);
    if (!composeContent.trim()) {
      setComposeError('Please enter a message content.');
      return;
    }

    if (composeRecipientScope === 'INDIVIDUAL') {
      if (!composeTargetUserId) {
        setComposeError('Please select a recipient.');
        return;
      }

      const target = DEFAULT_STAFF_USERS.find((u) => u.uid === composeTargetUserId);
      if (!target) {
        setComposeError('Selected recipient was not found.');
        return;
      }

      const permission = canSendMessage(currentUser, target);
      if (!permission.allowed) {
        setComposeError(permission.reason || 'You are not authorized to message this user.');
        return;
      }

      // Create or get direct conversation
      const conv = await messagingService.createOrGetDirectConversation(currentUser, target);
      await messagingService.sendMessage({
        conversationId: conv.id,
        sender: currentUser,
        content: composeContent.trim(),
        subject: composeSubject.trim() || undefined,
        priority: composePriority,
        type: 'DIRECT',
        recipientType: 'INDIVIDUAL',
        recipientIds: [target.uid],
      });

      setActiveConversationId(conv.id);
    } else if (composeRecipientScope === 'OFFICE_STAFF') {
      const officeStaffUids = DEFAULT_STAFF_USERS.filter((u) => isOfficeStaff(u)).map((u) => u.uid);
      const conv = await messagingService.createChannel({
        title: 'Office Staff Notice Desk',
        type: 'BROADCAST',
        channelCategory: 'ALL_STAFF',
        creator: currentUser,
        participants: officeStaffUids,
        description: 'Notice broadcast to all Office Staff & Operations',
      });

      await messagingService.sendMessage({
        conversationId: conv.id,
        sender: currentUser,
        content: composeContent.trim(),
        subject: composeSubject.trim() || undefined,
        priority: composePriority,
        type: 'BROADCAST',
        recipientType: 'OFFICE_STAFF',
      });

      setActiveConversationId(conv.id);
    } else if (composeRecipientScope === 'PEER_CGMS') {
      const cgmUids = DEFAULT_STAFF_USERS.filter((u) => isCGM(u)).map((u) => u.uid);
      const conv = await messagingService.createChannel({
        title: 'CGM Peer Coordination Channel',
        type: 'GROUP',
        channelCategory: 'CGM_NETWORK',
        creator: currentUser,
        participants: cgmUids,
        description: 'Peer coordination among Chief General Managers',
      });

      await messagingService.sendMessage({
        conversationId: conv.id,
        sender: currentUser,
        content: composeContent.trim(),
        subject: composeSubject.trim() || undefined,
        priority: composePriority,
        type: 'GROUP',
        recipientType: 'PEER_CGMS',
      });

      setActiveConversationId(conv.id);
    } else if (composeRecipientScope === 'MARKETING_TEAM') {
      const marketingUids = DEFAULT_STAFF_USERS.filter((u) => isMarketingMember(u)).map((u) => u.uid);
      const conv = await messagingService.createChannel({
        title: 'Marketing Network Broadcast',
        type: 'BROADCAST',
        channelCategory: 'MARKETING_TEAM',
        creator: currentUser,
        participants: marketingUids,
        description: 'Announcement to Marketing Associates and Leaders',
      });

      await messagingService.sendMessage({
        conversationId: conv.id,
        sender: currentUser,
        content: composeContent.trim(),
        subject: composeSubject.trim() || undefined,
        priority: composePriority,
        type: 'BROADCAST',
        recipientType: 'MARKETING_TEAM',
      });

      setActiveConversationId(conv.id);
    } else if (composeRecipientScope === 'ALL_COMPANY') {
      const allUids = DEFAULT_STAFF_USERS.map((u) => u.uid);
      const conv = await messagingService.createChannel({
        title: 'Company-Wide Official Announcement',
        type: 'BROADCAST',
        channelCategory: 'ALL_STAFF',
        creator: currentUser,
        participants: allUids,
        description: 'Official enterprise announcement to all employees and cadres',
      });

      await messagingService.sendMessage({
        conversationId: conv.id,
        sender: currentUser,
        content: composeContent.trim(),
        subject: composeSubject.trim() || undefined,
        priority: composePriority,
        type: 'BROADCAST',
        recipientType: 'ALL_COMPANY',
      });

      setActiveConversationId(conv.id);
    }

    setComposeModalOpen(false);
    setComposeContent('');
    setComposeSubject('');
    setComposeTargetUserId('');
  };

  const getCadreChip = (cadre?: string, role?: string) => {
    if (cadre === 'cgm') {
      return <Chip label="CGM (Rank 2)" size="small" sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 700, height: 20 }} />;
    }
    if (cadre === 'director' || role === 'super_admin' || role === 'director') {
      return <Chip label="Director / Admin" size="small" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, height: 20 }} />;
    }
    if (cadre === 'office_staff' || role === 'accountant') {
      return <Chip label="Office Staff" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 700, height: 20 }} />;
    }
    if (cadre) {
      return <Chip label={CADRE_DISPLAY_NAMES[cadre as keyof typeof CADRE_DISPLAY_NAMES] || cadre} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />;
    }
    return <Chip label={role || 'Staff'} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />;
  };

  const formatMessageTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, height: 'calc(100vh - 84px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header & Stats */}
      <Box sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#0f172a">
              Communications & Notifications Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role-governed internal messaging, team broadcast channels, and real-time ERP notifications
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setComposeModalOpen(true)}
              sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
            >
              Compose Message
            </Button>
          </Stack>
        </Stack>

        {/* Metrics Row */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: '12px 16px !important' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Total Conversations
                </Typography>
                <Typography variant="h6" fontWeight={800} color="#1e293b">
                  {stats.totalConversations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 2.5 }}>
              <CardContent sx={{ p: '12px 16px !important' }}>
                <Typography variant="caption" fontWeight={600} color="#1d4ed8">
                  Unread Messages
                </Typography>
                <Typography variant="h6" fontWeight={800} color="#1d4ed8">
                  {stats.unreadMessages}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: '12px 16px !important' }}>
                <Typography variant="caption" fontWeight={600} color="#15803d">
                  Active Channels
                </Typography>
                <Typography variant="h6" fontWeight={800} color="#15803d">
                  {stats.channelsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2.5 }}>
              <CardContent sx={{ p: '12px 16px !important' }}>
                <Typography variant="caption" fontWeight={600} color="#b45309">
                  System Alerts
                </Typography>
                <Typography variant="h6" fontWeight={800} color="#b45309">
                  {stats.unreadAlerts} Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Main Chat Interface Split View */}
      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        {/* Left Panel: Conversation List */}
        <Box
          sx={{
            width: { xs: '100%', sm: 340, md: 380 },
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#ffffff',
          }}
        >
          {/* Search Box */}
          <Box sx={{ p: 1.5, borderBottom: '1px solid #f1f5f9' }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search chats, colleagues, alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: '#f8fafc' },
              }}
            />

            {/* Filter Category Chips */}
            <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, overflowX: 'auto', pb: 0.5 }}>
              <Chip
                label="All"
                size="small"
                clickable
                color={selectedCategory === 'ALL' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('ALL')}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label="Direct"
                size="small"
                clickable
                color={selectedCategory === 'DIRECT' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('DIRECT')}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label="Channels"
                size="small"
                clickable
                color={selectedCategory === 'CHANNELS' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('CHANNELS')}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label="Alerts"
                size="small"
                clickable
                color={selectedCategory === 'ALERTS' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('ALERTS')}
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Box>

          {/* Conversations List */}
          <List sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            {filteredConversations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No conversations match your criteria
                </Typography>
              </Box>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversationId;
                const unreadCount = conv.unreadCounts[currentUser.uid] || 0;

                return (
                  <ListItem
                    key={conv.id}
                    button
                    onClick={() => setActiveConversationId(conv.id)}
                    sx={{
                      borderRadius: 2.5,
                      mb: 0.75,
                      bgcolor: isSelected ? '#eff6ff' : unreadCount > 0 ? '#f0fdf4' : 'transparent',
                      border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                      '&:hover': {
                        bgcolor: isSelected ? '#dbeafe' : '#f8fafc',
                      },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 46 }}>
                      <Badge
                        color="success"
                        variant="dot"
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      >
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor:
                              conv.channelCategory === 'ALL_STAFF'
                                ? '#ef4444'
                                : conv.channelCategory === 'CGM_NETWORK'
                                ? '#7c3aed'
                                : '#2563eb',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          {conv.channelCategory === 'ALL_STAFF' ? (
                            <CampaignIcon fontSize="small" />
                          ) : conv.channelCategory === 'CGM_NETWORK' ? (
                            <SupervisorAccountIcon fontSize="small" />
                          ) : (
                            conv.title.charAt(0).toUpperCase()
                          )}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      secondaryTypographyProps={{ component: 'div' }}
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={unreadCount > 0 || isSelected ? 700 : 600} noWrap sx={{ maxWidth: 170, color: '#0f172a' }}>
                            {conv.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatMessageTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack direction="column" spacing={0.5} sx={{ mt: 0.25 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 210, display: 'block' }}
                          >
                            {conv.lastMessage?.content || 'No messages yet'}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            {conv.channelCategory === 'ALL_STAFF' && (
                              <Chip label="Office Staff Broadcast" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#fee2e2', color: '#b91c1c' }} />
                            )}
                            {conv.channelCategory === 'CGM_NETWORK' && (
                              <Chip label="CGM Forum" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#ede9fe', color: '#6d28d9' }} />
                            )}
                            {conv.channelCategory === 'MARKETING_TEAM' && (
                              <Chip label="Marketing Team" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#dcfce7', color: '#15803d' }} />
                            )}
                          </Stack>
                        </Stack>
                      }
                    />
                    {unreadCount > 0 && (
                      <Chip
                        label={unreadCount}
                        size="small"
                        color="primary"
                        sx={{ height: 20, minWidth: 20, fontSize: '0.75rem', fontWeight: 700, ml: 1 }}
                      />
                    )}
                  </ListItem>
                );
              })
            )}
          </List>
        </Box>

        {/* Right Panel: Active Thread Messages & Composer */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor:
                        activeConversation.channelCategory === 'ALL_STAFF'
                          ? '#ef4444'
                          : activeConversation.channelCategory === 'CGM_NETWORK'
                          ? '#7c3aed'
                          : '#2563eb',
                    }}
                  >
                    {activeConversation.channelCategory === 'ALL_STAFF' ? (
                      <CampaignIcon />
                    ) : activeConversation.channelCategory === 'CGM_NETWORK' ? (
                      <SupervisorAccountIcon />
                    ) : (
                      <ChatIcon />
                    )}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                        {activeConversation.title}
                      </Typography>
                      {activeConversation.channelCategory === 'ALL_STAFF' && (
                        <Chip label="Office Staff Broadcast" size="small" color="error" variant="outlined" sx={{ height: 20 }} />
                      )}
                      {activeConversation.channelCategory === 'CGM_NETWORK' && (
                        <Chip label="Peer CGMs Network" size="small" color="secondary" variant="outlined" sx={{ height: 20 }} />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {activeConversation.description || `${activeConversation.participants.length} participants in conversation`}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Mark thread as read">
                    <IconButton
                      size="small"
                      onClick={() => messagingService.markConversationAsRead(activeConversation.id, currentUser.uid)}
                    >
                      <DoneAllIcon fontSize="small" sx={{ color: '#2563eb' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Message History Stream */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', my: 'auto', p: 4 }}>
                    <ChatIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      This is the beginning of the conversation.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Send a message to start communicating.
                    </Typography>
                  </Box>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.uid;

                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '100%',
                        }}
                      >
                        {/* Sender info line */}
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 0.5, px: 0.5 }}
                        >
                          {!isMe && (
                            <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: '#64748b' }}>
                              {msg.senderName.charAt(0)}
                            </Avatar>
                          )}
                          <Typography variant="caption" fontWeight={700} color="#334155">
                            {isMe ? 'You' : msg.senderName}
                          </Typography>
                          {getCadreChip(msg.senderCadre, msg.senderRole)}
                          <Typography variant="caption" color="text.secondary">
                            {formatMessageTime(msg.createdAt)}
                          </Typography>
                        </Stack>

                        {/* Message Bubble Card */}
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            maxWidth: { xs: '90%', sm: '75%' },
                            bgcolor: isMe ? '#2563eb' : '#ffffff',
                            color: isMe ? '#ffffff' : '#1e293b',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: isMe ? 'none' : '1px solid #e2e8f0',
                            borderTopRightRadius: isMe ? 4 : 16,
                            borderTopLeftRadius: !isMe ? 4 : 16,
                          }}
                        >
                          {/* Urgent / Priority Banner */}
                          {msg.priority === 'URGENT' && (
                            <Chip
                              icon={<PriorityHighIcon fontSize="small" />}
                              label="URGENT PRIORITY"
                              size="small"
                              sx={{
                                mb: 1,
                                bgcolor: isMe ? '#fee2e2' : '#fef2f2',
                                color: '#b91c1c',
                                fontWeight: 800,
                                height: 22,
                              }}
                            />
                          )}

                          {msg.subject && (
                            <Typography
                              variant="subtitle2"
                              fontWeight={800}
                              sx={{ mb: 0.5, color: isMe ? '#ffffff' : '#0f172a' }}
                            >
                              {msg.subject}
                            </Typography>
                          )}

                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                            {msg.content}
                          </Typography>
                        </Paper>
                      </Box>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Rich Composer Bottom Bar */}
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                {/* Priority Selector & Quick Reply helpers */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    Priority:
                  </Typography>
                  <Chip
                    label="Normal"
                    size="small"
                    clickable
                    color={messagePriority === 'NORMAL' ? 'primary' : 'default'}
                    onClick={() => setMessagePriority('NORMAL')}
                    sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }}
                  />
                  <Chip
                    label="Important"
                    size="small"
                    clickable
                    color={messagePriority === 'HIGH' ? 'warning' : 'default'}
                    onClick={() => setMessagePriority('HIGH')}
                    sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }}
                  />
                  <Chip
                    label="Urgent"
                    size="small"
                    clickable
                    color={messagePriority === 'URGENT' ? 'error' : 'default'}
                    onClick={() => setMessagePriority('URGENT')}
                    sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }}
                  />

                  <Box sx={{ flex: 1 }} />

                  <Button
                    size="small"
                    startIcon={<QuickReplyIcon fontSize="small" />}
                    onClick={(e) => setQuickReplyAnchor(e.currentTarget)}
                    sx={{ textTransform: 'none', fontWeight: 600, color: '#475569' }}
                  >
                    Quick Templates
                  </Button>
                </Stack>

                <Menu
                  anchorEl={quickReplyAnchor}
                  open={Boolean(quickReplyAnchor)}
                  onClose={() => setQuickReplyAnchor(null)}
                >
                  {quickReplies.map((qr, index) => (
                    <MenuItem key={index} onClick={() => handleApplyQuickReply(qr)}>
                      <Typography variant="body2">{qr}</Typography>
                    </MenuItem>
                  ))}
                </Menu>

                {/* Optional Subject for Broadcasts or High Priority */}
                {(messagePriority === 'URGENT' || activeConversation.type === 'BROADCAST') && (
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Announcement Subject / Topic (Optional)"
                    value={inputSubject}
                    onChange={(e) => setInputSubject(e.target.value)}
                    sx={{ mb: 1 }}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                )}

                {/* Input Text Box */}
                <Stack direction="row" spacing={1.5} alignItems="flex-end">
                  <TextField
                    multiline
                    maxRows={4}
                    fullWidth
                    placeholder="Type your message here... (Press Enter to send)"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    InputProps={{
                      sx: { borderRadius: 2.5, bgcolor: '#f8fafc' },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!inputMessage.trim()}
                    onClick={handleSendMessage}
                    sx={{
                      height: 48,
                      minWidth: 54,
                      borderRadius: 2.5,
                      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                    }}
                  >
                    <SendIcon />
                  </Button>
                </Stack>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body1" color="text.secondary">
                Select a conversation to view messages
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Compose Message Modal Dialog */}
      <Dialog
        open={composeModalOpen}
        onClose={() => setComposeModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
          Compose New Message / Announcement
        </DialogTitle>
        <DialogContent>
          {composeError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {composeError}
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Target Category / Scope Selector */}
            <TextField
              select
              fullWidth
              label="Recipient Target Audience"
              value={composeRecipientScope}
              onChange={(e) => {
                setComposeRecipientScope(e.target.value as RecipientScope);
                setComposeTargetUserId('');
              }}
            >
              {allowedCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      {cat.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cat.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {/* If Individual: User Selector */}
            {composeRecipientScope === 'INDIVIDUAL' && (
              <TextField
                select
                fullWidth
                label="Select Colleague / Associate"
                value={composeTargetUserId}
                onChange={(e) => setComposeTargetUserId(e.target.value)}
              >
                {allowedRecipients.map((rec) => (
                  <MenuItem key={rec.uid} value={rec.uid}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {rec.displayName || rec.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {rec.email}
                        </Typography>
                      </Box>
                      {getCadreChip(rec.cadre, rec.role)}
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Subject */}
            <TextField
              fullWidth
              label="Subject (Optional)"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              placeholder="e.g., Booking Approval / Passbook Confirmation"
            />

            {/* Priority */}
            <TextField
              select
              fullWidth
              label="Message Priority"
              value={composePriority}
              onChange={(e) => setComposePriority(e.target.value as MessagePriority)}
            >
              <MenuItem value="NORMAL">Normal Priority</MenuItem>
              <MenuItem value="HIGH">High Priority (Urgent Notification)</MenuItem>
              <MenuItem value="URGENT">Urgent (Immediate Attention Needed)</MenuItem>
            </TextField>

            {/* Message Body */}
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Message Content"
              value={composeContent}
              onChange={(e) => setComposeContent(e.target.value)}
              placeholder="Type your message details here..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setComposeModalOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleComposeSubmit}
            sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunicationsWorkspace;
