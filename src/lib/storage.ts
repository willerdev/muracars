import { supabase } from './supabase';

export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('carimages')
    .upload(filePath, file, {
      contentType: file.type
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = await supabase.storage
    .from('carimages')
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return data.publicUrl;
}