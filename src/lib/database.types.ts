export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          is_premium: boolean;
          premium_purchased_at: string | null;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          is_premium?: boolean;
          premium_purchased_at?: string | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          is_premium?: boolean;
          premium_purchased_at?: string | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      audio_content: {
        Row: {
          id: string;
          content_type: 'bible' | 'music';
          language: 'english' | 'spanish';
          title: string;
          book_name: string | null;
          chapter_number: number | null;
          artist: string | null;
          album: string | null;
          duration_seconds: number;
          audio_url: string;
          cover_image_url: string | null;
          quality_standard: string;
          quality_premium: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          content_type: 'bible' | 'music';
          language: 'english' | 'spanish';
          title: string;
          book_name?: string | null;
          chapter_number?: number | null;
          artist?: string | null;
          album?: string | null;
          duration_seconds: number;
          audio_url: string;
          cover_image_url?: string | null;
          quality_standard: string;
          quality_premium?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          content_type?: 'bible' | 'music';
          language?: 'english' | 'spanish';
          title?: string;
          book_name?: string | null;
          chapter_number?: number | null;
          artist?: string | null;
          album?: string | null;
          duration_seconds?: number;
          audio_url?: string;
          cover_image_url?: string | null;
          quality_standard?: string;
          quality_premium?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      playlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      playlist_items: {
        Row: {
          id: string;
          playlist_id: string;
          content_id: string;
          order_index: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          playlist_id: string;
          content_id: string;
          order_index?: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          playlist_id?: string;
          content_id?: string;
          order_index?: number;
          added_at?: string;
        };
      };
      listening_sessions: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          started_at: string;
          duration_listened_seconds: number;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_id: string;
          started_at?: string;
          duration_listened_seconds?: number;
          completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_id?: string;
          started_at?: string;
          duration_listened_seconds?: number;
          completed?: boolean;
        };
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          downloaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_id: string;
          downloaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_id?: string;
          downloaded_at?: string;
        };
      };
    };
  };
}
