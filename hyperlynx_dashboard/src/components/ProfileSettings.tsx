import React, { useState, useEffect } from 'react';
import { User, Mail, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

export function ProfileSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setName(data.name || '');
      setEmail(data.email || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
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
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div>
          <h2 className="text-xl mb-2">Account Information</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="inline-block w-32">Account Type:</span>
              <span>Standard User</span>
            </p>
            <p>
              <span className="inline-block w-32">Status:</span>
              <span className="text-green-600">Active</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
