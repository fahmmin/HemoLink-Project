import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donorMe, donorCreateOrUpdate } from '../api';
import { EligibilityGauge } from '../components/EligibilityGauge';
import { LocationPicker } from '../components/LocationPicker';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function DonorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: 'O+',
    city: '',
    lat: '',
    lng: '',
    isAvailableNow: false,
    lastDonationDate: '',
    healthSummary: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    donorMe()
      .then((p) => {
        setProfile(p);
        if (p) {
          setForm({
            bloodGroup: p.bloodGroup || 'O+',
            city: p.city || '',
            lat: p.location?.coordinates?.[1] ?? '',
            lng: p.location?.coordinates?.[0] ?? '',
            isAvailableNow: p.isAvailableNow ?? false,
            lastDonationDate: p.lastDonationDate ? p.lastDonationDate.slice(0, 10) : '',
            healthSummary: p.healthSummary || '',
          });
        }
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        bloodGroup: form.bloodGroup,
        city: form.city || undefined,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        isAvailableNow: form.isAvailableNow,
        lastDonationDate: form.lastDonationDate || undefined,
        healthSummary: form.healthSummary || undefined,
      };
      const updated = await donorCreateOrUpdate(body);
      setProfile(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div className="font-bold">Loading…</div>;
  if (!user) return null;

  // Client-side rough score when API doesn't return it (from lastDonationDate + isAvailableNow)
  let displayScore = profile?.eligibilityScore;
  if (displayScore == null && profile) {
    const lastDon = profile.lastDonationDate ? new Date(profile.lastDonationDate) : null;
    const daysSince = lastDon ? Math.floor((Date.now() - lastDon) / (1000 * 60 * 60 * 24)) : 999;
    displayScore = profile.isAvailableNow && daysSince >= 90 ? 85 : profile.isAvailableNow ? 60 : 40;
  }
  const verdict = displayScore >= 80 ? 'Safe to Request' : displayScore >= 50 ? 'Moderate' : 'Recently donated / check';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold border-4 border-black inline-block px-4 py-2 bg-[#95E1A3] shadow-[4px_4px_0_0_#000] mb-6">
        Donor profile
      </h1>
      {(profile?.eligibilityScore != null || displayScore != null) && (
        <div className="mb-6">
          <EligibilityGauge score={displayScore ?? profile?.eligibilityScore} verdict={verdict} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="card-nb space-y-4">
        <div>
          <label className="block font-bold mb-1">Blood group</label>
          <select
            value={form.bloodGroup}
            onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value }))}
            className="input-nb"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="input-nb"
            placeholder="e.g. Mangalore"
          />
        </div>
        <LocationPicker
          label="Your location (India) – search or click map"
          lat={form.lat || undefined}
          lng={form.lng || undefined}
          onSelect={(lat, lng) => setForm((f) => ({
            ...f,
            lat: lat !== undefined && lat !== null && lat !== '' ? String(lat) : '',
            lng: lng !== undefined && lng !== null && lng !== '' ? String(lng) : '',
          }))}
        />
        <div>
          <label className="block font-bold mb-1">Last donation date</label>
          <input
            type="date"
            value={form.lastDonationDate}
            onChange={(e) => setForm((f) => ({ ...f, lastDonationDate: e.target.value }))}
            className="input-nb"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Health summary (optional)</label>
          <input
            type="text"
            value={form.healthSummary}
            onChange={(e) => setForm((f) => ({ ...f, healthSummary: e.target.value }))}
            className="input-nb"
            placeholder="e.g. No illness"
          />
        </div>
        <label className="flex items-center gap-2 font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={form.isAvailableNow}
            onChange={(e) => setForm((f) => ({ ...f, isAvailableNow: e.target.checked }))}
            className="w-5 h-5 border-2 border-black"
          />
          I am available to donate now
        </label>
        <button type="submit" disabled={saving} className="btn-nb btn-nb-primary">
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
