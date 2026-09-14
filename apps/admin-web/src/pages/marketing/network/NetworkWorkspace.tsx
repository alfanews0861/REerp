import React, { FC, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import GroupsIcon from '@mui/icons-material/Groups';
import PolicyIcon from '@mui/icons-material/Policy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { NetworkTreePage } from './NetworkTreePage';
import { NetworkMembersPage } from './NetworkMembersPage';
import { CommissionRulesPage } from '../commission/CommissionRulesPage';
import { CommissionLedgerPage } from '../commission/CommissionLedgerPage';

// Positions view
const PositionsView: FC = () => {
  const positions = [
    {
      title: 'Senior Chief General Manager (Sr CGM)',
      rank: 'Level 1 - Executive Tier',
      requirement: '₹10 Cr+ Cumulative Network Volume, Min. 3 Active CGMs',
      directCommission: '2.0%',
      overrideCommission: '0.5%',
      membersCount: 2,
      color: '#4f46e5',
    },
    {
      title: 'Chief General Manager (CGM)',
      rank: 'Level 2 - Regional Director Tier',
      requirement: '₹5 Cr+ Cumulative Network Volume, Min. 4 Active GMs',
      directCommission: '1.5%',
      overrideCommission: '0.4%',
      membersCount: 4,
      color: '#7c3aed',
    },
    {
      title: 'General Manager (GM)',
      rank: 'Level 3 - Zone Leader Tier',
      requirement: '₹2 Cr+ Cumulative Network Volume, Min. 5 Active SSMs',
      directCommission: '2.0% - 2.5%',
      overrideCommission: '0.3%',
      membersCount: 8,
      color: '#0284c7',
    },
    {
      title: 'Senior Sales Manager (SSM)',
      rank: 'Level 4 - Senior Team Lead',
      requirement: '₹75 L Cumulative Sales, Min. 3 Active SMs',
      directCommission: '2.5%',
      overrideCommission: '0.2%',
      membersCount: 14,
      color: '#059669',
    },
    {
      title: 'Sales Manager (SM)',
      rank: 'Level 5 - Direct Sales Associate',
      requirement: '₹25 L Cumulative Sales or 2 Registered Plots',
      directCommission: '3.0%',
      overrideCommission: 'N/A (Direct Sales)',
      membersCount: 20,
      color: '#d97706',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" fontWeight="700" gutterBottom>
        Marketing Network Positions & Eligibility Criteria
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Official rank designations, qualifying criteria, direct payouts, and team override percentages.
      </Typography>

      <Grid container spacing={2.5}>
        {positions.map((pos, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card sx={{ borderRadius: 2, borderLeft: 6, borderColor: pos.color, boxShadow: 1 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="700">
                      {pos.title}
                    </Typography>
                    <Chip label={pos.rank} size="small" sx={{ mt: 0.5, fontSize: '0.75rem', bgcolor: `${pos.color}15`, color: pos.color, fontWeight: '600' }} />
                  </Box>
                  <Chip label={`${pos.membersCount} Active`} size="small" variant="outlined" />
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Prerequisite:</strong> {pos.requirement}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Direct Commission
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="700" color="primary">
                      {pos.directCommission}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Team Downline Override
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="700" color="secondary">
                      {pos.overrideCommission}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Teams view
const TeamsView: FC = () => {
  const teams = [
    {
      teamName: 'Podalakur Highway Titans',
      leader: 'Kavitha Reddy (CGM)',
      territory: 'Nellore Town / Podalakur Road / Mattempadu',
      totalAgents: 22,
      totalVolume: '₹7.2 Cr',
      activeProjects: 'ISKON City - 2',
    },
    {
      teamName: 'Bombay Highway Eagles',
      leader: 'Suresh Babu (CGM)',
      territory: 'Kovuru / Kodavaluru / National Highway',
      totalAgents: 24,
      totalVolume: '₹7.6 Cr',
      activeProjects: 'Dream City',
    },
    {
      teamName: 'Nellore Urban Central Force',
      leader: 'Vikram Rao (GM)',
      territory: 'Annamayya Circle / Mini Bypass / Magunta Layout',
      totalAgents: 10,
      totalVolume: '₹3.6 Cr',
      activeProjects: 'ISKON Elite Township',
    },
    {
      teamName: 'Coastal Corridor Warriors',
      leader: 'Sunita Patel (GM)',
      territory: 'Chinthareddypalem / Krishnapatnam Road',
      totalAgents: 12,
      totalVolume: '₹4.2 Cr',
      activeProjects: 'ISKON Brundhavanam',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Regional Marketing Teams
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Geographic zone clusters, assigned team leaders, and cumulative territory targets.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<GroupsIcon />} size="small">
          Create New Team
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {teams.map((team, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                    <GroupsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="700">
                      {team.teamName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Zone Leader: <strong>{team.leader}</strong>
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Territory:</strong> {team.territory}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Key Project:</strong> {team.activeProjects}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Team Force
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="700">
                      {team.totalAgents} Field Agents
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Total Zone Sales
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="700" color="primary">
                      {team.totalVolume}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const NetworkWorkspace: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h4" gutterBottom fontWeight="700" color="primary">
        Marketing Network & Commission
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage enterprise multi-level broker hierarchy, agent enrollments, positions, regional teams, and commission payouts.
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<AccountTreeIcon />} iconPosition="start" label="Organization Tree" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Members" />
          <Tab icon={<MilitaryTechIcon />} iconPosition="start" label="Positions & Ranks" />
          <Tab icon={<GroupsIcon />} iconPosition="start" label="Regional Teams" />
          <Tab icon={<PolicyIcon />} iconPosition="start" label="Commission Rules" />
          <Tab icon={<AccountBalanceWalletIcon />} iconPosition="start" label="Commission Ledger" />
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {activeTab === 0 && <NetworkTreePage />}
        {activeTab === 1 && <NetworkMembersPage />}
        {activeTab === 2 && <PositionsView />}
        {activeTab === 3 && <TeamsView />}
        {activeTab === 4 && <CommissionRulesPage />}
        {activeTab === 5 && <CommissionLedgerPage />}
      </Box>
    </Box>
  );
};

export default NetworkWorkspace;
