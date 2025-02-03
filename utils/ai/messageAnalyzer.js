import { GoogleGenerativeAI } from '@google/generative-ai';
import stringSimilarity from 'string-similarity';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analisa o conteúdo e sugere tags relevantes
 */
export async function suggestTags(content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      Analise o seguinte texto e sugira até 5 tags relevantes que descrevam seu conteúdo.
      Retorne apenas as tags, uma por linha, sem numeração ou marcadores.
      
      Texto: ${content}
    `;

    const result = await model.generateContent(prompt);
    const tags = result.response.text()
      .split('\n')
      .map(tag => tag.trim())
      .filter(tag => tag);

    return tags;
  } catch (error) {
    console.error('Erro ao gerar sugestões de tags:', error);
    throw error;
  }
}

/**
 * Verifica duplicatas com análise semântica
 */
export async function checkDuplicates(content, existingMessages) {
  try {
    // Primeiro faz uma comparação básica de similaridade de strings
    const basicSimilarities = existingMessages.map(msg => ({
      id: msg.id,
      title: msg.title,
      similarity: stringSimilarity.compareTwoStrings(content, msg.content) * 100
    }));

    // Filtra mensagens com similaridade básica > 50%
    const potentialDuplicates = basicSimilarities
      .filter(sim => sim.similarity > 50)
      .sort((a, b) => b.similarity - a.similarity);

    // Se houver potenciais duplicatas, usa o Gemini para análise semântica
    if (potentialDuplicates.length > 0) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const semanticResults = await Promise.all(
        potentialDuplicates.map(async dup => {
          const msg = existingMessages.find(m => m.id === dup.id);
          const prompt = `
            Compare os seguintes textos e determine sua similaridade semântica em porcentagem.
            Retorne apenas o número (0-100).

            Texto 1: ${content}
            Texto 2: ${msg.content}
          `;

          const result = await model.generateContent(prompt);
          const semanticSimilarity = parseInt(result.response.text().trim());

          return {
            ...dup,
            similarity: (dup.similarity + semanticSimilarity) / 2
          };
        })
      );

      return semanticResults
        .filter(dup => dup.similarity > 70)
        .slice(0, 3);
    }

    return [];
  } catch (error) {
    console.error('Erro ao verificar duplicatas:', error);
    throw error;
  }
}

/**
 * Encontra mensagens relacionadas usando análise semântica
 */
export async function findRelatedMessages(content, existingMessages) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Primeiro extrai os principais tópicos do conteúdo
    const topicsPrompt = `
      Extraia os principais tópicos deste texto em uma lista curta.
      Retorne apenas os tópicos, um por linha.

      Texto: ${content}
    `;

    const topicsResult = await model.generateContent(topicsPrompt);
    const topics = topicsResult.response.text()
      .split('\n')
      .map(topic => topic.trim())
      .filter(topic => topic);

    // Depois compara com outras mensagens
    const relatedResults = await Promise.all(
      existingMessages.map(async msg => {
        const comparePrompt = `
          Compare os seguintes tópicos com este texto e determine a relevância em porcentagem.
          Retorne apenas o número (0-100).

          Tópicos: ${topics.join(', ')}
          Texto: ${msg.content}
        `;

        const result = await model.generateContent(comparePrompt);
        const relevance = parseInt(result.response.text().trim());

        return {
          id: msg.id,
          title: msg.title,
          relevance
        };
      })
    );

    return relatedResults
      .filter(rel => rel.relevance > 60)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  } catch (error) {
    console.error('Erro ao buscar mensagens relacionadas:', error);
    throw error;
  }
}