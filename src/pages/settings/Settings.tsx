import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { Save, Bell, Lock, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Implement password change logic here
      toast.success('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Notifications */}
        <Card
          title="Notifications"
          subtitle="Manage your notification preferences"
          className="space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                  Email notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive email notifications about important updates
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="pushNotifications"
                  name="pushNotifications"
                  type="checkbox"
                  checked={formData.pushNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                  Push notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive push notifications in your browser
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketingEmails"
                  name="marketingEmails"
                  type="checkbox"
                  checked={formData.marketingEmails}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                  Marketing emails
                </label>
                <p className="text-sm text-gray-500">
                  Receive marketing and promotional emails
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              leftIcon={<Bell className="h-4 w-4" />}
              onClick={() => toast.success('Notification settings saved')}
            >
              Save preferences
            </Button>
          </div>
        </Card>

        {/* Password */}
        <Card
          title="Password"
          subtitle="Update your password"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <FormField
              label="Current password"
              id="currentPassword"
              error={errors.currentPassword}
              required
            >
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </FormField>

            <FormField
              label="New password"
              id="newPassword"
              error={errors.newPassword}
              required
            >
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </FormField>

            <FormField
              label="Confirm new password"
              id="confirmPassword"
              error={errors.confirmPassword}
              required
            >
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </FormField>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
                leftIcon={<Lock className="h-4 w-4" />}
              >
                Update password
              </Button>
            </div>
          </form>
        </Card>

        {/* Security */}
        <Card
          title="Security"
          subtitle="Manage your security settings"
        >
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="twoFactorEnabled"
                  name="twoFactorEnabled"
                  type="checkbox"
                  checked={formData.twoFactorEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="twoFactorEnabled" className="font-medium text-gray-700">
                  Two-factor authentication
                </label>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                leftIcon={<Shield className="h-4 w-4" />}
                onClick={() => toast.success('Security settings saved')}
              >
                Save security settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;