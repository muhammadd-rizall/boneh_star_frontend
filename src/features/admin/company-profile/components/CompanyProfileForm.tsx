import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Info, 
  Image as ImageIcon, 
  Save, 
  Plus, 
  Trash2,
  Globe
} from "lucide-react";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import type { CompanyProfileFormData } from "../types/CompanyProfile";
import Loader from "@/components/feedback/Loader";
import Alert from "@/components/feedback/Alert";

export default function CompanyProfileForm() {
  const { profile, loading, updating, error, updateProfile, refetch } = useCompanyProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyProfileFormData>({
    company_name: "",
    address: "",
    phone: [""],
    whatsapp: [""],
    email: "",
    description: "",
    logo: null,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name,
        address: profile.address,
        phone: profile.phone.length > 0 ? profile.phone : [""],
        whatsapp: profile.whatsapp.length > 0 ? profile.whatsapp : [""],
        email: profile.email || "",
        description: profile.description || "",
        logo: null,
      });
      if (profile.logo) {
        setImagePreview(profile.logo);
      }
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (
    type: "phone" | "whatsapp",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[type]];
    newArray[index] = value;
    setFormData({ ...formData, [type]: newArray });
  };

  const addArrayItem = (type: "phone" | "whatsapp") => {
    setFormData({ ...formData, [type]: [...formData[type], ""] });
  };

  const removeArrayItem = (type: "phone" | "whatsapp", index: number) => {
    if (formData[type].length > 1) {
      const newArray = formData[type].filter((_, i) => i !== index);
      setFormData({ ...formData, [type]: newArray });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    try {
      await updateProfile(formData);
      setSuccessMessage("Company profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      refetch();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <Alert variant="danger" title="Error">
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" title="Success">
          {successMessage}
        </Alert>
      )}

      {/* Logo Section */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <ImageIcon size={18} className="text-indigo-500" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Company Logo</h4>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group h-32 w-32 flex items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 overflow-hidden transition-all hover:border-indigo-300">
            {imagePreview ? (
              <img src={imagePreview} alt="Logo Preview" className="h-full w-full object-contain p-2" />
            ) : (
              <ImageIcon size={40} />
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-slate-800">Upload Logo</span>
            <span className="text-xs text-slate-500 max-w-xs">Recommended: Square image, PNG or SVG. Max 2MB.</span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2 w-fit"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            >
              Change Logo
            </Button>
          </div>
        </div>
      </section>

      {/* Basic Info */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Building2 size={18} className="text-indigo-500" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Basic Information</h4>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Company Name"
            placeholder="e.g. Boneh Star"
            icon={Building2}
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. info@bonehstar.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <Textarea
          label="Office Address"
          placeholder="Enter full company address..."
          icon={MapPin}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
        <Textarea
          label="Company Description"
          placeholder="Tell something about your company..."
          icon={Info}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </section>

      {/* Contact Info */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Phone size={18} className="text-indigo-500" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Contact Numbers</h4>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Phone Numbers */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone size={16} /> Phone Numbers
            </label>
            {formData.phone.map((num, index) => (
              <div key={`phone-${index}`} className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="e.g. 021-123456"
                  value={num}
                  onChange={(e) => handleArrayChange("phone", index, e.target.value)}
                  required
                />
                {formData.phone.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="aspect-square p-2 text-rose-500 border-rose-100 hover:bg-rose-50"
                    onClick={() => removeArrayItem("phone", index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1 border-dashed"
              icon={Plus}
              onClick={() => addArrayItem("phone")}
            >
              Add Phone Number
            </Button>
          </div>

          {/* WhatsApp Numbers */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Globe size={16} /> WhatsApp Numbers
            </label>
            {formData.whatsapp.map((num, index) => (
              <div key={`ws-${index}`} className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="e.g. 08123456789"
                  value={num}
                  onChange={(e) => handleArrayChange("whatsapp", index, e.target.value)}
                  required
                />
                {formData.whatsapp.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="aspect-square p-2 text-rose-500 border-rose-100 hover:bg-rose-50"
                    onClick={() => removeArrayItem("whatsapp", index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1 border-dashed"
              icon={Plus}
              onClick={() => addArrayItem("whatsapp")}
            >
              Add WhatsApp Number
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-4 flex justify-end border-t border-slate-100 pt-8">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full md:w-64" 
          loading={updating} 
          icon={Save}
        >
          Save Company Profile
        </Button>
      </div>
    </form>
  );
}
