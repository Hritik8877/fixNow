import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/lib/api';
import Sidebar from '@/layouts/Sidebar';
import Loader from '@/components/Loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Users, Package, IndianRupee, TrendingUp, Search, Clock, Plus, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const statusColors = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const currentUser = useSelector(state => state.auth.user);
  const isSuperAdmin = currentUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [searchUsers, setSearchUsers] = useState('');
  const [searchBookings, setSearchBookings] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const fetchUsers = async () => {
    try {
      const u = await api.get('/admin/users');
      setAllUsers(u.data);
    } catch {
      toast.error('Failed to reload users');
    }
  };

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/bookings'),
    ]).then(([s, u, b]) => {
      setStats(s.data);
      setAllUsers(u.data);
      setAllBookings(b.data);
    }).catch(err => {
      toast.error('Failed to load admin data');
    }).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setAllBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success('Booking status updated');
    } catch { toast.error('Failed to update'); }
  };

  const handleAddAdmin = async () => {
    try {
      if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        return toast.error("Please fill all required fields");
      }
      await api.post('/admin/create-admin', newAdmin);
      toast.success('Admin account created successfully!');
      setIsAddAdminOpen(false);
      setNewAdmin({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchUsers.toLowerCase()) || u.email?.toLowerCase().includes(searchUsers.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const filteredBookings = allBookings.filter(b => {
    if (!searchBookings) return true;
    const q = searchBookings.toLowerCase();
    return b.serviceId?.name?.toLowerCase().includes(q) || b._id?.toLowerCase().includes(q);
  });

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500/10 text-blue-500', change: '+12%' },
    { label: 'Technicians', value: stats.totalTechnicians, icon: Package, color: 'bg-violet-500/10 text-violet-500', change: '+8%' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Clock, color: 'bg-amber-500/10 text-amber-500', change: '+24%' },
    { label: 'Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: IndianRupee, color: 'bg-emerald-500/10 text-emerald-500', change: '+18%' },
  ] : [];

  if (loading) return <div className="flex min-h-[calc(100vh-4rem)]"><Sidebar role="admin" /><main className="flex-1"><Loader /></main></div>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background" data-testid="admin-dashboard">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'Outfit' }}>Admin Dashboard</h1>
              <p className="text-sm text-zinc-500 mt-1">Platform overview and management</p>
            </div>
            <TabsList className="bg-surface-container-low rounded-xl h-10 p-1" data-testid="admin-dashboard-tabs">
              <TabsTrigger value="overview" className="rounded-lg text-xs px-4 data-[state=active]:bg-surface data-[state=active]:shadow-sm data-[state=active]:text-foreground">Overview</TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg text-xs px-4 data-[state=active]:bg-surface data-[state=active]:shadow-sm data-[state=active]:text-foreground">Users</TabsTrigger>
              <TabsTrigger value="bookings" className="rounded-lg text-xs px-4 data-[state=active]:bg-surface data-[state=active]:shadow-sm data-[state=active]:text-foreground">Bookings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map(stat => (
                <div key={stat.label} className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]" data-testid={`admin-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}><stat.icon className="w-5 h-5" strokeWidth={1.5} /></div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 text-xs font-medium"><TrendingUp className="w-3 h-3" /> {stat.change}</div>
                  </div>
                  <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Outfit' }}>{stat.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'Outfit' }}>Recent Bookings</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="border-outline-variant">
                    <TableHead className="text-xs font-medium text-zinc-400">Service</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Customer</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Date</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Amount</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Status</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {allBookings.slice(0, 5).map(b => (
                      <TableRow key={b._id} className="border-outline-variant/10">
                        <TableCell className="text-sm font-medium text-foreground">{b.serviceId?.name || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-zinc-500">{b.userId?.name || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-zinc-500">{b.date}</TableCell>
                        <TableCell className="text-sm font-medium text-foreground">₹{b.total?.toLocaleString()}</TableCell>
                        <TableCell><Badge className={`rounded-full text-[10px] uppercase tracking-wider border ${statusColors[b.status]}`}>{b.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-xl border border-outline-variant px-4 flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-zinc-400" />
                  <Input placeholder="Search users..." value={searchUsers} onChange={e => setSearchUsers(e.target.value)}
                    className="border-0 bg-transparent shadow-none h-10 px-0 focus-visible:ring-0 text-foreground" data-testid="admin-search-users" />
                </div>
                {isSuperAdmin && (
                  <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                    <DialogTrigger asChild>
                      <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 gap-1 text-xs"><ShieldCheck className="w-4 h-4" /> Add Admin</Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-sm">
                      <DialogHeader><DialogTitle style={{ fontFamily: 'Outfit' }}>Create Admin Account</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Full Name</Label><Input placeholder="Admin Name" className="rounded-xl" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} /></div>
                        <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Email</Label><Input type="email" placeholder="admin@fixnow.com" className="rounded-xl" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} /></div>
                        <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Password</Label><Input type="password" placeholder="Secure Password" className="rounded-xl" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} /></div>
                        <Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 mt-2" onClick={handleAddAdmin}>Create Admin</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                {[
                  { label: "All Users", value: "all" },
                  { label: "Admins", value: "admin" },
                  { label: "Technicians", value: "technician" },
                  { label: "Customers", value: "user" },
                ].map((r) => (
                  <Button
                    key={r.value}
                    variant={roleFilter === r.value ? "default" : "outline"}
                    size="sm"
                    className={`rounded-xl h-8 px-4 text-xs cursor-pointer ${roleFilter === r.value
                      ? "bg-foreground text-background hover:opacity-90 shadow-sm"
                      : "text-zinc-500 hover:bg-surface-container-low border-outline-variant"
                      }`}
                    onClick={() => setRoleFilter(r.value)}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="border-zinc-100">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Name</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Email</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Role</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Phone</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filteredUsers.map(u => (
                      <TableRow key={u._id} className="border-outline-variant/10">
                        <TableCell>
                          <Avatar className="w-8 h-8 border border-outline-variant">
                            {u.profileImage ? (
                              <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <AvatarFallback className="bg-surface-container-high text-zinc-500 text-[10px] font-semibold">
                                {u.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">{u.name}</TableCell>
                        <TableCell className="text-sm text-zinc-500">{u.email}</TableCell>
                        <TableCell><Badge className={`rounded-full text-[10px] uppercase tracking-wider border ${u.role === 'admin' ? 'bg-violet-500/10 text-violet-500 border-violet-500/20' : u.role === 'technician' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-surface-container-high text-zinc-500 border-outline-variant'}`}>{u.role}</Badge></TableCell>
                        <TableCell className="text-sm text-zinc-500">{u.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-surface-container-low rounded-xl border border-outline-variant px-4 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-400" />
                  <Input placeholder="Search bookings..." value={searchBookings} onChange={e => setSearchBookings(e.target.value)}
                    className="border-0 bg-transparent shadow-none h-10 px-0 focus-visible:ring-0 text-foreground" data-testid="admin-search-bookings" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="border-zinc-100">
                    <TableHead className="text-xs font-medium text-zinc-400">Service</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Customer</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Date</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Amount</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Status</TableHead>
                    <TableHead className="text-xs font-medium text-zinc-400">Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filteredBookings.map(b => (
                      <TableRow key={b._id} className="border-outline-variant/10">
                        <TableCell className="text-sm font-medium text-foreground">{b.serviceId?.name || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-zinc-500">{b.userId?.name || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-zinc-500">{b.date}</TableCell>
                        <TableCell className="text-sm font-medium text-foreground">₹{b.total?.toLocaleString()}</TableCell>
                        <TableCell><Badge className={`rounded-full text-[10px] uppercase tracking-wider border ${statusColors[b.status]}`}>{b.status}</Badge></TableCell>
                        <TableCell>
                          {b.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button size="sm" className="h-7 text-[10px] rounded-lg bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusChange(b._id, 'accepted')}>Accept</Button>
                              <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg" onClick={() => handleStatusChange(b._id, 'cancelled')}>Cancel</Button>
                            </div>
                          )}
                          {(b.status === 'accepted' || b.status === 'in-progress') && (
                            <Button size="sm" className="h-7 text-[10px] rounded-lg bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusChange(b._id, 'completed')}>Complete</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
