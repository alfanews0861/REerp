import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { PUBLIC_FAQS, TESTIMONIALS } from '../../data/publicVenturesData';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Star,
  Sparkles,
  ExternalLink,
} from 'lucide-react-native';

interface PublicContactScreenProps {
  onOpenAdminLogin?: () => void;
}

export const PublicContactScreen: React.FC<PublicContactScreenProps> = ({
  onOpenAdminLogin,
}) => {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Brand & Assurance Card */}
      <View style={styles.brandCard}>
        <View style={styles.brandBadge}>
          <ShieldCheck size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.brandTitle}>REOS Real Estate Developers</Text>
        <Text style={styles.brandSubtitle}>
          ప్రభుత్వ ఆమోదం పొందిన ఓపెన్ ప్లాట్లు • 100% క్లియర్ టైటిల్ • స్పాట్ రిజిస్ట్రేషన్
        </Text>
        <View style={styles.reraPill}>
          <Text style={styles.reraPillText}>RERA REG: TS/RERA/2024/HYD01</Text>
        </View>
      </View>

      {/* Direct Contact Channels */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Get in Touch with Our Property Desk</Text>
        <Text style={styles.sectionSubtitle}>ఉచిత సమాచారం & సైట్ విజిట్ సలహాల కోసం</Text>
      </View>

      <View style={styles.channelsGrid}>
        {/* Phone Call */}
        <TouchableOpacity
          style={[styles.channelCard, { borderColor: '#3B82F6' }]}
          onPress={() => Linking.openURL('tel:+919848012345')}
        >
          <View style={[styles.channelIcon, { backgroundColor: '#EFF6FF' }]}>
            <Phone size={22} color="#2563EB" />
          </View>
          <Text style={styles.channelLabel}>Direct Phone Call</Text>
          <Text style={styles.channelValue}>+91 98480 12345</Text>
          <Text style={styles.channelAction}>Tap to Call Directly</Text>
        </TouchableOpacity>

        {/* WhatsApp Chat */}
        <TouchableOpacity
          style={[styles.channelCard, { borderColor: '#10B981' }]}
          onPress={() => Linking.openURL('https://wa.me/919848012345?text=Hello%20REOS,%20I%20am%20interested%20in%20open%20plots')}
        >
          <View style={[styles.channelIcon, { backgroundColor: '#ECFDF5' }]}>
            <MessageSquare size={22} color="#059669" />
          </View>
          <Text style={styles.channelLabel}>WhatsApp Property Desk</Text>
          <Text style={styles.channelValue}>+91 98480 12345</Text>
          <Text style={[styles.channelAction, { color: '#059669' }]}>Tap to Chat on WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Office Location Card */}
      <View style={styles.officeCard}>
        <View style={styles.officeRow}>
          <MapPin size={24} color="#1E40AF" />
          <View style={styles.officeTextCol}>
            <Text style={styles.officeHeading}>Corporate Headquarters</Text>
            <Text style={styles.officeAddress}>
              Level 4, Financial District Boulevard, Beside Waverock, Nanakramguda, Gachibowli, Hyderabad - 500032
            </Text>
            <Text style={styles.officeHours}>Office Hours: Mon - Sun (9:00 AM to 7:30 PM)</Text>
          </View>
        </View>
      </View>

      {/* Verified Customer Testimonials */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What Our Investors Say</Text>
        <Text style={styles.sectionSubtitle}>కస్టమర్ల అనుభవాలు & అభిప్రాయాలు</Text>
      </View>

      {TESTIMONIALS.map((t) => (
        <View key={t.id} style={styles.testiCard}>
          <View style={styles.testiHeader}>
            <View>
              <Text style={styles.testiName}>{t.name}</Text>
              <Text style={styles.testiRole}>{t.designation} • {t.location}</Text>
            </View>
            <View style={styles.starRow}>
              {[...Array(t.rating)].map((_, idx) => (
                <Star key={idx} size={14} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
          </View>
          <Text style={styles.testiQuote}>"{t.quote}"</Text>
          <View style={styles.testiVentureBadge}>
            <Sparkles size={12} color="#1E40AF" />
            <Text style={styles.testiVentureText}>Purchased: {t.venturePurchased}</Text>
          </View>
        </View>
      ))}

      {/* Frequently Asked Questions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionSubtitle}>సాధారణ సందేహాలు మరియు సమాధానాలు</Text>
      </View>

      {PUBLIC_FAQS.map((faq, idx) => {
        const isExpanded = expandedFaqIndex === idx;
        return (
          <TouchableOpacity
            key={idx}
            style={styles.faqItem}
            onPress={() => toggleFaq(idx)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.questionTe}</Text>
              {isExpanded ? (
                <ChevronUp size={18} color="#1E40AF" />
              ) : (
                <ChevronDown size={18} color="#64748B" />
              )}
            </View>
            <Text style={styles.faqQuestionSub}>{faq.question}</Text>

            {isExpanded && (
              <View style={styles.faqAnswerBox}>
                <Text style={styles.faqAnswerTe}>{faq.answerTe}</Text>
                <Text style={styles.faqAnswerEn}>{faq.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
  },
  brandCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  brandBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  reraPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  reraPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FDE68A',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  channelsGrid: {
    gap: 12,
    marginBottom: 18,
  },
  channelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  channelLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  channelValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  channelAction: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 6,
  },
  officeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  officeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  officeTextCol: {
    flex: 1,
  },
  officeHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  officeAddress: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  officeHours: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  testiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  testiName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  testiRole: {
    fontSize: 11,
    color: '#64748B',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  testiQuote: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  testiVentureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  testiVentureText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E40AF',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  faqQuestionSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  faqAnswerBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  faqAnswerTe: {
    fontSize: 12.5,
    color: '#0F172A',
    lineHeight: 18,
    fontWeight: '600',
  },
  faqAnswerEn: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
