export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      referrals: {
        Row: {
          created_at: string
          doctor_visited: boolean
          follow_up_date: string | null
          id: string
          notes: string | null
          referred_on: string
          result_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          doctor_visited?: boolean
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          referred_on?: string
          result_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          doctor_visited?: boolean
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          referred_on?: string
          result_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string
          district: string
          id: string
          name: string
          state: string
          type: string | null
        }
        Insert: {
          created_at?: string
          district: string
          id?: string
          name: string
          state?: string
          type?: string | null
        }
        Update: {
          created_at?: string
          district?: string
          id?: string
          name?: string
          state?: string
          type?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          age: number
          created_at: string
          gender: string
          id: string
          name: string
          roll_number: string | null
          school_id: string
        }
        Insert: {
          age: number
          created_at?: string
          gender: string
          id?: string
          name: string
          roll_number?: string | null
          school_id: string
        }
        Update: {
          age?: number
          created_at?: string
          gender?: string
          id?: string
          name?: string
          roll_number?: string | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          school_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          school_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          created_at: string
          false_positive_count: number
          id: string
          left_ear_1000hz: boolean
          left_ear_2000hz: boolean
          left_ear_4000hz: boolean
          left_ear_500hz: boolean
          left_false_positive_count: number
          overall_result: string
          parent_summary_en: string | null
          parent_summary_ta: string | null
          practice_passed: boolean
          readiness_checklist: Json | null
          right_ear_1000hz: boolean
          right_ear_2000hz: boolean
          right_ear_4000hz: boolean
          right_ear_500hz: boolean
          right_false_positive_count: number
          screening_version: string
          session_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          false_positive_count?: number
          id?: string
          left_ear_1000hz?: boolean
          left_ear_2000hz?: boolean
          left_ear_4000hz?: boolean
          left_ear_500hz?: boolean
          left_false_positive_count?: number
          overall_result?: string
          parent_summary_en?: string | null
          parent_summary_ta?: string | null
          practice_passed?: boolean
          readiness_checklist?: Json | null
          right_ear_1000hz?: boolean
          right_ear_2000hz?: boolean
          right_ear_4000hz?: boolean
          right_ear_500hz?: boolean
          right_false_positive_count?: number
          screening_version?: string
          session_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          false_positive_count?: number
          id?: string
          left_ear_1000hz?: boolean
          left_ear_2000hz?: boolean
          left_ear_4000hz?: boolean
          left_ear_500hz?: boolean
          left_false_positive_count?: number
          overall_result?: string
          parent_summary_en?: string | null
          parent_summary_ta?: string | null
          practice_passed?: boolean
          readiness_checklist?: Json | null
          right_ear_1000hz?: boolean
          right_ear_2000hz?: boolean
          right_ear_4000hz?: boolean
          right_ear_500hz?: boolean
          right_false_positive_count?: number
          screening_version?: string
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      test_sessions: {
        Row: {
          created_at: string
          device_info: string | null
          id: string
          school_id: string
          session_date: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          id?: string
          school_id: string
          session_date?: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          device_info?: string | null
          id?: string
          school_id?: string
          session_date?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
