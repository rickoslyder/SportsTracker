export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_cache: {
        Row: {
          created_at: string
          endpoint: string
          expires_at: string
          headers: Json | null
          key: string
          response: Json
          status_code: number
          ttl: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          expires_at: string
          headers?: Json | null
          key: string
          response: Json
          status_code: number
          ttl: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          expires_at?: string
          headers?: Json | null
          key?: string
          response?: Json
          status_code?: number
          ttl?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_results: {
        Row: {
          created_at: string
          event_id: string
          id: string
          metadata: Json | null
          participant_name: string | null
          points: number | null
          position: number
          status: string | null
          team_id: number | null
          time: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          metadata?: Json | null
          participant_name?: string | null
          points?: number | null
          position: number
          status?: string | null
          team_id?: number | null
          time?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          metadata?: Json | null
          participant_name?: string | null
          points?: number | null
          position?: number
          status?: string | null
          team_id?: number | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      event_teams: {
        Row: {
          created_at: string
          event_id: string
          team_id: number
        }
        Insert: {
          created_at?: string
          event_id: string
          team_id: number
        }
        Update: {
          created_at?: string
          event_id?: string
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_teams_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          external_id: string | null
          id: string
          league: string
          metadata: Json | null
          parent_event_id: string | null
          session_type: string | null
          sport_id: number
          start_time: string
          status: Database["public"]["Enums"]["event_status"]
          timezone: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          external_id?: string | null
          id?: string
          league: string
          metadata?: Json | null
          parent_event_id?: string | null
          session_type?: string | null
          sport_id: number
          start_time: string
          status?: Database["public"]["Enums"]["event_status"]
          timezone: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          external_id?: string | null
          id?: string
          league?: string
          metadata?: Json | null
          parent_event_id?: string | null
          session_type?: string | null
          sport_id?: number
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"]
          timezone?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          event_id: string
          failure_reason: string | null
          id: string
          is_active: boolean
          minutes_before: number
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["reminder_status"]
          type: Database["public"]["Enums"]["reminder_type"]
          updated_at: string
          user_config_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          failure_reason?: string | null
          id?: string
          is_active?: boolean
          minutes_before?: number
          scheduled_for: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["reminder_status"]
          type: Database["public"]["Enums"]["reminder_type"]
          updated_at?: string
          user_config_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          failure_reason?: string | null
          id?: string
          is_active?: boolean
          minutes_before?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["reminder_status"]
          type?: Database["public"]["Enums"]["reminder_type"]
          updated_at?: string
          user_config_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_user_config_id_fkey"
            columns: ["user_config_id"]
            isOneToOne: false
            referencedRelation: "user_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      sports: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          country: string | null
          created_at: string
          driver_name: string | null
          driver_number: number | null
          external_id: string | null
          id: number
          logo_url: string | null
          metadata: Json | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          short_name: string | null
          sport_id: number
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          driver_name?: string | null
          driver_number?: number | null
          external_id?: string | null
          id?: number
          logo_url?: string | null
          metadata?: Json | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name?: string | null
          sport_id: number
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          driver_name?: string | null
          driver_number?: number | null
          external_id?: string | null
          id?: number
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name?: string | null
          sport_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      user_configs: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          last_synced_at: string | null
          preferences: Json
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          sync_enabled: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          last_synced_at?: string | null
          preferences?: Json
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          sync_enabled?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          last_synced_at?: string | null
          preferences?: Json
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          sync_enabled?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_status:
        | "scheduled"
        | "live"
        | "finished"
        | "cancelled"
        | "postponed"
      reminder_status: "pending" | "sent" | "failed" | "cancelled"
      reminder_type: "email" | "push" | "sms"
      subscription_tier: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_status: ["scheduled", "live", "finished", "cancelled", "postponed"],
      reminder_status: ["pending", "sent", "failed", "cancelled"],
      reminder_type: ["email", "push", "sms"],
      subscription_tier: ["free", "premium"],
    },
  },
} as const