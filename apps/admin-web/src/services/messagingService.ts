import {
  InternalMessage,
  InternalConversation,
  SystemNotificationItem,
  UserProfile,
  MessageType,
  MessagePriority,
  RecipientScope,
  ChannelCategory,
  ConversationParticipant,
} from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_CONVERSATIONS_KEY = 'reerp_internal_conversations_v1';
const STORAGE_MESSAGES_KEY = 'reerp_internal_messages_v1';
const STORAGE_NOTIFICATIONS_KEY = 'reerp_system_notifications_v1';

// Initial Mock Seed Data
const DEFAULT_SYSTEM_NOTIFICATIONS: SystemNotificationItem[] = [
  {
    id: 'notif-001',
    userId: 'all',
    title: 'New Plot Booking Completed: ISKON City - 2 Block B-12',
    message: 'Customer Ramesh Goud completed advance payment of ₹5,00,000 for Plot #B-12. Verification pending by Accounts.',
    type: 'booking',
    severity: 'success',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    linkUrl: '/bookings',
    metadata: { bookingId: 'BK-2026-089', amount: 500000 },
  },
  {
    id: 'notif-002',
    userId: 'all',
    title: 'New High-Priority Lead Assigned',
    message: 'Premium investor inquiry for "ISKON City - 2 Villa Plots" assigned to Telecaller Team.',
    type: 'lead',
    severity: 'info',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    linkUrl: '/crm/leads',
    metadata: { leadId: 'LD-99201', budget: '₹1.2 Cr' },
  },
  {
    id: 'notif-003',
    userId: 'all',
    title: 'Marketing Commission Disbursed (Level 2 & 3)',
    message: 'Monthly Cadre Overriding Commission batch #OC-MAR-01 approved by Managing Director for all qualifying CGMs & GMs.',
    type: 'commission',
    severity: 'success',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    linkUrl: '/marketing/commission',
    metadata: { batchId: 'OC-MAR-01', totalAmount: 1450000 },
  },
  {
    id: 'notif-004',
    userId: 'all',
    title: 'Site Visit Scheduled: Sunday Special Bus Tour',
    message: '3 Luxury Van site visits scheduled for Podalakur Road ISKON City - 2 with 18 prospective buyers.',
    type: 'visit',
    severity: 'warning',
    read: true,
    readAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    linkUrl: '/crm/site-visits',
    metadata: { tripId: 'SV-4401', passengerCount: 18 },
  },
];

