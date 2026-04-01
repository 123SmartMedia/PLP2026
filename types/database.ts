export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          updated_at?: string;
        };
      };
      coaches: {
        Row: {
          id: string;
          name: string;
          slug: string;
          role: string;
          bio: string[];
          specialties: string[];
          sports: string[];
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          role: string;
          bio?: string[];
          specialties?: string[];
          sports?: string[];
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          role?: string;
          bio?: string[];
          specialties?: string[];
          sports?: string[];
          active?: boolean;
          sort_order?: number;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          category: "lesson" | "clinic" | "rental";
          duration_minutes: number;
          price_cents: number;
          description: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: "lesson" | "clinic" | "rental";
          duration_minutes: number;
          price_cents: number;
          description?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          category?: "lesson" | "clinic" | "rental";
          duration_minutes?: number;
          price_cents?: number;
          description?: string | null;
          active?: boolean;
        };
      };
      coach_services: {
        Row: {
          coach_id: string;
          service_id: string;
        };
        Insert: {
          coach_id: string;
          service_id: string;
        };
        Update: {
          coach_id?: string;
          service_id?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          coach_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          coach_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          active?: boolean;
        };
        Update: {
          coach_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          active?: boolean;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          coach_id: string | null;
          service_id: string;
          facility_type: "cage" | "turf_full" | "turf_half" | null;
          start_at: string;
          end_at: string;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          notes: string | null;
          stripe_payment_intent_id: string | null;
          price_cents: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coach_id?: string | null;
          service_id: string;
          facility_type?: "cage" | "turf_full" | "turf_half" | null;
          start_at: string;
          end_at: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          stripe_payment_intent_id?: string | null;
          price_cents: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          coach_id?: string | null;
          service_id?: string;
          facility_type?: "cage" | "turf_full" | "turf_half" | null;
          start_at?: string;
          end_at?: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          stripe_payment_intent_id?: string | null;
          price_cents?: number;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_type: "parent" | "player" | "coach" | "team";
          quote: string;
          rating: number;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_type?: "parent" | "player" | "coach" | "team";
          quote: string;
          rating?: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          author_name?: string;
          author_type?: "parent" | "player" | "coach" | "team";
          quote?: string;
          rating?: number;
          active?: boolean;
          sort_order?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Coach = Database["public"]["Tables"]["coaches"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Availability = Database["public"]["Tables"]["availability"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
