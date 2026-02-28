import React, { useState, useEffect } from 'react';
import { User, Mail, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { hyperlynxApi } from '../services/hyperlynxApi';

export function ProfileSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const profile = await hyperlynxApi.getProfile(accessToken);
        setName([profile.first_name, profile.last_name].filter(Boolean).join(' ').trim());
        setEmail(profile.email || '');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [accessToken]);

  const handleSave = async () => {
    if (!accessToken) {
      toast.error('You are not authenticated');
      return;
    }

    setSaving(true);
    try {
      const [firstName = '', ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      await hyperlynxApi.updateProfile(accessToken, {
        first_name: firstName,
        last_name: lastName,
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl">Profile Settings</h1>
        <Card className="p-8">
          <p className="text-center text-gray-600">Loading profile...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information from Flask user profile APIs</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl mb-4">Personal Information</h2>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="email" type="email" value={email} disabled className="pl-10 bg-gray-50 cursor-not-allowed" />
                </div>
                <p className="text-sm text-gray-500">Email is read-only in this form</p>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave} disabled={saving || !name.trim()} className="gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
