import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookings, updateBookingStatusApi } from '@/store/bookingsSlice';
import { fetchServices } from '@/store/servicesSlice';
import Sidebar from '@/layouts/Sidebar';
import BookingCard from '@/components/BookingCard';
import EmptyState from '@/components/EmptyState';
import Loader from '@/components/Loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Briefcase, Clock, CheckCircle2, Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TechnicianDashboard() {
  const { user } = useSelector(s => s.auth);
  const { bookings, loading: bLoading, fetched: bFetched } = useSelector(s => s.bookings);
  const { allServices, fetched: sFetched } = useSelector(s => s.services);
  const dispatch = useDispatch();
  const [tab, setTab] = useState('overview');
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', category: '', description: '', imageFile: null });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (!bFetched) dispatch(fetchBookings());
    if (!sFetched) dispatch(fetchServices());
  }, [dispatch, bFetched, sFetched]);

  const techServices = allServices.filter(s => s.technicianId === user?._id);
  const pending = bookings.filter(b => b.status === 'pending');
  const accepted = bookings.filter(b => b.status === 'accepted');
  const inProgress = bookings.filter(b => b.status === 'in-progress');
  const completed = bookings.filter(b => b.status === 'completed');

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateBookingStatusApi({ id, status }));
    if (updateBookingStatusApi.fulfilled.match(result)) {
      toast.success(`Booking ${status === 'accepted' ? 'accepted' : status === 'in-progress' ? 'started' : status === 'completed' ? 'completed' : 'updated'}!`);
    } else {
      toast.error(result.payload || 'Failed to update');
    }
  };

  const handleAddService = async () => {
    try {
      if (!newService.name || !newService.price || !newService.category || !newService.description) {
        return toast.error("Please fill all required fields");
      }
      const formData = new FormData();
      formData.append('name', newService.name);
      formData.append('price', newService.price);
      formData.append('category', newService.category);
      formData.append('description', newService.description);
      if (newService.imageFile) formData.append('image', newService.imageFile);
      
      const { default: api } = await import('@/lib/api');
      await api.post('/services', formData);
      toast.success('Service created successfully!');
      setIsAddServiceOpen(false);
      setNewService({ name: '', price: '', category: '', description: '', imageFile: null });
      dispatch(fetchServices());
    } catch (err) {
      toast.error('Failed to create service');
    }
  };

  const handleUpdateService = async () => {
    try {
      if (!editingService.name || !editingService.price || !editingService.category) {
        return toast.error("Name, Price and Category are required");
      }
      const formData = new FormData();
      formData.append('name', editingService.name);
      formData.append('price', editingService.price);
      formData.append('category', editingService.category);
      formData.append('description', editingService.description || '');
      if (editingService.imageFile) formData.append('image', editingService.imageFile);
      
      const { default: api } = await import('@/lib/api');
      await api.put(`/services/${editingService._id}`, formData);
      toast.success('Service updated successfully!');
      setIsEditServiceOpen(false);
      setEditingService(null);
      dispatch(fetchServices());
    } catch (err) {
      toast.error('Failed to update service');
    }
  };

  const stats = [
    { label: 'Pending', value: pending.length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'In Progress', value: inProgress.length + accepted.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'My Services', value: techServices.length, icon: Briefcase, color: 'bg-violet-50 text-violet-600' },
  ];

  if (bLoading && !bFetched) return <div className="flex min-h-[calc(100vh-4rem)]"><Sidebar role="technician" /><main className="flex-1"><Loader /></main></div>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]" data-testid="technician-dashboard">
      <Sidebar role="technician" />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>Technician Dashboard</h1>
              <p className="text-sm text-zinc-500 mt-1">Manage your services and orders</p>
            </div>
            <TabsList className="bg-zinc-100 rounded-xl h-10 p-1" data-testid="tech-dashboard-tabs">
              <TabsTrigger value="overview" className="rounded-lg text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Orders</TabsTrigger>
              <TabsTrigger value="services" className="rounded-lg text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">My Services</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-blue-50 text-blue-600 text-xl font-semibold">{user?.name?.split(' ').map(n => n[0]).join('') || 'T'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900" style={{ fontFamily: 'Outfit' }}>{user?.name}</h2>
                  <p className="text-sm text-zinc-500">{user?.specialization || 'Technician'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {user?.rating || 4.5}</span>
                    <span className="text-xs text-zinc-400">{user?.completedJobs || 0} jobs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]" data-testid={`tech-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900" style={{ fontFamily: 'Outfit' }}>{stat.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-zinc-900 mb-4" style={{ fontFamily: 'Outfit' }}>Incoming Orders</h2>
            {pending.length === 0 ? (
              <EmptyState title="No pending orders" description="New orders will appear here" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pending.map(b => <BookingCard key={b._id} booking={b} showActions onStatusChange={handleStatusChange} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-6">
              {[{ label: 'Pending', items: pending }, { label: 'Accepted', items: accepted }, { label: 'In Progress', items: inProgress }, { label: 'Completed', items: completed }].map(group => (
                <div key={group.label}>
                  <h3 className="font-semibold text-zinc-900 mb-3" style={{ fontFamily: 'Outfit' }}>{group.label} ({group.items.length})</h3>
                  {group.items.length === 0 ? <p className="text-sm text-zinc-400 mb-4">No {group.label.toLowerCase()} orders</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {group.items.map(b => <BookingCard key={b._id} booking={b} showActions={group.label !== 'Completed'} onStatusChange={handleStatusChange} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-900" style={{ fontFamily: 'Outfit' }}>My Services ({techServices.length})</h3>
              <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-1 text-xs" data-testid="add-service-btn"><Plus className="w-3.5 h-3.5" /> Add Service</Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-md">
                  <DialogHeader><DialogTitle style={{ fontFamily: 'Outfit' }}>Add New Service</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4 h-96 overflow-y-auto pr-2">
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Service Name *</Label><Input placeholder="AC Deep Cleaning" className="rounded-xl" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} /></div>
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Category * (e.g. ac, plumbing, custom)</Label><Input placeholder="Category" className="rounded-xl" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} /></div>
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Price (₹) *</Label><Input type="number" placeholder="999" className="rounded-xl" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} /></div>
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Description *</Label><Input placeholder="Thorough cleaning service..." className="rounded-xl" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} /></div>
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Cover Image</Label><Input type="file" accept="image/*" className="rounded-xl" onChange={e => setNewService({...newService, imageFile: e.target.files[0]})} /></div>
                    <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 mt-2" onClick={handleAddService}>Create Service</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
                <DialogContent className="rounded-2xl max-w-md">
                  <DialogHeader><DialogTitle style={{ fontFamily: 'Outfit' }}>Edit Service</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4 h-96 overflow-y-auto pr-2">
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Service Name *</Label><Input placeholder="AC Deep Cleaning" className="rounded-xl" value={editingService?.name || ''} onChange={e => setEditingService({...editingService, name: e.target.value})} /></div>
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Category *</Label><Input placeholder="Category" className="rounded-xl" value={editingService?.category || ''} onChange={e => setEditingService({...editingService, category: e.target.value})} /></div>
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Price (₹) *</Label><Input type="number" placeholder="999" className="rounded-xl" value={editingService?.price || ''} onChange={e => setEditingService({...editingService, price: e.target.value})} /></div>
                    <div><Label className="text-xs font-medium text-zinc-500 mb-2 block">Description</Label><Input placeholder="Thorough cleaning service..." className="rounded-xl" value={editingService?.description || ''} onChange={e => setEditingService({...editingService, description: e.target.value})} /></div>
                    <div>
                      <Label className="text-xs font-medium text-zinc-500 mb-2 block">Cover Image</Label>
                      {editingService?.image && !editingService?.imageFile && (
                        <div className="mb-2 relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200">
                          <img src={editingService.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <Input type="file" accept="image/*" className="rounded-xl" onChange={e => setEditingService({...editingService, imageFile: e.target.files[0]})} />
                    </div>
                    <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 mt-2" onClick={handleUpdateService}>Update Service</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {techServices.length === 0 ? <EmptyState title="No services yet" description="Add your first service" /> : (
              <div className="space-y-3">
                {techServices.map(s => (
                  <div key={s._id} className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]" data-testid={`tech-service-${s._id}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"><img src={s.image} alt={s.name} className="w-full h-full object-cover" /></div>
                      <div>
                        <h4 className="font-semibold text-sm text-zinc-900">{s.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-medium text-zinc-900">₹{s.price?.toLocaleString()}</span>
                          <span className="flex items-center gap-1 text-xs text-zinc-400"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {s.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => { setEditingService(s); setIsEditServiceOpen(true); }}><Edit2 className="w-4 h-4 text-zinc-400" /></Button>
                      <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
