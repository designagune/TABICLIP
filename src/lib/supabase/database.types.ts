export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json | undefined}
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          locale?: string;
          updated_at?: string;
        };
        Relationships: Relationship[];
      };
      trips: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          origin_country_code: string;
          destination_country_code: string;
          language: string;
          start_date: string;
          end_date: string;
          cover_image_path: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          origin_country_code: string;
          destination_country_code: string;
          language: string;
          start_date: string;
          end_date: string;
          cover_image_path?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['trips']['Insert']>;
        Relationships: Relationship[];
      };
      trip_members: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id: string;
          role: string;
          created_at?: string;
        };
        Update: {role?: string};
        Relationships: Relationship[];
      };
      collected_items: {
        Row: {
          id: string;
          trip_id: string;
          type: string;
          source_url: string | null;
          source_platform: string | null;
          original_text: string | null;
          memo: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          type: string;
          source_url?: string | null;
          source_platform?: string | null;
          original_text?: string | null;
          memo?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['collected_items']['Insert']>;
        Relationships: Relationship[];
      };
      attachments: {
        Row: {
          id: string;
          trip_id: string;
          collected_item_id: string | null;
          reservation_id: string | null;
          storage_path: string;
          mime_type: string;
          file_size: number;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          collected_item_id?: string | null;
          reservation_id?: string | null;
          storage_path: string;
          mime_type: string;
          file_size: number;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: never;
        Relationships: Relationship[];
      };
      places: {
        Row: {
          id: string;
          created_by: string;
          visibility: string;
          country_code: string;
          local_name: string;
          translated_name: string;
          address_local: string;
          address_translated: string;
          latitude: number | null;
          longitude: number | null;
          region: string;
          category: string;
          official_url: string | null;
          instagram_url: string | null;
          naver_map_url: string | null;
          kakao_map_url: string | null;
          google_map_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          visibility?: string;
          country_code: string;
          local_name: string;
          translated_name?: string;
          address_local: string;
          address_translated?: string;
          latitude?: number | null;
          longitude?: number | null;
          region: string;
          category: string;
          official_url?: string | null;
          instagram_url?: string | null;
          naver_map_url?: string | null;
          kakao_map_url?: string | null;
          google_map_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['places']['Insert']>;
        Relationships: Relationship[];
      };
      trip_places: {
        Row: {
          id: string;
          trip_id: string;
          place_id: string;
          collected_item_id: string | null;
          memo: string;
          priority: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          place_id: string;
          collected_item_id?: string | null;
          memo?: string;
          priority?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['trip_places']['Insert']>;
        Relationships: Relationship[];
      };
      itinerary_items: {
        Row: {
          id: string;
          trip_id: string;
          trip_place_id: string | null;
          reservation_id: string | null;
          date: string;
          start_time: string | null;
          end_time: string | null;
          title: string;
          memo: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          trip_place_id?: string | null;
          reservation_id?: string | null;
          date: string;
          start_time?: string | null;
          end_time?: string | null;
          title: string;
          memo?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['itinerary_items']['Insert']>;
        Relationships: Relationship[];
      };
      reservations: {
        Row: {
          id: string;
          trip_id: string;
          type: string;
          title: string;
          reservation_date: string;
          reservation_time: string | null;
          confirmation_number: string | null;
          booked_name: string | null;
          address: string | null;
          original_url: string | null;
          cancellation_deadline: string | null;
          payment_status: string;
          memo: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          type: string;
          title: string;
          reservation_date: string;
          reservation_time?: string | null;
          confirmation_number?: string | null;
          booked_name?: string | null;
          address?: string | null;
          original_url?: string | null;
          cancellation_deadline?: string | null;
          payment_status?: string;
          memo?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>;
        Relationships: Relationship[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