const DEFAULT_CONVERSATIONS: InternalConversation[] = [
  {
    id: 'conv-office-staff-broadcast',
    title: 'Office Staff & Corporate Desk (Official)',
    type: 'BROADCAST',
    channelCategory: 'ALL_STAFF',
    participants: ['usr-000', 'usr-001', 'usr-001b', 'usr-bm1', 'usr-bm2', 'usr-acc1', 'usr-ops1'],
    participantProfiles: [
      { uid: 'usr-001', displayName: 'Rajesh Kumar (MD)', role: 'director', cadre: 'director', department: 'Executive Management', isOnline: true },
      { uid: 'usr-000', displayName: 'Satyadev Varma', role: 'super_admin', cadre: 'director', department: 'System Governance', isOnline: true },
      { uid: 'usr-bm1', displayName: 'Srinivas Murthy', role: 'branch_manager', cadre: 'senior_sales_manager', department: 'Branch Operations', isOnline: true },
      { uid: 'usr-acc1', displayName: 'Lakshmi Narayana', role: 'accountant', cadre: 'office_staff', department: 'Finance & Accounts', isOnline: true },
    ],
    lastMessage: {
      content: 'FY 2026-27 Q1 Target Review Meeting scheduled for all Office Staff tomorrow at 10:30 AM in Conference Hall A.',
      senderId: 'usr-001',
      senderName: 'Rajesh Kumar (Managing Director)',
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      priority: 'HIGH',
      readBy: ['usr-001'],
    },
    unreadCounts: { 'usr-000': 0, 'usr-001': 0, 'usr-bm1': 1, 'usr-acc1': 1 },
    pinnedFor: ['usr-000', 'usr-001'],
    description: 'Executive Management broadcast channel to all Office Staff and Branch Heads.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-cgm-leadership-forum',
    title: 'CGM Leadership Forum (Peer Network)',
    type: 'GROUP',
    channelCategory: 'CGM_NETWORK',
    participants: ['usr-001', 'usr-cgm1', 'usr-cgm2', 'usr-cgm3'],
    participantProfiles: [
      { uid: 'usr-cgm1', displayName: 'V. Venkatesh (CGM West)', role: 'marketing_manager', cadre: 'cgm', department: 'Marketing Wing 1', isOnline: true },
      { uid: 'usr-cgm2', displayName: 'B. Jagadeesh (CGM North)', role: 'marketing_manager', cadre: 'cgm', department: 'Marketing Wing 2', isOnline: true },
      { uid: 'usr-cgm3', displayName: 'K. Subba Rao (CGM Coastal)', role: 'marketing_manager', cadre: 'cgm', department: 'Marketing Wing 3', isOnline: false },
      { uid: 'usr-001', displayName: 'Rajesh Kumar (MD)', role: 'director', cadre: 'director', department: 'Executive Management', isOnline: true },
    ],
    lastMessage: {
      content: 'All CGMs: Please submit the projected Mega Launch event registrations by Friday evening.',
      senderId: 'usr-cgm1',
      senderName: 'V. Venkatesh (CGM West)',
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      priority: 'NORMAL',
      readBy: ['usr-cgm1'],
    },
    unreadCounts: { 'usr-001': 0, 'usr-cgm1': 0, 'usr-cgm2': 1, 'usr-cgm3': 1 },
    pinnedFor: ['usr-cgm1', 'usr-cgm2'],
    description: 'Exclusive communication and strategy channel for Chief General Managers.',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-marketing-operations-desk',
    title: 'Marketing & Operations Desk (Approvals & Docs)',
    type: 'GROUP',
    channelCategory: 'MARKETING_TEAM',
    participants: ['usr-003', 'usr-cgm1', 'usr-006', 'usr-acc1', 'usr-ops1'],
    participantProfiles: [
      { uid: 'usr-003', displayName: 'Vikram Varma (Marketing Head)', role: 'marketing_manager', cadre: 'gm', department: 'Marketing', isOnline: true },
      { uid: 'usr-cgm1', displayName: 'V. Venkatesh (CGM West)', role: 'marketing_manager', cadre: 'cgm', department: 'Marketing Wing 1', isOnline: true },
      { uid: 'usr-acc1', displayName: 'Lakshmi Narayana', role: 'accountant', cadre: 'office_staff', department: 'Finance & Accounts', isOnline: true },
      { uid: 'usr-006', displayName: 'Anand Naidu', role: 'sales_executive', cadre: 'sales_executive', department: 'Sales & Field Visits', isOnline: true },
    ],
    lastMessage: {
      content: 'Accounts team: Customer passbook for Plot #C-04 has been uploaded for verification.',
      senderId: 'usr-006',
      senderName: 'Anand Naidu (Sales Executive)',
      createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      priority: 'NORMAL',
      readBy: ['usr-006', 'usr-acc1'],
    },
    unreadCounts: { 'usr-003': 0, 'usr-cgm1': 0, 'usr-006': 0, 'usr-acc1': 0 },
    description: 'Coordination channel between Marketing field teams and Office Staff.',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
  },
];

