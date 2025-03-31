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
      chatbot: {
        Row: {
          created_at: string
          id: number
          message: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      donated_meds: {
        Row: {
          date_added: string | null
          donor_entity_id: string
          expiry_date: string | null
          id: number
          image_url: string | null
          ingredients: string | null
          medicine_name: string | null
          ngo_entity_id: string | null
          quantity: number | null
          status: string | null
        }
        Insert: {
          date_added?: string | null
          donor_entity_id: string
          expiry_date?: string | null
          id?: number
          image_url?: string | null
          ingredients?: string | null
          medicine_name?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          status?: string | null
        }
        Update: {
          date_added?: string | null
          donor_entity_id?: string
          expiry_date?: string | null
          id?: number
          image_url?: string | null
          ingredients?: string | null
          medicine_name?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donated_meds_donor_entity_id_fkey"
            columns: ["donor_entity_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "donated_meds_ngo_entity_id_fkey"
            columns: ["ngo_entity_id"]
            isOneToOne: false
            referencedRelation: "intermediary_ngo"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string
          entity_id: string
          latitude: string | null
          longitude: string | null
          name: string
          org_name: string
          phone: string | null
        }
        Insert: {
          address: string
          entity_id: string
          latitude?: string | null
          longitude?: string | null
          name: string
          org_name: string
          phone?: string | null
        }
        Update: {
          address?: string
          entity_id?: string
          latitude?: string | null
          longitude?: string | null
          name?: string
          org_name?: string
          phone?: string | null
        }
        Relationships: []
      }
      intermediary_ngo: {
        Row: {
          address: string | null
          entity_id: string
          latitude: string | null
          longitude: string | null
          name: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          entity_id: string
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          entity_id?: string
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      recipients: {
        Row: {
          address: string | null
          entity_id: string
          latitude: string | null
          longitude: string | null
          name: string
          org_name: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          entity_id: string
          latitude?: string | null
          longitude?: string | null
          name: string
          org_name?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          entity_id?: string
          latitude?: string | null
          longitude?: string | null
          name?: string
          org_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      requested_meds: {
        Row: {
          id: string
          medicine_name: string | null
          need_by_date: string | null
          ngo_entity_id: string | null
          quantity: number | null
          recipient_entity_id: string
          status: string | null
        }
        Insert: {
          id?: string
          medicine_name?: string | null
          need_by_date?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          recipient_entity_id: string
          status?: string | null
        }
        Update: {
          id?: string
          medicine_name?: string | null
          need_by_date?: string | null
          ngo_entity_id?: string | null
          quantity?: number | null
          recipient_entity_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requested_meds_ngo_entity_id_fkey"
            columns: ["ngo_entity_id"]
            isOneToOne: false
            referencedRelation: "intermediary_ngo"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "requested_meds_recipient_entity_id_fkey"
            columns: ["recipient_entity_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          entity_id: string
          entity_type: string
          id: number
          password: number | null
          verification: string | null
          verification_id: string
        }
        Insert: {
          created_at?: string
          email: string
          entity_id: string
          entity_type: string
          id?: number
          password?: number | null
          verification?: string | null
          verification_id: string
        }
        Update: {
          created_at?: string
          email?: string
          entity_id?: string
          entity_type?: string
          id?: number
          password?: number | null
          verification?: string | null
          verification_id?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
