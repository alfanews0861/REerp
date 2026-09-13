import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  AIMessage,
  queryMobileRealEstateAssistant,
} from '../../services/mobileAiService';
import { PublicPlot } from '../../data/publicVenturesData';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Layers,
  Car,
  CheckCircle2,
  Compass,
} from 'lucide-react-native';

interface PublicAiAssistantScreenProps {
  onSelectPlot?: (plot: PublicPlot) => void;
  onBookSiteVisit?: (ventureId?: string) => void;
}

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: `నమస్కారం! 🙏 నేను మీ **Gemini AI రియల్ ఎస్టేట్ అసిస్టెంట్‌ని**.\n\nహైదరాబాద్ ఓపెన్ ప్లాట్లు, HMDA/DTCP నిబంధనలు, మీ బడ్జెట్‌కు తగిన ప్లాట్ల వివరాలు మరియు ఉచిత సైట్ విజిట్ గురించి నన్ను ఏదైనా అడగవచ్చు!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTIONS = [
  'తూర్పు ముఖం (East facing) ప్లాట్లు చూపించు',
  'HMDA vs DTCP తేడాలు ఏమిటి?',
  'మోకిల ప్రాంతం విశేషాలు?',
  'Plots under ₹30 Lakhs',
  'ఉచిత క్యాబ్ సైట్ విజిట్ ఎలా బుక్ చేయాలి?',
];

export const PublicAiAssistantScreen: React.FC<PublicAiAssistantScreenProps> = ({
  onSelectPlot,
  onBookSiteVisit,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query || isTyping) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await queryMobileRealEstateAssistant(query);
      const botMsg: AIMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.replyText,
        recommendedPlots: response.recommendedPlots,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'క్షమించండి, సమాచారం పొందడంలో అంతరాయం కలిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Top AI Header */}
        <View style={styles.aiHeader}>
          <View style={styles.aiAvatar}>
            <Sparkles size={20} color="#F59E0B" />
          </View>
          <View style={styles.aiTitleBlock}>
            <Text style={styles.aiName}>Gemini AI Property Advisor</Text>
            <Text style={styles.aiSub}>Real-time Telugu & English Real Estate Intelligence</Text>
          </View>
        </View>

        {/* Messages Feed */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.messageRow,
                m.sender === 'user' ? styles.userRow : styles.assistantRow,
              ]}
            >
              {m.sender === 'assistant' && (
                <View style={styles.botIconCircle}>
                  <Bot size={18} color="#FFFFFF" />
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  m.sender === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    m.sender === 'user' ? styles.userText : styles.assistantText,
                  ]}
                >
                  {m.text}
                </Text>

                {/* Recommended Plots embedded in message */}
                {m.recommendedPlots && m.recommendedPlots.length > 0 && (
                  <View style={styles.plotsEmbedContainer}>
                    <Text style={styles.plotsEmbedHeading}>🌟 Recommended Plots:</Text>
                    {m.recommendedPlots.map((plot) => (
                      <View key={plot.id} style={styles.plotCard}>
                        <View style={styles.plotCardHeader}>
                          <Text style={styles.plotNumber}>Plot #{plot.plotNumber}</Text>
                          <View style={styles.facingBadge}>
                            <Compass size={12} color="#1E40AF" />
                            <Text style={styles.facingBadgeText}>{plot.facing}</Text>
                          </View>
                        </View>
                        <Text style={styles.plotProjectName}>{plot.projectName}</Text>
                        <Text style={styles.plotPrice}>
                          ₹{(plot.totalPrice / 100000).toFixed(2)} Lakhs ({plot.areaSqYds} Sq.Yds)
                        </Text>

                        <View style={styles.plotActionsRow}>
                          <TouchableOpacity
                            style={styles.plotHoldBtn}
                            onPress={() => onSelectPlot?.(plot)}
                          >
                            <Layers size={13} color="#FFFFFF" />
                            <Text style={styles.plotHoldBtnText}>View & Hold</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.plotVisitBtn}
                            onPress={() => onBookSiteVisit?.(plot.projectId)}
                          >
                            <Car size={13} color="#1E40AF" />
                            <Text style={styles.plotVisitBtnText}>Free Cab</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <Text
                  style={[
                    styles.timestamp,
                    m.sender === 'user' ? styles.userTimestamp : styles.assistantTimestamp,
                  ]}
                >
                  {m.timestamp}
                </Text>
              </View>

              {m.sender === 'user' && (
                <View style={styles.userIconCircle}>
                  <User size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageRow, styles.assistantRow]}>
              <View style={styles.botIconCircle}>
                <Bot size={18} color="#FFFFFF" />
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble, { paddingVertical: 12 }]}>
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggestion Chips */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SUGGESTIONS.map((s, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionChip}
                onPress={() => handleSendMessage(s)}
              >
                <Sparkles size={12} color="#D97706" />
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask AI property assistant (తెలుగు / English)..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 12,
  },
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  aiTitleBlock: {
    flex: 1,
  },
  aiName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  aiSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  botIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#1E40AF',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  assistantText: {
    color: '#0F172A',
  },
  timestamp: {
    fontSize: 9.5,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  assistantTimestamp: {
    color: '#94A3B8',
  },
  plotsEmbedContainer: {
    marginTop: 10,
    gap: 8,
  },
  plotsEmbedHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  plotCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  plotCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plotNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  facingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  facingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },
  plotProjectName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  plotPrice: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
    marginTop: 4,
  },
  plotActionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  plotHoldBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 6,
    paddingVertical: 6,
    gap: 4,
  },
  plotHoldBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  plotVisitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 6,
    paddingVertical: 6,
    gap: 4,
  },
  plotVisitBtnText: {
    color: '#1E40AF',
    fontSize: 11,
    fontWeight: '700',
  },
  suggestionsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    gap: 4,
  },
  suggestionText: {
    fontSize: 11.5,
    color: '#92400E',
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
