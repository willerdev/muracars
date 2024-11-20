import { supabase } from './supabase';
import { Vehicle } from '../types';

export async function fetchCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Vehicle[];
}

export async function fetchUserCars(userId: string) {
  const { data, error } = await supabase
    .from('user_cars')
    .select(`
      *,
      cars (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}