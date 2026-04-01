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
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      coaches: {
        Row: {
          id: string;
          profile_id: string | null;
          name: string;
          bio: string | null;
          image_url: string | null;
          specialties: string[];
          active: boolean;
          // Added via migration
          slug: string | null;
          role: string | null;
          sports: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          name: string;
          bio?: string | null;
          image_url?: string | null;
          specialties?: string[];
          active?: boolean;
          slug?: string | null;
          role?: string | null;
          sports?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          bio?: string | null;
          image_url?: string | null;
          specialties?: string[];
          active?: boolean;
          slug?: string | null;
          role?: string | null;
          sports?: string[];
          sort_order?: number;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          type: "lesson" | "clinic" | "rental";
          name: string;
          description: string | null;
          price_cents: number;
          duration_minutes: number;
          max_participants: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "lesson" | "clinic" | "rental";
          name: string;
          description?: string | null;
          price_cents: number;
          duration_minutes: number;
          max_participants?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: "lesson" | "clinic" | "rental";
          name?: string;
          description?: string | null;
          price_cents?: number;
          duration_minutes?: number;
          max_participants?: number;
          active?: boolean;
          updated_at?: string;
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
      facilities: {
        Row: {
          id: string;
          type: string;
          name: string;
          description: string | null;
          hourly_rate_cents: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          name: string;
          description?: string | null;
          hourly_rate_cents: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: string;
          name?: string;
          description?: string | null;
          hourly_rate_cents?: number;
          active?: boolean;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          coach_id: string | null;
          facility_id: string | null;
          service_id: string;
          start_time: string;
          end_time: string;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          payment_intent_id: string | null;
          notes: string | null;
          total_cents: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coach_id?: string | null;
          facility_id?: string | null;
          service_id: string;
          start_time: string;
          end_time: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          payment_intent_id?: string | null;
          notes?: string | null;
          total_cents: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          coach_id?: string | null;
          facility_id?: string | null;
          service_id?: string;
          start_time?: string;
          end_time?: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          payment_intent_id?: string | null;
          notes?: string | null;
          total_cents?: number;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          user_id: string | null;
          author_name: string;
          content: string;
          rating: number;
          approved: boolean;
          // Added via migration
          author_type: string | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          author_name: string;
          content: string;
          rating: number;
          approved?: boolean;
          author_type?: string | null;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          author_name?: string;
          content?: string;
          rating?: number;
          approved?: boolean;
          author_type?: string | null;
          sort_order?: number | null;
          updated_at?: string;
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
export type Facility = Database["public"]["Tables"]["facilities"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
