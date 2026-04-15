import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileApi } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Edit2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [imageFile, setImageFile] = useState(null);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const addresses = user?.addresses || [];

  const handleSave = async () => {
    let payload = { name: form.name, phone: form.phone };
    if (imageFile) {
      payload = new FormData();
      payload.append('name', form.name);
      payload.append('phone', form.phone);
      payload.append('profileImage', imageFile);
    }
    const result = await dispatch(updateProfileApi(payload));
    if (updateProfileApi.fulfilled.match(result)) {
      setEditing(false);
      toast.success('Profile updated!');
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.label || !newAddress.address) { toast.error('Please fill both fields'); return; }
    const updated = [...addresses, { ...newAddress, isDefault: false }];
    const result = await dispatch(updateProfileApi({ addresses: updated }));
    if (updateProfileApi.fulfilled.match(result)) {
      setNewAddress({ label: '', address: '' });
      toast.success('Address added!');
    }
  };

  const handleDeleteAddress = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    const result = await dispatch(updateProfileApi({ addresses: updated }));
    if (updateProfileApi.fulfilled.match(result)) {
      toast.success('Address removed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-8" data-testid="profile-page">
      <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-8 font-manrope">My Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="bg-surface-container-low rounded-xl h-12 p-1 mb-8 border border-outline-variant" data-testid="profile-tabs">
          <TabsTrigger value="profile" className="rounded-lg text-xs font-bold px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-background transition-all">Profile</TabsTrigger>
          <TabsTrigger value="addresses" className="rounded-lg text-xs font-bold px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-background transition-all">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-surface rounded-3xl border border-outline-variant p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 relative overflow-hidden group ring-4 ring-primary/5">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black font-manrope">{initials}</AvatarFallback>
                  )}
                  {editing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Label htmlFor="profile-upload" className="w-full h-full flex items-center justify-center cursor-pointer">
                        <Edit2 className="w-6 h-6 text-white" />
                      </Label>
                      <Input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files[0]) setImageFile(e.target.files[0]); }} />
                    </div>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-2xl font-black text-foreground font-manrope">{user?.name}</h2>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">{user?.role} Account</p>
                </div>
              </div>
              <Button size="lg" variant={editing ? 'default' : 'outline'} className={`rounded-2xl gap-2 h-12 px-6 font-bold ${!editing ? 'border-outline-variant hover:bg-surface-container-low text-foreground' : 'premium-gradient-btn text-white dark:text-background border-0'}`}
                onClick={() => editing ? handleSave() : setEditing(true)} data-testid="edit-profile-btn">
                <Edit2 className="w-4 h-4" /> {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Full Name</Label>
                  {editing ? <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium" data-testid="profile-name-input" />
                    : <p className="text-base text-foreground font-bold px-1" data-testid="profile-name">{user?.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email Address</Label>
                  <p className="text-base text-foreground font-bold px-1" data-testid="profile-email">{user?.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Phone Number</Label>
                  {editing ? <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium" data-testid="profile-phone-input" />
                    : <p className="text-base text-foreground font-bold px-1" data-testid="profile-phone">{user?.phone || 'Not set'}</p>}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="addresses">
          <div className="bg-surface rounded-3xl border border-outline-variant p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-foreground font-manrope">Saved Locations</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl premium-gradient-btn text-white dark:text-background h-12 px-6 font-bold gap-2" data-testid="add-address-btn"><Plus className="w-4 h-4" /> Add New</Button>
                </DialogTrigger>
                <DialogContent className="rounded-[32px] bg-surface border-outline-variant p-8 w-[95vw] max-w-lg">
                  <DialogHeader><DialogTitle className="text-2xl font-black text-foreground font-manrope">Add New Address</DialogTitle></DialogHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Label</Label>
                      <Input value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} placeholder="Home, Office, etc." className="rounded-2xl h-14 bg-surface-container-low border-outline-variant text-foreground font-medium" data-testid="new-address-label" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Full Address</Label>
                      <Input value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} placeholder="Enter full address" className="rounded-2xl h-14 bg-surface-container-low border-outline-variant text-foreground font-medium" data-testid="new-address-input" />
                    </div>
                    <Button className="w-full h-14 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-lg" onClick={handleAddAddress} data-testid="save-address-btn">Save Address</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {addresses.length === 0 ? (
               <div className="text-center py-12 border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-low/30">
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No saved locations</p>
               </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr, i) => (
                  <div key={i} className="flex items-start justify-between p-6 rounded-2xl border border-outline-variant bg-surface-container-low/30 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all" data-testid={`address-${i}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-outline-variant shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-foreground font-manrope text-lg">{addr.label}</span>
                          {addr.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest">Default</span>}
                        </div>
                        <p className="text-sm font-medium text-zinc-500 font-inter">{addr.address}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleDeleteAddress(i)} data-testid={`delete-address-${i}`}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