const DEFAULT_MESSAGES: Record<string, InternalMessage[]> = {
  'conv-office-staff-broadcast': [
    {
      id: 'msg-001',
      conversationId: 'conv-office-staff-broadcast',
      senderId: 'usr-001',
      senderName: 'Rajesh Kumar (Managing Director)',
      senderRole: 'director',
      senderCadre: 'director',
      recipientType: 'OFFICE_STAFF',
      subject: 'Quarterly Office Operations & Target Review',
      content: 'Good morning Team. Please ensure all pending title deed scans, token receipt reconciliations, and attendance logs are updated before 5:00 PM today.',
      type: 'BROADCAST',
      priority: 'HIGH',
      readBy: ['usr-001', 'usr-000', 'usr-bm1'],
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: 'msg-002',
      conversationId: 'conv-office-staff-broadcast',
      senderId: 'usr-001',
      senderName: 'Rajesh Kumar (Managing Director)',
      senderRole: 'director',
      senderCadre: 'director',
      recipientType: 'OFFICE_STAFF',
      subject: 'FY 2026-27 Q1 Target Review Meeting',
      content: 'FY 2026-27 Q1 Target Review Meeting scheduled for all Office Staff tomorrow at 10:30 AM in Conference Hall A. All department heads must bring their monthly reports.',
      type: 'BROADCAST',
      priority: 'HIGH',
      readBy: ['usr-001'],
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
  ],
  'conv-cgm-leadership-forum': [
    {
      id: 'msg-101',
      conversationId: 'conv-cgm-leadership-forum',
      senderId: 'usr-cgm2',
      senderName: 'B. Jagadeesh (CGM North)',
      senderRole: 'marketing_manager',
      senderCadre: 'cgm',
      recipientType: 'PEER_CGMS',
      subject: 'Dream City Venture Zone Launch',
      content: 'Greetings fellow CGMs! North Zone marketing teams are ready with 45 pre-bookings for Sunday. Looking forward to synchronizing campaign buses.',
      type: 'GROUP',
      priority: 'NORMAL',
      readBy: ['usr-cgm2', 'usr-cgm1'],
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: 'msg-102',
      conversationId: 'conv-cgm-leadership-forum',
      senderId: 'usr-cgm1',
      senderName: 'V. Venkatesh (CGM West)',
      senderRole: 'marketing_manager',
      senderCadre: 'cgm',
      recipientType: 'PEER_CGMS',
      subject: 'Launch Coordination',
      content: 'All CGMs: Please submit the projected Mega Launch event registrations by Friday evening.',
      type: 'GROUP',
      priority: 'NORMAL',
      readBy: ['usr-cgm1'],
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    },
  ],
  'conv-marketing-operations-desk': [
    {
      id: 'msg-201',
      conversationId: 'conv-marketing-operations-desk',
      senderId: 'usr-006',
      senderName: 'Anand Naidu (Sales Executive)',
      senderRole: 'sales_executive',
      senderCadre: 'sales_executive',
      recipientType: 'OFFICE_STAFF',
      subject: 'Customer Passbook Verification',
      content: 'Accounts team: Customer passbook for Plot #C-04 has been uploaded for verification. Requesting prompt review so we can finalize the agreement.',
      type: 'GROUP',
      priority: 'NORMAL',
      readBy: ['usr-006', 'usr-acc1'],
      createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    },
  ],
};

class InternalMessagingService {
  private getLocalConversations(): InternalConversation[] {
    if (typeof window === 'undefined') return DEFAULT_CONVERSATIONS;
    try {
      const raw = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(DEFAULT_CONVERSATIONS));
        return DEFAULT_CONVERSATIONS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_CONVERSATIONS;
    }
  }

  private saveLocalConversations(conversations: InternalConversation[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(conversations));
      } catch (err) {
        console.warn('Failed to save conversations to localStorage', err);
      }
    }
  }

  private getLocalMessages(): Record<string, InternalMessage[]> {
    if (typeof window === 'undefined') return DEFAULT_MESSAGES;
    try {
      const raw = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(DEFAULT_MESSAGES));
        return DEFAULT_MESSAGES;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_MESSAGES;
    }
  }

  private saveLocalMessages(messages: Record<string, InternalMessage[]>): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
      } catch (err) {
        console.warn('Failed to save messages to localStorage', err);
      }
    }
  }

  private getLocalNotifications(): SystemNotificationItem[] {
    if (typeof window === 'undefined') return DEFAULT_SYSTEM_NOTIFICATIONS;
    try {
      const raw = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_SYSTEM_NOTIFICATIONS));
        return DEFAULT_SYSTEM_NOTIFICATIONS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SYSTEM_NOTIFICATIONS;
    }
  }

  private saveLocalNotifications(notifications: SystemNotificationItem[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
      } catch (err) {
        console.warn('Failed to save notifications to localStorage', err);
      }
    }
  }

  /**
   * Subscribes to conversations for a user with Firestore listener and fallback.
   */
  public subscribeToConversations(
    userId: string,
    onUpdate: (conversations: InternalConversation[]) => void
  ): () => void {
    const local = this.getLocalConversations();
    // Filter conversations where user is a participant or broadcast channel
    const visible = local.filter(
      (c) => c.participants.includes(userId) || c.type === 'BROADCAST' || c.participants.includes('all')
    );
    onUpdate(visible);

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const q = query(collection(db, 'internal_conversations'), orderBy('updatedAt', 'desc'));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const remote = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
              })) as InternalConversation[];
              const filtered = remote.filter(
                (c) => c.participants.includes(userId) || c.type === 'BROADCAST'
              );
              if (filtered.length > 0) {
                this.saveLocalConversations(remote);
                onUpdate(filtered);
              }
            }
          },
          (err) => {
            console.debug('Firestore conversations fallback:', err);
          }
        );
        return unsubscribe;
      }
    } catch {
      // Offline fallback
    }

    return () => {};
  }

  /**
   * Subscribes to messages of an active conversation.
   */
  public subscribeToMessages(
    conversationId: string,
    onUpdate: (messages: InternalMessage[]) => void
  ): () => void {
    const allMessages = this.getLocalMessages();
    const thread = allMessages[conversationId] || [];
    onUpdate(thread);

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const q = query(
          collection(db, 'internal_messages'),
          where('conversationId', '==', conversationId),
          orderBy('createdAt', 'asc')
        );
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const remote = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })) as InternalMessage[];
              allMessages[conversationId] = remote;
              this.saveLocalMessages(allMessages);
              onUpdate(remote);
            }
          },
          (err) => {
            console.debug('Firestore messages fallback:', err);
          }
        );
        return unsubscribe;
      }
    } catch {
      // Offline fallback
    }

    return () => {};
  }

  /**
   * Subscribes to system notifications for a user.
   */
  public subscribeToNotifications(
    userId: string,
    onUpdate: (notifications: SystemNotificationItem[]) => void
  ): () => void {
    const local = this.getLocalNotifications();
    const userNotifs = local.filter((n) => n.userId === 'all' || n.userId === userId);
    onUpdate(userNotifs);

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const remote = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })) as SystemNotificationItem[];
              this.saveLocalNotifications(remote);
              onUpdate(remote.filter((n) => n.userId === 'all' || n.userId === userId));
            }
          },
          (err) => {
            console.debug('Firestore notifications fallback:', err);
          }
        );
        return unsubscribe;
      }
    } catch {
      // Offline fallback
    }

    return () => {};
  }

  /**
   * Sends a message into a conversation.
   */
  public async sendMessage(params: {
    conversationId: string;
    sender: UserProfile;
    content: string;
    subject?: string;
    priority?: MessagePriority;
    type?: MessageType;
    recipientType?: RecipientScope;
    recipientIds?: string[];
  }): Promise<InternalMessage> {
    const now = new Date().toISOString();
    const newMessage: InternalMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: params.conversationId,
      senderId: params.sender.uid,
      senderName: params.sender.displayName || params.sender.email,
      senderRole: params.sender.role,
      senderCadre: params.sender.cadre,
      senderPhotoUrl: params.sender.photoURL,
      recipientType: params.recipientType || 'INDIVIDUAL',
      recipientIds: params.recipientIds,
      subject: params.subject,
      content: params.content,
      type: params.type || 'DIRECT',
      priority: params.priority || 'NORMAL',
      readBy: [params.sender.uid],
      createdAt: now,
      updatedAt: now,
    };

    // 1. Update local messages cache
    const allMessages = this.getLocalMessages();
    if (!allMessages[params.conversationId]) {
      allMessages[params.conversationId] = [];
    }
    allMessages[params.conversationId].push(newMessage);
    this.saveLocalMessages(allMessages);

    // 2. Update conversation lastMessage and unread counts
    const conversations = this.getLocalConversations();
    const convIndex = conversations.findIndex((c) => c.id === params.conversationId);
    if (convIndex >= 0) {
      const conv = conversations[convIndex];
      conv.lastMessage = {
        content: newMessage.content,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        createdAt: now,
        priority: newMessage.priority,
        readBy: [params.sender.uid],
      };
      conv.updatedAt = now;

      // Increment unread counts for participants other than sender
      conv.participants.forEach((pId) => {
        if (pId !== params.sender.uid) {
          conv.unreadCounts[pId] = (conv.unreadCounts[pId] || 0) + 1;
        }
      });
      conversations[convIndex] = conv;
      this.saveLocalConversations(conversations);
    }

    // 3. Firestore write attempt
    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'internal_messages'), newMessage);
        if (convIndex >= 0) {
          await updateDoc(doc(db, 'internal_conversations', params.conversationId), {
            lastMessage: conversations[convIndex].lastMessage,
            unreadCounts: conversations[convIndex].unreadCounts,
            updatedAt: now,
          });
        }
      }
    } catch (err) {
      console.debug('Firestore message send offline fallback:', err);
    }

    return newMessage;
  }

  /**
   * Starts a new conversation or retrieves existing direct chat between two users.
   */
  public async createOrGetDirectConversation(
    currentUser: UserProfile,
    targetUser: UserProfile
  ): Promise<InternalConversation> {
    const conversations = this.getLocalConversations();

    // Check if direct conversation already exists
    const existing = conversations.find(
      (c) =>
        c.type === 'DIRECT' &&
        c.participants.includes(currentUser.uid) &&
        c.participants.includes(targetUser.uid)
    );

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const newConv: InternalConversation = {
      id: `conv-dir-${Date.now()}`,
      title: `${targetUser.displayName || targetUser.email}`,
      type: 'DIRECT',
      channelCategory: 'DIRECT',
      participants: [currentUser.uid, targetUser.uid],
      participantProfiles: [
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
          cadre: currentUser.cadre,
          photoURL: currentUser.photoURL,
          isOnline: true,
        },
        {
          uid: targetUser.uid,
          displayName: targetUser.displayName,
          role: targetUser.role,
          cadre: targetUser.cadre,
          photoURL: targetUser.photoURL,
          isOnline: true,
        },
      ],
      unreadCounts: {
        [currentUser.uid]: 0,
        [targetUser.uid]: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    conversations.unshift(newConv);
    this.saveLocalConversations(conversations);

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await setDoc(doc(db, 'internal_conversations', newConv.id), newConv);
      }
    } catch {
      // Local fallback
    }

    return newConv;
  }

  /**
   * Creates a Broadcast or Group channel.
   */
  public async createChannel(params: {
    title: string;
    type: 'GROUP' | 'BROADCAST';
    channelCategory: ChannelCategory;
    creator: UserProfile;
    participants: string[];
    participantProfiles?: ConversationParticipant[];
    description?: string;
  }): Promise<InternalConversation> {
    const now = new Date().toISOString();
    const conversations = this.getLocalConversations();

    const newConv: InternalConversation = {
      id: `conv-chan-${Date.now()}`,
      title: params.title,
      type: params.type,
      channelCategory: params.channelCategory,
      participants: params.participants,
      participantProfiles: params.participantProfiles || [],
      unreadCounts: {},
      description: params.description,
      createdAt: now,
      updatedAt: now,
    };

    params.participants.forEach((p) => {
      newConv.unreadCounts[p] = 0;
    });

    conversations.unshift(newConv);
    this.saveLocalConversations(conversations);

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await setDoc(doc(db, 'internal_conversations', newConv.id), newConv);
      }
    } catch {
      // Local fallback
    }

    return newConv;
  }

  /**
   * Marks a conversation thread as read for the current user.
   */
  public async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const conversations = this.getLocalConversations();
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.unreadCounts[userId] = 0;
      if (conv.lastMessage && !conv.lastMessage.readBy.includes(userId)) {
        conv.lastMessage.readBy.push(userId);
      }
      this.saveLocalConversations(conversations);
    }

    const allMessages = this.getLocalMessages();
    const thread = allMessages[conversationId] || [];
    let updated = false;
    thread.forEach((msg) => {
      if (!msg.readBy.includes(userId)) {
        msg.readBy.push(userId);
        updated = true;
      }
    });
    if (updated) {
      allMessages[conversationId] = thread;
      this.saveLocalMessages(allMessages);
    }

    try {
      const { db } = getFirebaseInstance();
      if (db && conv) {
        await updateDoc(doc(db, 'internal_conversations', conversationId), {
          [`unreadCounts.${userId}`]: 0,
        });
      }
    } catch {
      // Local fallback
    }
  }

  /**
   * Marks a system notification as read.
   */
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    const notifications = this.getLocalNotifications();
    const notif = notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
      notif.readAt = new Date().toISOString();
      this.saveLocalNotifications(notifications);
    }

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await updateDoc(doc(db, 'notifications', notificationId), {
          read: true,
          readAt: new Date().toISOString(),
        });
      }
    } catch {
      // Local fallback
    }
  }

  /**
   * Marks all notifications as read for a user.
   */
  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    const notifications = this.getLocalNotifications();
    const now = new Date().toISOString();
    notifications.forEach((n) => {
      if (n.userId === 'all' || n.userId === userId) {
        n.read = true;
        n.readAt = now;
      }
    });
    this.saveLocalNotifications(notifications);

    const conversations = this.getLocalConversations();
    conversations.forEach((c) => {
      c.unreadCounts[userId] = 0;
    });
    this.saveLocalConversations(conversations);
  }

  /**
   * Sends an automated system notification (e.g., Lead assignment, booking, payment, commission).
   */
  public async sendSystemNotification(
    notification: Omit<SystemNotificationItem, 'id' | 'createdAt' | 'read'>
  ): Promise<SystemNotificationItem> {
    const newNotif: SystemNotificationItem = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifications = this.getLocalNotifications();
    notifications.unshift(newNotif);
    this.saveLocalNotifications(notifications);

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'notifications'), newNotif);
      }
    } catch {
      // Local fallback
    }

    return newNotif;
  }

  /**
   * Calculates total unread pending items (unread messages + unread system notifications).
   */
  public getPendingCount(userId: string): {
    unreadMessages: number;
    unreadNotifications: number;
    total: number;
  } {
    const conversations = this.getLocalConversations();
    const unreadMessages = conversations.reduce((acc, curr) => {
      return acc + (curr.unreadCounts[userId] || 0);
    }, 0);

    const notifications = this.getLocalNotifications();
    const unreadNotifications = notifications.filter(
      (n) => (n.userId === 'all' || n.userId === userId) && !n.read
    ).length;

    return {
      unreadMessages,
      unreadNotifications,
      total: unreadMessages + unreadNotifications,
    };
  }
}

export const messagingService = new InternalMessagingService();
