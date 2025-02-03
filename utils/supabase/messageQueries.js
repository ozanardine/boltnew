import { supabaseAdmin } from './supabaseClient';

/**
 * Funções para gerenciamento de pastas
 */
export async function createFolder(userId, name) {
  try {
    const { data, error } = await supabaseAdmin
      .from('message_folders')
      .insert([{
        user_id: userId,
        name,
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar pasta:', error);
    throw error;
  }
}

export async function updateFolder(folderId, name) {
  try {
    const { data, error } = await supabaseAdmin
      .from('message_folders')
      .update({ name, updated_at: new Date() })
      .eq('id', folderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar pasta:', error);
    throw error;
  }
}

export async function deleteFolder(folderId) {
  try {
    // Primeiro move todas as mensagens da pasta para "sem pasta"
    await supabaseAdmin
      .from('shared_responses')
      .update({ folder_id: null })
      .eq('folder_id', folderId);

    // Depois deleta a pasta
    const { error } = await supabaseAdmin
      .from('message_folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar pasta:', error);
    throw error;
  }
}

export async function getUserFolders(userId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('message_folders')
      .select(`
        *,
        messages:shared_responses(count)
      `)
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;

    return data.map(folder => ({
      ...folder,
      messageCount: folder.messages?.[0]?.count || 0
    }));
  } catch (error) {
    console.error('Erro ao buscar pastas:', error);
    throw error;
  }
}

/**
 * Funções para organização de mensagens
 */
export async function moveMessageToFolder(messageId, folderId) {
  try {
    const { error } = await supabaseAdmin
      .from('shared_responses')
      .update({ 
        folder_id: folderId,
        updated_at: new Date()
      })
      .eq('id', messageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao mover mensagem:', error);
    throw error;
  }
}

export async function archiveMessage(messageId) {
  try {
    const { error } = await supabaseAdmin
      .from('shared_responses')
      .update({ 
        is_archived: true,
        archived_at: new Date(),
        updated_at: new Date()
      })
      .eq('id', messageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao arquivar mensagem:', error);
    throw error;
  }
}

export async function unarchiveMessage(messageId) {
  try {
    const { error } = await supabaseAdmin
      .from('shared_responses')
      .update({ 
        is_archived: false,
        archived_at: null,
        updated_at: new Date()
      })
      .eq('id', messageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao desarquivar mensagem:', error);
    throw error;
  }
}