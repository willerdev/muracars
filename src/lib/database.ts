import { supabase } from './supabase';
import { Vehicle } from '../types';
import { UserCarWithDetails } from '../types';

export async function fetchCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Vehicle[];
}

export async function fetchUserCars(userId: string): Promise<UserCarWithDetails[]> {
  const { data, error } = await supabase
    .from('user_cars')
    .select(`
      id,
      user_id,
      car_id,
      created_at,
      is_owner,
      cars (
        id,
        make,
        model,
        year,
        price,
        mileage,
        fuel_type,
        transmission,
        image_url,
        features,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserCarWithDetails[];
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