export interface Opportunity {
  type: string;
  label: string;
  signal: string;
  observation: string;
  fix: string;
}

export interface Business {
  slug: string;
  name: string;
  vertical: "hvac" | "plumbing" | "electrical" | "landscaping" | "cleaning" | "construction" | "other";
  city: string;
  logoUrl: string;
  heroPhotoUrl: string;
  brandColor: string;
  googleRating: number;
  reviewCount: number;
  opportunities: Opportunity[];
  calendlyUrl: string;
  coachingUrl: string;
  // Outreach fields (optional — filled by research script or manually)
  website?: string;
  phone?: string;
  email?: string;
  ownerName?: string;
}

export interface Company {
  slug: string;
  name: string;
  vertical: string;
  website: string;
  googleMapsUrl: string;
  googleRating?: number;
  reviewCount?: number;
  ownerName?: string;
  status: "pending" | "researched" | "approved" | "sent" | "skipped";
}
