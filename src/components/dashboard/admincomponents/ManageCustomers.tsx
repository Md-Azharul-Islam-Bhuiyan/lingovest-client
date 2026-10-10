import React, { useState } from 'react';
import Loader from '@/components/common/Loader';
import CustomDropdown from '@/components/common/CustomDropdown';
import {
  useCreateUserByAdminMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetProfileQuery,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
} from '@/redux/api/authApi';
import { useCurrentUser } from '@/redux/features/authSlice';
import { useAppSelector } from '@/redux/hook';
import { TCurrentUser } from '@/types/commonTypes';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Eye,
  Key,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type ActiveTab = 'PENDING' | 'LEARNERS' | 'STAFF' | 'ALL';

const ManageCustomers: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser | null;
  const userRole = (currentUser?.role || '').toUpperCase();
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  const isStaff = userRole === 'STAFF';

  // Redirect if unauthorized
  if (currentUser && !isSuperAdmin && !isStaff) {
    navigate('/', { replace: true });
  }

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('PENDING');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<any | null>(null);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    mobile: '',
    city: '',
  });
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);

  // Queries & Mutations
  const { data: profileData } = useGetProfileQuery(undefined);
  const {
    data: usersData,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
    isFetching,
  } = useGetAllUsersQuery(searchTerm ? `searchTerm=${encodeURIComponent(searchTerm)}&limit=100` : 'limit=100');

  const [createUserByAdmin] = useCreateUserByAdminMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const allUsers: any[] = usersData?.data || [];

  // Filter lists
  const pendingRequests = allUsers.filter((u) => u.status === 'PENDING');
  const activeLearners = allUsers.filter((u) => u.role === 'USER' && u.status === 'ACTIVE');
  const staffMembers = allUsers.filter((u) => u.role === 'STAFF');
  const blockedUsers = allUsers.filter((u) => u.status === 'BLOCKED');

  // Currently displayed users based on tab
  const displayedUsers = allUsers.filter((user) => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = user.name?.toLowerCase().includes(term);
      const matchEmail = user.email?.toLowerCase().includes(term);
      if (!matchName && !matchEmail) return false;
    }

    if (activeTab === 'PENDING') return user.status === 'PENDING';
    if (activeTab === 'LEARNERS') return user.role === 'USER' && user.status !== 'PENDING';
    if (activeTab === 'STAFF') return user.role === 'STAFF';
    return true; // 'ALL'
  });

  // Handler: Approve / Accept Registration Request
  const handleAcceptRequest = async (user: any) => {
    try {
      const response: any = await updateUserStatus({
        id: user.id,
        status: 'ACTIVE',
      }).unwrap();

      if (response?.success || response?.data) {
        toast.success(`Request accepted! ${user.name} can now log into the site. 🎉`, {
          icon: '✅',
          duration: 3500,
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to accept user registration', {
        icon: '⚠️',
      });
    }
  };

  // Handler: Reject Registration Request
  const handleRejectRequest = async (user: any) => {
    const confirmReject = window.confirm(
      `Are you sure you want to reject the registration request for "${user.name}" (${user.email})?`
    );
    if (!confirmReject) return;

    try {
      const response: any = await updateUserStatus({
        id: user.id,
        status: 'BLOCKED',
      }).unwrap();

      if (response?.success || response?.data) {
        toast.info(`Registration request for ${user.name} has been rejected.`, {
          icon: '🚫',
          duration: 3000,
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reject registration request', {
        icon: '⚠️',
      });
    }
  };

  // Handler: Block / Unblock existing user
  const handleToggleBlock = async (user: any) => {
    const nextStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const actionLabel = nextStatus === 'ACTIVE' ? 'unblock' : 'block';

    const confirmAction = window.confirm(
      `Are you sure you want to ${actionLabel} ${user.name}?`
    );
    if (!confirmAction) return;

    try {
      await updateUserStatus({ id: user.id, status: nextStatus }).unwrap();
      toast.success(`User ${user.name} is now ${nextStatus.toLowerCase()}.`);
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${actionLabel} user.`);
    }
  };

  // Handler: Super Admin Add User Directly
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      toast.error('Name, email, and password are required.');
      return;
    }

    if (newUserForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmittingNewUser(true);
    try {
      const payload = {
        name: newUserForm.name,
        email: newUserForm.email,
        password: newUserForm.password,
        role: newUserForm.role,
        status: 'ACTIVE',
        mobile: newUserForm.mobile || null,
        city: newUserForm.city || null,
      };

      const response: any = await createUserByAdmin(payload).unwrap();
      if (response?.success || response?.data) {
        toast.success(
          `User "${newUserForm.name}" created successfully with ACTIVE status! They can log in immediately. 🎉`,
          { duration: 4000 }
        );
        setNewUserForm({
          name: '',
          email: '',
          password: '',
          role: 'USER',
          mobile: '',
          city: '',
        });
        setIsAddUserModalOpen(false);
        setActiveTab(newUserForm.role === 'STAFF' ? 'STAFF' : 'LEARNERS');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create user.');
    } finally {
      setIsSubmittingNewUser(false);
    }
  };

  // Handler: Change Role (Super Admin only)
  const handleChangeRole = async (user: any, newRole: 'USER' | 'STAFF') => {
    if (!isSuperAdmin) return;
    const confirmChange = window.confirm(
      `Change role of ${user.name} to ${newRole === 'STAFF' ? 'Staff Member' : 'Learner'}?`
    );
    if (!confirmChange) return;

    try {
      await updateUser({ id: user.id, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole} successfully.`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update user role.');
    }
  };

  if (isUsersLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-violet-200 text-xs font-semibold border border-white/10">
              <Users className="w-4 h-4 text-violet-300" />
              <span>{isSuperAdmin ? 'Super Admin Control Center' : 'Staff Moderation Center'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Learners & Registration Management
            </h1>
            <p className="text-sm md:text-base text-violet-200/90 leading-relaxed">
              Review public sign-up registration requests, approve learners into DeutschLernen, and administer portal access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => refetchUsers()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15"
              title="Refresh User List"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {isSuperAdmin && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddUserModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-sm font-extrabold shadow-lg shadow-pink-500/30 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add User / Learner</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending Requests Metric */}
        <div
          onClick={() => setActiveTab('PENDING')}
          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
            activeTab === 'PENDING'
              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200/80 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Requests</span>
            </span>
            {pendingRequests.length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{pendingRequests.length}</span>
            <span className="text-xs font-bold text-amber-600">
              {pendingRequests.length === 1 ? 'awaiting action' : 'awaiting approval'}
            </span>
          </div>
        </div>

        {/* Active Learners Metric */}
        <div
          onClick={() => setActiveTab('LEARNERS')}
          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
            activeTab === 'LEARNERS'
              ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200/80 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Active Learners</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activeLearners.length}</span>
            <span className="text-xs font-bold text-emerald-600">enrolled</span>
          </div>
        </div>

        {/* Staff Members Metric */}
        <div
          onClick={() => setActiveTab('STAFF')}
          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
            activeTab === 'STAFF'
              ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200/80 hover:border-indigo-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Team</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{staffMembers.length}</span>
            <span className="text-xs font-bold text-indigo-600">editorial curators</span>
          </div>
        </div>

        {/* Total Users Metric */}
        <div
          onClick={() => setActiveTab('ALL')}
          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
            activeTab === 'ALL'
              ? 'bg-slate-900/10 border-slate-900 ring-2 ring-slate-900/20'
              : 'bg-white border-slate-200/80 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Total Accounts</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{allUsers.length}</span>
            <span className="text-xs font-bold text-slate-500">records</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Requests</span>
            {pendingRequests.length > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'PENDING' ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('LEARNERS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'LEARNERS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Active Learners ({activeLearners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STAFF')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'STAFF'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff ({staffMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Users ({allUsers.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Notice for Pending Tab */}
        {activeTab === 'PENDING' && (
          <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-base">⏳</span>
              <span>
                <strong>Approval Queue:</strong> Anyone who registers via the public sign-up form appears here. Once you click <strong>Accept</strong>, their account becomes ACTIVE and they can log into the platform.
              </span>
            </div>
            <span className="font-extrabold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
              {pendingRequests.length} Pending
            </span>
          </div>
        )}

        {displayedUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-5xl">
              {activeTab === 'PENDING' ? '🎉' : '🔍'}
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {activeTab === 'PENDING'
                ? 'No Pending Registration Requests!'
                : 'No users found matching this filter.'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {activeTab === 'PENDING'
                ? 'All registered users have been processed. New public registrations will show up here automatically.'
                : 'Try adjusting your search criteria or switch tabs to view other user categories.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
                  <th className="px-6 py-4">User / Candidate</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedUsers.map((user) => {
                  const isPending = user.status === 'PENDING';
                  const isBlocked = user.status === 'BLOCKED';
                  const isActive = user.status === 'ACTIVE';

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isPending ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm uppercase shadow-sm ${
                              user.role === 'STAFF'
                                ? 'bg-indigo-100 text-indigo-700'
                                : isPending
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {user.name ? user.name.slice(0, 2) : '??'}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">
                              {user.name}
                            </p>
                            <p className="text-slate-500 font-medium flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{user.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            user.role === 'STAFF'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : user.role === 'SUPER_ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {user.role === 'STAFF' && <Shield className="w-3 h-3" />}
                          {user.role === 'USER' && <UserCheck className="w-3 h-3" />}
                          <span>{user.role === 'USER' ? 'Learner' : user.role === 'STAFF' ? 'Staff' : 'Super Admin'}</span>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Pending Approval
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Blocked / Rejected
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {user.createdAt ? (
                          <span>{new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}</span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* If PENDING: Show Accept & Reject buttons */}
                          {isPending ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAcceptRequest(user)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm shadow-emerald-600/20 transition-all"
                                title="Accept request & activate user"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRejectRequest(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs transition-all"
                                title="Reject registration request"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </motion.button>
                            </>
                          ) : (
                            <>
                              {/* View Details */}
                              <button
                                onClick={() => setSelectedUserForDetails(user)}
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                title="View User Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Block / Unblock */}
                              {user.role !== 'SUPER_ADMIN' && (
                                <button
                                  onClick={() => handleToggleBlock(user)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                                    isBlocked
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                                  }`}
                                  title={isBlocked ? 'Activate / Unblock User' : 'Block User'}
                                >
                                  {isBlocked ? 'Unblock' : 'Block'}
                                </button>
                              )}

                              {/* Super Admin Promotion / Demotion */}
                              {isSuperAdmin && user.role !== 'SUPER_ADMIN' && (
                                <CustomDropdown
                                  value={user.role}
                                  onChange={(val) =>
                                    handleChangeRole(user, val as 'USER' | 'STAFF')
                                  }
                                  options={[
                                    { value: 'USER', label: 'Learner', badge: '🎓' },
                                    { value: 'STAFF', label: 'Staff', badge: '🛡️' },
                                  ]}
                                  placeholder="Role"
                                  theme="purple"
                                  allowClear={false}
                                  searchable={false}
                                  className="inline-block"
                                  triggerClassName="py-1 px-2 text-[11px] bg-white border border-slate-200"
                                />
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD USER BY SUPER ADMIN ================= */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold mb-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Direct User Enrollment</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Add User / Learner
                </h3>
                <p className="text-xs text-slate-500">
                  Directly provision an account. Accounts added by Super Admin are set to <strong>ACTIVE</strong> immediately and can log in without waiting.
                </p>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="e.g. Max Mustermann"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">
                    Temporary Password <span className="text-rose-500">*</span> (min 6 chars)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Set temporary password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">
                    Role Assignment <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        newUserForm.role === 'USER'
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="USER"
                        checked={newUserForm.role === 'USER'}
                        onChange={() => setNewUserForm({ ...newUserForm, role: 'USER' })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-extrabold text-xs">Learner (USER)</p>
                        <p className="text-[11px] text-slate-500 font-normal">Student portal access</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        newUserForm.role === 'STAFF'
                          ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="STAFF"
                        checked={newUserForm.role === 'STAFF'}
                        onChange={() => setNewUserForm({ ...newUserForm, role: 'STAFF' })}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-extrabold text-xs">Staff Member</p>
                        <p className="text-[11px] text-slate-500 font-normal">Curriculum curation</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">
                      Mobile Number (optional)
                    </label>
                    <input
                      type="text"
                      value={newUserForm.mobile}
                      onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                      placeholder="+49 ..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">
                      City (optional)
                    </label>
                    <input
                      type="text"
                      value={newUserForm.city}
                      onChange={(e) => setNewUserForm({ ...newUserForm, city: e.target.value })}
                      placeholder="e.g. Berlin"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingNewUser}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold shadow-md shadow-violet-500/25 transition-all flex items-center gap-2"
                  >
                    {isSubmittingNewUser ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create & Activate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: USER DETAILS ================= */}
      <AnimatePresence>
        {selectedUserForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                  {selectedUserForDetails.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {selectedUserForDetails.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedUserForDetails.email}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold">Role:</span>
                  <span className="font-extrabold text-slate-900">{selectedUserForDetails.role}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold">Status:</span>
                  <span
                    className={`font-extrabold ${
                      selectedUserForDetails.status === 'ACTIVE'
                        ? 'text-emerald-600'
                        : selectedUserForDetails.status === 'PENDING'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {selectedUserForDetails.status}
                  </span>
                </div>
                {selectedUserForDetails.mobile && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">Mobile:</span>
                    <span className="font-semibold text-slate-800">{selectedUserForDetails.mobile}</span>
                  </div>
                )}
                {selectedUserForDetails.city && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-bold">City:</span>
                    <span className="font-semibold text-slate-800">{selectedUserForDetails.city}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-bold">Registered:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedUserForDetails.createdAt
                      ? new Date(selectedUserForDetails.createdAt).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedUserForDetails(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCustomers;
