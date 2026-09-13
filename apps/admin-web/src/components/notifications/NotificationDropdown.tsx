import React, { useState, useEffect, useMemo } from 'react';
import {
  Popover,
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Divider,
  Chip,
  Badge,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  DoneAll as DoneAllIcon,
  OpenInNew as OpenInNewIcon,
  Campaign as CampaignIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@real-estate-erp/hooks';
import {
  InternalConversation,
  SystemNotificationItem,
} from '@real-estate-erp/types';
import { messagingService } from '../../services/messagingService';

interface NotificationDropdownProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSelectConversation?: (conversationId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  anchorEl,
  open,
  onClose,
  onSelectConversation,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [conversations, setConversations] = useState<InternalConversation[]>([]);
  const [notifications, setNotifications] = useState<SystemNotificationItem[]>([]);

  const userId = user?.uid || 'usr-001';

  useEffect(() => {
    if (!open) return;

    const unsubConv = messagingService.subscribeToConversations(userId, (convs) => {
      setConversations(convs);
    });

    const unsubNotif = messagingService.subscribeToNotifications(userId, (notifs) => {
      setNotifications(notifs);
    });

    return () => {
      unsubConv();
      unsubNotif();
    };
  }, [open, userId]);

  const handleMarkAllRead = async () => {
    await messagingService.markAllNotificationsAsRead(userId);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, readAt: new Date().toISOString() }))
    );
    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        unreadCounts: { ...c.unreadCounts, [userId]: 0 },
      }))
    );
  };

  const handleNotificationClick = async (item: SystemNotificationItem) => {
    await messagingService.markNotificationAsRead(item.id);
    onClose();
    if (item.linkUrl) {
      navigate(item.linkUrl);
    }
  };

  const handleConversationClick = async (conv: InternalConversation) => {
    await messagingService.markConversationAsRead(conv.id, userId);
    onClose();
    if (onSelectConversation) {
      onSelectConversation(conv.id);
    }
    navigate(`/messages?conversationId=${conv.id}`);
  };

  const handleOpenFullCenter = () => {
    onClose();
    navigate('/messages');
  };

  // Compute counts
  const unreadMessagesCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCounts[userId] || 0), 0);
  }, [conversations, userId]);

  const unreadAlertsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const totalPending = unreadMessagesCount + unreadAlertsCount;

  // Filter items based on tab
  const messageItems = useMemo(() => {
    return conversations.filter((c) => c.lastMessage);
  }, [conversations]);

  const unreadItems = useMemo(() => {
    const unreadConvs = conversations.filter((c) => (c.unreadCounts[userId] || 0) > 0);
    const unreadNotifs = notifications.filter((n) => !n.read);
    return { unreadConvs, unreadNotifs };
  }, [conversations, notifications, userId]);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon fontSize="small" sx={{ color: '#10b981' }} />;
      case 'warning':
        return <WarningIcon fontSize="small" sx={{ color: '#f59e0b' }} />;
      case 'error':
        return <ErrorIcon fontSize="small" sx={{ color: '#ef4444' }} />;
      default:
        return <InfoIcon fontSize="small" sx={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          width: { xs: 340, sm: 420 },
          maxHeight: 560,
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #e2e8f0',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
              Notifications & Messages
            </Typography>
            {totalPending > 0 && (
              <Chip
                label={`${totalPending} new`}
                size="small"
                color="primary"
                sx={{ height: 22, fontSize: '0.75rem', fontWeight: 700 }}
              />
            )}
          </Stack>
          {totalPending > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={handleMarkAllRead} color="primary">
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(_, newVal) => setTabIndex(newVal)}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            mt: 1.5,
            '& .MuiTab-root': {
              minHeight: 36,
              py: 0.5,
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
            },
          }}
        >
          <Tab label="All" />
          <Tab
            label={
              <Badge badgeContent={unreadMessagesCount} color="error" sx={{ '& .MuiBadge-badge': { right: -6, top: 2 } }}>
                Messages
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={unreadAlertsCount} color="error" sx={{ '& .MuiBadge-badge': { right: -6, top: 2 } }}>
                Alerts
              </Badge>
            }
          />
          <Tab label={`Unread (${totalPending})`} />
        </Tabs>
      </Box>

      {/* Body List */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        {/* Tab 0: All */}
        {tabIndex === 0 && (
          <List disablePadding>
            {messageItems.slice(0, 3).map((conv) => (
              <ListItem
                key={conv.id}
                button
                onClick={() => handleConversationClick(conv)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: (conv.unreadCounts[userId] || 0) > 0 ? '#f0fdf4' : 'transparent',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 44 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563eb', fontSize: '0.8rem' }}>
                    {conv.channelCategory === 'ALL_STAFF' ? (
                      <CampaignIcon fontSize="small" />
                    ) : conv.channelCategory === 'CGM_NETWORK' ? (
                      <GroupIcon fontSize="small" />
                    ) : (
                      <ChatIcon fontSize="small" />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 220, color: '#1e293b' }}>
                        {conv.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(conv.lastMessage?.createdAt)}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {conv.lastMessage?.senderName ? `${conv.lastMessage.senderName}: ` : ''}
                      {conv.lastMessage?.content}
                    </Typography>
                  }
                />
                {(conv.unreadCounts[userId] || 0) > 0 && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#2563eb',
                      ml: 1,
                    }}
                  />
                )}
              </ListItem>
            ))}

            {notifications.slice(0, 4).map((notif) => (
              <ListItem
                key={notif.id}
                button
                onClick={() => handleNotificationClick(notif)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: !notif.read ? '#eff6ff' : 'transparent',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 44 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    {getSeverityIcon(notif.severity)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={!notif.read ? 700 : 500} noWrap sx={{ maxWidth: 220, color: '#1e293b' }}>
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(notif.createdAt)}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notif.message}
                    </Typography>
                  }
                />
                {!notif.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#3b82f6',
                      ml: 1,
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}

        {/* Tab 1: Messages */}
        {tabIndex === 1 && (
          <List disablePadding>
            {messageItems.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 36, color: '#94a3b8', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No active message conversations
                </Typography>
              </Box>
            ) : (
              messageItems.map((conv) => (
                <ListItem
                  key={conv.id}
                  button
                  onClick={() => handleConversationClick(conv)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: (conv.unreadCounts[userId] || 0) > 0 ? '#f0fdf4' : 'transparent',
                    '&:hover': { bgcolor: '#f1f5f9' },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563eb' }}>
                      {conv.channelCategory === 'ALL_STAFF' ? (
                        <CampaignIcon fontSize="small" />
                      ) : (
                        <ChatIcon fontSize="small" />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 220, color: '#1e293b' }}>
                          {conv.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(conv.lastMessage?.createdAt)}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {conv.lastMessage?.content}
                      </Typography>
                    }
                  />
                  {(conv.unreadCounts[userId] || 0) > 0 && (
                    <Chip
                      label={conv.unreadCounts[userId]}
                      size="small"
                      color="primary"
                      sx={{ height: 20, minWidth: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </ListItem>
              ))
            )}
          </List>
        )}

        {/* Tab 2: Alerts */}
        {tabIndex === 2 && (
          <List disablePadding>
            {notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 36, color: '#94a3b8', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No system notifications
                </Typography>
              </Box>
            ) : (
              notifications.map((notif) => (
                <ListItem
                  key={notif.id}
                  button
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: !notif.read ? '#eff6ff' : 'transparent',
                    '&:hover': { bgcolor: '#f1f5f9' },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      {getSeverityIcon(notif.severity)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={!notif.read ? 700 : 500} noWrap sx={{ maxWidth: 220, color: '#1e293b' }}>
                          {notif.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(notif.createdAt)}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {notif.message}
                      </Typography>
                    }
                  />
                  {!notif.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#3b82f6',
                        ml: 1,
                      }}
                    />
                  )}
                </ListItem>
              ))
            )}
          </List>
        )}

        {/* Tab 3: Unread */}
        {tabIndex === 3 && (
          <List disablePadding>
            {totalPending === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 36, color: '#10b981', mb: 1 }} />
                <Typography variant="body2" fontWeight={600} color="#10b981">
                  You are all caught up!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  No pending unread messages or notifications
                </Typography>
              </Box>
            ) : (
              <>
                {unreadItems.unreadConvs.map((conv) => (
                  <ListItem
                    key={conv.id}
                    button
                    onClick={() => handleConversationClick(conv)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: '#f0fdf4',
                      '&:hover': { bgcolor: '#e2f7e8' },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563eb' }}>
                        <ChatIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 220, color: '#1e293b' }}>
                            {conv.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(conv.lastMessage?.createdAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {conv.lastMessage?.content}
                        </Typography>
                      }
                    />
                    <Chip
                      label={conv.unreadCounts[userId]}
                      size="small"
                      color="primary"
                      sx={{ height: 20, minWidth: 20, fontSize: '0.7rem' }}
                    />
                  </ListItem>
                ))}

                {unreadItems.unreadNotifs.map((notif) => (
                  <ListItem
                    key={notif.id}
                    button
                    onClick={() => handleNotificationClick(notif)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: '#eff6ff',
                      '&:hover': { bgcolor: '#dbeafe' },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: '#ffffff', border: '1px solid #bfdbfe' }}>
                        {getSeverityIcon(notif.severity)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 220, color: '#1e293b' }}>
                            {notif.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(notif.createdAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {notif.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </>
            )}
          </List>
        )}
      </Box>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 1.5, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          size="small"
          variant="text"
          color="primary"
          endIcon={<OpenInNewIcon fontSize="small" />}
          onClick={handleOpenFullCenter}
          sx={{ fontWeight: 700, textTransform: 'none' }}
        >
          Open Communications Center
        </Button>
        <Button size="small" onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
          Close
        </Button>
      </Box>
    </Popover>
  );
};
